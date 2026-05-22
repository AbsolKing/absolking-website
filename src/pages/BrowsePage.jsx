import { Link } from 'react-router-dom'
import SectionCard from '../components/SectionCard'

const browseCards = [
  {
    title: 'Anime & Manga',
    description: 'Live from AniList — trending, top-rated, and seasonal anime and manga. Browse, search, and add directly to your archive.',
    href: '/anime',
  },
  {
    title: 'Games',
    description: 'Powered by RAWG — discover games by genre, platform, and rating, then track them in your archive.',
    href: '/games',
  },
  {
    title: 'Movies & TV',
    description: 'From TMDB — films and series with posters, scores, and full descriptions. Add what you watch to the archive.',
    href: '/movies',
  },
]

export default function BrowsePage() {
  return (
    <>
      <section className="clean-shell py-8 sm:py-12 lg:py-14">
        <div className="clean-panel overflow-hidden rounded-2xl fade-up">
          <div className="editor-topbar">
            <span className="window-dot bg-[#ce9178]" />
            <span className="window-dot bg-[#dcdcaa]" />
            <span className="window-dot bg-[#4ec9b0]" />
            <span className="ml-2 font-mono-soft text-[11px] text-[#8f8f8f]">
              <Link to="/" className="transition hover:text-[#d4d4d4]">home</Link>
              <span className="text-[#6f6f6f]"> / </span>
              <span className="text-[#d4d4d4]">browse</span>
            </span>
          </div>
          <div className="px-6 py-8 sm:px-9 sm:py-11">
            <p className="font-mono-soft text-[10px] uppercase tracking-[0.24em] text-[#4ec9b0]">// live databases</p>
            <h1 className="mt-4 text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.05em] text-[#d4d4d4] sm:text-6xl">
              Browse
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b7b7b7] sm:text-base">
              Search live media databases for anime, manga, games, movies, and TV — then add anything straight into your
              own archive. Pick a category to get started.
            </p>
          </div>
        </div>
      </section>

      <section className="clean-shell pb-12 sm:pb-16">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {browseCards.map((card, index) => (
            <SectionCard key={card.title} index={index + 1} {...card} />
          ))}
        </div>
      </section>
    </>
  )
}
