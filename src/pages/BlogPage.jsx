import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { blogPosts, categoryMeta } from '../data/posts'

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Writing that belongs somewhere more durable than a timeline."
        description="Essays, reflections, and project notes that fit the tone of the archive: deliberate, personal, and easy to return to later."
      />
      <section className="clean-shell pb-12 lg:pb-16">
        <div className="space-y-3">
          {blogPosts.map((post) => {
            const meta = categoryMeta[post.category] ?? { color: '#8f8f8f' }
            return (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="clean-card clean-hover group relative block overflow-hidden rounded-[1.6rem] p-6 sm:p-7"
              >
                {/* Category accent strip */}
                <div
                  className="absolute left-0 right-0 top-0 h-[2px] transition-all duration-300 group-hover:h-[3px]"
                  style={{ background: `linear-gradient(90deg, ${meta.color}cc 0%, ${meta.color}44 100%)` }}
                />
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono-soft text-[10px] uppercase tracking-[0.24em]" style={{ color: meta.color }}>
                    {post.category}
                  </p>
                  <p className="font-mono-soft text-[10px] uppercase tracking-[0.18em] text-[#6f6f6f]">{post.date}</p>
                </div>
                <h2 className="mt-4 text-2xl font-medium tracking-[-0.02em] text-[#d4d4d4]">{post.title}</h2>
                <p className="mt-4 max-w-3xl leading-8 text-[#b7b7b7]">{post.excerpt}</p>
                <p
                  className="mt-5 font-mono-soft text-[11px] uppercase tracking-[0.18em] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  style={{ color: meta.color }}
                >
                  Read →
                </p>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
