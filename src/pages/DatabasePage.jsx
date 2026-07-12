import ArchiveCategoryCard from '../components/archive/ArchiveCategoryCard'
import PageHeader from '../components/PageHeader'
import { animeEntries } from '../data/anime'
import { gameEntries } from '../data/games'
import { movieEntries } from '../data/movies'
import { mangaEntries } from '../data/manga'

const categories = [
  {
    title: 'Anime',
    description: 'The first fully built archive page, with a MAL-inspired layout, status filters, and out-of-10 scoring.',
    href: '/database/anime',
    image: '/banners/anime-banner.jpg',
    count: animeEntries.length,
    statusLabel: 'Live now',
  },
  {
    title: 'Manga',
    description: 'Manga and light novels tracked with the same status system as anime — completed, reading, planning, and on-hold.',
    href: '/database/manga',
    image: '/banners/manga-banner.jpg',
    count: mangaEntries.length,
  },
  {
    title: 'Movies',
    description: 'A dedicated archive page for posters, notes, scores, and familiar status filters.',
    href: '/database/movies',
    image: '/banners/movies-banner.svg',
    count: movieEntries.length,
  },
  {
    title: 'Games',
    description: 'Played, playing, and backlog entries with a score only where it makes sense.',
    href: '/database/games',
    image: '/banners/games-banner.jpg',
    count: gameEntries.length,
    statusLabel: 'Live now',
  },
]

export default function DatabasePage() {
  return (
    <>
      <PageHeader
        eyebrow="Archive"
        title="A media archive designed to branch cleanly by category."
        description="This section now acts as the hub for separate archive pages. Each category has its own page, status filters, cover-first rows, and scoring rules while keeping the whole archive consistent."
      />
      <section className="px-6 pb-12 lg:px-8">
        <div className="mx-auto grid max-w-[88rem] gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <ArchiveCategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>
    </>
  )
}
