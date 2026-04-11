import SectionCard from './SectionCard'

const cards = [
  {
    title: 'About',
    description: 'The short version of who I am, what I like building, and why this archive exists.',
    href: '/about',
  },
  {
    title: 'Blog',
    description: 'Essays, notes, and ideas that fit better in long form than in a feed.',
    href: '/blog',
  },
  {
    title: 'Archive',
    description: 'A media-focused collection for anime, games, movies, and shows — with space for rankings and progress.',
    href: '/database',
  },
  {
    title: 'Socials',
    description: 'The small handful of places where the rest of my online presence still lives.',
    href: '/about#socials',
  },
]

export default function NavigationCards() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono-soft text-[11px] uppercase tracking-[0.32em] text-slate-400">Explore</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl tracking-tight text-slate-50 sm:text-5xl">
              A simple front page,
              <span className="block text-sky-200">with deeper rooms behind it.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-8 text-slate-300/75">
            The homepage stays light. The archive is where things start to feel more personal and more specific.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => (
            <SectionCard key={card.title} index={index + 1} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}
