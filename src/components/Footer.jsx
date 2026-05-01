const socials = [
  { label: 'YouTube', href: 'https://youtube.com/@absolking1/' },
  { label: 'GitHub', href: 'https://github.com/AbsolKing/' },
  { label: 'AniList', href: 'https://anilist.co/user/AbsolKing/' },
  { label: 'Steam', href: 'https://steamcommunity.com/id/absolking/' },
  { label: 'Instagram', href: 'https://www.instagram.com/absol.king/' },
  { label: 'Discord', href: 'https://discord.gg/7AyNdX3ryw' },
]

export default function Footer() {
  return (
    <footer id="socials" className="px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6 lg:px-8">
      <div className="glass-panel mx-auto flex max-w-6xl flex-col gap-6 rounded-[1.75rem] px-5 py-6 sm:rounded-[2rem] sm:px-6 sm:py-8 md:flex-row md:items-end md:justify-between md:gap-8">
        <div>
          <p className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">AbsolKing / Archive</p>
          <p className="mt-2 max-w-md text-sm leading-7 text-slate-300/75">
            A personal home for writing, rankings, and the media worth keeping track of over time.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-5">
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
      <p className="text-xs text-white/40 mt-4">
        v1.0.5-ranking-games-beta
      </p>
    </footer>
  )
}
