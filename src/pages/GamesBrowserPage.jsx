import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ArchiveTabs from '../components/archive/ArchiveTabs'
import { addEntryToDatabase, editEntryInDatabase, buildEntryFromRawg } from '../lib/githubDatabase'
import { RAWG_API_KEY } from '../lib/apiKeys'
import { gameEntries } from '../data/games'

const RAWG_BASE = 'https://api.rawg.io/api'
const PER_PAGE = 24

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
    label: 'Games',
    to: '/games',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3.5" width="12" height="7.5" rx="2" />
        <path d="M5 5.5v3M3.5 7h3" /><circle cx="9.5" cy="6" r="0.5" fill="currentColor" /><circle cx="11" cy="7.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
]

const SORTS = [
  { value: '-added', label: 'Trending' },
  { value: '-rating', label: 'Top Rated' },
  { value: '-released', label: 'New Releases' },
  { value: '-metacritic', label: 'Metacritic' },
]

// A compact, popular subset of RAWG genres (slug + label).
const GENRES = [
  { slug: '', label: 'Any Genre' },
  { slug: 'action', label: 'Action' },
  { slug: 'adventure', label: 'Adventure' },
  { slug: 'role-playing-games-rpg', label: 'RPG' },
  { slug: 'strategy', label: 'Strategy' },
  { slug: 'shooter', label: 'Shooter' },
  { slug: 'puzzle', label: 'Puzzle' },
  { slug: 'platformer', label: 'Platformer' },
  { slug: 'indie', label: 'Indie' },
  { slug: 'simulation', label: 'Simulation' },
  { slug: 'racing', label: 'Racing' },
  { slug: 'sports', label: 'Sports' },
  { slug: 'fighting', label: 'Fighting' },
]

const PLATFORMS = [
  { id: '', label: 'Any Platform' },
  { id: '4', label: 'PC' },
  { id: '187', label: 'PS5' },
  { id: '18', label: 'PS4' },
  { id: '1', label: 'Xbox One' },
  { id: '186', label: 'Xbox Series' },
  { id: '7', label: 'Switch' },
  { id: '21', label: 'Android' },
  { id: '3', label: 'iOS' },
]

const ADD_STATUS_OPTIONS = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'playing', label: 'Playing' },
  { key: 'played', label: 'Played' },
  { key: 'dropped', label: 'Dropped' },
]

function normalizeTitle(t) {
  return (t || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function findDbEntry(game) {
  if (!gameEntries || !gameEntries.length) return null
  const byId = gameEntries.find((e) => e.rawgId === game.id)
  if (byId) return byId
  const needle = normalizeTitle(game.name)
  return gameEntries.find((e) => normalizeTitle(e.title) === needle) || null
}

function stripHtml(text) {
  if (!text) return ''
  return text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

const selectClass =
  'rounded-lg border border-[#3e3e42] bg-[#1e1e1e] py-2 pl-3 pr-8 font-mono-soft text-xs uppercase tracking-[0.12em] text-[#d4d4d4] outline-none transition focus:border-[#569cd6]/60 hover:border-[#4b4b50] appearance-none cursor-pointer'

function FieldSelect({ label, value, onChange, options, valueKey, labelKey }) {
  return (
    <label className="relative flex flex-col gap-1">
      <span className="font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">{label}</span>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className={`${selectClass} w-full`}>
          {options.map((opt) => {
            const v = opt[valueKey]
            const l = opt[labelKey]
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

function GameCard({ game, index, onOpen }) {
  const score = typeof game.rating === 'number' && game.rating > 0 ? game.rating.toFixed(1) : null
  const inArchive = !!findDbEntry(game)
  const meta = [game.genres?.[0]?.name, game.released ? game.released.slice(0, 4) : null].filter(Boolean)

  return (
    <button
      type="button"
      onClick={() => onOpen(game)}
      style={{ animationDelay: `${Math.min(index, 11) * 28}ms` }}
      className="group fade-up relative flex flex-col overflow-hidden rounded-xl border border-[#333337] bg-[#202020]/78 text-left transition duration-300 hover:border-[#4b4b50] hover:bg-[#242426] hover:-translate-y-[3px]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1a1a1a]">
        {game.background_image ? (
          <img src={game.background_image} alt={game.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono-soft text-[10px] text-[#6f6f6f]">no image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent opacity-90" />
        {score && (
          <div className="absolute right-2 top-2 flex items-baseline gap-0.5 rounded-md border border-[#3e3e42] bg-[#161616]/88 px-2 py-1 backdrop-blur-sm">
            <span className="font-mono-soft text-sm font-semibold leading-none text-[#dcdcaa]">{score}</span>
            <span className="font-mono-soft text-[8px] uppercase tracking-[0.14em] text-[#6f6f6f]">/5</span>
          </div>
        )}
        {inArchive && (
          <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md border border-[#4ec9b0]/40 bg-[#161616]/88 px-1.5 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ec9b0]" />
            <span className="font-mono-soft text-[8px] uppercase tracking-[0.16em] text-[#4ec9b0]">In archive</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3" style={{ borderTop: '2px solid #569cd655' }}>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-[-0.01em] text-[#d4d4d4] transition group-hover:text-[#569cd6]">
          {game.name}
        </h3>
        {meta.length ? (
          <p className="mt-1.5 truncate font-mono-soft text-[9px] uppercase tracking-[0.14em] text-[#8f8f8f]">{meta.join(' • ')}</p>
        ) : null}
      </div>
    </button>
  )
}

function GameDetailModal({ game, onClose, token, setToken }) {
  const [detail, setDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(false)
  const [addStatus, setAddStatus] = useState('backlog')
  const [addScore, setAddScore] = useState('')
  const [addNote, setAddNote] = useState('')
  const [editStatus, setEditStatus] = useState('backlog')
  const [editScore, setEditScore] = useState('')
  const [editNote, setEditNote] = useState('')
  const [tokenInput, setTokenInput] = useState('')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)

  const dbEntry = game ? findDbEntry(game) : null

  useEffect(() => {
    setAdding(false)
    setEditing(false)
    setResult(null)
    setAddStatus('backlog')
    setAddScore('')
    setAddNote('')
    setDetail(null)
    if (game) {
      const existing = findDbEntry(game)
      if (existing) {
        setEditStatus(existing.statusKey || 'backlog')
        setEditScore(existing.score != null ? String(existing.score) : '')
        setEditNote(existing.note || '')
      }
      // Fetch full description (list endpoint doesn't include it).
      setLoadingDetail(true)
      fetch(`${RAWG_BASE}/games/${game.id}?key=${RAWG_API_KEY}`)
        .then((r) => r.json())
        .then((d) => setDetail(d))
        .catch(() => setDetail(null))
        .finally(() => setLoadingDetail(false))
    }
  }, [game])

  useEffect(() => {
    if (!game) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [game, onClose])

  if (!game) return null

  const score = typeof game.rating === 'number' && game.rating > 0 ? game.rating.toFixed(1) : null
  const description = detail ? stripHtml(detail.description_raw || detail.description) : ''
  const platforms = (game.platforms || []).map((p) => p.platform?.name).filter(Boolean)
  const facts = [
    ['Genre', game.genres?.map((g) => g.name).slice(0, 3).join(', ')],
    ['Released', game.released],
    ['Rating', score ? `${score} / 5` : null],
    ['Metacritic', game.metacritic],
    ['Platforms', platforms.slice(0, 4).join(', ')],
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
      const statusLabel = ADD_STATUS_OPTIONS.find((s) => s.key === addStatus)?.label || 'Backlog'
      const entry = buildEntryFromRawg(game, addStatus, statusLabel)
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
      const res = await addEntryToDatabase({ mediaType: 'GAME', entry, token: activeToken })
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
      const statusLabel = ADD_STATUS_OPTIONS.find((s) => s.key === editStatus)?.label || 'Backlog'
      const updates = { statusKey: editStatus, status: statusLabel, note: editNote.trim() }
      const trimmedScore = editScore.trim()
      updates.score = trimmedScore === '' ? '' : Number(trimmedScore)
      if (trimmedScore !== '' && Number.isNaN(updates.score)) {
        setResult({ ok: false, message: 'Score must be a number (or left blank).' })
        setBusy(false)
        return
      }
      const match = dbEntry?.rawgId != null ? { rawgId: dbEntry.rawgId } : { title: dbEntry?.title }
      const res = await editEntryInDatabase({ mediaType: 'GAME', match, updates, token: activeToken })
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
          <span className="ml-2 truncate font-mono-soft text-[11px] text-[#8f8f8f]">game / {String(game.id)}.json</span>
          <button type="button" onClick={onClose} className="ml-auto font-mono-soft text-xs text-[#6f6f6f] transition hover:text-[#d4d4d4]" aria-label="Close">
            ✕ esc
          </button>
        </div>

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-7">
          <div className="w-full sm:w-[200px] flex-shrink-0">
            <div className="overflow-hidden rounded-lg border border-[#3e3e42] bg-[#1a1a1a]" style={{ aspectRatio: '3/4' }}>
              {game.background_image ? (
                <img src={game.background_image} alt={game.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-mono-soft text-[10px] text-[#6f6f6f]">no image</div>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#d4d4d4] sm:text-3xl">{game.name}</h2>

            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5 border-y border-[#2d2d30] py-4">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <span className="block font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">{k}</span>
                  <span className="mt-0.5 block font-mono-soft text-xs text-[#d4d4d4]">{v}</span>
                </div>
              ))}
            </div>

            {loadingDetail ? (
              <p className="mt-4 font-mono-soft text-xs text-[#6f6f6f]">Loading description…</p>
            ) : description ? (
              <p className="mt-4 max-h-44 overflow-y-auto pr-1 text-sm leading-6 text-[#b7b7b7]">{description}</p>
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
                  <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-lg border border-[#dcdcaa]/45 bg-[#332f1c]/55 px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] text-[#dcdcaa] transition hover:border-[#dcdcaa]/70 hover:bg-[#332f1c]/80">
                    ✎ Edit Entry
                  </button>
                </>
              )}
              {!dbEntry && !adding && (
                <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-lg border border-[#569cd6]/45 bg-[#094771]/55 px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] text-[#d4d4d4] transition hover:border-[#569cd6]/70 hover:bg-[#094771]/80">
                  + Add to Database
                </button>
              )}
            </div>

            {(adding || editing) && (
              <div className={`mt-4 rounded-xl border p-4 ${editing ? 'border-[#dcdcaa]/30' : 'border-[#3e3e42]'} bg-[#1a1a1a]/70`}>
                <div className="flex items-center justify-between">
                  <p className={`font-mono-soft text-[10px] uppercase tracking-[0.18em] ${editing ? 'text-[#dcdcaa]' : 'text-[#569cd6]'}`}>
                    {editing ? 'Edit entry' : 'Add to Games archive'}
                  </p>
                  <button type="button" onClick={() => (editing ? setEditing(false) : setAdding(false))} className="font-mono-soft text-[10px] uppercase tracking-[0.16em] text-[#6f6f6f] transition hover:text-[#d4d4d4]">
                    cancel
                  </button>
                </div>

                <div className="mt-3">
                  <span className="block font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">Status</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {ADD_STATUS_OPTIONS.map((s) => {
                      const selected = editing ? editStatus === s.key : addStatus === s.key
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => (editing ? setEditStatus(s.key) : setAddStatus(s.key))}
                          className={`rounded-md border px-2.5 py-1.5 font-mono-soft text-[10px] uppercase tracking-[0.12em] transition ${
                            selected
                              ? editing
                                ? 'border-[#dcdcaa]/60 bg-[#332f1c]/65 text-[#dcdcaa]'
                                : 'border-[#569cd6]/60 bg-[#094771]/65 text-[#d4d4d4]'
                              : 'border-[#3e3e42] bg-[#1e1e1e] text-[#8f8f8f] hover:text-[#d4d4d4]'
                          }`}
                        >
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
                    {result.url && (
                      <> <a href={result.url} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2">view commit</a></>
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

export default function GamesBrowserPage() {
  const [filters, setFilters] = useState({ sort: '-added', genre: '', platform: '' })
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

  const queryState = useMemo(() => ({ ...filters, search }), [filters, search])

  const fetchPage = useCallback(
    async (targetPage, append) => {
      const id = ++requestId.current
      append ? setLoadingMore(true) : setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ key: RAWG_API_KEY, page: String(targetPage), page_size: String(PER_PAGE) })
        if (queryState.search.trim()) {
          params.set('search', queryState.search.trim())
        } else {
          params.set('ordering', queryState.sort)
        }
        if (queryState.genre) params.set('genres', queryState.genre)
        if (queryState.platform) params.set('platforms', queryState.platform)

        const res = await fetch(`${RAWG_BASE}/games?${params.toString()}`)
        if (res.status === 401) throw new Error('RAWG rejected the API key.')
        if (res.status === 429) throw new Error('RAWG rate limit reached — wait a moment and retry.')
        const json = await res.json()
        if (id !== requestId.current) return
        const results = json.results || []
        setHasNext(Boolean(json.next))
        setCount(json.count || 0)
        setItems((prev) => {
          if (!append) return results
          const seen = new Set(prev.map((g) => g.id))
          return [...prev, ...results.filter((g) => !seen.has(g.id))]
        })
        setPage(targetPage)
      } catch (err) {
        if (id !== requestId.current) return
        setError(err.message || 'Something went wrong talking to RAWG.')
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

  useEffect(() => {
    fetchPage(1, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryState])

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))
  const sortLabel = SORTS.find((s) => s.value === filters.sort)?.label ?? 'Browse'

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
              <span className="text-[#d4d4d4]">games.rawg</span>
            </span>
          </div>
          <div className="px-6 py-8 sm:px-9 sm:py-11">
            <p className="font-mono-soft text-[10px] uppercase tracking-[0.24em] text-[#4ec9b0]">// live from rawg</p>
            <h1 className="mt-4 text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.05em] text-[#d4d4d4] sm:text-6xl">Games</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b7b7b7] sm:text-base">
              Browse games by genre, platform, and rating — or search by title. Add anything to your archive directly.
            </p>
          </div>
        </div>
      </section>

      <ArchiveTabs items={browseTabs} />

      <section className="clean-shell py-5 sm:py-7">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[#2d2d30] pb-4">
          <div className="inline-flex flex-wrap overflow-hidden rounded-lg border border-[#3e3e42]">
            {SORTS.map((s) => (
              <button key={s.value} type="button" onClick={() => updateFilter('sort', s.value)} className={`px-3.5 py-2 font-mono-soft text-[11px] uppercase tracking-[0.14em] transition ${filters.sort === s.value ? 'bg-[#1e3a4c] text-[#4ec9b0]' : 'text-[#767676] hover:bg-[#252526] hover:text-[#d4d4d4]'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <FieldSelect label="Genre" value={filters.genre} onChange={(v) => updateFilter('genre', v)} options={GENRES} valueKey="slug" labelKey="label" />
          <FieldSelect label="Platform" value={filters.platform} onChange={(v) => updateFilter('platform', v)} options={PLATFORMS} valueKey="id" labelKey="label" />
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
            {search.trim() ? `Results for "${search.trim()}"` : `${sortLabel} Games`}
            {count ? <span className="ml-2 text-[#5f5f5f]">{count.toLocaleString()} entries</span> : null}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {loading ? Array.from({ length: PER_PAGE }).map((_, i) => <SkeletonCard key={i} />) : items.map((game, i) => <GameCard key={game.id} game={game} index={i} onOpen={setActive} />)}
        </div>

        {!loading && error && (
          <div className="clean-card mt-5 rounded-xl p-6 text-center">
            <p className="font-mono-soft text-sm text-[#f44747]">{error}</p>
            <button type="button" onClick={() => fetchPage(1, false)} className="mt-3 rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-4 py-2 font-mono-soft text-[11px] uppercase tracking-[0.16em] text-[#d4d4d4] transition hover:border-[#569cd6]/50">Retry</button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="clean-card mt-5 rounded-xl p-8 text-center font-mono-soft text-sm text-[#8f8f8f]">No games match these filters.</div>
        )}

        {!loading && !error && hasNext && (
          <div className="mt-7 flex justify-center">
            <button type="button" disabled={loadingMore} onClick={() => fetchPage(page + 1, true)} className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e] px-6 py-2.5 font-mono-soft text-[11px] uppercase tracking-[0.18em] text-[#d4d4d4] transition hover:border-[#569cd6]/60 hover:bg-[#1e3a4c] disabled:opacity-50">
              {loadingMore ? 'Loading…' : 'Load More'}
            </button>
          </div>
        )}
      </section>

      <GameDetailModal game={active} onClose={() => setActive(null)} token={ghToken} setToken={setGhToken} />
    </>
  )
}
