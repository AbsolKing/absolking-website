import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
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
  { type: 'output', text: 'keep what mattered.' },
  { type: 'output', text: 'add context. revisit later.' },
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

function FastfetchPane({ totalEntries, categoryCount }) {
  const magenta = '#c586c0'

  const display = (() => {
    if (typeof window === 'undefined') return '??x??'
    const w = window.screen?.width
    const h = window.screen?.height
    return `${w ?? '??'}x${h ?? '??'}`
  })()

  const boxTop = '╭────────────────────────────────────────────────────╮'
  const boxBottom = '╰────────────────────────────────────────────────────╯'

  const Row = ({ label, labelColor, value }) => (
    <div className="grid grid-cols-[auto_1fr] gap-3">
      <span className="whitespace-pre" style={{ color: labelColor }}>
        {label}
      </span>
      <span className="min-w-0 whitespace-pre text-[#d4d4d4]">{value}</span>
    </div>
  )

  return (
    <div className="font-mono-nerd text-[12px] leading-[1.25] text-[#b7b7b7]">
      <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
        <img
          src="/fastfetch/fast.png"
          alt=""
          className="h-[15.5rem] w-auto select-none object-contain"
          draggable={false}
        />

        <div className="min-w-0">
          <div className="text-[#d4d4d4]">
            <span style={{ color: magenta }}>Hi AK :)</span>
          </div>

          <div className="mt-2">
            <div className="whitespace-pre text-[#8f8f8f]">{boxTop}</div>
            <div className="space-y-1">
              <Row label="    User" labelColor="#569cd6" value="absolking@archive" />
              <Row label="   󰣇 OS" labelColor="#569cd6" value="ArchiveOS" />
              <Row label="    Kernel" labelColor="#569cd6" value="react-router" />
              <Row label="   󰏗 Packages" labelColor="#4ec9b0" value={`${totalEntries} entries`} />
              <Row label="    CPU" labelColor="#4ec9b0" value="React 18 (client) @ Vite" />
              <Row label="   󰊴 GPU" labelColor="#4ec9b0" value="CSS renderer" />
              <Row label="   󰍛 Memory" labelColor="#4ec9b0" value="N/A" />
            </div>
            <div className="whitespace-pre text-[#8f8f8f]">{boxBottom}</div>

            <div className="mt-2 whitespace-pre text-[#8f8f8f]">{boxTop}</div>
            <div className="space-y-1">
              <Row label="   󰍹 Display" labelColor="#dcdcaa" value={display} />
              <Row label="   󱗃 WM" labelColor="#dcdcaa" value="browser" />
              <Row label="    Terminal" labelColor="#dcdcaa" value="archive-terminal" />
              <Row label="   󰅐 Uptime" labelColor={magenta} value="just now" />
            </div>
            <div className="whitespace-pre text-[#8f8f8f]">{boxBottom}</div>
          </div>
        </div>
      </div>
    </div>
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

const recentMovieAdds = takeNewest(movieEntries, { category: 'Movies & TV', accent: '#dcdcaa', catHref: '/database/movies' }, 3)
const recentGameAdds = takeNewest(gameEntries, { category: 'Games', accent: '#569cd6', catHref: '/database/games' }, 3)

export default function HomePage() {
  const navigate = useNavigate()
  const script = terminalScript(totalEntries, categories.length)

  const counts = useMemo(
    () => ({
      anime: animeEntries.length,
      manga: mangaEntries.length,
      movies: movieEntries.length,
      games: gameEntries.length,
    }),
    [],
  )

  const [introState, setIntroState] = useState(() => {
    try {
      if (typeof window === 'undefined') return 'done'
      if (prefersReducedMotion()) return 'done'
      return window.sessionStorage.getItem(INTRO_SESSION_KEY) ? 'done' : 'typing'
    } catch {
      return 'done'
    }
  })

  // 0: nothing yet
  // 1: Navbar visible
  // 2: Archive index block visible
  // 3: Cards (Anime + Games) visible
  // 4: Remaining cards + Recently Added visible
  const [revealStage, setRevealStage] = useState(() => (introState === 'done' ? 4 : 0))

  const [isInteractive, setIsInteractive] = useState(() => introState === 'done')

  const inputRef = useRef(null)
  const terminalScrollRef = useRef(null)

  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const typingTimeoutRef = useRef(null)

  const [commandInput, setCommandInput] = useState('')
  const [commandHistory, setCommandHistory] = useState([]) // [{ type: 'prompt'|'output', text: string }]
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [historySnapshot, setHistorySnapshot] = useState('')

  const [rightPane, setRightPane] = useState({ mode: 'empty' }) // { mode: 'empty' | 'fastfetch' }

  const timing = useMemo(() => {
    const linePauseMs = 55
    const fadeMs = 520
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
    document.documentElement.removeAttribute('data-home-nav-hidden')
    setIntroState('done')
    setRevealStage(4)
    setIsInteractive(true)
  }

  useEffect(() => {
    if (introState === 'done') return
    if (revealStage >= 1) {
      document.documentElement.removeAttribute('data-home-nav-hidden')
      return
    }
    document.documentElement.setAttribute('data-home-nav-hidden', '1')
    return () => {
      document.documentElement.removeAttribute('data-home-nav-hidden')
    }
  }, [introState, revealStage])

  useEffect(() => {
    // Ensure we never leave the attribute behind when navigating away.
    return () => {
      document.documentElement.removeAttribute('data-home-nav-hidden')
    }
  }, [])

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

    if (!line) return

    if (charIndex < text.length) {
      typingTimeoutRef.current = window.setTimeout(() => {
        setCharIndex((n) => n + 1)
      }, timing.perCharMs)
      return () => window.clearTimeout(typingTimeoutRef.current)
    }

    // Line completed: update reveal milestones.
    if (lineIndex === 1) setRevealStage((s) => Math.max(s, 1))
    if (lineIndex === 3) setRevealStage((s) => Math.max(s, 2))
    if (lineIndex === 4) setRevealStage((s) => Math.max(s, 3))
    if (lineIndex === script.length - 1) {
      setRevealStage((s) => Math.max(s, 4))
      try {
        window.sessionStorage.setItem(INTRO_SESSION_KEY, '1')
      } catch {
        // ignore
      }

      setIntroState('fading')
      return
    }

    if (lineIndex < script.length - 1) {
      typingTimeoutRef.current = window.setTimeout(() => {
        setLineIndex((n) => n + 1)
        setCharIndex(0)
      }, timing.linePauseMs)
      return () => window.clearTimeout(typingTimeoutRef.current)
    }
  }, [introState, charIndex, lineIndex, script, timing.perCharMs, timing.linePauseMs])

  useEffect(() => {
    if (introState !== 'fading') return
    const id = window.setTimeout(() => {
      setIntroState('done')
      setIsInteractive(true)
    }, timing.fadeMs)
    return () => window.clearTimeout(id)
  }, [introState, timing.fadeMs])

  const typedLines = useMemo(() => {
    if (introState === 'done') return []

    return script
      .map((line, i) => {
        if (i > lineIndex) return null
        const full = line.type === 'prompt' ? line.cmd : line.text
        const typed = i === lineIndex ? (full || '').slice(0, charIndex) : full
        if (line.type === 'prompt') {
          return { type: 'prompt', cmd: typed, showCursor: introState === 'typing' && i === lineIndex }
        }
        return { type: 'output', text: typed, showCursor: introState === 'typing' && i === lineIndex }
      })
      .filter(Boolean)

  }, [charIndex, introState, lineIndex, script])

  const printedLines = useMemo(() => {
    const base = introState === 'done' ? script : typedLines
    return [...base, ...commandHistory]
  }, [commandHistory, introState, script, typedLines])

  useEffect(() => {
    if (!terminalScrollRef.current) return
    terminalScrollRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [printedLines.length])

  useEffect(() => {
    if (!isInteractive) return
    inputRef.current?.focus()
  }, [isInteractive])

  const commandMap = useMemo(() => {
    return {
      anime: '/database/anime',
      manga: '/database/manga',
      movies: '/database/movies',
      movie: '/database/movies',
      games: '/database/games',
      game: '/database/games',
      database: '/database',
      archive: '/database',
      discover: '/browse',
      browse: '/browse',
      about: '/about',
      home: '/',
    }
  }, [])

  const runCommand = (raw) => {
    const input = (raw || '').trim()
    if (!input) return

    setCommandHistory((prev) => [...prev, { type: 'prompt', cmd: input }])

    const tokens = input.toLowerCase().split(/\s+/).filter(Boolean)
    const cmd = tokens[0]
    const arg = tokens.slice(1).join(' ')

    const print = (text) => setCommandHistory((prev) => [...prev, { type: 'output', text }])

    if (cmd === 'help') {
      print('commands: anime, manga, movies, games, database, discover, about, home')
      print('extras: mission, stats [--total], open <path|keyword>, close <path|keyword>, clear, ls')
      return
    }

    if (cmd === 'clear') {
      setCommandHistory([])
      return
    }

    if (cmd === 'ls') {
      print('database/  browse/  about/  game/')
      return
    }

    if (cmd === 'mission') {
      print('keep what mattered.')
      print('add context. revisit later.')
      return
    }

    if (cmd === 'stats') {
      if (tokens.includes('--total')) {
        print(`${totalEntries} entries / ${categories.length} categories`)
        return
      }
      print(`anime: ${counts.anime}`)
      print(`manga: ${counts.manga}`)
      print(`movies: ${counts.movies}`)
      print(`games: ${counts.games}`)
      return
    }

    if (cmd === 'fastfetch' || cmd === 'neofetch') {
      setRightPane({ mode: 'fastfetch' })
      return
    }

    const go = (to) => {
      print(`opening ${to}`)
      navigate(to)
    }

    if (cmd === 'open' || cmd === 'go' || cmd === 'cd') {
      if (!arg) {
        print('usage: open <path|keyword>')
        return
      }

      if (arg.startsWith('/')) {
        go(arg)
        return
      }

      const mapped = commandMap[arg]
      if (mapped) {
        go(mapped)
        return
      }

      print(`unknown target: ${arg}`)
      return
    }

    if (cmd === 'close') {
      if (!arg) {
        print('usage: close <path|keyword>')
        return
      }

      if (arg === '/database' || arg === 'database' || arg === 'archive') {
        print('closing /database')
        navigate('/closed')
        return
      }

      print(`cannot close: ${arg}`)
      return
    }

    const mapped = commandMap[cmd]
    if (mapped) {
      go(mapped)
      return
    }

    print(`command not found: ${input}`)
  }

  return (
    <>
      <section className="clean-shell py-8 sm:py-12 lg:py-14">
        <div className="clean-panel overflow-hidden rounded-2xl fade-up">
          <div className="editor-topbar">
            <span className="window-dot bg-[#ce9178]" />
            <span className="window-dot bg-[#dcdcaa]" />
            <span className="window-dot bg-[#4ec9b0]" />
            <span className="ml-2 font-mono-soft text-[11px] text-[#8f8f8f]">terminal.intro.sh</span>
            {introState !== 'done' ? (
              <button
                type="button"
                onClick={skipIntro}
                className="ml-auto rounded-md border border-[#3e3e42] bg-[#252526] px-2.5 py-1 font-mono-soft text-[10px] uppercase tracking-[0.18em] text-[#8f8f8f] transition hover:border-white/15 hover:text-[#d4d4d4]"
              >
                skip
              </button>
            ) : (
              <span className="ml-auto font-mono-soft text-[10px] uppercase tracking-[0.18em] text-[#6f6f6f]">
                type <span className="text-[#d4d4d4]">help</span>
              </span>
            )}
          </div>

          <div className="relative p-6 sm:p-8 lg:p-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(86,156,214,0.13),transparent_35%),radial-gradient(circle_at_84%_22%,rgba(78,201,176,0.09),transparent_32%)]" />

            <div className="relative">
              <p className="mb-6 font-mono-soft text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">
                <span className="text-[#569cd6]">//</span> boot
              </p>

              <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr] xl:grid-cols-[0.85fr_1.15fr]">
                <div
                  className="max-h-[46vh] overflow-auto pr-2 [scrollbar-width:thin]"
                  onMouseDown={(e) => {
                    if (introState !== 'done') return
                    e.preventDefault()
                    inputRef.current?.focus()
                  }}
                >
                  <div className="space-y-2.5">
                    {printedLines.map((line, i) => (
                      <div key={i}>
                        {line.type === 'prompt' ? <TerminalPrompt cmd={line.cmd} /> : <TerminalOutput text={line.text} />}
                        {line.showCursor ? <TerminalCursor /> : null}
                      </div>
                    ))}

                    {introState === 'done' ? (
                      <div className="overflow-x-auto whitespace-nowrap [scrollbar-width:thin]">
                        <div className="inline-flex items-center gap-2">
                          <TerminalPrompt cmd="" />
                          <input
                            ref={inputRef}
                            value={commandInput}
                            onChange={(e) => setCommandInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (!isInteractive) return

                              if (e.key === 'Enter') {
                                const value = commandInput
                                setCommandInput('')
                                setHistoryIndex(-1)
                                setHistorySnapshot('')
                                runCommand(value)
                              }

                              if (e.key === 'ArrowUp') {
                                e.preventDefault()
                                if (!commandHistory.length) return

                                if (historyIndex === -1) setHistorySnapshot(commandInput)

                                // Pick only prompt lines for history navigation.
                                const prompts = commandHistory.filter((l) => l.type === 'prompt').map((l) => l.cmd)
                                if (!prompts.length) return

                                const nextIndex =
                                  historyIndex === -1 ? prompts.length - 1 : Math.max(0, historyIndex - 1)
                                setHistoryIndex(nextIndex)
                                setCommandInput(prompts[nextIndex] || '')
                              }

                              if (e.key === 'ArrowDown') {
                                e.preventDefault()
                                if (historyIndex === -1) return

                                const prompts = commandHistory.filter((l) => l.type === 'prompt').map((l) => l.cmd)
                                const nextIndex = Math.min(prompts.length, historyIndex + 1)
                                if (nextIndex >= prompts.length) {
                                  setHistoryIndex(-1)
                                  setCommandInput(historySnapshot)
                                  setHistorySnapshot('')
                                } else {
                                  setHistoryIndex(nextIndex)
                                  setCommandInput(prompts[nextIndex] || '')
                                }
                              }
                            }}
                            spellCheck={false}
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={!isInteractive}
                            style={{
                              width: `${Math.max(1, commandInput.length)}ch`,
                            }}
                            className="bg-transparent font-mono-soft text-sm leading-7 text-[#d4d4d4] outline-none disabled:opacity-60 sm:text-[15px] sm:leading-8"
                            aria-label="Terminal input"
                          />
                        </div>
                      </div>
                    ) : null}

                    <div ref={terminalScrollRef} />
                  </div>
                </div>

                <div
                  className={
                    introState === 'done'
                      ? 'fade-up max-h-[46vh] overflow-auto [scrollbar-width:thin]'
                      : 'opacity-0 pointer-events-none'
                  }
                >
                  {rightPane.mode === 'fastfetch' ? (
                    <div className="overflow-x-auto [scrollbar-width:thin]">
                      <FastfetchPane totalEntries={totalEntries} categoryCount={categories.length} />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {revealStage >= 2 ? (
        <section className="clean-shell pb-10 sm:pb-14 lg:pb-16">
          <div className="mb-8 fade-up">
            <p className="font-mono-soft text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">
              <span className="text-[#569cd6]">//</span> archive index
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#b7b7b7]">
              Jump straight into a category. Each one has status tracking, scores, and notes.
            </p>
          </div>

          {revealStage >= 3 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {(revealStage >= 4 ? categories : categories.filter((c) => c.title === 'Anime' || c.title === 'Games')).map((cat) => (
                <Link
                  key={cat.title}
                  to={cat.href}
                  className="clean-card clean-hover group relative block overflow-hidden rounded-xl p-6 sm:p-7 fade-up"
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
          ) : null}
        </section>
      ) : null}

      {revealStage >= 4 && (recentMovieAdds.length > 0 || recentGameAdds.length > 0) ? (
        <section className="clean-shell pb-12 sm:pb-16 lg:pb-18 fade-up">
          <div className="mb-6 flex items-center gap-3">
            <p className="font-mono-soft text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">// recently added</p>
            <div className="h-px flex-1 bg-gradient-to-r from-[#3e3e42] to-transparent" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {recentMovieAdds.length > 0 ? (
              <div>
                <p className="mb-3 font-mono-soft text-[10px] uppercase tracking-[0.22em] text-[#dcdcaa]">// movies & tv</p>
                <div className="flex gap-4 pb-2">
                  {recentMovieAdds.map((entry, i) => (
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
              </div>
            ) : null}
            {recentGameAdds.length > 0 ? (
              <div>
                <p className="mb-3 font-mono-soft text-[10px] uppercase tracking-[0.22em] text-[#569cd6]">// games</p>
                <div className="flex gap-4 pb-2">
                  {recentGameAdds.map((entry, i) => (
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
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  )
}
