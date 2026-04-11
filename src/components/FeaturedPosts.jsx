import { Link } from 'react-router-dom'

const posts = [
  {
    title: 'Why I still like keeping a personal archive',
    excerpt: 'A small defense of private curation, slower browsing, and websites that feel more like rooms than profiles.',
    date: 'Apr 2026',
    category: 'Notes',
  },
  {
    title: 'What makes a ranking system actually fun to maintain',
    excerpt: 'The difference between collecting data and building something you will genuinely want to revisit later.',
    date: 'Apr 2026',
    category: 'Archive',
  },
  {
    title: 'Glass interfaces, calm spacing, and not overdesigning your homepage',
    excerpt: 'A few reasons subtle visual depth works better than louder styling for a site meant to age well.',
    date: 'Apr 2026',
    category: 'Design',
  },
]

export default function FeaturedPosts() {
  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/8 bg-white/[0.02] p-6 sm:p-8 lg:p-10">
        <div className="mb-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono-soft text-[11px] uppercase tracking-[0.32em] text-slate-400">Featured writing</p>
            <h2 className="mt-4 font-serif text-4xl tracking-tight text-slate-50 sm:text-5xl">Recent posts</h2>
          </div>
          <Link to="/blog" className="text-sm text-slate-300/70 transition hover:text-sky-200">
            View archive →
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
          {posts.map((post, idx) => (
            <article
              key={post.title}
              className={`glass-hover rounded-[1.75rem] p-7 ${idx === 0 ? 'glass-panel' : 'glass-panel-soft'}`}
            >
              <p className="font-mono-soft text-[11px] uppercase tracking-[0.26em] text-slate-400">{post.category}</p>
              <h3 className="mt-5 text-2xl font-semibold leading-tight text-slate-50 sm:text-3xl">{post.title}</h3>
              <p className="mt-4 text-sm text-slate-400">{post.date}</p>
              <p className="mt-5 leading-8 text-slate-300/80">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
