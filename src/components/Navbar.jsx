import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Database', to: '/database' },
  { label: 'Socials', to: '/about#socials' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 px-4 py-4 sm:px-6">
      <nav className="glass-panel mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3 sm:px-6">
        <Link to="/" className="group min-w-0">
          <p className="text-sm font-semibold tracking-[0.34em] text-slate-50 sm:text-base">
            ABSOLKING
          </p>
          <p className="mt-1 font-mono-soft text-[10px] uppercase tracking-[0.32em] text-slate-400 sm:text-[11px]">
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
            Open Archive
          </Link>
        </div>
      </nav>
    </header>
  )
}
