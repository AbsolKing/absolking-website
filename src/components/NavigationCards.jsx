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
    description: 'A media-focused collection for anime, manga, movies, and games.',
    href: '/database',
  },
  {
    title: 'Browse',
    description: 'Live anime, manga, movies, and games pulled from public databases — browse and add directly to the archive.',
    href: '/browse',
  },
]

export default function NavigationCards() {
  return (
    <section className="clean-shell py-10 sm:py-14 lg:py-18">
      <div className="mb-8 grid gap-5 md:grid-cols-[1fr_0.75fr] md:items-end">
        <div>
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">Explore</p>
          <h2 className="mt-4 text-balance font-sans text-[2.7rem] leading-[0.95] tracking-[-0.04em] text-[#d4d4d4] sm:text-5xl">
            Simple on the front, deeper in the archive.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-[#b7b7b7] md:justify-self-end">
          A clean homepage with a few direct paths into the parts of the site that matter most.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <SectionCard key={card.title} index={index + 1} {...card} />
        ))}
      </div>
    </section>
  )
}
