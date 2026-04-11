export default function MediaRow({ index, item }) {
  return (
    <article className="group rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex items-center justify-between gap-3 sm:w-8 sm:flex-none sm:justify-start">
          <span className="text-sm font-medium tracking-[0.18em] text-slate-400 sm:text-base">
            #{String(index).padStart(2, '0')}
          </span>
          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-300 sm:hidden">
            {item.status}
          </span>
        </div>

        <div className="flex gap-4 sm:min-w-0 sm:flex-1 sm:items-center sm:gap-5">
          <div className="w-[76px] flex-shrink-0 overflow-hidden rounded-[1rem] border border-white/10 bg-slate-900/80 shadow-[0_12px_36px_rgba(0,0,0,0.22)] sm:w-[92px]">
            <img
              src={item.image}
              alt={item.title}
              className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-2 sm:items-center">
              <h3 className="max-w-3xl text-lg font-semibold leading-tight text-slate-50 sm:text-[1.35rem]">
                {item.title}
              </h3>
              <span className="hidden rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300 sm:inline-flex">
                {item.status}
              </span>
            </div>

            <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-slate-400 sm:text-xs">
              {item.type} • {item.progress}
            </p>

            {item.note ? (
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300/78">
                {item.note}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end sm:ml-4 sm:flex-none">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-sky-200/20 bg-gradient-to-br from-white/[0.12] to-sky-300/[0.08] text-base font-semibold text-slate-50 shadow-[0_0_0_1px_rgba(125,211,252,0.04),0_12px_32px_rgba(15,23,42,0.22)] backdrop-blur-md transition duration-300 group-hover:border-sky-200/30 group-hover:from-white/[0.18] group-hover:to-sky-300/[0.14] sm:h-16 sm:w-16 sm:text-lg">
            {item.score}
          </div>
        </div>
      </div>
    </article>
  )
}
