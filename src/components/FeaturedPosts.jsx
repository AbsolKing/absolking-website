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
    <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl rounded-[1.75rem] border border-white/8 bg-white/[0.02] p-5 sm:rounded-[2rem] sm:p-8 lg:p-10">
        <div className="mb-8 grid gap-4 sm:mb-10 md:grid-cols-[1fr_auto] md:items-end md:gap-6">
          <div>
            <p className="font-mono-soft text-[11px] uppercase tracking-[0.32em] text-slate-400">Featured writing</p>
            <h2 className="mt-3 font-serif text-[2.5rem] leading-tight tracking-tight text-slate-50 sm:mt-4 sm:text-5xl">Recent posts</h2>
          </div>
          <Link to="/blog" className="text-sm text-slate-300/70 transition hover:text-sky-200">
            View archive →
          </Link>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
          {posts.map((post, idx) => (
            <article
              key={post.title}
              className={`glass-hover rounded-[1.5rem] p-5 sm:rounded-[1.75rem] sm:p-7 ${idx === 0 ? 'glass-panel' : 'glass-panel-soft'}`}
            >
              <p className="font-mono-soft text-[11px] uppercase tracking-[0.26em] text-slate-400">{post.category}</p>
              <h3 className="mt-4 text-xl font-semibold leading-tight text-slate-50 sm:mt-5 sm:text-3xl">{post.title}</h3>
              <p className="mt-3 text-sm text-slate-400 sm:mt-4">{post.date}</p>
              <p className="mt-4 leading-7 text-slate-300/80 sm:mt-5 sm:leading-8">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
