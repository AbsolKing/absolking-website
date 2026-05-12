// ── Blog posts ──
// Add new posts here. FeaturedPosts on the homepage and BlogPage both pull from this list.
// Set featured: true on up to 3 posts to show them on the homepage.
// Posts render in the order they appear in this array (newest first).

export const blogPosts = [
  {
    slug: 'why-i-still-like-keeping-a-personal-archive',
    title: 'Why I still like keeping a personal archive',
    excerpt: 'A small defense of private curation, slower browsing, and websites that feel more like rooms than profiles.',
    date: 'Apr 2026',
    category: 'Notes',
    featured: true,
  },
  {
    slug: 'the-difference-between-a-database-and-an-archive',
    title: 'The difference between a database and an archive',
    excerpt: 'Why language matters when you want your media pages to feel curated instead of clinical.',
    date: 'Apr 2026',
    category: 'Archive',
    featured: true,
  },
  {
    slug: 'glass-interfaces-calm-spacing-and-not-overdesigning-your-homepage',
    title: 'Glass interfaces, calm spacing, and not overdesigning your homepage',
    excerpt: 'A few reasons subtle visual depth works better than louder styling for a site meant to age well.',
    date: 'Apr 2026',
    category: 'Design',
    featured: true,
  },
]

export const categoryMeta = {
  Notes:   { color: '#4ec9b0' },
  Archive: { color: '#dcdcaa' },
  Design:  { color: '#569cd6' },
  Roadmap: { color: '#ce9178' },
}
