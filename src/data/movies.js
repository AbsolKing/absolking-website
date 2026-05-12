export const movieStatuses = [
  { value: 'completed', label: 'Completed' },
  { value: 'watching', label: 'Watching' },
  { value: 'planned', label: 'Planning' },
  { value: 'on-hold', label: 'On hold' },
]

export const movieEntries = [
  {
    title: 'Blade Runner 2049',
    type: 'Film',
    status: 'Completed',
    statusKey: 'completed',
    score: 10,
    image: '/covers/movies/blade-runner-2049.svg',
    note: 'One of those films that instantly justifies keeping a dedicated archive section for movies.',
  },
  {
    title: 'Perfect Blue',
    type: 'Film',
    status: 'Completed',
    statusKey: 'completed',
    score: 9,
    image: '/covers/movies/perfect-blue.svg',
    note: 'Dense, memorable, and exactly the kind of movie that benefits from a short personal note.',
  },
  {
    title: 'Arrival',
    type: 'Film',
    status: 'Completed',
    statusKey: 'completed',
    score: 9,
    image: '/covers/movies/arrival.svg',
    note: '',
  },
  {
    title: 'Ghost in the Shell',
    type: 'Film',
    status: 'Planning',
    statusKey: 'planned',
    image: '/covers/movies/ghost-in-the-shell.svg',
    note: 'Parked here until I get around to it.',
  },
]
