import PageHeader from '../components/PageHeader'

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A quieter website, built to be useful to me first."
        description="This project is not meant to be a polished corporate portfolio. It is a personal archive with a public front page: a place for rankings and collections that are easier to revisit when they live in one calm, structured home."
      />
      <section className="clean-shell pb-12 lg:pb-16">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="clean-card rounded-[1.7rem] p-6 sm:p-8">
            <p className="font-mono-soft text-[10px] uppercase tracking-[0.24em] text-[#8f8f8f]">Why this exists</p>
            <p className="mt-5 text-base leading-8 text-[#b7b7b7]">
              I wanted something that could hold personal, visual lists in one place. The homepage gives enough context to make sense to other people, but the archive side is designed mostly around what I actually enjoy browsing and maintaining.
            </p>
          </div>
          <div className="clean-card rounded-[1.7rem] p-6 sm:p-8">
            <p className="font-mono-soft text-[10px] uppercase tracking-[0.24em] text-[#8f8f8f]">What comes next</p>
            <p className="mt-5 text-base leading-8 text-[#b7b7b7]">
              The archive is live across anime, manga, movies, and games. The next focus is expanding reviews and refining the parts that benefit most from actual use.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
