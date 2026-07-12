import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ArchiveTabs from '../components/archive/ArchiveTabs'
import { addEntryToDatabase, editEntryInDatabase, buildEntryFromAniList } from '../lib/githubDatabase'
import { animeEntries } from '../data/anime'
import { mangaEntries } from '../data/manga'

// Normalize a title for fuzzy matching: lowercase, strip punctuation & spaces.
function normalizeTitle(t) {
  return (t || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

// Find a matching DB entry for an AniList item. Prefers exact anilistId match,
// falls back to comparing normalized english/romaji titles.
function findDbEntry(item) {
  const pool = item.type === 'ANIME' ? animeEntries : mangaEntries
  if (!pool || !pool.length) return null
  // 1. Exact AniList id (only present on entries added via this tool).
  const byId = pool.find((e) => e.anilistId === item.id)
  if (byId) return byId
  // 2. Fuzzy title match against either AniList title.
  const candidates = [item.title.english, item.title.romaji].filter(Boolean).map(normalizeTitle)
  return pool.find((e) => candidates.includes(normalizeTitle(e.title))) || null
}

// Status options offered when adding an entry, per media type.
const ADD_STATUS_OPTIONS = {
  ANIME: [
    { key: 'planned', label: 'Planning' },
    { key: 'watching', label: 'Watching' },
    { key: 'completed', label: 'Completed' },
    { key: 'on-hold', label: 'On hold' },
    { key: 'dropped', label: 'Dropped' },
  ],
  MANGA: [
    { key: 'planned', label: 'Planning' },
    { key: 'reading', label: 'Reading' },
    { key: 'completed', label: 'Completed' },
    { key: 'on-hold', label: 'On hold' },
    { key: 'dropped', label: 'Dropped' },
  ],
}

/* ────────────────────────────────────────────────────────────
   AniList live browser — Trending / Popular / Top Rated / New
   Hits the public AniList GraphQL API (no auth, no key needed).
   Endpoint: https://graphql.anilist.co  (POST)
   ──────────────────────────────────────────────────────────── */

const ANILIST_ENDPOINT = 'https://graphql.anilist.co'

// Tabs reused from the archive section so the header matches the rest of the site.
const browserTabs = [
  {
    label: 'Overview',
    to: '/database',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <rect x="1" y="1" width="5" height="5" rx="1" /><rect x="8" y="1" width="5" height="5" rx="1" />
        <rect x="1" y="8" width="5" height="5" rx="1" /><rect x="8" y="8" width="5" height="5" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Browse',
    to: '/anime',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <circle cx="6" cy="6" r="4.5" /><path d="M9.5 9.5L13 13" />
      </svg>
    ),
  },
]

const TYPES = [
  { value: 'ANIME', label: 'Anime' },
  { value: 'MANGA', label: 'Manga' },
]

// AniList sort enums. We resolve "trending" specially per type below.
const SORTS = [
  { value: 'TRENDING_DESC', label: 'Trending' },
  { value: 'POPULARITY_DESC', label: 'Popular' },
  { value: 'SCORE_DESC', label: 'Top Rated' },
  { value: 'START_DATE_DESC', label: 'New Releases' },
]

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Ecchi', 'Fantasy', 'Horror',
  'Mahou Shoujo', 'Mecha', 'Music', 'Mystery', 'Psychological', 'Romance',
  'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller',
]

const ANIME_FORMATS = [
  { value: '', label: 'Any Format' },
  { value: 'TV', label: 'TV' },
  { value: 'TV_SHORT', label: 'TV Short' },
  { value: 'MOVIE', label: 'Movie' },
  { value: 'OVA', label: 'OVA' },
  { value: 'ONA', label: 'ONA' },
  { value: 'SPECIAL', label: 'Special' },
  { value: 'MUSIC', label: 'Music' },
]

const MANGA_FORMATS = [
  { value: '', label: 'Any Format' },
  { value: 'MANGA', label: 'Manga' },
  { value: 'NOVEL', label: 'Light Novel' },
  { value: 'ONE_SHOT', label: 'One Shot' },
]

const SEASONS = [
  { value: '', label: 'Any Season' },
  { value: 'WINTER', label: 'Winter' },
  { value: 'SPRING', label: 'Spring' },
  { value: 'SUMMER', label: 'Summer' },
  { value: 'FALL', label: 'Fall' },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = ['', ...Array.from({ length: 26 }, (_, i) => CURRENT_YEAR + 1 - i)]

const PER_PAGE = 24

// Status badge colours, aligned with the site's MediaRow palette.
const STATUS_META = {
  RELEASING: { label: 'Airing', color: '#4ec9b0' },
  FINISHED: { label: 'Finished', color: '#569cd6' },
  NOT_YET_RELEASED: { label: 'Upcoming', color: '#dcdcaa' },
  CANCELLED: { label: 'Cancelled', color: '#f44747' },
  HIATUS: { label: 'Hiatus', color: '#ce9178' },
}

const MEDIA_QUERY = `
query (
  $page: Int, $perPage: Int, $type: MediaType, $sort: [MediaSort],
  $search: String, $genre: String, $format: MediaFormat,
  $season: MediaSeason, $seasonYear: Int
) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { currentPage hasNextPage total }
    media(
      type: $type, sort: $sort, search: $search, genre: $genre,
      format: $format, season: $season, seasonYear: $seasonYear,
      isAdult: false
    ) {
      id
      idMal
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
      coverImage { large color }
      studios(isMain: true) { nodes { name } }
      description(asHtml: false)
    }
  }
}`

function stripHtml(text) {
  if (!text) return ''
  return text
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildVariables(state, page) {
  const vars = {
    page,
    perPage: PER_PAGE,
    type: state.type,
    sort: [state.sort],
  }
  if (state.search.trim()) {
    vars.search = state.search.trim()
    // A title search reads best ordered by relevance/popularity, not trending.
    if (state.sort === 'TRENDING_DESC') vars.sort = ['SEARCH_MATCH', 'POPULARITY_DESC']
  }
  if (state.genre) vars.genre = state.genre
  if (state.format) vars.format = state.format
  if (state.type === 'ANIME') {
    if (state.season) vars.season = state.season
    if (state.year) vars.seasonYear = Number(state.year)
  }
  return vars
}

const selectClass =
  'rounded-lg border border-[#3e3e42] bg-[#1e1e1e] py-2 pl-3 pr-8 font-mono-soft text-xs uppercase tracking-[0.12em] text-[#d4d4d4] outline-none transition focus:border-[#569cd6]/60 hover:border-[#4b4b50] appearance-none cursor-pointer'

function FieldSelect({ label, value, onChange, options }) {
  return (
    <label className="relative flex flex-col gap-1">
      <span className="font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">{label}</span>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={`${selectClass} w-full`}>
          {options.map((opt) => {
            const v = typeof opt === 'object' ? opt.value : opt
            const l = typeof opt === 'object' ? opt.label : opt || 'Any'
            return (
              <option key={`${v}`} value={v} className="bg-[#1e1e1e] text-[#d4d4d4]">
                {l}
              </option>
            )
          })}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 font-mono-soft text-[10px] text-[#6f6f6f]">▾</span>
      </div>
    </label>
  )
}

function MediaCard({ item, index, onOpen }) {
  const title = item.title.english || item.title.romaji
  const score = typeof item.averageScore === 'number' ? item.averageScore : null
  const status = STATUS_META[item.status]
  const accent = item.coverImage?.color || '#569cd6'
  const count =
    item.type === 'ANIME'
      ? item.episodes
        ? `${item.episodes} ep`
        : null
      : item.chapters
        ? `${item.chapters} ch`
        : null
  const meta = [item.format?.replace(/_/g, ' '), count, item.seasonYear].filter(Boolean)

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      style={{ animationDelay: `${Math.min(index, 11) * 28}ms` }}
      className="group fade-up relative flex flex-col overflow-hidden rounded-xl border border-[#333337] bg-[#202020]/78 text-left transition duration-300 hover:border-[#4b4b50] hover:bg-[#242426] hover:-translate-y-[3px]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1a1a1a]">
        <img
          src={item.coverImage?.large}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent opacity-90" />
        {score !== null && (
          <div className="absolute right-2 top-2 flex items-baseline gap-0.5 rounded-md border border-[#3e3e42] bg-[#161616]/88 px-2 py-1 backdrop-blur-sm">
            <span className="font-mono-soft text-sm font-semibold leading-none text-[#dcdcaa]">{score}</span>
            <span className="font-mono-soft text-[8px] uppercase tracking-[0.14em] text-[#6f6f6f]">%</span>
          </div>
        )}
        {status && (
          <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md border border-[#3e3e42] bg-[#161616]/88 px-1.5 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.color }} />
            <span className="font-mono-soft text-[8px] uppercase tracking-[0.16em]" style={{ color: status.color }}>
              {status.label}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3" style={{ borderTop: `2px solid ${accent}55` }}>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-[-0.01em] text-[#d4d4d4] transition group-hover:text-[#569cd6]">
          {title}
        </h3>
        {meta.length ? (
          <p className="mt-1.5 truncate font-mono-soft text-[9px] uppercase tracking-[0.14em] text-[#8f8f8f]">
            {meta.join(' • ')}
          </p>
        ) : null}
      </div>
    </button>
  )
}

function DetailModal({ item, onClose, token, setToken }) {
  const [adding, setAdding] = useState(false)
  const [addStatus, setAddStatus] = useState('planned')
  const [addScore, setAddScore] = useState('')
  const [addNote, setAddNote] = useState('')
  const [tokenInput, setTokenInput] = useState('')
  const [result, setResult] = useState(null) // { ok, message, url }
  const [busy, setBusy] = useState(false)

  // Edit-mode fields (pre-filled from the existing DB entry when present).
  const [editing, setEditing] = useState(false)
  const [editStatus, setEditStatus] = useState('planned')
  const [editScore, setEditScore] = useState('')
  const [editProgress, setEditProgress] = useState('')
  const [editNote, setEditNote] = useState('')

  // Does this AniList item already exist in the local database?
  const dbEntry = item ? findDbEntry(item) : null

  // Reset the per-item add/edit state whenever a different entry opens.
  useEffect(() => {
    setAdding(false)
    setEditing(false)
    setResult(null)
    setAddStatus('planned')
    setAddScore('')
    setAddNote('')
    if (item) {
      const existing = findDbEntry(item)
      if (existing) {
        setEditStatus(existing.statusKey || 'planned')
        setEditScore(existing.score != null ? String(existing.score) : '')
        setEditProgress(existing.progress || '')
        setEditNote(existing.note || '')
      }
    }
  }, [item])

  useEffect(() => {
    if (!item) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  if (!item) return null
  const title = item.title.english || item.title.romaji
  const altTitle = item.title.romaji !== title ? item.title.romaji : null
  const score = typeof item.averageScore === 'number' ? item.averageScore : null
  const status = STATUS_META[item.status]
  const studio = item.studios?.nodes?.[0]?.name
  const count =
    item.type === 'ANIME'
      ? item.episodes && `${item.episodes} episodes`
      : [item.chapters && `${item.chapters} chapters`, item.volumes && `${item.volumes} volumes`]
          .filter(Boolean)
          .join(' • ')

  const facts = [
    ['Format', item.format?.replace(/_/g, ' ')],
    ['Status', status?.label],
    ['Count', count],
    ['Year', item.seasonYear],
    ['Studio', studio],
    ['Score', score !== null ? `${score}%` : null],
  ].filter(([, v]) => v)

  const statusOptions = ADD_STATUS_OPTIONS[item.type] || ADD_STATUS_OPTIONS.ANIME

  const handleAdd = async () => {
    const activeToken = (token || tokenInput).trim()
    if (!activeToken) {
      setResult({ ok: false, message: 'Paste your GitHub token first.' })
      return
    }
    setBusy(true)
    setResult(null)
    try {
      const statusLabel = statusOptions.find((s) => s.key === addStatus)?.label || 'Planning'
      const entry = buildEntryFromAniList(item, addStatus, statusLabel)
      // Apply user-chosen score (overrides the AniList-derived default).
      const trimmedScore = addScore.trim()
      if (trimmedScore !== '') {
        const n = Number(trimmedScore)
        if (Number.isNaN(n)) {
          setResult({ ok: false, message: 'Score must be a number (or left blank).' })
          setBusy(false)
          return
        }
        entry.score = n
      } else {
        delete entry.score
      }
      entry.note = addNote.trim()
      const res = await addEntryToDatabase({ mediaType: item.type, entry, token: activeToken })
      // Remember the token in memory for the rest of this session only.
      if (!token) setToken(activeToken)
      setTokenInput('')
      if (res.alreadyExists) {
        setResult({ ok: true, message: 'Already in the database — skipped.' })
      } else {
        setResult({ ok: true, message: 'Committed! It will appear after the next rebuild.', url: res.commitUrl })
      }
    } catch (err) {
      setResult({ ok: false, message: err.message || 'Failed to commit.' })
    } finally {
      setBusy(false)
    }
  }

  const handleEdit = async () => {
    const activeToken = (token || tokenInput).trim()
    if (!activeToken) {
      setResult({ ok: false, message: 'Paste your GitHub token first.' })
      return
    }
    setBusy(true)
    setResult(null)
    try {
      const statusLabel = statusOptions.find((s) => s.key === editStatus)?.label || 'Planning'
      const updates = {
        statusKey: editStatus,
        status: statusLabel,
        progress: editProgress.trim(),
        note: editNote.trim(),
      }
      // Score: allow clearing it (empty string) or a number.
      const trimmedScore = editScore.trim()
      updates.score = trimmedScore === '' ? '' : Number(trimmedScore)
      if (trimmedScore !== '' && Number.isNaN(updates.score)) {
        setResult({ ok: false, message: 'Score must be a number (or left blank).' })
        setBusy(false)
        return
      }

      const match = dbEntry?.anilistId != null ? { anilistId: dbEntry.anilistId } : { title: dbEntry?.title }
      const res = await editEntryInDatabase({ mediaType: item.type, match, updates, token: activeToken })
      if (!token) setToken(activeToken)
      setTokenInput('')
      if (res.notFound) {
        setResult({ ok: false, message: 'Could not find this entry in the source file to edit.' })
      } else {
        setResult({ ok: true, message: 'Saved! Changes apply after the next rebuild.', url: res.commitUrl })
      }
    } catch (err) {
      setResult({ ok: false, message: err.message || 'Failed to commit.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#0d0d0d]/82 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="clean-panel relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="editor-topbar">
          <span className="window-dot bg-[#ce9178]" />
          <span className="window-dot bg-[#dcdcaa]" />
          <span className="window-dot bg-[#4ec9b0]" />
          <span className="ml-2 truncate font-mono-soft text-[11px] text-[#8f8f8f]">
            {item.type.toLowerCase()} / {String(item.id)}.json
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto font-mono-soft text-xs text-[#6f6f6f] transition hover:text-[#d4d4d4]"
            aria-label="Close"
          >
            ✕ esc
          </button>
        </div>

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-7">
          <div className="w-full sm:w-[200px] flex-shrink-0">
            <div className="overflow-hidden rounded-lg border border-[#3e3e42] bg-[#1a1a1a]" style={{ aspectRatio: '3/4' }}>
              <img src={item.coverImage?.large} alt={title} className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#d4d4d4] sm:text-3xl">{title}</h2>
            {altTitle && <p className="mt-1 font-mono-soft text-xs text-[#8f8f8f]">{altTitle}</p>}

            {item.genres?.length ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-md border border-[#3e3e42] bg-[#1e1e1e] px-2 py-1 font-mono-soft text-[9px] uppercase tracking-[0.14em] text-[#569cd6]"
                  >
                    {g}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5 border-y border-[#2d2d30] py-4">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <span className="block font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">{k}</span>
                  <span className="mt-0.5 block font-mono-soft text-xs text-[#d4d4d4]">{v}</span>
                </div>
              ))}
            </div>

            {item.description ? (
              <p className="mt-4 max-h-44 overflow-y-auto pr-1 text-sm leading-6 text-[#b7b7b7]">{stripHtml(item.description)}</p>
            ) : (
              <p className="mt-4 text-sm italic text-[#6f6f6f]">No synopsis available.</p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <a
                href={item.siteUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] text-[#4ec9b0] transition hover:border-[#4ec9b0]/50 hover:bg-[#1e3a4c]"
              >
                View on AniList →
              </a>
              {dbEntry && !editing && !adding && (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#4ec9b0]/40 bg-[#1e3a4c]/50 px-3 py-2 font-mono-soft text-[10px] uppercase tracking-[0.14em] text-[#4ec9b0]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4ec9b0]" />
                    In archive{dbEntry.status ? ` · ${dbEntry.status}` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#dcdcaa]/45 bg-[#332f1c]/55 px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] text-[#dcdcaa] transition hover:border-[#dcdcaa]/70 hover:bg-[#332f1c]/80"
                  >
                    ✎ Edit Entry
                  </button>
                </>
              )}
              {!dbEntry && !adding && (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#569cd6]/45 bg-[#094771]/55 px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] text-[#d4d4d4] transition hover:border-[#569cd6]/70 hover:bg-[#094771]/80"
                >
                  + Add to Database
                </button>
              )}
            </div>

            {editing && (
              <div className="mt-4 rounded-xl border border-[#dcdcaa]/30 bg-[#1a1a1a]/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono-soft text-[10px] uppercase tracking-[0.18em] text-[#dcdcaa]">
                    Edit entry · {item.type === 'ANIME' ? 'Anime' : 'Manga'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="font-mono-soft text-[10px] uppercase tracking-[0.16em] text-[#6f6f6f] transition hover:text-[#d4d4d4]"
                  >
                    cancel
                  </button>
                </div>

                {!dbEntry?.anilistId && (
                  <p className="mt-2 font-mono-soft text-[9px] leading-relaxed text-[#8f8f8f]">
                    Matched by title (this entry predates id tracking). Saving will leave the title as-is.
                  </p>
                )}

                {/* Status */}
                <div className="mt-3">
                  <span className="block font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">Status</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {statusOptions.map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setEditStatus(s.key)}
                        className={`rounded-md border px-2.5 py-1.5 font-mono-soft text-[10px] uppercase tracking-[0.12em] transition ${
                          editStatus === s.key
                            ? 'border-[#dcdcaa]/60 bg-[#332f1c]/65 text-[#dcdcaa]'
                            : 'border-[#3e3e42] bg-[#1e1e1e] text-[#8f8f8f] hover:text-[#d4d4d4]'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Score + Progress */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">Score (0–10, blank = none)</span>
                    <input
                      type="text"
                      value={editScore}
                      onChange={(e) => setEditScore(e.target.value)}
                      placeholder="—"
                      className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-3 py-2 font-mono-soft text-xs text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#dcdcaa]/60"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">Progress</span>
                    <input
                      type="text"
                      value={editProgress}
                      onChange={(e) => setEditProgress(e.target.value)}
                      placeholder="0 / 12"
                      className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-3 py-2 font-mono-soft text-xs text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#dcdcaa]/60"
                    />
                  </label>
                </div>

                {/* Note */}
                <label className="mt-3 flex flex-col gap-1">
                  <span className="font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">Note</span>
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    rows={2}
                    placeholder="Optional note…"
                    className="resize-none rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-3 py-2 text-sm text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#dcdcaa]/60"
                  />
                </label>

                {/* Token */}
                {!token && (
                  <div className="mt-3">
                    <span className="block font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">
                      GitHub token (held in memory only, never stored)
                    </span>
                    <input
                      type="password"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="github_pat_…"
                      autoComplete="off"
                      className="mt-1.5 w-full rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-3 py-2 font-mono-soft text-xs text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#dcdcaa]/60"
                    />
                  </div>
                )}
                {token && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="font-mono-soft text-[10px] text-[#4ec9b0]">● token loaded for this session</span>
                    <button
                      type="button"
                      onClick={() => setToken('')}
                      className="font-mono-soft text-[10px] uppercase tracking-[0.14em] text-[#6f6f6f] underline-offset-2 transition hover:text-[#f44747] hover:underline"
                    >
                      forget
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  disabled={busy}
                  onClick={handleEdit}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#dcdcaa]/45 bg-[#332f1c] px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] text-[#dcdcaa] transition hover:border-[#dcdcaa]/70 hover:bg-[#3d391f] disabled:opacity-50"
                >
                  {busy ? 'Saving…' : 'Save changes'}
                </button>

                {result && (
                  <p className={`mt-3 font-mono-soft text-[11px] ${result.ok ? 'text-[#4ec9b0]' : 'text-[#f44747]'}`}>
                    {result.message}
                    {result.url && (
                      <>
                        {' '}
                        <a href={result.url} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2">
                          view commit
                        </a>
                      </>
                    )}
                  </p>
                )}
              </div>
            )}

            {adding && (
              <div className="mt-4 rounded-xl border border-[#3e3e42] bg-[#1a1a1a]/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono-soft text-[10px] uppercase tracking-[0.18em] text-[#569cd6]">
                    Add to {item.type === 'ANIME' ? 'Anime' : 'Manga'} archive
                  </p>
                  <button
                    type="button"
                    onClick={() => setAdding(false)}
                    className="font-mono-soft text-[10px] uppercase tracking-[0.16em] text-[#6f6f6f] transition hover:text-[#d4d4d4]"
                  >
                    cancel
                  </button>
                </div>

                {/* Status picker */}
                <div className="mt-3">
                  <span className="block font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">Status</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {statusOptions.map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setAddStatus(s.key)}
                        className={`rounded-md border px-2.5 py-1.5 font-mono-soft text-[10px] uppercase tracking-[0.12em] transition ${
                          addStatus === s.key
                            ? 'border-[#569cd6]/60 bg-[#094771]/65 text-[#d4d4d4]'
                            : 'border-[#3e3e42] bg-[#1e1e1e] text-[#8f8f8f] hover:text-[#d4d4d4]'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Score + Note */}
                <div className="mt-3 grid grid-cols-1 gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">Score (0–10, blank = none)</span>
                    <input
                      type="text"
                      value={addScore}
                      onChange={(e) => setAddScore(e.target.value)}
                      placeholder="—"
                      className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-3 py-2 font-mono-soft text-xs text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#569cd6]/60"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">Note</span>
                    <textarea
                      value={addNote}
                      onChange={(e) => setAddNote(e.target.value)}
                      rows={2}
                      placeholder="Optional note…"
                      className="resize-none rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-3 py-2 text-sm text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#569cd6]/60"
                    />
                  </label>
                </div>

                {/* Token field — only shown if no token is held in memory yet */}
                {!token && (
                  <div className="mt-3">
                    <span className="block font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">
                      GitHub token (held in memory only, never stored)
                    </span>
                    <input
                      type="password"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="github_pat_…"
                      autoComplete="off"
                      className="mt-1.5 w-full rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-3 py-2 font-mono-soft text-xs text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#569cd6]/60"
                    />
                  </div>
                )}
                {token && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="font-mono-soft text-[10px] text-[#4ec9b0]">● token loaded for this session</span>
                    <button
                      type="button"
                      onClick={() => setToken('')}
                      className="font-mono-soft text-[10px] uppercase tracking-[0.14em] text-[#6f6f6f] underline-offset-2 transition hover:text-[#f44747] hover:underline"
                    >
                      forget
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  disabled={busy}
                  onClick={handleAdd}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#4ec9b0]/45 bg-[#1e3a4c] px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] text-[#4ec9b0] transition hover:border-[#4ec9b0]/70 hover:bg-[#1e4a5c] disabled:opacity-50"
                >
                  {busy ? 'Committing…' : 'Commit entry'}
                </button>

                {result && (
                  <p
                    className={`mt-3 font-mono-soft text-[11px] ${result.ok ? 'text-[#4ec9b0]' : 'text-[#f44747]'}`}
                  >
                    {result.message}
                    {result.url && (
                      <>
                        {' '}
                        <a href={result.url} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2">
                          view commit
                        </a>
                      </>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#333337] bg-[#202020]/60">
      <div className="aspect-[3/4] w-full animate-pulse bg-[#262628]" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-4/5 animate-pulse rounded bg-[#2d2d30]" />
        <div className="h-2 w-2/5 animate-pulse rounded bg-[#262628]" />
      </div>
    </div>
  )
}

export default function AnimeBrowserPage() {
  const [filters, setFilters] = useState({
    type: 'ANIME',
    sort: 'TRENDING_DESC',
    genre: '',
    format: '',
    season: '',
    year: '',
  })
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [active, setActive] = useState(null)
  const [ghToken, setGhToken] = useState('') // session-only, in-memory GitHub token

  const requestId = useRef(0)

  // Debounce the search box so we don't fire a request on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 420)
    return () => clearTimeout(t)
  }, [searchInput])

  const queryState = useMemo(() => ({ ...filters, search }), [filters, search])

  const fetchPage = useCallback(
    async (targetPage, append) => {
      const id = ++requestId.current
      append ? setLoadingMore(true) : setLoading(true)
      setError(null)
      try {
        const res = await fetch(ANILIST_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ query: MEDIA_QUERY, variables: buildVariables(queryState, targetPage) }),
        })
        if (res.status === 429) throw new Error('AniList rate limit reached — give it a few seconds and try again.')
        const json = await res.json()
        if (id !== requestId.current) return // a newer request superseded this one
        if (json.errors?.length) throw new Error(json.errors[0].message || 'AniList returned an error.')

        const pageData = json.data?.Page
        const media = pageData?.media ?? []
        setHasNext(Boolean(pageData?.pageInfo?.hasNextPage))
        setTotal(pageData?.pageInfo?.total ?? 0)
        setItems((prev) => {
          if (!append) return media
          const seen = new Set(prev.map((m) => m.id))
          return [...prev, ...media.filter((m) => !seen.has(m.id))]
        })
        setPage(targetPage)
      } catch (err) {
        if (id !== requestId.current) return
        setError(err.message || 'Something went wrong talking to AniList.')
        if (!append) setItems([])
      } finally {
        if (id === requestId.current) {
          setLoading(false)
          setLoadingMore(false)
        }
      }
    },
    [queryState],
  )

  // Refetch from page 1 whenever any filter or the debounced search changes.
  useEffect(() => {
    fetchPage(1, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryState])

  const updateFilter = (key, value) =>
    setFilters((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'type') {
        // Reset type-specific filters when switching anime <-> manga.
        next.format = ''
        next.season = ''
        next.year = ''
      }
      return next
    })

  const formats = filters.type === 'ANIME' ? ANIME_FORMATS : MANGA_FORMATS
  const sortLabel = SORTS.find((s) => s.value === filters.sort)?.label ?? 'Browse'
  const typeLabel = filters.type === 'ANIME' ? 'Anime' : 'Manga'

  return (
    <>
      {/* Hero */}
      <section className="clean-shell py-8 sm:py-12 lg:py-14">
        <div className="clean-panel overflow-hidden rounded-2xl fade-up">
          <div className="editor-topbar">
            <span className="window-dot bg-[#ce9178]" />
            <span className="window-dot bg-[#dcdcaa]" />
            <span className="window-dot bg-[#4ec9b0]" />
            <span className="ml-2 font-mono-soft text-[11px] text-[#8f8f8f]">
              <Link to="/" className="transition hover:text-[#d4d4d4]">home</Link>
              <span className="text-[#6f6f6f]"> / </span>
              <span className="text-[#d4d4d4]">browse.anilist</span>
            </span>
          </div>
          <div className="px-6 py-8 sm:px-9 sm:py-11">
            <p className="font-mono-soft text-[10px] uppercase tracking-[0.24em] text-[#4ec9b0]">// live from anilist</p>
            <h1 className="mt-4 text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.05em] text-[#d4d4d4] sm:text-6xl">
              Browse
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b7b7b7] sm:text-base">
              Trending anime &amp; manga pulled straight from the AniList database. Filter by genre, format, and season,
              or search by title — no account needed.
            </p>
          </div>
        </div>
      </section>

      <ArchiveTabs items={browserTabs} />

      <section className="clean-shell py-5 sm:py-7">
        {/* Type + Sort segmented controls */}
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[#2d2d30] pb-4">
          <div className="inline-flex overflow-hidden rounded-lg border border-[#3e3e42]">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => updateFilter('type', t.value)}
                className={`px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] transition ${
                  filters.type === t.value ? 'bg-[#094771]/70 text-[#d4d4d4]' : 'text-[#767676] hover:bg-[#252526] hover:text-[#d4d4d4]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="inline-flex flex-wrap overflow-hidden rounded-lg border border-[#3e3e42]">
            {SORTS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => updateFilter('sort', s.value)}
                className={`px-3.5 py-2 font-mono-soft text-[11px] uppercase tracking-[0.14em] transition ${
                  filters.sort === s.value ? 'bg-[#1e3a4c] text-[#4ec9b0]' : 'text-[#767676] hover:bg-[#252526] hover:text-[#d4d4d4]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown filters */}
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <FieldSelect label="Genre" value={filters.genre} onChange={(v) => updateFilter('genre', v)} options={['', ...GENRES]} />
          <FieldSelect label="Format" value={filters.format} onChange={(v) => updateFilter('format', v)} options={formats} />
          {filters.type === 'ANIME' && (
            <>
              <FieldSelect label="Season" value={filters.season} onChange={(v) => updateFilter('season', v)} options={SEASONS} />
              <FieldSelect
                label="Year"
                value={filters.year}
                onChange={(v) => updateFilter('year', v)}
                options={YEARS.map((y) => ({ value: String(y), label: y === '' ? 'Any Year' : String(y) }))}
              />
            </>
          )}
          {(filters.genre || filters.format || filters.season || filters.year) && (
            <button
              type="button"
              onClick={() => {
                setFilters((prev) => ({ ...prev, genre: '', format: '', season: '', year: '' }))
              }}
              className="mb-0.5 rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-2.5 py-2 font-mono-soft text-[9px] uppercase tracking-[0.16em] text-[#6f6f6f] transition hover:border-[#f44747]/50 hover:text-[#f44747]"
            >
              ✕ Reset filters
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono-soft text-xs text-[#6f6f6f]">/</span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title…"
            className="w-full rounded-lg border border-[#3e3e42] bg-[#1e1e1e] py-2.5 pl-8 pr-4 font-mono-soft text-sm text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#569cd6]/60 focus:bg-[#1a1a1a]"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 font-mono-soft text-xs text-[#6f6f6f] transition hover:text-[#d4d4d4]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Result summary */}
        <div className="mt-5 flex items-center justify-between">
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.18em] text-[#8f8f8f]">
            {search.trim()
              ? `Results for "${search.trim()}"`
              : `${sortLabel} ${typeLabel}`}
            {total ? <span className="ml-2 text-[#5f5f5f]">{total.toLocaleString()} entries</span> : null}
          </p>
        </div>

        {/* Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {loading
            ? Array.from({ length: PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((item, i) => <MediaCard key={item.id} item={item} index={i} onOpen={setActive} />)}
        </div>

        {/* Error / empty / load-more states */}
        {!loading && error && (
          <div className="clean-card mt-5 rounded-xl p-6 text-center">
            <p className="font-mono-soft text-sm text-[#f44747]">{error}</p>
            <button
              type="button"
              onClick={() => fetchPage(1, false)}
              className="mt-3 rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] text-[#d4d4d4] transition hover:border-[#569cd6]/50"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="clean-card mt-5 rounded-xl p-8 text-center font-mono-soft text-sm text-[#8f8f8f]">
            No entries match these filters.
          </div>
        )}

        {!loading && !error && hasNext && (
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              disabled={loadingMore}
              onClick={() => fetchPage(page + 1, true)}
              className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-6 py-2.5 font-mono-soft text-[11px] uppercase tracking-[0.18em] text-[#d4d4d4] transition hover:border-[#569cd6]/60 hover:bg-[#1e3a4c] disabled:opacity-50"
            >
              {loadingMore ? 'Loading…' : 'Load More'}
            </button>
          </div>
        )}
      </section>

      <DetailModal item={active} onClose={() => setActive(null)} token={ghToken} setToken={setGhToken} />
    </>
  )
}
