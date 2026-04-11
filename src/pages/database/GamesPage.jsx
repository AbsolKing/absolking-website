import ArchiveHero from '../../components/archive/ArchiveHero'
import ArchiveTabs from '../../components/archive/ArchiveTabs'

const tabs = [
  { label: 'Overview', to: '/database' },
  { label: 'Anime', to: '/database/anime' },
  { label: 'Games', to: '/database/games' },
  { label: 'Movies', to: '/database/movies' },
  { label: 'Shows', to: '/database/shows' },
]

export default function GamesPage() {
  return (
    <>
      <ArchiveHero
        title="Games"
        subtitle="This page is scaffolded for your future rankings. It already has a dedicated route, banner, and shared archive navigation."
        image="/banners/games-banner.svg"
        stats={[{ label: 'Entries', value: 3 }, { label: 'Status', value: 'Ready' }]}
      />
      <ArchiveTabs items={tabs} />
      <section className="px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-6xl glass-panel-soft rounded-[1.75rem] p-8 text-slate-300/80">
          Add your games data here next. The same media row and filter system used on the anime page can be reused once you decide on statuses like Finished, Playing, Backlog, or Dropped.
        </div>
      </section>
    </>
  )
}
