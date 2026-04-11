import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Socials', to: '/about#socials' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname, location.hash])

  return (
    <header className="sticky top-0 z-50 px-4 py-3 sm:px-6 sm:py-4">
      <div className="mx-auto max-w-6xl">
        <nav className="glass-panel rounded-[1.75rem] px-4 py-3 sm:rounded-full sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="group min-w-0 pr-2">
              <p className="text-sm font-semibold tracking-[0.28em] text-slate-50 sm:text-base sm:tracking-[0.34em]">
                ABSOLKING
              </p>
              <p className="mt-1 font-mono-soft text-[10px] uppercase tracking-[0.26em] text-slate-400 sm:text-[11px] sm:tracking-[0.32em]">
                Archive
              </p>
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm tracking-[0.14em] transition ${
                      isActive ? 'text-sky-100' : 'text-slate-300 hover:text-sky-100'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/database"
                className="rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-slate-50 transition hover:border-sky-200/30 hover:bg-white/[0.12]"
              >
                Archive
              </Link>
            </div>

            <button
              type="button"
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-100 transition hover:border-sky-200/30 hover:bg-white/[0.12] md:hidden"
            >
              <span className="relative h-4 w-5">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-5 rounded-full bg-current transition ${
                    isOpen ? 'translate-y-[7px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] h-[1.5px] w-5 rounded-full bg-current transition ${
                    isOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-0 top-[14px] h-[1.5px] w-5 rounded-full bg-current transition ${
                    isOpen ? '-translate-y-[7px] -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>

          {isOpen ? (
            <div className="mt-4 border-t border-white/10 pt-4 md:hidden">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    className={({ isActive }) =>
                      `rounded-2xl px-4 py-3 text-sm uppercase tracking-[0.18em] transition ${
                        isActive
                          ? 'border border-white/12 bg-white/[0.12] text-slate-50'
                          : 'text-slate-300 hover:bg-white/[0.08] hover:text-slate-50'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <Link
                  to="/database"
                  className="mt-2 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.08] px-4 py-3 text-xs font-medium uppercase tracking-[0.22em] text-slate-50 transition hover:border-sky-200/30 hover:bg-white/[0.12]"
                >
                  Open Archive
                </Link>
              </div>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
