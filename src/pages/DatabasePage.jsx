import ArchiveCategoryCard from '../components/archive/ArchiveCategoryCard'
import PageHeader from '../components/PageHeader'
import { animeEntries } from '../data/anime'
import { gameEntries } from '../data/games'
import { movieEntries } from '../data/movies'
import { showEntries } from '../data/shows'

const categories = [
  {
    title: 'Anime',
    description: 'The first fully built archive page, with a MAL-inspired layout, status filters, and out-of-10 scoring.',
    href: '/database/anime',
    image: '/banners/anime-banner.svg',
    count: animeEntries.length,
    statusLabel: 'Live now',
  },
  {
    title: 'Games',
    description: 'Ready for the same structure once you start adding real covers and your own ranking data.',
    href: '/database/games',
    image: '/banners/games-banner.svg',
    count: gameEntries.length,
    statusLabel: 'Next up',
  },
  {
    title: 'Movies',
    description: 'A dedicated archive page for posters, notes, scores, and whatever categories you settle on later.',
    href: '/database/movies',
    image: '/banners/movies-banner.svg',
    count: movieEntries.length,
    statusLabel: 'Planned',
  },
  {
    title: 'Shows',
    description: 'The same system can extend naturally to longer-form series once the core layout is in place.',
    href: '/database/shows',
    image: '/banners/shows-banner.svg',
    count: showEntries.length,
    statusLabel: 'Planned',
  },
]

export default function DatabasePage() {
  return (
    <>
      <PageHeader
        eyebrow="Archive"
        title="A media archive designed to branch cleanly by category."
        description="This section now acts as the hub for separate archive pages. Anime is the first complete example, and the same layout can expand into games, movies, and shows without changing the overall architecture."
      />
      <section className="px-6 pb-12 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <ArchiveCategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>
    </>
  )
}
