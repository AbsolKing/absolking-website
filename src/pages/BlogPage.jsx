import PageHeader from '../components/PageHeader'

const posts = [
  {
    title: 'Why I still like keeping a personal archive',
    summary: 'A small defense of slow websites, ranking systems, and collections that feel like rooms rather than feeds.',
    tag: 'Notes',
  },
  {
    title: 'The difference between a database and an archive',
    summary: 'Why language matters when you want your media pages to feel curated instead of clinical.',
    tag: 'Archive',
  },
  {
    title: 'How I want this site to grow from alpha',
    summary: 'Thoughts on what should stay simple, what should become more visual, and what can wait until later.',
    tag: 'Roadmap',
  },
]

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Writing that belongs somewhere more durable than a timeline."
        description="This section is still early, but it is meant for essays, reflections, and project notes that fit the tone of the archive: deliberate, personal, and easy to return to later."
      />
      <section className="px-6 pb-12 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4">
          {posts.map((post) => (
            <article key={post.title} className="glass-panel-soft rounded-[1.75rem] p-7">
              <p className="font-mono-soft text-[11px] uppercase tracking-[0.24em] text-slate-400">{post.tag}</p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-50">{post.title}</h2>
              <p className="mt-4 max-w-3xl leading-8 text-slate-300/80">{post.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
