export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <section className="px-6 pb-8 pt-10 lg:px-8 lg:pt-14">
      <div className="mx-auto max-w-6xl glass-panel rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <p className="font-mono-soft text-[11px] uppercase tracking-[0.32em] text-slate-400">{eyebrow}</p>
        <h1 className="mt-5 font-serif text-5xl tracking-tight text-slate-50 sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-200/80">{description}</p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  )
}
