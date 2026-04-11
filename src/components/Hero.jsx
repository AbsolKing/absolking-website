import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8 lg:px-8 lg:pb-14 lg:pt-14">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-10 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl sm:h-48 sm:w-48" />
        <div className="absolute right-[10%] top-24 h-44 w-44 rounded-full bg-cyan-300/10 blur-3xl sm:h-56 sm:w-56" />
        <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-indigo-400/10 blur-3xl sm:h-40 sm:w-40" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="glass-panel overflow-hidden rounded-[1.75rem] p-5 sm:rounded-[2rem] sm:p-8 lg:p-10">
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-8">
            <div>
              <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 sm:inline-flex">
                <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(180,240,255,0.7)]" />
                <p className="font-mono-soft text-[11px] uppercase tracking-[0.28em] text-slate-200/90">
                  ABSOLKING / Archive
                </p>
              </div>

              <h1 className="mt-1 max-w-4xl font-serif text-[3.2rem] leading-[0.92] text-white sm:mt-6 sm:text-5xl sm:leading-[0.95] md:text-6xl lg:mt-8 lg:text-7xl">
                A personal archive for
                <span className="block bg-gradient-to-r from-sky-100 via-cyan-200 to-sky-300 bg-clip-text text-transparent">
                  writing, rankings,
                </span>
                <span className="block">and everything worth revisiting.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200/85 sm:mt-6 sm:text-lg sm:leading-9 lg:mt-8">
                This is the public front of a more personal space: a calm home for blog posts,
                media rankings, and collected favorites that are meant to be browsed slowly rather
                than posted and forgotten.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4 lg:mt-10">
                <Link
                  to="/blog"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.82] px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-950 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Read the Blog
                </Link>
                <Link
                  to="/database"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-50 transition hover:-translate-y-0.5 hover:border-sky-200/30 hover:bg-white/[0.12]"
                >
                  Enter the Archive
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="glass-panel-soft rounded-[1.5rem] p-5 sm:rounded-[1.75rem] sm:p-6 lg:p-7">
                <p className="font-mono-soft text-[11px] uppercase tracking-[0.28em] text-slate-400">Now</p>
                <p className="mt-3 text-xl font-semibold leading-tight text-slate-50 sm:mt-4 sm:text-2xl">
                  Building a better home for my writing and a cleaner system for keeping media rankings.
                </p>
              </div>

              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <div className="glass-panel-soft rounded-[1.35rem] p-4 sm:rounded-[1.5rem] sm:p-5">
                  <p className="font-mono-soft text-[11px] uppercase tracking-[0.24em] text-slate-400">Blog</p>
                  <p className="mt-3 text-sm leading-7 text-slate-200/85">
                    Notes, essays, and longer thoughts that deserve more than a timeline.
                  </p>
                </div>
                <div className="glass-panel-soft rounded-[1.35rem] p-4 sm:rounded-[1.5rem] sm:p-5">
                  <p className="font-mono-soft text-[11px] uppercase tracking-[0.24em] text-slate-400">Archive</p>
                  <p className="mt-3 text-sm leading-7 text-slate-200/85">
                    Ranked anime, games, movies, and shows with room to grow into separate collections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
