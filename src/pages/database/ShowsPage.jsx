import MediaListPage from '../../components/archive/MediaListPage'
import { showEntries, showStatuses } from '../../data/shows'

export default function ShowsPage() {
  return (
    <MediaListPage
      title="Shows"
      subtitle="Shows follow the same status structure as anime, so completed, watching, planning, and on-hold entries all stay consistent across the archive."
      banner="/banners/shows-banner.svg"
      items={showEntries}
      statuses={showStatuses}
      emptyMessage="No show entries match this filter yet."
    />
  )
}
