export const showStatuses = [
  { value: 'completed', label: 'Completed' },
  { value: 'watching', label: 'Watching' },
  { value: 'planned', label: 'Planning' },
  { value: 'on-hold', label: 'On hold' },
]

export const showEntries = [
  {
    title: 'Mr. Robot',
    type: 'TV',
    status: 'Completed',
    statusKey: 'completed',
    score: 10,
    image: '/covers/shows/mr-robot.svg',
    note: 'Exactly the kind of show that deserves a score, a proper cover, and a permanent place in the archive.',
  },
  {
    title: 'Dark',
    type: 'TV',
    status: 'Completed',
    statusKey: 'completed',
    score: 9,
    image: '/covers/shows/dark.svg',
    note: '',
  },
  {
    title: 'Arcane',
    type: 'Animated series',
    status: 'Watching',
    statusKey: 'watching',
    score: 9,
    image: '/covers/shows/arcane.svg',
    note: 'Keeping a live score while watching still makes sense here, even if the average only counts completed entries.',
  },
  {
    title: 'Severance',
    type: 'TV',
    status: 'Planning',
    statusKey: 'planned',
    image: '/covers/shows/severance.svg',
    note: 'Queued up for later.',
  },
]
