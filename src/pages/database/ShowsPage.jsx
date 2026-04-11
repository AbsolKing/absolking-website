import ArchiveHero from '../../components/archive/ArchiveHero'
import ArchiveTabs from '../../components/archive/ArchiveTabs'

const tabs = [
  { label: 'Overview', to: '/database' },
  { label: 'Anime', to: '/database/anime' },
  { label: 'Games', to: '/database/games' },
  { label: 'Movies', to: '/database/movies' },
  { label: 'Shows', to: '/database/shows' },
]

export default function ShowsPage() {
  return (
    <>
      <ArchiveHero
        title="Shows"
        subtitle="Built for progress tracking, scores, and cleaner long-form series browsing once you add the real data."
        image="/banners/shows-banner.svg"
        stats={[{ label: 'Entries', value: 3 }, { label: 'Status', value: 'Ready' }]}
      />
      <ArchiveTabs items={tabs} />
      <section className="px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-6xl glass-panel-soft rounded-[1.75rem] p-8 text-slate-300/80">
          The route exists now, so later you only need to plug in the banner, statuses, and items for shows.
        </div>
      </section>
    </>
  )
}
