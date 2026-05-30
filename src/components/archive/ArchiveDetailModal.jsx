import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMediaDetails } from '../../lib/mediaLookup'

const statusColors = {
  completed: '#4ec9b0',
  watching:  '#569cd6',
  reading:   '#569cd6',
  playing:   '#569cd6',
  'on-hold': '#dcdcaa',
  played:    '#4ec9b0',
  backlog:   '#3e3e42',
  planned:   '#3e3e42',
  dropped:   '#ce9178',
}

export default function ArchiveDetailModal({ item, mediaType, onClose }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch when an item opens; reset when it closes.
  useEffect(() => {
    if (!item || !mediaType) {
      setDetails(null)
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    setDetails(null)
    fetchMediaDetails(mediaType, item)
      .then((d) => {
        if (!cancelled) setDetails(d)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to load.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [item, mediaType])

  // Escape to close + lock body scroll.
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

  const accent = statusColors[item.statusKey] ?? '#3e3e42'
  const userScore = typeof item.score === 'number' ? item.score : null
  const fileName =
    `${(item.title || 'entry').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.json`

  // Show stored title if the API hasn't replied yet; otherwise prefer the matched one.
  const headerTitle = details?.matchedTitle || item.title
  const headerAlt = details?.altTitle

  const facts = details
    ? [
        ['Format', details.format],
        ['Year', details.year],
        ['Count', details.count],
        ['Studio', details.studio],
        ['External', details.externalScore],
      ].filter(([, v]) => v)
    : []

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
            {mediaType} / {fileName}
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
            <div
              className="overflow-hidden rounded-lg border border-[#3e3e42] bg-[#1a1a1a]"
              style={{ aspectRatio: '3/4' }}
            >
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            </div>

            {/* User's archive metadata */}
            <div className="mt-4 space-y-2.5 rounded-lg border border-[#2d2d30] bg-[#1a1a1a]/60 p-3">
              <div>
                <span className="block font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">
                  My status
                </span>
                <span
                  className="mt-1 inline-flex items-center gap-1.5 font-mono-soft text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: accent }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: accent }}
                  />
                  {item.status}
                </span>
              </div>
              {userScore !== null && (
                <div>
                  <span className="block font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">
                    My score
                  </span>
                  <span className="font-mono-soft text-base text-[#d4d4d4]">
                    {userScore}<span className="text-[#6f6f6f] text-xs">/10</span>
                  </span>
                </div>
              )}
              {item.progress && (
                <div>
                  <span className="block font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">
                    Progress
                  </span>
                  <span className="font-mono-soft text-xs text-[#d4d4d4]">{item.progress}</span>
                </div>
              )}
              {item.reviewPath && (
                <Link
                  to={item.reviewPath}
                  className="mt-1 inline-block font-mono-soft text-[10px] uppercase tracking-[0.16em] text-[#4ec9b0] underline-offset-2 hover:underline"
                >
                  Read my review →
                </Link>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#d4d4d4] sm:text-3xl">
              {headerTitle}
            </h2>
            {headerAlt && <p className="mt-1 font-mono-soft text-xs text-[#8f8f8f]">{headerAlt}</p>}
            {/* Show the locally-stored title separately when the matched one differs */}
            {details?.matchedTitle && details.matchedTitle.toLowerCase() !== item.title.toLowerCase() && (
              <p className="mt-1 font-mono-soft text-[10px] uppercase tracking-[0.14em] text-[#6f6f6f]">
                Stored as: {item.title}
              </p>
            )}

            {item.note && (
              <p className="mt-3 border-l-2 border-[#4ec9b0]/40 pl-3 text-sm leading-6 text-[#a9a9a9] italic">
                {item.note}
              </p>
            )}

            {details?.genres?.length ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {details.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-md border border-[#3e3e42] bg-[#1e1e1e] px-2 py-1 font-mono-soft text-[9px] uppercase tracking-[0.14em] text-[#569cd6]"
                  >
                    {g}
                  </span>
                ))}
              </div>
            ) : null}

            {facts.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5 border-y border-[#2d2d30] py-4">
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <span className="block font-mono-soft text-[9px] uppercase tracking-[0.18em] text-[#6f6f6f]">
                      {k}
                    </span>
                    <span className="mt-0.5 block font-mono-soft text-xs text-[#d4d4d4]">{v}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              {loading && (
                <p className="font-mono-soft text-xs uppercase tracking-[0.16em] text-[#6f6f6f]">
                  Loading details…
                </p>
              )}
              {error && (
                <p className="font-mono-soft text-xs text-[#ce9178]">
                  {error}
                </p>
              )}
              {details && (
                <>
                  {details.description ? (
                    <p className="max-h-56 overflow-y-auto pr-1 text-sm leading-6 text-[#b7b7b7]">
                      {details.description}
                    </p>
                  ) : (
                    <p className="text-sm italic text-[#6f6f6f]">No synopsis available.</p>
                  )}
                  {details.externalUrl && (
                    <a
                      href={details.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block font-mono-soft text-[10px] uppercase tracking-[0.18em] text-[#569cd6] underline-offset-2 hover:underline"
                    >
                      {details.externalLabel} ↗
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
