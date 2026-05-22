/* ────────────────────────────────────────────────────────────
   githubDatabase.js — commit new archive entries to the repo
   via the GitHub Contents API.

   SECURITY NOTE: the token is supplied by the user at runtime and
   held only in memory by the caller. Nothing here persists it to
   localStorage, sessionStorage, or the bundle. It is sent only to
   api.github.com over HTTPS, only when the user clicks "add".
   ──────────────────────────────────────────────────────────── */

const OWNER = 'AbsolKing'
const REPO = 'absolking-website'
const BRANCH = 'main'

const FILE_BY_TYPE = {
  ANIME: { path: 'src/data/anime.js', arrayName: 'animeEntries' },
  MANGA: { path: 'src/data/manga.js', arrayName: 'mangaEntries' },
}

const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`

// Base64 <-> UTF-8 helpers that survive non-ASCII titles (é, ：, etc.)
function decodeBase64Utf8(b64) {
  const binary = atob(b64.replace(/\n/g, ''))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder('utf-8').decode(bytes)
}

function encodeBase64Utf8(str) {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary)
}

// Turn a JS value into source text matching the existing file's hand-written style.
function formatValue(value) {
  if (typeof value === 'number') return String(value)
  // Single-quoted string with quotes/backslashes escaped.
  const escaped = String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  return `'${escaped}'`
}

// Build the object literal exactly in the shape of existing entries,
// 2-space indented inside the array (matching anime.js).
function formatEntry(entry) {
  const lines = ['  {']
  for (const [key, value] of Object.entries(entry)) {
    if (value === undefined || value === null || value === '') continue
    lines.push(`    ${key}: ${formatValue(value)},`)
  }
  lines.push('  },')
  return lines.join('\n')
}

async function githubRequest(url, token, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    let detail = ''
    try {
      const j = await res.json()
      detail = j.message || ''
    } catch {
      /* ignore */
    }
    if (res.status === 401) throw new Error('Invalid token, or it lacks Contents: write on this repo.')
    if (res.status === 404) throw new Error('File or repo not found — check the token has access to absolking-website.')
    if (res.status === 409) throw new Error('Commit conflict — the file changed. Try again.')
    throw new Error(`GitHub API error ${res.status}${detail ? `: ${detail}` : ''}`)
  }
  return res.json()
}

/**
 * Append a new entry into the relevant data file and commit it.
 * @param {object} args
 * @param {'ANIME'|'MANGA'} args.mediaType
 * @param {object} args.entry  Object matching the anime/manga schema.
 * @param {string} args.token  Fine-grained PAT, Contents: write.
 * @returns {Promise<{commitUrl: string, alreadyExists?: boolean}>}
 */
export async function addEntryToDatabase({ mediaType, entry, token }) {
  const target = FILE_BY_TYPE[mediaType]
  if (!target) throw new Error(`Unsupported media type: ${mediaType}`)

  const fileUrl = `${API_BASE}/${target.path}?ref=${BRANCH}`
  const fileData = await githubRequest(fileUrl, token)
  const source = decodeBase64Utf8(fileData.content)

  // Guard against duplicates — match on the exact title string.
  const titleNeedle = `title: ${formatValue(entry.title)}`
  if (source.includes(titleNeedle)) {
    return { commitUrl: '', alreadyExists: true }
  }

  // Find the array's opening bracket and insert right after it so the new
  // entry lands at the top of the list (newest-first while editing).
  const arrayDecl = `export const ${target.arrayName} = [`
  const declIndex = source.indexOf(arrayDecl)
  if (declIndex === -1) throw new Error(`Could not locate "${target.arrayName}" array in ${target.path}.`)

  const insertAt = declIndex + arrayDecl.length
  const entryText = formatEntry(entry)

  // Handle both empty array (`= []`) and populated array.
  const afterDecl = source.slice(insertAt).trimStart()
  let updated
  if (afterDecl.startsWith(']')) {
    // Empty array on one line: `export const mangaEntries = []`
    updated = source.slice(0, insertAt) + '\n' + entryText + '\n' + source.slice(insertAt).replace(/^\s*/, '')
  } else {
    updated = source.slice(0, insertAt) + '\n' + entryText + source.slice(insertAt)
  }

  const commitMessage = `archive: add "${entry.title}" to ${target.arrayName}`
  const putBody = {
    message: commitMessage,
    content: encodeBase64Utf8(updated),
    sha: fileData.sha,
    branch: BRANCH,
  }

  const result = await githubRequest(`${API_BASE}/${target.path}`, token, {
    method: 'PUT',
    body: JSON.stringify(putBody),
  })

  return { commitUrl: result.commit?.html_url || '' }
}

/* ── Editing existing entries ───────────────────────────────── */

// Locate a single entry object `{ ... }` within the array by a needle string
// (e.g. `title: 'Angel Beats!'` or `anilistId: 12345`). Returns the start/end
// character offsets of the object literal, brace-matched so nested braces are
// handled correctly.
function locateEntryObject(source, arrayName, needle) {
  const arrayDecl = `export const ${arrayName} = [`
  const declIndex = source.indexOf(arrayDecl)
  if (declIndex === -1) throw new Error(`Could not locate "${arrayName}" array.`)

  const needleIndex = source.indexOf(needle, declIndex)
  if (needleIndex === -1) return null

  // Walk backwards from the needle to the opening brace of its object.
  let start = needleIndex
  while (start > declIndex && source[start] !== '{') start -= 1
  if (source[start] !== '{') return null

  // Walk forward, brace-matching, to find the matching closing brace.
  let depth = 0
  let end = start
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i]
    if (ch === '{') depth += 1
    else if (ch === '}') {
      depth -= 1
      if (depth === 0) {
        end = i
        break
      }
    }
  }
  if (depth !== 0) return null
  return { start, end: end + 1 } // end is exclusive
}

/**
 * Edit an existing entry in place. Reads the current object, merges in the
 * provided field updates (preserving any fields not in the update such as
 * reviewPath), and commits the rewritten object.
 *
 * @param {object} args
 * @param {'ANIME'|'MANGA'} args.mediaType
 * @param {object} args.match     How to find the entry: { anilistId } or { title }.
 * @param {object} args.updates   Fields to overwrite (statusKey, status, score, progress, note).
 * @param {string} args.token
 * @returns {Promise<{commitUrl: string, notFound?: boolean}>}
 */
export async function editEntryInDatabase({ mediaType, match, updates, token }) {
  const target = FILE_BY_TYPE[mediaType]
  if (!target) throw new Error(`Unsupported media type: ${mediaType}`)

  const fileUrl = `${API_BASE}/${target.path}?ref=${BRANCH}`
  const fileData = await githubRequest(fileUrl, token)
  const source = decodeBase64Utf8(fileData.content)

  // Prefer matching by AniList id (exact); fall back to title.
  let located = null
  if (match.anilistId != null) {
    located = locateEntryObject(source, target.arrayName, `anilistId: ${match.anilistId}`)
  }
  if (!located && match.title) {
    located = locateEntryObject(source, target.arrayName, `title: ${formatValue(match.title)}`)
  }
  if (!located) return { commitUrl: '', notFound: true }

  const objectText = source.slice(located.start, located.end)

  // Parse existing simple key: value pairs (strings and numbers only — matches
  // the file's hand-written style, no nested objects in entries).
  const existing = {}
  const fieldRe = /(\w+):\s*('(?:[^'\\]|\\.)*'|-?\d+(?:\.\d+)?)/g
  let m
  while ((m = fieldRe.exec(objectText)) !== null) {
    const key = m[1]
    const raw = m[2]
    if (raw.startsWith("'")) {
      existing[key] = raw.slice(1, -1).replace(/\\'/g, "'").replace(/\\\\/g, '\\')
    } else {
      existing[key] = Number(raw)
    }
  }

  // Merge updates over existing; an explicit empty string clears a field.
  const merged = { ...existing }
  for (const [k, v] of Object.entries(updates)) {
    if (v === undefined) continue
    merged[k] = v
  }

  // formatEntry yields "  {\n    field: val,\n  }," — drop the trailing comma
  // (the original object's following comma in the source is preserved) and
  // drop the leading indentation (the source already has the object positioned).
  const newObjectText = formatEntry(merged).replace(/,$/, '').replace(/^\s+/, '')

  const updated = source.slice(0, located.start) + newObjectText + source.slice(located.end)

  const titleForMsg = merged.title || match.title || 'entry'
  const putBody = {
    message: `archive: edit "${titleForMsg}" in ${target.arrayName}`,
    content: encodeBase64Utf8(updated),
    sha: fileData.sha,
    branch: BRANCH,
  }

  const result = await githubRequest(`${API_BASE}/${target.path}`, token, {
    method: 'PUT',
    body: JSON.stringify(putBody),
  })

  return { commitUrl: result.commit?.html_url || '' }
}

/**
 * Map an AniList media object + chosen status into the site's entry schema.
 */
export function buildEntryFromAniList(item, statusKey, statusLabel) {
  const title = item.title.english || item.title.romaji
  const entry = {
    title,
    type: item.format ? item.format.replace(/_/g, ' ') : item.type === 'ANIME' ? 'TV' : 'Manga',
    status: statusLabel,
    statusKey,
    image: item.coverImage?.large || '',
  }
  if (typeof item.averageScore === 'number') {
    // AniList scores 0-100; the site uses out-of-10. Round to nearest .5.
    entry.score = Math.round((item.averageScore / 10) * 2) / 2
  }
  if (item.type === 'ANIME' && item.episodes) {
    entry.progress = `0 / ${item.episodes}`
  } else if (item.type === 'MANGA' && item.chapters) {
    entry.progress = `0 / ${item.chapters}`
  }
  entry.note = ''
  // Store the AniList id so this entry can be matched exactly later.
  entry.anilistId = item.id
  return entry
}
