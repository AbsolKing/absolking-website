import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ArchiveTabs from '../components/archive/ArchiveTabs'
import { addEntryToDatabase, editEntryInDatabase, buildEntryFromTmdb } from '../lib/githubDatabase'
import { TMDB_API_KEY } from '../lib/apiKeys'
import { movieEntries } from '../data/movies'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p/w500'
const PER_PAGE = 20

const browseTabs = [
  {
    label: 'Browse',
    to: '/browse',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <rect x="1" y="1" width="5" height="5" rx="1" /><rect x="8" y="1" width="5" height="5" rx="1" />
        <rect x="1" y="8" width="5" height="5" rx="1" /><rect x="8" y="8" width="5" height="5" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Movies',
    to: '/movies',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <rect x="1" y="2" width="12" height="10" rx="1.5" /><path d="M1 5h12M1 9h12M4 2v10M10 2v10" />
      </svg>
    ),
  },
]

const KINDS = [
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'TV' },
]

// TMDB "sort modes" expressed as endpoints / discover orderings.
const SORTS = [
  { value: 'popular', label: 'Popular' },
  { value: 'top_rated', label: 'Top Rated' },
  { value: 'now', label: 'Now Playing' },
  { value: 'upcoming', label: 'Upcoming' },
]

// TMDB genre ids differ slightly between movie and tv; this covers the common ones.
const MOVIE_GENRES = [
  { id: '', label: 'Any Genre' },
  { id: '28', label: 'Action' },
  { id: '12', label: 'Adventure' },
  { id: '16', label: 'Animation' },
  { id: '35', label: 'Comedy' },
  { id: '80', label: 'Crime' },
  { id: '18', label: 'Drama' },
  { id: '14', label: 'Fantasy' },
  { id: '27', label: 'Horror' },
  { id: '9648', label: 'Mystery' },
  { id: '10749', label: 'Romance' },
  { id: '878', label: 'Sci-Fi' },
  { id: '53', label: 'Thriller' },
]

const TV_GENRES = [
  { id: '', label: 'Any Genre' },
  { id: '10759', label: 'Action & Adventure' },
  { id: '16', label: 'Animation' },
  { id: '35', label: 'Comedy' },
  { id: '80', label: 'Crime' },
  { id: '18', label: 'Drama' },
  { id: '10765', label: 'Sci-Fi & Fantasy' },
  { id: '9648', label: 'Mystery' },
  { id: '10764', label: 'Reality' },
]

const ADD_STATUS_OPTIONS = [
  { key: 'planned', label: 'Planning' },
  { key: 'watching', label: 'Watching' },
  { key: 'completed', label: 'Completed' },
  { key: 'on-hold', label: 'On hold' },
  { key: 'dropped', label: 'Dropped' },
]

function normalizeTitle(t) {
  return (t || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function findDbEntry(item) {
  if (!movieEntries || !movieEntries.length) return null
  const byId = movieEntries.find((e) => e.tmdbId === item.id)
  if (byId) return byId
  const title = item.title || item.name || ''
  const needle = normalizeTitle(title)
  return movieEntries.find((e) => normalizeTitle(e.title) === needle) || null
}

const selectClass =
  'rounded-lg border border-[#3e3e42] bg-[#1e1e1e] py-2 pl-3 pr-8 font-mono-soft text-xs uppercase tracking-[0.12em] text-[#d4d4d4] outline-none transition focus:border-[#569cd6]/60 hover:border-[#4b4b50] appearance-none cursor-pointer'

function FieldSelect({ label, value, onChange, options }) {
  return (
    <label className="relative flex flex-col gap-1">
      <span className="font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">{label}</span>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={`${selectClass} w-full`}>
          {options.map((opt) => (
            <option key={`${opt.id}`} value={opt.id} className="bg-[#1e1e1e] text-[#d4d4d4]">
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 font-mono-soft text-[10px] text-[#6f6f6f]">▾</span>
      </div>
    </label>
  )
}

function titleOf(item) {
  return item.title || item.name || 'Untitled'
}
function yearOf(item) {
  const d = item.release_date || item.first_air_date
  return d ? d.slice(0, 4) : null
}

function MovieCard({ item, kind, index, onOpen }) {
  const score = typeof item.vote_average === 'number' && item.vote_average > 0 ? item.vote_average.toFixed(1) : null
  const inArchive = !!findDbEntry(item)
  const year = yearOf(item)

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      style={{ animationDelay: `${Math.min(index, 11) * 28}ms` }}
      className="group fade-up relative flex flex-col overflow-hidden rounded-xl border border-[#333337] bg-[#202020]/78 text-left transition duration-300 hover:border-[#4b4b50] hover:bg-[#242426] hover:-translate-y-[3px]"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#1a1a1a]">
        {item.poster_path ? (
          <img src={`${IMG_BASE}${item.poster_path}`} alt={titleOf(item)} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono-soft text-[10px] text-[#6f6f6f]">no poster</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent opacity-90" />
        {score && (
          <div className="absolute right-2 top-2 flex items-baseline gap-0.5 rounded-md border border-[#3e3e42] bg-[#161616]/88 px-2 py-1 backdrop-blur-sm">
            <span className="font-mono-soft text-sm font-semibold leading-none text-[#dcdcaa]">{score}</span>
            <span className="font-mono-soft text-[8px] uppercase tracking-[0.14em] text-[#6f6f6f]">/10</span>
          </div>
        )}
        {inArchive && (
          <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md border border-[#4ec9b0]/40 bg-[#161616]/88 px-1.5 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ec9b0]" />
            <span className="font-mono-soft text-[8px] uppercase tracking-[0.16em] text-[#4ec9b0]">In archive</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3" style={{ borderTop: '2px solid #dcdcaa55' }}>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-[-0.01em] text-[#d4d4d4] transition group-hover:text-[#569cd6]">{titleOf(item)}</h3>
        <p className="mt-1.5 truncate font-mono-soft text-[9px] uppercase tracking-[0.14em] text-[#8f8f8f]">
          {(kind === 'tv' ? 'TV' : 'Film') + (year ? ` • ${year}` : '')}
        </p>
      </div>
    </button>
  )
}

function MovieDetailModal({ item, kind, onClose, token, setToken }) {
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(false)
  const [addStatus, setAddStatus] = useState('planned')
  const [addScore, setAddScore] = useState('')
  const [addNote, setAddNote] = useState('')
  const [editStatus, setEditStatus] = useState('planned')
  const [editScore, setEditScore] = useState('')
  const [editNote, setEditNote] = useState('')
  const [tokenInput, setTokenInput] = useState('')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)

  const dbEntry = item ? findDbEntry(item) : null

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

  const title = titleOf(item)
  const score = typeof item.vote_average === 'number' && item.vote_average > 0 ? item.vote_average.toFixed(1) : null
  const facts = [
    ['Type', kind === 'tv' ? 'TV Series' : 'Film'],
    ['Released', item.release_date || item.first_air_date],
    ['Rating', score ? `${score} / 10` : null],
    ['Votes', item.vote_count ? item.vote_count.toLocaleString() : null],
    ['Language', item.original_language ? item.original_language.toUpperCase() : null],
  ].filter(([, v]) => v)

  const handleAdd = async () => {
    const activeToken = (token || tokenInput).trim()
    if (!activeToken) {
      setResult({ ok: false, message: 'Paste your GitHub token first.' })
      return
    }
    setBusy(true)
    setResult(null)
    try {
      const statusLabel = ADD_STATUS_OPTIONS.find((s) => s.key === addStatus)?.label || 'Planning'
      const entry = buildEntryFromTmdb(item, kind, addStatus, statusLabel)
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
      const res = await addEntryToDatabase({ mediaType: 'MOVIE', entry, token: activeToken })
      if (!token) setToken(activeToken)
      setTokenInput('')
      if (res.alreadyExists) setResult({ ok: true, message: 'Already in the database — skipped.' })
      else setResult({ ok: true, message: 'Committed! It will appear after the next rebuild.', url: res.commitUrl })
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
      const statusLabel = ADD_STATUS_OPTIONS.find((s) => s.key === editStatus)?.label || 'Planning'
      const updates = { statusKey: editStatus, status: statusLabel, note: editNote.trim() }
      const trimmedScore = editScore.trim()
      updates.score = trimmedScore === '' ? '' : Number(trimmedScore)
      if (trimmedScore !== '' && Number.isNaN(updates.score)) {
        setResult({ ok: false, message: 'Score must be a number (or left blank).' })
        setBusy(false)
        return
      }
      const match = dbEntry?.tmdbId != null ? { tmdbId: dbEntry.tmdbId } : { title: dbEntry?.title }
      const res = await editEntryInDatabase({ mediaType: 'MOVIE', match, updates, token: activeToken })
      if (!token) setToken(activeToken)
      setTokenInput('')
      if (res.notFound) setResult({ ok: false, message: 'Could not find this entry in the source file to edit.' })
      else setResult({ ok: true, message: 'Saved! Changes apply after the next rebuild.', url: res.commitUrl })
    } catch (err) {
      setResult({ ok: false, message: err.message || 'Failed to commit.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#0d0d0d]/82 p-4 backdrop-blur-sm sm:p-8" onClick={onClose}>
      <div className="clean-panel relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="editor-topbar">
          <span className="window-dot bg-[#ce9178]" />
          <span className="window-dot bg-[#dcdcaa]" />
          <span className="window-dot bg-[#4ec9b0]" />
          <span className="ml-2 truncate font-mono-soft text-[11px] text-[#8f8f8f]">{kind} / {String(item.id)}.json</span>
          <button type="button" onClick={onClose} className="ml-auto font-mono-soft text-xs text-[#6f6f6f] transition hover:text-[#d4d4d4]" aria-label="Close">✕ esc</button>
        </div>

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-7">
          <div className="w-full sm:w-[200px] flex-shrink-0">
            <div className="overflow-hidden rounded-lg border border-[#3e3e42] bg-[#1a1a1a]" style={{ aspectRatio: '2/3' }}>
              {item.poster_path ? (
                <img src={`${IMG_BASE}${item.poster_path}`} alt={title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-mono-soft text-[10px] text-[#6f6f6f]">no poster</div>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#d4d4d4] sm:text-3xl">{title}</h2>

            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5 border-y border-[#2d2d30] py-4">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <span className="block font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">{k}</span>
                  <span className="mt-0.5 block font-mono-soft text-xs text-[#d4d4d4]">{v}</span>
                </div>
              ))}
            </div>

            {item.overview ? (
              <p className="mt-4 max-h-44 overflow-y-auto pr-1 text-sm leading-6 text-[#b7b7b7]">{item.overview}</p>
            ) : (
              <p className="mt-4 text-sm italic text-[#6f6f6f]">No description available.</p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              {dbEntry && !editing && !adding && (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#4ec9b0]/40 bg-[#1e3a4c]/50 px-3 py-2 font-mono-soft text-[10px] uppercase tracking-[0.14em] text-[#4ec9b0]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4ec9b0]" />
                    In archive{dbEntry.status ? ` · ${dbEntry.status}` : ''}
                  </span>
                  <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-lg border border-[#dcdcaa]/45 bg-[#332f1c]/55 px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] text-[#dcdcaa] transition hover:border-[#dcdcaa]/70 hover:bg-[#332f1c]/80">✎ Edit Entry</button>
                </>
              )}
              {!dbEntry && !adding && (
                <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-lg border border-[#569cd6]/45 bg-[#094771]/55 px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] text-[#d4d4d4] transition hover:border-[#569cd6]/70 hover:bg-[#094771]/80">+ Add to Database</button>
              )}
            </div>

            {(adding || editing) && (
              <div className={`mt-4 rounded-xl border p-4 ${editing ? 'border-[#dcdcaa]/30' : 'border-[#3e3e42]'} bg-[#1a1a1a]/70`}>
                <div className="flex items-center justify-between">
                  <p className={`font-mono-soft text-[10px] uppercase tracking-[0.18em] ${editing ? 'text-[#dcdcaa]' : 'text-[#569cd6]'}`}>
                    {editing ? 'Edit entry' : `Add to Movies archive`}
                  </p>
                  <button type="button" onClick={() => (editing ? setEditing(false) : setAdding(false))} className="font-mono-soft text-[10px] uppercase tracking-[0.16em] text-[#6f6f6f] transition hover:text-[#d4d4d4]">cancel</button>
                </div>

                <div className="mt-3">
                  <span className="block font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">Status</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {ADD_STATUS_OPTIONS.map((s) => {
                      const selected = editing ? editStatus === s.key : addStatus === s.key
                      return (
                        <button key={s.key} type="button" onClick={() => (editing ? setEditStatus(s.key) : setAddStatus(s.key))} className={`rounded-md border px-2.5 py-1.5 font-mono-soft text-[10px] uppercase tracking-[0.12em] transition ${selected ? (editing ? 'border-[#dcdcaa]/60 bg-[#332f1c]/65 text-[#dcdcaa]' : 'border-[#569cd6]/60 bg-[#094771]/65 text-[#d4d4d4]') : 'border-[#3e3e42] bg-[#1e1e1e] text-[#8f8f8f] hover:text-[#d4d4d4]'}`}>
                          {s.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {editing && (
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">Score (0–10, blank = none)</span>
                      <input type="text" value={editScore} onChange={(e) => setEditScore(e.target.value)} placeholder="—" className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-3 py-2 font-mono-soft text-xs text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#dcdcaa]/60" />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">Note</span>
                      <textarea value={editNote} onChange={(e) => setEditNote(e.target.value)} rows={2} placeholder="Optional note…" className="resize-none rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-3 py-2 text-sm text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#dcdcaa]/60" />
                    </label>
                  </div>
                )}

                {adding && (
                  <div className="mt-3 grid grid-cols-1 gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">Score (0–10, blank = none)</span>
                      <input type="text" value={addScore} onChange={(e) => setAddScore(e.target.value)} placeholder="—" className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-3 py-2 font-mono-soft text-xs text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#569cd6]/60" />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">Note</span>
                      <textarea value={addNote} onChange={(e) => setAddNote(e.target.value)} rows={2} placeholder="Optional note…" className="resize-none rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-3 py-2 text-sm text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#569cd6]/60" />
                    </label>
                  </div>
                )}

                {!token && (
                  <div className="mt-3">
                    <span className="block font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">GitHub token (held in memory only, never stored)</span>
                    <input type="password" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="github_pat_…" autoComplete="off" className="mt-1.5 w-full rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-3 py-2 font-mono-soft text-xs text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#569cd6]/60" />
                  </div>
                )}
                {token && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="font-mono-soft text-[10px] text-[#4ec9b0]">● token loaded for this session</span>
                    <button type="button" onClick={() => setToken('')} className="font-mono-soft text-[10px] uppercase tracking-[0.14em] text-[#6f6f6f] underline-offset-2 transition hover:text-[#f44747] hover:underline">forget</button>
                  </div>
                )}

                <button type="button" disabled={busy} onClick={editing ? handleEdit : handleAdd} className={`mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] transition disabled:opacity-50 ${editing ? 'border-[#dcdcaa]/45 bg-[#332f1c] text-[#dcdcaa] hover:bg-[#3d391f]' : 'border-[#4ec9b0]/45 bg-[#1e3a4c] text-[#4ec9b0] hover:bg-[#1e4a5c]'}`}>
                  {busy ? (editing ? 'Saving…' : 'Committing…') : editing ? 'Save changes' : 'Commit entry'}
                </button>

                {result && (
                  <p className={`mt-3 font-mono-soft text-[11px] ${result.ok ? 'text-[#4ec9b0]' : 'text-[#f44747]'}`}>
                    {result.message}
                    {result.url && (<> <a href={result.url} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2">view commit</a></>)}
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
      <div className="aspect-[2/3] w-full animate-pulse bg-[#262628]" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-4/5 animate-pulse rounded bg-[#2d2d30]" />
        <div className="h-2 w-2/5 animate-pulse rounded bg-[#262628]" />
      </div>
    </div>
  )
}

export default function MoviesBrowserPage() {
  const [kind, setKind] = useState('movie')
  const [filters, setFilters] = useState({ sort: 'popular', genre: '' })
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [active, setActive] = useState(null)
  const [ghToken, setGhToken] = useState('')
  const requestId = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 420)
    return () => clearTimeout(t)
  }, [searchInput])

  const queryState = useMemo(() => ({ kind, ...filters, search }), [kind, filters, search])

  const buildUrl = useCallback((targetPage) => {
    const k = queryState.kind
    const common = `api_key=${TMDB_API_KEY}&page=${targetPage}&include_adult=false`
    if (queryState.search.trim()) {
      return `${TMDB_BASE}/search/${k}?${common}&query=${encodeURIComponent(queryState.search.trim())}`
    }
    if (queryState.genre) {
      // Genre filtering requires the discover endpoint.
      const sortMap = { popular: 'popularity.desc', top_rated: 'vote_average.desc', now: 'primary_release_date.desc', upcoming: 'primary_release_date.asc' }
      const sortBy = sortMap[queryState.sort] || 'popularity.desc'
      const voteCount = queryState.sort === 'top_rated' ? '&vote_count.gte=200' : ''
      const dateField = k === 'tv' ? 'first_air_date' : 'primary_release_date'
      const adjustedSort = sortBy.replace('primary_release_date', dateField)
      return `${TMDB_BASE}/discover/${k}?${common}&with_genres=${queryState.genre}&sort_by=${adjustedSort}${voteCount}`
    }
    // No genre, no search: use the curated list endpoints.
    const listMap = {
      movie: { popular: 'popular', top_rated: 'top_rated', now: 'now_playing', upcoming: 'upcoming' },
      tv: { popular: 'popular', top_rated: 'top_rated', now: 'on_the_air', upcoming: 'airing_today' },
    }
    const endpoint = listMap[k][queryState.sort] || 'popular'
    return `${TMDB_BASE}/${k}/${endpoint}?${common}`
  }, [queryState])

  const fetchPage = useCallback(
    async (targetPage, append) => {
      const id = ++requestId.current
      append ? setLoadingMore(true) : setLoading(true)
      setError(null)
      try {
        const res = await fetch(buildUrl(targetPage))
        if (res.status === 401) throw new Error('TMDB rejected the API key.')
        if (res.status === 429) throw new Error('TMDB rate limit reached — wait a moment and retry.')
        const json = await res.json()
        if (id !== requestId.current) return
        const results = (json.results || []).filter((r) => r.poster_path || r.overview)
        setHasNext(json.page < json.total_pages)
        setCount(json.total_results || 0)
        setItems((prev) => {
          if (!append) return results
          const seen = new Set(prev.map((m) => m.id))
          return [...prev, ...results.filter((m) => !seen.has(m.id))]
        })
        setPage(targetPage)
      } catch (err) {
        if (id !== requestId.current) return
        setError(err.message || 'Something went wrong talking to TMDB.')
        if (!append) setItems([])
      } finally {
        if (id === requestId.current) {
          setLoading(false)
          setLoadingMore(false)
        }
      }
    },
    [buildUrl],
  )

  useEffect(() => {
    fetchPage(1, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryState])

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))
  const changeKind = (k) => {
    setKind(k)
    setFilters((prev) => ({ ...prev, genre: '' })) // genre ids differ between movie/tv
  }
  const sortLabel = SORTS.find((s) => s.value === filters.sort)?.label ?? 'Browse'
  const genres = kind === 'tv' ? TV_GENRES : MOVIE_GENRES

  return (
    <>
      <section className="clean-shell py-8 sm:py-12 lg:py-14">
        <div className="clean-panel overflow-hidden rounded-2xl fade-up">
          <div className="editor-topbar">
            <span className="window-dot bg-[#ce9178]" />
            <span className="window-dot bg-[#dcdcaa]" />
            <span className="window-dot bg-[#4ec9b0]" />
            <span className="ml-2 font-mono-soft text-[11px] text-[#8f8f8f]">
              <Link to="/browse" className="transition hover:text-[#d4d4d4]">browse</Link>
              <span className="text-[#6f6f6f]"> / </span>
              <span className="text-[#d4d4d4]">movies.tmdb</span>
            </span>
          </div>
          <div className="px-6 py-8 sm:px-9 sm:py-11">
            <p className="font-mono-soft text-[10px] uppercase tracking-[0.24em] text-[#4ec9b0]">// live from tmdb</p>
            <h1 className="mt-4 text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.05em] text-[#d4d4d4] sm:text-6xl">Movies &amp; TV</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b7b7b7] sm:text-base">
              Browse films and series by genre and rating, or search by title. Add anything to your archive directly.
            </p>
          </div>
        </div>
      </section>

      <ArchiveTabs items={browseTabs} />

      <section className="clean-shell py-5 sm:py-7">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[#2d2d30] pb-4">
          <div className="inline-flex overflow-hidden rounded-lg border border-[#3e3e42]">
            {KINDS.map((t) => (
              <button key={t.value} type="button" onClick={() => changeKind(t.value)} className={`px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] transition ${kind === t.value ? 'bg-[#094771]/70 text-[#d4d4d4]' : 'text-[#767676] hover:bg-[#252526] hover:text-[#d4d4d4]'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="inline-flex flex-wrap overflow-hidden rounded-lg border border-[#3e3e42]">
            {SORTS.map((s) => (
              <button key={s.value} type="button" onClick={() => updateFilter('sort', s.value)} className={`px-3.5 py-2 font-mono-soft text-[11px] uppercase tracking-[0.14em] transition ${filters.sort === s.value ? 'bg-[#1e3a4c] text-[#4ec9b0]' : 'text-[#767676] hover:bg-[#252526] hover:text-[#d4d4d4]'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <FieldSelect label="Genre" value={filters.genre} onChange={(v) => updateFilter('genre', v)} options={genres} />
        </div>

        <div className="relative mt-4">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono-soft text-xs text-[#6f6f6f]">/</span>
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by title…" className="w-full rounded-lg border border-[#3e3e42] bg-[#1e1e1e] py-2.5 pl-8 pr-4 font-mono-soft text-sm text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#569cd6]/60 focus:bg-[#1a1a1a]" />
          {searchInput && (
            <button type="button" onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 font-mono-soft text-xs text-[#6f6f6f] transition hover:text-[#d4d4d4]">✕</button>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.18em] text-[#8f8f8f]">
            {search.trim() ? `Results for "${search.trim()}"` : `${sortLabel} ${kind === 'tv' ? 'TV' : 'Movies'}`}
            {count ? <span className="ml-2 text-[#5f5f5f]">{count.toLocaleString()} entries</span> : null}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {loading ? Array.from({ length: PER_PAGE }).map((_, i) => <SkeletonCard key={i} />) : items.map((it, i) => <MovieCard key={it.id} item={it} kind={kind} index={i} onOpen={setActive} />)}
        </div>

        {!loading && error && (
          <div className="clean-card mt-5 rounded-xl p-6 text-center">
            <p className="font-mono-soft text-sm text-[#f44747]">{error}</p>
            <button type="button" onClick={() => fetchPage(1, false)} className="mt-3 rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] text-[#d4d4d4] transition hover:border-[#569cd6]/50">Retry</button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="clean-card mt-5 rounded-xl p-8 text-center font-mono-soft text-sm text-[#8f8f8f]">Nothing matches these filters.</div>
        )}

        {!loading && !error && hasNext && (
          <div className="mt-7 flex justify-center">
            <button type="button" disabled={loadingMore} onClick={() => fetchPage(page + 1, true)} className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-6 py-2.5 font-mono-soft text-[11px] uppercase tracking-[0.18em] text-[#d4d4d4] transition hover:border-[#569cd6]/60 hover:bg-[#1e3a4c] disabled:opacity-50">
              {loadingMore ? 'Loading…' : 'Load More'}
            </button>
          </div>
        )}
      </section>

      <MovieDetailModal item={active} kind={kind} onClose={() => setActive(null)} token={ghToken} setToken={setGhToken} />
    </>
  )
}
