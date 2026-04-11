import { useMemo, useState } from 'react'
import ArchiveHero from './ArchiveHero'
import ArchiveTabs from './ArchiveTabs'
import StatusFilterBar from './StatusFilterBar'
import MediaRow from './MediaRow'

const archiveTabs = [
  { label: 'Overview', to: '/database' },
  { label: 'Anime', to: '/database/anime' },
  { label: 'Games', to: '/database/games' },
  { label: 'Movies', to: '/database/movies' },
  { label: 'Shows', to: '/database/shows' },
]

export default function MediaListPage({ title, subtitle, banner, items, statuses, emptyMessage }) {
  const [activeStatus, setActiveStatus] = useState('all')

  const filters = useMemo(() => {
    const base = [{ value: 'all', label: 'All', count: items.length }]
    return base.concat(
      statuses.map((status) => ({
        value: status.value,
        label: status.label,
        count: items.filter((item) => item.statusKey === status.value).length,
      })),
    )
  }, [items, statuses])

  const visibleItems = useMemo(() => {
    if (activeStatus === 'all') return items
    return items.filter((item) => item.statusKey === activeStatus)
  }, [activeStatus, items])

  const avgScore = items.length
    ? (items.reduce((sum, item) => sum + item.score, 0) / items.length).toFixed(1)
    : '0.0'

  return (
    <>
      <ArchiveHero
        title={title}
        subtitle={subtitle}
        image={banner}
        stats={[
          { label: 'Entries', value: items.length },
          { label: 'Average', value: avgScore },
          { label: 'Visible', value: visibleItems.length },
        ]}
      />
      <ArchiveTabs items={archiveTabs} />
      <section className="px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <StatusFilterBar filters={filters} value={activeStatus} onChange={setActiveStatus} />
          <div className="mt-6 space-y-4">
            {visibleItems.length ? (
              visibleItems.map((item, index) => <MediaRow key={item.title} index={index + 1} item={item} />)
            ) : (
              <div className="glass-panel-soft rounded-[1.75rem] p-8 text-slate-300/80">{emptyMessage}</div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
