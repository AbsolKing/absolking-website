import { NavLink } from 'react-router-dom'

export default function ArchiveTabs({ items }) {
  return (
    <div className="clean-shell">
      <div className="overflow-x-auto border-y border-[#2d2d30] py-1.5">
        <div className="flex min-w-max items-center gap-5 sm:gap-7">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/database'}
              className={({ isActive }) =>
                `group relative flex items-center gap-2 py-3 font-mono-soft text-[11px] uppercase tracking-[0.2em] transition duration-300 ${
                  isActive
                    ? 'text-[#d4d4d4]'
                    : 'text-[#767676] hover:text-[#d4d4d4]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.icon && (
                    <span className={`flex-shrink-0 transition duration-300 ${isActive ? 'text-[#569cd6]' : 'text-[#6f6f6f] group-hover:text-[#8f8f8f]'}`}>
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                  <span
                    className={`absolute -bottom-[7px] left-0 h-px transition-all duration-300 ${
                      isActive
                        ? 'w-full bg-[#569cd6]'
                        : 'w-0 bg-[#4ec9b0] group-hover:w-full'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
