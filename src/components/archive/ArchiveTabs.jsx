import { NavLink } from 'react-router-dom'

export default function ArchiveTabs({ items }) {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      <div className="glass-panel-soft flex flex-wrap items-center gap-2 rounded-[1.5rem] p-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm uppercase tracking-[0.18em] transition ${
                isActive
                  ? 'bg-white/[0.14] text-slate-50 border border-white/15'
                  : 'text-slate-300/75 hover:bg-white/[0.08] hover:text-slate-50'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
