const socials = [
  { label: 'YouTube',   href: 'https://youtube.com/@absolking1/' },
  { label: 'GitHub',    href: 'https://github.com/AbsolKing/' },
  { label: 'AniList',   href: 'https://anilist.co/user/AbsolKing/' },
  { label: 'Steam',     href: 'https://steamcommunity.com/id/absolking/' },
  { label: 'Instagram', href: 'https://www.instagram.com/absol.king/' },
  { label: 'Discord',   href: 'https://discord.gg/7AyNdX3ryw' },
]

export default function Footer() {
  return (
    <footer id="socials" className="clean-shell pb-8 pt-8 sm:pb-10 sm:pt-12">
      <div className="relative pt-7 sm:pt-9">
        {/* Gradient top rule */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#569cd6]/40 to-transparent" />

        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono-soft text-sm font-semibold uppercase tracking-[0.18em] text-[#d4d4d4]">
              <span className="syntax-blue">export default</span> ABSOLKING / Archive
            </p>
            <p className="mt-3 max-w-md text-sm leading-7 text-[#8f8f8f]">
              A personal home for writing, rankings, and the media worth keeping track of over time.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="font-mono-soft text-[11px] uppercase tracking-[0.16em] text-[#8f8f8f] transition hover:text-[#4ec9b0]"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.2em] text-[#6f6f6f]">
            v1.1.0-vs-alpha
          </p>
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.16em] text-[#6f6f6f]">
            © {new Date().getFullYear()} AbsolKing
          </p>
        </div>
      </div>
    </footer>
  )
}
