export default function ArchiveHero({ title, subtitle, image, stats = [] }) {
  return (
    <section className="px-6 pb-6 pt-10 lg:px-8 lg:pt-14">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] glass-panel">
        <div className="relative h-[300px] sm:h-[340px] lg:h-[380px]">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.28),transparent_28%)]" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
            <p className="font-mono-soft text-[11px] uppercase tracking-[0.32em] text-sky-100/80">Archive section</p>
            <h1 className="mt-4 font-serif text-5xl tracking-tight text-white sm:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-100/80 sm:text-lg">{subtitle}</p>
            {stats.length ? (
              <div className="mt-7 flex flex-wrap gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 backdrop-blur-xl">
                    <span className="text-sm font-medium text-slate-50">{stat.value}</span>
                    <span className="ml-2 text-xs uppercase tracking-[0.2em] text-slate-300/75">{stat.label}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
