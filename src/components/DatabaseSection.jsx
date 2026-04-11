import { Link } from 'react-router-dom'

const sections = [
  { title: 'Anime', note: 'Completed lists, seasonal notes, and out-of-10 rankings.', href: '/database/anime' },
  { title: 'Games', note: 'Finished titles, backlog favorites, and score history.', href: '/database/games' },
  { title: 'Movies', note: 'Films worth keeping track of, ranked and categorized.', href: '/database/movies' },
  { title: 'Shows', note: 'TV and long-form series with progress and quick notes.', href: '/database/shows' },
]

export default function DatabaseSection() {
  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] glass-panel">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
            <p className="font-mono-soft text-[11px] uppercase tracking-[0.32em] text-slate-400">Archive</p>
            <h2 className="mt-4 max-w-lg font-serif text-4xl tracking-tight text-slate-50 sm:text-5xl">
              A media archive with room to grow.
            </h2>
            <p className="mt-5 max-w-xl leading-9 text-slate-200/80">
              This is no longer a generic database section. It is the part of the site built for rankings, progress, and clean category pages that can expand over time.
            </p>
            <Link
              to="/database"
              className="mt-8 inline-flex rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-slate-50 transition hover:border-sky-200/30 hover:bg-white/[0.12]"
            >
              Browse the Archive
            </Link>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            {sections.map((item) => (
              <Link key={item.title} to={item.href} className="bg-[#0a1320]/65 p-7 backdrop-blur-xl transition hover:bg-[#0d192a]/80">
                <p className="font-mono-soft text-[11px] uppercase tracking-[0.24em] text-slate-400">Collection</p>
                <p className="mt-4 text-2xl font-semibold text-slate-50">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300/75">{item.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
