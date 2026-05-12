export default function StatusFilterBar({ filters, value, onChange }) {
  return (
    <div className="overflow-x-auto border-b border-[#2d2d30] pb-3">
      <div className="flex min-w-max items-center gap-5 sm:gap-7">
        {filters.map((filter) => {
          const active = filter.value === value
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onChange(filter.value)}
              className={`group relative py-2 font-mono-soft text-[11px] uppercase tracking-[0.18em] transition duration-300 ${
                active ? 'text-[#d4d4d4]' : 'text-[#767676] hover:text-[#d4d4d4]'
              }`}
            >
              <span>{filter.label}</span>
              <span className={`ml-2 text-[10px] ${active ? 'text-[#4ec9b0]' : 'text-[#5f5f5f] group-hover:text-[#8f8f8f]'}`}>
                {filter.count}
              </span>
              <span
                className={`absolute bottom-0 left-0 h-px transition-all duration-300 ${
                  active ? 'w-full bg-[#4ec9b0]' : 'w-0 bg-[#569cd6] group-hover:w-full'
                }`}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
