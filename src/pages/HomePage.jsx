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
  return (
    <>
      <section className="clean-shell py-8 sm:py-12 lg:py-14">
        <div className="mb-10 fade-up">
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">
            <span className="text-[#569cd6]">//</span> personal media archive
          </p>
          <p className="mt-2 font-mono-soft text-xs text-[#6f6f6f]">
            <span className="text-[#4ec9b0]">{totalEntries}</span> entries across{' '}
            <span className="text-[#d4d4d4]">{categories.length}</span> categories
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 fade-up" style={{ animationDelay: '60ms' }}>
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
    </>
  )
}
