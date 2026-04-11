export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <section className="px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8 lg:px-8 lg:pt-14">
      <div className="mx-auto max-w-6xl rounded-[1.75rem] p-5 sm:rounded-[2rem] sm:p-8 lg:p-10 glass-panel">
        <p className="font-mono-soft text-[11px] uppercase tracking-[0.28em] text-slate-400 sm:tracking-[0.32em]">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-[2.7rem] leading-[0.95] text-slate-50 sm:mt-5 sm:text-5xl md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200/80 sm:mt-6 sm:text-lg sm:leading-9">{description}</p>
        {children ? <div className="mt-6 sm:mt-8">{children}</div> : null}
      </div>
    </section>
  )
}
