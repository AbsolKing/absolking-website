import { NavLink } from 'react-router-dom'

export default function ArchiveTabs({ items }) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="glass-panel-soft overflow-x-auto rounded-[1.25rem] p-2.5 sm:rounded-[1.5rem] sm:p-3">
        <div className="flex min-w-max items-center gap-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition sm:text-sm sm:tracking-[0.18em] ${
                  isActive
                    ? 'border-white/15 bg-white/[0.14] text-slate-50'
                    : 'border-transparent text-slate-300/75 hover:bg-white/[0.08] hover:text-slate-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
