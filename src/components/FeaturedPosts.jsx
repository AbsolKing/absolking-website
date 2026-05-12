import { Link } from 'react-router-dom'
import { blogPosts, categoryMeta } from '../data/posts'

const featuredPosts = blogPosts.filter((p) => p.featured).slice(0, 3)

export default function FeaturedPosts() {
  return (
    <section className="clean-shell py-10 sm:py-14 lg:py-18">
      <div className="mb-8 flex flex-col gap-4 border-t border-[#3e3e42] pt-8 sm:pt-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">Featured writing</p>
          <h2 className="mt-4 font-sans text-[2.7rem] leading-[0.95] tracking-[-0.04em] text-[#d4d4d4] sm:text-5xl">Recent posts</h2>
        </div>
        <Link to="/blog" className="text-sm text-[#8f8f8f] transition hover:text-[#4ec9b0]">
          View archive →
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {featuredPosts.map((post) => {
          const meta = categoryMeta[post.category] ?? { color: '#8f8f8f' }
          return (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="clean-card clean-hover group relative overflow-hidden rounded-[1.6rem] p-6 sm:p-7"
            >
              {/* Category color accent strip at top */}
              <div
                className="absolute left-0 right-0 top-0 h-[2px] transition-all duration-300 group-hover:h-[3px]"
                style={{ background: `linear-gradient(90deg, ${meta.color}cc 0%, ${meta.color}44 100%)` }}
              />

              <div className="flex items-center justify-between gap-4">
                <p
                  className="font-mono-soft text-[10px] uppercase tracking-[0.24em]"
                  style={{ color: meta.color }}
                >
                  {post.category}
                </p>
                <p className="text-xs text-[#8f8f8f]">{post.date}</p>
              </div>
              <h3 className="mt-5 text-2xl font-medium leading-tight tracking-[-0.02em] text-[#d4d4d4]">{post.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#b7b7b7]">{post.excerpt}</p>
              <p
                className="mt-6 font-mono-soft text-[11px] uppercase tracking-[0.18em] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
                style={{ color: meta.color }}
              >
                Read →
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
