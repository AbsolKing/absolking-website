import PageHeader from '../components/PageHeader'

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A quieter website, built to be useful to me first."
        description="This project is not meant to be a polished corporate portfolio. It is a personal archive with a public front page: a place for blog posts, rankings, and collections that are easier to revisit when they live in one calm, structured home."
      />
      <section className="px-6 pb-12 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="glass-panel-soft rounded-[1.75rem] p-8">
            <p className="font-mono-soft text-[11px] uppercase tracking-[0.26em] text-slate-400">Why this exists</p>
            <p className="mt-5 text-base leading-8 text-slate-200/80">
              I wanted something that could hold both long-form writing and more personal, visual lists. The homepage gives enough context to make sense to other people, but the archive side is designed mostly around what I actually enjoy browsing and maintaining.
            </p>
          </div>
          <div className="glass-panel-soft rounded-[1.75rem] p-8">
            <p className="font-mono-soft text-[11px] uppercase tracking-[0.26em] text-slate-400">What comes next</p>
            <p className="mt-5 text-base leading-8 text-slate-200/80">
              The next iterations can fill out real blog posts, swap in your real links, and expand the archive into anime, games, movies, and shows with their own banners, covers, and status filters.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
