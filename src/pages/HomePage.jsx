import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animeEntries } from '../data/anime'
import { gameEntries } from '../data/games'
import { movieEntries } from '../data/movies'
import { mangaEntries } from '../data/manga'

const categories = [
  { title: 'Anime',  entries: animeEntries, href: '/database/anime',  accent: '#ce9178', note: 'Completed, watching, planned — scored out of 10.' },
  { title: 'Manga',  entries: mangaEntries, href: '/database/manga',  accent: '#4ec9b0', note: 'Manga and light novels with status tracking.' },
  { title: 'Movies', entries: movieEntries, href: '/database/movies', accent: '#dcdcaa', note: 'Ranked films with posters, notes, and scores.' },
  { title: 'Games',  entries: gameEntries, href: '/database/games',   accent: '#569cd6', note: 'Played, playing, backlog — scored where it counts.' },
]

const countLabels = {
  Anime: 'entries',
  Manga: 'entries',
  Movies: 'films',
  Games: 'games',
}

const totalEntries = categories.reduce((sum, c) => sum + c.entries.length, 0)

const terminalScript = (totalEntries, categoryCount) => [
  { type: 'prompt', cmd: 'mission' },
  { type: 'output', text: 'keep what mattered. add context. revisit later.' },
  { type: 'prompt', cmd: 'stats --total' },
  { type: 'output', text: `${totalEntries} entries / ${categoryCount} categories` },
  { type: 'prompt', cmd: 'open /database' },
]

function TerminalPrompt({ cmd }) {
  return (
    <span className="font-mono-soft text-sm leading-7 sm:text-[15px] sm:leading-8">
      <span className="text-[#4ec9b0]">absolking</span>
      <span className="text-[#8f8f8f]">@archive</span>
      <span className="text-[#dcdcaa]">:~$</span>
      <span className="text-[#d4d4d4]"> {cmd}</span>
    </span>
  )
}

function TerminalOutput({ text }) {
  return (
    <span className="font-mono-soft text-sm leading-7 text-[#b7b7b7] sm:text-[15px] sm:leading-8">
      <span className="text-[#569cd6]">&gt;</span> {text}
    </span>
  )
}

function TerminalCursor() {
  return (
    <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-[#d4d4d4] opacity-80 [animation:cursor-blink_1.1s_steps(1)_infinite]" />
  )
}

const INTRO_SESSION_KEY = 'homeIntroSeen'

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const takeNewest = (entries, catMeta, n = 2) =>
  [...entries]
    .filter(e => e.dateAdded)
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
    .slice(0, n)
    .map(e => ({ ...e, ...catMeta }))

const recentlyAdded = [
  ...takeNewest(animeEntries, { category: 'Anime', accent: '#ce9178', catHref: '/database/anime' }),
  ...takeNewest(mangaEntries, { category: 'Manga', accent: '#4ec9b0', catHref: '/database/manga' }),
  ...takeNewest(movieEntries, { category: 'Movies', accent: '#dcdcaa', catHref: '/database/movies' }),
  ...takeNewest(gameEntries, { category: 'Games', accent: '#569cd6', catHref: '/database/games' }),
]

export default function HomePage() {
  const script = terminalScript(totalEntries, categories.length)

  const [introState, setIntroState] = useState(() => {
    try {
      if (typeof window === 'undefined') return 'done'
      if (prefersReducedMotion()) return 'done'
      return window.sessionStorage.getItem(INTRO_SESSION_KEY) ? 'done' : 'typing'
    } catch {
      return 'done'
    }
  })

  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const typingTimeoutRef = useRef(null)

  const timing = useMemo(() => {
    const linePauseMs = 55
    const fadeMs = 420
    const totalMs = 3000

    const totalChars = script.reduce((sum, line) => {
      const str = line.type === 'prompt' ? line.cmd : line.text
      return sum + (str?.length || 0)
    }, 0)

    const pauses = Math.max(0, script.length - 1) * linePauseMs
    const typingBudget = Math.max(900, totalMs - fadeMs)
    const typingMs = Math.max(300, typingBudget - pauses)
    const perChar = totalChars > 0 ? Math.floor(typingMs / totalChars) : 28

    return {
      perCharMs: Math.max(12, Math.min(42, perChar)),
      linePauseMs,
      fadeMs,
    }
  }, [script])

  const skipIntro = () => {
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    } catch {
      // ignore
    }
    setIntroState('done')
  }

  useEffect(() => {
    if (introState === 'done') return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [introState])

  useEffect(() => {
    if (introState === 'done') return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') skipIntro()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [introState])

  useEffect(() => {
    if (introState !== 'typing') return

    const line = script[lineIndex]
    const str = line?.type === 'prompt' ? line.cmd : line?.text
    const text = str || ''

    if (!line) {
      setIntroState('fading')
      return
    }

    if (charIndex < text.length) {
      typingTimeoutRef.current = window.setTimeout(() => {
        setCharIndex((n) => n + 1)
      }, timing.perCharMs)
      return () => window.clearTimeout(typingTimeoutRef.current)
    }

    if (lineIndex < script.length - 1) {
      typingTimeoutRef.current = window.setTimeout(() => {
        setLineIndex((n) => n + 1)
        setCharIndex(0)
      }, timing.linePauseMs)
      return () => window.clearTimeout(typingTimeoutRef.current)
    }

    // Finished typing.
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    } catch {
      // ignore
    }
    setIntroState('fading')
  }, [introState, charIndex, lineIndex, script, timing.perCharMs, timing.linePauseMs])

  useEffect(() => {
    if (introState !== 'fading') return
    const id = window.setTimeout(() => setIntroState('done'), timing.fadeMs)
    return () => window.clearTimeout(id)
  }, [introState, timing.fadeMs])

  const showMain = introState === 'done' || introState === 'fading'
  const showOverlay = introState === 'typing' || introState === 'fading'

  const typedLines = useMemo(() => {
    if (!showOverlay) return []

    return script
      .map((line, i) => {
        if (i > lineIndex) return null
        const full = line.type === 'prompt' ? line.cmd : line.text
        const typed = i === lineIndex ? (full || '').slice(0, charIndex) : full
        return { ...line, typed, showCursor: introState === 'typing' && i === lineIndex }
      })
      .filter(Boolean)
  }, [charIndex, introState, lineIndex, script, showOverlay])

  return (
    <>
      {showOverlay ? (
        <div
          className={`fixed inset-0 z-[80] bg-[#1e1e1e] transition-opacity duration-500 ${
            introState === 'fading' ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={skipIntro}
          role="button"
          tabIndex={-1}
          aria-label="Skip intro"
        >
          <div className="clean-shell flex min-h-[100svh] items-center justify-center py-10">
            <div className="w-full max-w-3xl">
              <div className="clean-panel overflow-hidden rounded-2xl">
                <div className="editor-topbar">
                  <span className="window-dot bg-[#ce9178]" />
                  <span className="window-dot bg-[#dcdcaa]" />
                  <span className="window-dot bg-[#4ec9b0]" />
                  <span className="ml-2 font-mono-soft text-[11px] text-[#8f8f8f]">terminal.intro.sh</span>
                  <span className="ml-auto font-mono-soft text-[10px] uppercase tracking-[0.18em] text-[#6f6f6f]">
                    click or esc to skip
                  </span>
                </div>

                <div className="relative p-6 sm:p-8 lg:p-10">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(86,156,214,0.14),transparent_36%),radial-gradient(circle_at_84%_22%,rgba(78,201,176,0.10),transparent_34%)]" />

                  <div className="relative">
                    <p className="mb-6 font-mono-soft text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">
                      <span className="text-[#569cd6]">//</span> boot
                    </p>

                    <div className="space-y-2.5">
                      {typedLines.map((line, i) => (
                        <div key={i}>
                          {line.type === 'prompt' ? (
                            <>
                              <TerminalPrompt cmd={line.typed} />
                              {line.showCursor ? <TerminalCursor /> : null}
                            </>
                          ) : (
                            <>
                              <TerminalOutput text={line.typed} />
                              {line.showCursor ? <TerminalCursor /> : null}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className={`transition-opacity duration-500 ${showMain ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'}`}>
        <section className="clean-shell py-8 sm:py-12 lg:py-14">
          <div className="clean-panel overflow-hidden rounded-2xl fade-up">
            <div className="editor-topbar">
              <span className="window-dot bg-[#ce9178]" />
              <span className="window-dot bg-[#dcdcaa]" />
              <span className="window-dot bg-[#4ec9b0]" />
              <span className="ml-2 font-mono-soft text-[11px] text-[#8f8f8f]">terminal.intro.sh</span>
            </div>

            <div className="relative p-6 sm:p-8 lg:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(86,156,214,0.13),transparent_35%),radial-gradient(circle_at_84%_22%,rgba(78,201,176,0.09),transparent_32%)]" />

              <div className="relative">
                <p className="mb-6 font-mono-soft text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">
                  <span className="text-[#569cd6]">//</span> welcome
                </p>

                <div className="space-y-2.5">
                  {script.map((line, i) => (
                    <div key={i} className="fade-up" style={{ animationDelay: `${80 + i * 80}ms` }}>
                      {line.type === 'prompt' ? <TerminalPrompt cmd={line.cmd} /> : <TerminalOutput text={line.text} />}
                    </div>
                  ))}

                  <div className="fade-up" style={{ animationDelay: `${80 + script.length * 80}ms` }}>
                    <TerminalPrompt cmd="" />
                    <TerminalCursor />
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/database"
                    className="inline-flex items-center justify-center rounded-lg border border-[#569cd6]/55 bg-[#094771] px-5 py-3 font-mono-soft text-xs font-semibold uppercase tracking-[0.14em] text-[#d4d4d4] transition hover:-translate-y-0.5 hover:border-[#569cd6] hover:bg-[#0e639c]"
                  >
                    Open Archive
                  </Link>
                  <Link
                    to="/browse"
                    className="inline-flex items-center justify-center rounded-lg border border-[#3e3e42] bg-[#252526] px-5 py-3 font-mono-soft text-xs font-semibold uppercase tracking-[0.14em] text-[#d4d4d4] transition hover:-translate-y-0.5 hover:border-[#4ec9b0]/45 hover:bg-[#2d2d30]"
                  >
                    Discover
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="clean-shell pb-10 sm:pb-14 lg:pb-16">
        <div className="mb-8 fade-up" style={{ animationDelay: '40ms' }}>
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">
            <span className="text-[#569cd6]">//</span> archive index
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#b7b7b7]">
            Jump straight into a category. Each one has status tracking, scores, and notes.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 fade-up" style={{ animationDelay: '90ms' }}>
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.href}
              className="clean-card clean-hover group relative block overflow-hidden rounded-xl p-6 sm:p-7"
            >
              <div
                className="absolute left-0 right-0 top-0 h-[2px] opacity-50 transition-opacity duration-300 group-hover:opacity-90"
                style={{ background: `linear-gradient(90deg, ${cat.accent}, transparent)` }}
              />

              <div className="flex items-center justify-between gap-4">
                <p className="font-mono-soft text-[10px] uppercase tracking-[0.22em]" style={{ color: cat.accent }}>
                  {cat.title}
                </p>
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md border text-[10px] transition-all duration-300 group-hover:scale-110"
                  style={{
                    borderColor: `${cat.accent}44`,
                    background: `${cat.accent}11`,
                    color: cat.accent,
                  }}
                >
                  →
                </span>
              </div>

              <p className="mt-8 text-4xl font-semibold tracking-[-0.03em] text-[#d4d4d4]">
                {cat.entries.length}
              </p>
              <p className="mt-1 text-sm text-[#8f8f8f]">{countLabels[cat.title]}</p>
              <p className="mt-3 text-sm leading-7 text-[#b7b7b7]">{cat.note}</p>
              <p
                className="mt-6 font-mono-soft text-xs opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-90"
                style={{ color: cat.accent }}
              >
                open() →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {recentlyAdded.length > 0 && (
        <section className="clean-shell pb-12 sm:pb-16 lg:pb-18">
          <div className="mb-6 flex items-center gap-3">
            <p className="font-mono-soft text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">// recently added</p>
            <div className="h-px flex-1 bg-gradient-to-r from-[#3e3e42] to-transparent" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recentlyAdded.map((entry, i) => (
              <Link
                key={i}
                to={entry.catHref}
                className="group w-36 flex-shrink-0 sm:w-44"
              >
                <div className="overflow-hidden rounded-lg border border-[#3e3e42] bg-[#252526] transition duration-300 group-hover:border-[#569cd6]/40">
                  <div className="aspect-[3/4] overflow-hidden bg-[#1e1e1e]">
                    {entry.image && (
                      <img
                        src={entry.image}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="space-y-1.5 p-3">
                    <p className="truncate text-sm font-medium text-[#d4d4d4]">{entry.title}</p>
                    <div className="flex items-center justify-between">
                      <span
                        className="font-mono-soft text-[9px] uppercase tracking-[0.18em]"
                        style={{ color: entry.accent }}
                      >
                        {entry.category}
                      </span>
                      {entry.score != null && (
                        <span
                          className="score-badge flex h-5 w-5 items-center justify-center rounded font-mono-soft text-[10px] font-bold"
                          style={{
                            background: `${entry.accent}22`,
                            color: entry.accent,
                          }}
                        >
                          {entry.score}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      </div>
    </>
  )
}
