export default function StatusFilterBar({ filters, value, onChange }) {
  return (
    <div className="glass-panel-soft overflow-x-auto rounded-[1.25rem] p-2.5 sm:rounded-[1.5rem] sm:p-3">
      <div className="flex min-w-max items-center gap-2">
        {filters.map((filter) => {
          const active = filter.value === value
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onChange(filter.value)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition sm:text-sm sm:tracking-[0.18em] ${
                active
                  ? 'border-white/15 bg-white/[0.14] text-slate-50'
                  : 'border-transparent text-slate-300/75 hover:border-white/10 hover:bg-white/[0.08] hover:text-slate-50'
              }`}
            >
              {filter.label}
              <span className="ml-2 text-[11px] text-slate-400">{filter.count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
