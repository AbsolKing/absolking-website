const socials = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'MAL', href: 'https://myanimelist.net/' },
  { label: 'Letterboxd', href: 'https://letterboxd.com/' },
]

export default function Footer() {
  return (
    <footer id="socials" className="px-6 pb-10 pt-6 lg:px-8">
      <div className="glass-panel mx-auto flex max-w-6xl flex-col gap-8 rounded-[2rem] px-6 py-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-2xl font-semibold tracking-tight text-slate-50">ABSOLKING / Archive</p>
          <p className="mt-2 max-w-md text-sm leading-7 text-slate-300/75">
            A personal home for writing, rankings, and the media worth keeping track of over time.
          </p>
        </div>

        <div className="flex flex-wrap gap-5">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm uppercase tracking-[0.16em] text-slate-300/75 transition hover:text-sky-200"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
