export default function ArchiveHero({ title, subtitle, image, stats = [] }) {
  return (
    <section className="px-4 pb-4 pt-6 sm:px-6 sm:pb-6 sm:pt-8 lg:px-8 lg:pt-14">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] glass-panel sm:rounded-[2rem]">
        <div className="relative h-[260px] sm:h-[340px] lg:h-[380px]">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.28),transparent_28%)]" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
            <p className="font-mono-soft text-[11px] uppercase tracking-[0.28em] text-sky-100/80 sm:tracking-[0.32em]">Archive section</p>
            <h1 className="mt-3 font-serif text-[3rem] leading-[0.95] tracking-tight text-white sm:mt-4 sm:text-6xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-100/82 sm:mt-5 sm:text-lg sm:leading-8">{subtitle}</p>
            {stats.length ? (
              <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-2 backdrop-blur-xl sm:px-4">
                    <span className="text-sm font-medium text-slate-50">{stat.value}</span>
                    <span className="ml-2 text-[11px] uppercase tracking-[0.18em] text-slate-300/75 sm:tracking-[0.2em]">{stat.label}</span>
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
