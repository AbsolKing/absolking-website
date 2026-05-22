import MediaListPage from '../../components/archive/MediaListPage'
import { mangaEntries, mangaStatuses } from '../../data/manga'

export default function MangaPage() {
  return (
    <MediaListPage
      title="Manga"
      subtitle="Manga and light novels tracked with the same status system as anime — completed, reading, planning, and on-hold entries in one consistent archive."
      banner="/banners/anime-banner.jpg"
      items={mangaEntries}
      statuses={mangaStatuses}
      statusOrder={['completed', 'reading', 'on-hold', 'planned']}
      emptyMessage="No manga entries yet — check back soon."
    />
  )
}
