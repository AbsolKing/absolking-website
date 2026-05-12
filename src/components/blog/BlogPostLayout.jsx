import { Link } from 'react-router-dom'
import { categoryMeta } from '../../data/posts'

export default function BlogPostLayout({ title, date, category, children }) {
  const meta = categoryMeta[category] ?? { color: '#8f8f8f' }

  return (
    <section className="clean-shell py-8 sm:py-12 lg:py-16">
      <div className="fade-up">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono-soft text-[10px] uppercase tracking-[0.22em] text-[#8f8f8f]">
          <Link to="/blog" className="transition hover:text-[#d4d4d4]">Blog</Link>
          <span>/</span>
          <span style={{ color: meta.color }}>{category}</span>
        </div>

        {/* Header */}
        <div className="mt-6 max-w-3xl">
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.22em]" style={{ color: meta.color }}>
            {category}
          </p>
          <h1 className="mt-4 text-balance text-[2.6rem] font-semibold leading-[0.96] tracking-[-0.05em] text-[#d4d4d4] sm:text-6xl">
            {title}
          </h1>
          <p className="mt-4 font-mono-soft text-[11px] uppercase tracking-[0.2em] text-[#6f6f6f]">{date}</p>
        </div>

        <div className="mt-8 h-px bg-gradient-to-r from-[#569cd6]/30 via-[#3e3e42] to-transparent" />

        {/* Body */}
        <div className="mt-8 max-w-3xl space-y-5 text-base leading-8 text-[#b7b7b7] sm:text-lg sm:leading-9">
          {children}
        </div>

        <Link
          to="/blog"
          className="mt-12 inline-flex items-center gap-2 font-mono-soft text-[11px] uppercase tracking-[0.18em] text-[#8f8f8f] transition hover:text-[#4ec9b0]"
        >
          ← Back to blog
        </Link>

      </div>
    </section>
  )
}
