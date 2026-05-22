import { Link } from 'react-router-dom'

const sections = [
  { title: 'Anime',  note: 'Completed lists, seasonal notes, and out-of-10 rankings.', href: '/database/anime',  accent: '#ce9178' },
  { title: 'Manga',  note: 'Manga and light novels with familiar status filters.',     href: '/database/manga',  accent: '#4ec9b0' },
  { title: 'Movies', note: 'Films worth keeping track of, ranked and categorized.',    href: '/database/movies', accent: '#dcdcaa' },
  { title: 'Games',  note: 'Played, playing, backlog, and personal scores.',           href: '/database/games',  accent: '#569cd6' },
]

export default function DatabaseSection() {
  return (
    <section className="clean-shell py-10 sm:py-14 lg:py-18">
      <div className="overflow-hidden rounded-[1.8rem] border border-[#3e3e42] bg-[#252526]/80">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="border-b border-[#3e3e42] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <p className="font-mono-soft text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">Archive</p>
            <h2 className="mt-4 max-w-lg font-sans text-[2.7rem] leading-[0.95] tracking-[-0.04em] text-[#d4d4d4] sm:text-5xl">
              A media archive with room to grow.
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-[#b7b7b7]">
              Rankings, statuses, covers, and notes — organized into pages that can keep expanding without making the homepage heavier.
            </p>
            <Link
              to="/database"
              className="mt-7 inline-flex rounded-full bg-[#0e639c] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3f3f3] transition hover:bg-[#1177bb]"
            >
              Browse archive
            </Link>
          </div>

          <div className="grid divide-y divide-[#3e3e42] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {sections.map((item, index) => (
              <Link
                key={item.title}
                to={item.href}
                className="group relative min-h-52 overflow-hidden p-6 transition duration-300 hover:bg-[#1e1e1e]/60 sm:p-7"
              >
                {/* Accent corner dot */}
                <span
                  className="absolute right-5 top-5 h-2 w-2 rounded-full opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:scale-125"
                  style={{ background: item.accent }}
                />
                {/* Bottom accent line on hover */}
                <span
                  className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ background: `linear-gradient(90deg, ${item.accent}88, transparent)` }}
                />

                <p className="font-mono-soft text-[10px] uppercase tracking-[0.24em] text-[#8f8f8f]">0{index + 1}</p>
                <p
                  className="mt-10 text-2xl font-medium transition-colors duration-300"
                  style={{ color: '#d4d4d4' }}
                >
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#b7b7b7]">{item.note}</p>
                <p
                  className="mt-7 text-sm transition-all duration-300 group-hover:translate-x-1"
                  style={{ color: item.accent }}
                >
                  Open →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
