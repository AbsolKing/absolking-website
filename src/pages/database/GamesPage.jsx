import MediaListPage from '../../components/archive/MediaListPage'
import { gameEntries, gameStatuses } from '../../data/games'

export default function GamesPage() {
  return (
    <MediaListPage
      title="Games"
      subtitle="Played, currently playing, and backlog entries live together here, but only played and playing games count as ranked and affect the average."
      banner="/banners/games-banner.svg"
      items={gameEntries}
      statuses={gameStatuses}
      scoredStatuses={['played', 'playing']}
      emptyMessage="No game entries match this filter yet."
    />
  )
}
