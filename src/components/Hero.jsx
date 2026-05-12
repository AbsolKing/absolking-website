import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="clean-shell py-8 sm:py-12 lg:py-18">
      <div className="clean-panel overflow-hidden rounded-2xl">
        <div className="editor-topbar">
          <span className="window-dot bg-[#ce9178]" />
          <span className="window-dot bg-[#dcdcaa]" />
          <span className="window-dot bg-[#4ec9b0]" />
          <span className="ml-2 font-mono-soft text-[11px] text-[#8f8f8f]">archive.home.jsx</span>
        </div>

        <div className="relative grid gap-10 p-6 sm:p-8 lg:grid-cols-[1.3fr_0.7fr] lg:p-12 xl:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_0%,rgba(86,156,214,0.14),transparent_34%),radial-gradient(circle_at_86%_24%,rgba(78,201,176,0.08),transparent_30%)]" />

          <div className="relative fade-up">
            <div className="font-mono-soft text-xs leading-7 text-[#8f8f8f]">
              <span className="syntax-blue">const</span> <span className="syntax-cyan">site</span> <span>=</span>{' '}
              <span className="syntax-orange">'ABSOLKING / Archive'</span>
              <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-[#d4d4d4] opacity-80 [animation:cursor-blink_1.1s_steps(1)_infinite]" />
            </div>

            <h1 className="mt-6 max-w-5xl text-balance text-[2.9rem] font-semibold leading-[0.96] tracking-[-0.055em] text-[#d4d4d4] sm:text-6xl md:text-7xl lg:text-[5.6rem]">
              A clean workspace for <span className="syntax-blue">writing</span>, <span className="syntax-cyan">rankings</span>, and things worth keeping.
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-8 text-[#b7b7b7] sm:text-lg">
              A personal archive shaped like a calm developer workspace: media lists, notes, and references organized with intention instead of noise.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/database"
                className="inline-flex items-center justify-center rounded-lg border border-[#569cd6]/55 bg-[#094771] px-5 py-3 font-mono-soft text-xs font-semibold uppercase tracking-[0.14em] text-[#d4d4d4] transition hover:-translate-y-0.5 hover:border-[#569cd6] hover:bg-[#0e639c]"
              >
                Open Archive
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center rounded-lg border border-[#3e3e42] bg-[#252526] px-5 py-3 font-mono-soft text-xs font-semibold uppercase tracking-[0.14em] text-[#d4d4d4] transition hover:-translate-y-0.5 hover:border-[#4ec9b0]/45 hover:bg-[#2d2d30]"
              >
                Read Blog
              </Link>
            </div>
          </div>

          <div className="relative grid gap-3 fade-up lg:pl-6" style={{ animationDelay: '120ms' }}>
            <div className="rounded-xl border border-[#3e3e42] bg-[#1e1e1e]/75 p-5 sm:p-6">
              <p className="font-mono-soft text-[10px] uppercase tracking-[0.22em] text-[#569cd6]">// current focus</p>
              <p className="mt-4 text-xl font-medium leading-snug text-[#d4d4d4] sm:text-2xl">
                Building a media archive that feels more like a workspace than a feed.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#3e3e42] bg-[#252526]/70 p-5">
                <p className="font-mono-soft text-[10px] uppercase tracking-[0.22em] text-[#4ec9b0]">blog()</p>
                <p className="mt-3 text-sm leading-7 text-[#b7b7b7]">Longer thoughts, notes, and updates.</p>
              </div>
              <div className="rounded-xl border border-[#3e3e42] bg-[#252526]/70 p-5">
                <p className="font-mono-soft text-[10px] uppercase tracking-[0.22em] text-[#dcdcaa]">database[]</p>
                <p className="mt-3 text-sm leading-7 text-[#b7b7b7]">Anime, games, movies, and shows.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
