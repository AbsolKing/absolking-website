import ArchiveHero from '../../components/archive/ArchiveHero'
import ArchiveTabs from '../../components/archive/ArchiveTabs'

const tabs = [
  { label: 'Overview', to: '/database' },
  { label: 'Anime', to: '/database/anime' },
  { label: 'Games', to: '/database/games' },
  { label: 'Movies', to: '/database/movies' },
  { label: 'Shows', to: '/database/shows' },
]

export default function MoviesPage() {
  return (
    <>
      <ArchiveHero
        title="Movies"
        subtitle="A dedicated route for film rankings, poster-first layouts, and the same out-of-10 scoring system."
        image="/banners/movies-banner.svg"
        stats={[{ label: 'Entries', value: 3 }, { label: 'Status', value: 'Ready' }]}
      />
      <ArchiveTabs items={tabs} />
      <section className="px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-6xl glass-panel-soft rounded-[1.75rem] p-8 text-slate-300/80">
          This placeholder page is here so your archive architecture is already in place before you start adding real movie data and poster art.
        </div>
      </section>
    </>
  )
}
