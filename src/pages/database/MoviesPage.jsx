import MediaListPage from '../../components/archive/MediaListPage'
import { movieEntries, movieStatuses } from '../../data/movies'

export default function MoviesPage() {
  return (
    <MediaListPage
      title="Movies"
      subtitle="Movies use the same archive structure as anime: status filters up top, out-of-10 scores, and a cleaner poster-first list underneath."
      banner="/banners/movies-banner.svg"
      items={movieEntries}
      statuses={movieStatuses}
      emptyMessage="No movie entries match this filter yet."
    />
  )
}
