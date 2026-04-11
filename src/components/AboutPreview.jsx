import { Link } from 'react-router-dom'

export default function AboutPreview() {
  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <div>
          <p className="font-mono-soft text-[11px] uppercase tracking-[0.32em] text-slate-400">About</p>
          <h2 className="mt-3 font-serif text-[2.5rem] leading-tight tracking-tight text-slate-50 sm:mt-4 sm:text-5xl">
            Less of a portfolio,
            <span className="mt-1 block text-sky-200 sm:mt-2">more of a personal archive.</span>
          </h2>
        </div>

        <div className="glass-panel rounded-[1.75rem] p-5 sm:rounded-[2rem] sm:p-8">
          <p className="text-base leading-8 text-slate-200/85 sm:text-lg sm:leading-9">
            I wanted this site to feel calm, personal, and worth returning to. The public side is here for writing and context.
            The archive side is where I keep ranked media collections, progress lists, and whatever else becomes part of the long-term shape of the site.
          </p>

          <Link
            to="/about"
            className="mt-6 inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium uppercase tracking-[0.16em] text-slate-50 transition hover:border-sky-200/30 hover:bg-white/[0.12] sm:mt-8"
          >
            Read more
          </Link>
        </div>
      </div>
    </section>
  )
}
