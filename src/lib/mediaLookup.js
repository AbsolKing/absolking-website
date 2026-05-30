/* ────────────────────────────────────────────────────────────
   mediaLookup.js — fetch external metadata for an archive entry.

   Used by ArchiveDetailModal to enrich a stored entry with the
   AniList / TMDB / RAWG description, score, year, genres, etc.

   Strategy per entry:
   1. If a stored external id exists (anilistId / tmdbId / rawgId),
      fetch by id — fast and authoritative.
   2. Otherwise, search by the stored title and take the top hit.

   Results are cached in-memory for the session keyed by media type
   + (id || normalized title), so reopening the same entry is free.
   ──────────────────────────────────────────────────────────── */

import { TMDB_API_KEY, RAWG_API_KEY } from './apiKeys'

const ANILIST_ENDPOINT = 'https://graphql.anilist.co'
const TMDB_BASE = 'https://api.themoviedb.org/3'
const RAWG_BASE = 'https://api.rawg.io/api'

const cache = new Map()

function normalizeTitle(t) {
  return (t || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function cacheKey(mediaType, item) {
  const id =
    mediaType === 'anime' || mediaType === 'manga'
      ? item.anilistId
      : mediaType === 'movie'
        ? item.tmdbId
        : item.rawgId
  return id != null ? `${mediaType}:${id}` : `${mediaType}:t:${normalizeTitle(item.title)}`
}

function stripHtml(text) {
  if (!text) return ''
  return text
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/* ── AniList (anime + manga) ─────────────────────────────── */

const ANILIST_QUERY = `
query ($id: Int, $search: String, $type: MediaType) {
  Media(id: $id, search: $search, type: $type, isAdult: false) {
    id
    type
    format
    status
    episodes
    chapters
    volumes
    averageScore
    seasonYear
    genres
    siteUrl
    title { romaji english }
    coverImage { large }
    studios(isMain: true) { nodes { name } }
    description(asHtml: false)
  }
}`

async function fetchAniList(item, type) {
  const variables = item.anilistId
    ? { id: item.anilistId, type }
    : { search: item.title, type }
  const res = await fetch(ANILIST_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query: ANILIST_QUERY, variables }),
  })
  if (!res.ok) throw new Error(`AniList: HTTP ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)
  const m = json.data?.Media
  if (!m) throw new Error('No match on AniList.')

  const count =
    type === 'ANIME'
      ? m.episodes
        ? `${m.episodes} episodes`
        : null
      : [m.chapters && `${m.chapters} chapters`, m.volumes && `${m.volumes} volumes`]
          .filter(Boolean)
          .join(' • ') || null

  return {
    matchedTitle: m.title.english || m.title.romaji,
    altTitle: m.title.romaji && m.title.romaji !== (m.title.english || m.title.romaji) ? m.title.romaji : null,
    description: stripHtml(m.description),
    externalScore: typeof m.averageScore === 'number' ? `${m.averageScore}%` : null,
    year: m.seasonYear,
    format: m.format?.replace(/_/g, ' '),
    count,
    studio: m.studios?.nodes?.[0]?.name || null,
    genres: m.genres || [],
    externalUrl: m.siteUrl,
    externalLabel: 'View on AniList',
  }
}

/* ── TMDB (movies + TV) ──────────────────────────────────── */

async function fetchTmdb(item) {
  const kind = item.tmdbKind || 'movie'
  let id = item.tmdbId
  // Search fallback if no stored id.
  if (id == null) {
    const sParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query: item.title,
      include_adult: 'false',
      page: '1',
    })
    const sRes = await fetch(`${TMDB_BASE}/search/${kind}?${sParams}`)
    if (!sRes.ok) throw new Error(`TMDB search: HTTP ${sRes.status}`)
    const sJson = await sRes.json()
    id = sJson.results?.[0]?.id
    if (id == null) throw new Error('No match on TMDB.')
  }
  const params = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'en-US' })
  const res = await fetch(`${TMDB_BASE}/${kind}/${id}?${params}`)
  if (!res.ok) throw new Error(`TMDB: HTTP ${res.status}`)
  const m = await res.json()
  const title = m.title || m.name
  const altTitle = m.original_title && m.original_title !== title ? m.original_title : null
  const releaseDate = m.release_date || m.first_air_date || ''
  const year = releaseDate ? Number(releaseDate.slice(0, 4)) : null
  const runtime = m.runtime
  const seasons = m.number_of_seasons
  const episodes = m.number_of_episodes
  const count =
    kind === 'movie'
      ? runtime
        ? `${runtime} min`
        : null
      : [seasons && `${seasons} seasons`, episodes && `${episodes} episodes`].filter(Boolean).join(' • ') || null

  return {
    matchedTitle: title,
    altTitle,
    description: m.overview || '',
    externalScore: typeof m.vote_average === 'number' && m.vote_average > 0 ? `${m.vote_average.toFixed(1)}/10` : null,
    year,
    format: kind === 'movie' ? 'Film' : 'TV',
    count,
    studio: m.production_companies?.[0]?.name || null,
    genres: (m.genres || []).map((g) => g.name),
    externalUrl: `https://www.themoviedb.org/${kind}/${id}`,
    externalLabel: 'View on TMDB',
  }
}

/* ── RAWG (games) ────────────────────────────────────────── */

async function fetchRawg(item) {
  let id = item.rawgId
  if (id == null) {
    const sParams = new URLSearchParams({
      key: RAWG_API_KEY,
      search: item.title,
      page_size: '1',
    })
    const sRes = await fetch(`${RAWG_BASE}/games?${sParams}`)
    if (!sRes.ok) throw new Error(`RAWG search: HTTP ${sRes.status}`)
    const sJson = await sRes.json()
    id = sJson.results?.[0]?.id
    if (id == null) throw new Error('No match on RAWG.')
  }
  const res = await fetch(`${RAWG_BASE}/games/${id}?key=${RAWG_API_KEY}`)
  if (!res.ok) throw new Error(`RAWG: HTTP ${res.status}`)
  const g = await res.json()
  const year = g.released ? Number(g.released.slice(0, 4)) : null

  return {
    matchedTitle: g.name,
    altTitle: null,
    description: stripHtml(g.description_raw || g.description || ''),
    externalScore:
      typeof g.rating === 'number' && g.rating > 0
        ? `${g.rating.toFixed(1)}/5`
        : typeof g.metacritic === 'number'
          ? `${g.metacritic}/100 metacritic`
          : null,
    year,
    format: null,
    count: g.playtime ? `${g.playtime} h avg` : null,
    studio: g.developers?.[0]?.name || g.publishers?.[0]?.name || null,
    genres: (g.genres || []).map((x) => x.name),
    externalUrl: `https://rawg.io/games/${g.slug || id}`,
    externalLabel: 'View on RAWG',
  }
}

/* ── Public API ──────────────────────────────────────────── */

export async function fetchMediaDetails(mediaType, item) {
  const key = cacheKey(mediaType, item)
  if (cache.has(key)) return cache.get(key)
  let promise
  switch (mediaType) {
    case 'anime':
      promise = fetchAniList(item, 'ANIME')
      break
    case 'manga':
      promise = fetchAniList(item, 'MANGA')
      break
    case 'movie':
      promise = fetchTmdb(item)
      break
    case 'game':
      promise = fetchRawg(item)
      break
    default:
      promise = Promise.reject(new Error(`Unknown mediaType: ${mediaType}`))
  }
  // Cache the promise itself so concurrent opens dedupe; clear on reject.
  cache.set(key, promise)
  try {
    return await promise
  } catch (err) {
    cache.delete(key)
    throw err
  }
}
