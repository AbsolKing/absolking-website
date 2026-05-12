import { Link } from 'react-router-dom'

export default function AboutPreview() {
  return (
    <section className="clean-shell py-10 sm:py-14 lg:py-18">
      <div className="grid gap-6 border-t border-[#3e3e42] pt-8 sm:pt-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <div>
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">About</p>
          <h2 className="mt-4 text-balance font-sans text-[2.7rem] leading-[0.95] tracking-[-0.04em] text-[#d4d4d4] sm:text-5xl">
            Less of a portfolio, more of a personal archive.
          </h2>
        </div>

        <div className="clean-panel rounded-[1.7rem] p-6 sm:p-8">
          <p className="text-base leading-8 text-[#b7b7b7] sm:text-lg sm:leading-9">
            I wanted this site to feel calm, personal, and worth returning to. The public side is here for writing and context.
            The archive side is where I keep ranked media collections, progress lists, and whatever else becomes part of the long-term shape of the site.
          </p>

          <Link
            to="/about"
            className="mt-7 inline-flex rounded-full border border-[#3e3e42] bg-[#252526]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-200 transition hover:border-white/18 hover:bg-[#1177bb]/[0.07]"
          >
            Read more about this archive
          </Link>
        </div>
      </div>
    </section>
  )
}
