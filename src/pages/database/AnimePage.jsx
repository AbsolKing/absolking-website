import MediaListPage from '../../components/archive/MediaListPage'
import { animeEntries, animeStatuses } from '../../data/anime'

export default function AnimePage() {
  return (
    <MediaListPage
      title="Anime"
      subtitle="A MAL-inspired archive page with cleaner spacing, better visuals, and room for your own covers, progress, and rankings."
      banner="/banners/anime-banner.jpg"
      items={animeEntries}
      statuses={animeStatuses}
      emptyMessage="No anime entries match this filter yet."
    />
  )
}
