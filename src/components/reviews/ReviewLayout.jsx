import { Link } from 'react-router-dom'

export default function ReviewLayout({ title, score, category, categoryPath, cover, children }) {
  return (
    <section className="clean-shell py-8 sm:py-12 lg:py-16">
      <div className="fade-up">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono-soft text-[10px] uppercase tracking-[0.22em] text-[#8f8f8f]">
          <Link to="/database" className="transition hover:text-[#d4d4d4]">Archive</Link>
          <span>/</span>
          <Link to={categoryPath} className="transition hover:text-[#d4d4d4]">{category}</Link>
          <span>/</span>
          <span className="text-[#569cd6]">Review</span>
        </div>

        {/* Two-column layout: content left, cover right */}
        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_260px] lg:items-start xl:grid-cols-[1fr_300px]">

          {/* Left: title, score, divider, body */}
          <div>
            <h1 className="text-balance text-[2.6rem] font-semibold leading-[0.96] tracking-[-0.05em] text-[#d4d4d4] sm:text-6xl">
              {title}
            </h1>

            {typeof score === 'number' && (
              <div className="mt-7 inline-flex items-baseline gap-2 rounded-xl border border-[#3e3e42] bg-[#252526]/80 px-5 py-3">
                <span className="font-mono-soft text-4xl font-semibold leading-none tracking-[-0.05em] text-[#dcdcaa]">
                  {score}
                </span>
                <span className="font-mono-soft text-sm uppercase tracking-[0.16em] text-[#6f6f6f]">/10</span>
              </div>
            )}

            <div className="mt-8 h-px bg-gradient-to-r from-[#569cd6]/30 via-[#3e3e42] to-transparent" />

            <div className="mt-8 space-y-5 text-base leading-8 text-[#b7b7b7] sm:text-lg sm:leading-9">
              {children}
            </div>

            <Link
              to={categoryPath}
              className="mt-12 inline-flex items-center gap-2 font-mono-soft text-[11px] uppercase tracking-[0.18em] text-[#8f8f8f] transition hover:text-[#4ec9b0]"
            >
              ← Back to {category}
            </Link>
          </div>

          {/* Right: cover image */}
          {cover && (
            <div className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-xl border border-[#3e3e42] bg-[#1e1e1e] shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
                <img
                  src={cover}
                  alt={title}
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
