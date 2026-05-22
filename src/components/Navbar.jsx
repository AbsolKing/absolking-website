import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Archive', to: '/database' },
  { label: 'Browse', to: '/browse' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-[#3e3e42]/90 bg-[#1a1a1a]/96 shadow-[0_4px_32px_rgba(0,0,0,0.44)] backdrop-blur-xl'
          : 'border-[#3e3e42]/60 bg-[#1e1e1e]/88 backdrop-blur-xl'
      }`}
    >
      {/* Slim accent line at bottom when scrolled */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#569cd6]/30 to-transparent" />
      )}
      <div className="clean-shell">
        <nav className="flex min-h-[64px] items-center justify-between gap-5">
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3e3e42] bg-[#252526] font-mono-soft text-xs text-[#4ec9b0] transition group-hover:border-[#569cd6]/60 group-hover:bg-[#1e3a4c]">
              AK
            </span>
            <span className="leading-none">
              <span className="block font-mono-soft text-sm font-semibold uppercase tracking-[0.22em] text-[#d4d4d4] transition group-hover:text-[#569cd6]">
                ABSOLKING
              </span>
              <span className="mt-1 block font-mono-soft text-[10px] uppercase tracking-[0.18em] text-[#8f8f8f]">
                / Archive
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md border px-3.5 py-2 font-mono-soft text-[11px] uppercase tracking-[0.14em] transition ${
                    isActive
                      ? 'border-[#569cd6]/45 bg-[#094771]/65 text-[#d4d4d4]'
                      : 'border-transparent text-[#8f8f8f] hover:border-[#3e3e42] hover:bg-[#252526] hover:text-[#d4d4d4]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <button
            type="button"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#3e3e42] bg-[#252526] text-[#d4d4d4] transition hover:border-[#569cd6]/50 md:hidden"
          >
            <span className="relative h-4 w-5">
              <span className={`absolute left-0 top-0 h-px w-5 bg-current transition ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`absolute left-0 top-[7px] h-px w-5 bg-current transition ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 top-[14px] h-px w-5 bg-current transition ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </span>
          </button>
        </nav>

        {isOpen ? (
          <div className="pb-4 md:hidden">
            <div className="rounded-xl border border-[#3e3e42] bg-[#252526] p-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 font-mono-soft text-xs uppercase tracking-[0.16em] transition ${
                      isActive ? 'bg-[#094771] text-[#d4d4d4]' : 'text-[#8f8f8f] hover:bg-[#2d2d30] hover:text-[#d4d4d4]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
