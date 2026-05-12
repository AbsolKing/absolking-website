export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <section className="clean-shell py-8 sm:py-12 lg:py-16">
      <div className="max-w-5xl fade-up">
        <p className="font-mono-soft text-[10px] uppercase tracking-[0.24em] text-[#569cd6]">// {eyebrow}</p>
        <h1 className="mt-5 text-balance text-[2.75rem] font-semibold leading-[0.96] tracking-[-0.05em] text-[#d4d4d4] sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-4xl text-base leading-8 text-[#b7b7b7] sm:text-lg sm:leading-9">{description}</p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  )
}
