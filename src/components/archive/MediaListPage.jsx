import { useMemo, useState } from 'react'
import ArchiveHero from './ArchiveHero'
import ArchiveTabs from './ArchiveTabs'
import StatusFilterBar from './StatusFilterBar'
import MediaRow from './MediaRow'

const archiveTabs = [
  {
    label: 'Overview',
    to: '/database',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <rect x="1" y="1" width="5" height="5" rx="1" /><rect x="8" y="1" width="5" height="5" rx="1" />
        <rect x="1" y="8" width="5" height="5" rx="1" /><rect x="8" y="8" width="5" height="5" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Anime',
    to: '/database/anime',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M7 1l1.5 3.5L12 5.5l-2.8 2.3.9 3.7L7 9.5 3.9 11.5l.9-3.7L2 5.5l3.5-1z" />
      </svg>
    ),
  },
  {
    label: 'Manga',
    to: '/database/manga',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <rect x="2" y="1" width="8" height="11" rx="1" /><path d="M4 4h4M4 6.5h4M4 9h2.5" /><path d="M10 3l2 1v8l-2-1" />
      </svg>
    ),
  },
  {
    label: 'Movies',
    to: '/database/movies',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <rect x="1" y="2" width="12" height="10" rx="1.5" /><path d="M1 5h12M1 9h12M4 2v10M10 2v10" />
      </svg>
    ),
  },
  {
    label: 'Games',
    to: '/database/games',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3.5" width="12" height="7.5" rx="2" />
        <path d="M5 5.5v3M3.5 7h3" /><circle cx="9.5" cy="6" r="0.5" fill="currentColor" /><circle cx="11" cy="7.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
]

export default function MediaListPage({
  title,
  subtitle,
  banner,
  items,
  statuses,
  emptyMessage,
  scoredStatuses = ['completed'],
  rankedLabel = 'Ranked',
  statusOrder,
}) {
  const [activeStatus, setActiveStatus] = useState('all')
  const [search, setSearch] = useState('')

  const order = useMemo(
    () => statusOrder || statuses.map((s) => s.value),
    [statusOrder, statuses],
  )

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
    let filtered = activeStatus === 'all' ? items : items.filter((item) => item.statusKey === activeStatus)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      filtered = filtered.filter((item) => item.title.toLowerCase().includes(q))
    }
    return [...filtered].sort((a, b) => {
      // 1. Status group priority
      const ai = order.indexOf(a.statusKey)
      const bi = order.indexOf(b.statusKey)
      if (ai !== bi) return ai - bi
      // 2. Score descending (unrated entries sink to bottom of their group)
      const as = typeof a.score === 'number' ? a.score : -1
      const bs = typeof b.score === 'number' ? b.score : -1
      return bs - as
    })
  }, [activeStatus, items, order, search])

  const rankedItems = useMemo(
    () => items.filter((item) => scoredStatuses.includes(item.statusKey) && typeof item.score === 'number'),
    [items, scoredStatuses],
  )

  const avgScore = rankedItems.length
    ? (rankedItems.reduce((sum, item) => sum + item.score, 0) / rankedItems.length).toFixed(1)
    : '0.0'

  return (
    <>
      <ArchiveHero
        title={title}
        subtitle={subtitle}
        image={banner}
        stats={[
          { label: 'Entries', value: items.length },
          { label: rankedLabel, value: rankedItems.length },
          { label: 'Average', value: avgScore },
        ]}
      />
      <ArchiveTabs items={archiveTabs} />
      <section className="clean-shell py-5 sm:py-7">
        <StatusFilterBar filters={filters} value={activeStatus} onChange={setActiveStatus} />

        {/* Search */}
        <div className="relative mt-4">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono-soft text-xs text-[#6f6f6f]">
            /
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="w-full rounded-lg border border-[#3e3e42] bg-[#1e1e1e] py-2.5 pl-8 pr-4 font-mono-soft text-sm text-[#d4d4d4] placeholder-[#6f6f6f] outline-none transition focus:border-[#569cd6]/60 focus:bg-[#1a1a1a]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 font-mono-soft text-xs text-[#6f6f6f] transition hover:text-[#d4d4d4]"
            >
              ✕
            </button>
          )}
        </div>

        <div className="mt-5 space-y-3 sm:mt-6">
          {visibleItems.length ? (
            visibleItems.map((item, index) => <MediaRow key={`${item.title}-${item.statusKey}-${index}`} index={index + 1} item={item} />)
          ) : (
            <div className="clean-card rounded-[1.5rem] p-6 text-stone-400 sm:p-8">
              {search.trim() ? `No entries matching "${search.trim()}"` : emptyMessage}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
