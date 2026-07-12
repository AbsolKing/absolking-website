import { useState } from 'react'
import { Link } from 'react-router-dom'
import { animeEntries } from '../data/anime'
import { gameEntries } from '../data/games'
import { movieEntries } from '../data/movies'
import { mangaEntries } from '../data/manga'
import DiscordCard from '../components/DiscordCard'

const socials = [
  { label: 'GitHub',    href: 'https://github.com/AbsolKing/' },
  { label: 'Steam',     href: 'https://steamcommunity.com/id/absolking/' },
  { label: 'Instagram', href: 'https://www.instagram.com/absol.king/' },
  { label: 'Discord',   href: null },
]

const totalEntries = animeEntries.length + gameEntries.length + movieEntries.length + mangaEntries.length

export default function AboutPage() {
  const [discordOpen, setDiscordOpen] = useState(false)

  return (
    <>
      <section className="clean-shell py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <div className="fade-up">
            <p className="font-mono-soft text-[10px] uppercase tracking-[0.24em] text-[#569cd6]">// about</p>
            <h1 className="mt-5 text-balance text-[2.75rem] font-semibold leading-[0.96] tracking-[-0.05em] text-[#d4d4d4] sm:text-6xl md:text-7xl">
              AbsolKing
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#b7b7b7] sm:text-lg sm:leading-9">
              I build things, play games, watch anime, and keep track of what sticks. This site is where I log all of it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {socials.map((s) =>
                s.href ? (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#3e3e42] bg-[#252526] px-3.5 py-2 font-mono-soft text-[10px] uppercase tracking-[0.16em] text-[#8f8f8f] transition hover:border-[#569cd6]/50 hover:text-[#d4d4d4]"
                  >
                    {s.label}
                    <span className="text-[#569cd6]">↗</span>
                  </a>
                ) : (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setDiscordOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#3e3e42] bg-[#252526] px-3.5 py-2 font-mono-soft text-[10px] uppercase tracking-[0.16em] text-[#8f8f8f] transition hover:border-[#569cd6]/50 hover:text-[#d4d4d4]"
                  >
                    {s.label}
                    <span className="text-[#569cd6]">●</span>
                  </button>
                )
              )}
            </div>
          </div>

          <div className="space-y-4 fade-up" style={{ animationDelay: '80ms' }}>
            <div className="clean-card rounded-[1.7rem] p-6 sm:p-8">
              <p className="font-mono-soft text-[10px] uppercase tracking-[0.24em] text-[#8f8f8f]">Now</p>
              <p className="mt-5 text-base leading-8 text-[#b7b7b7]">
                Building this archive, playing through my backlog, and writing when something sticks with me.
                Currently deep in roguelike deckbuilders and catching up on seasonal anime.
              </p>
            </div>

            <div className="clean-card rounded-[1.7rem] p-6 sm:p-8">
              <p className="font-mono-soft text-[10px] uppercase tracking-[0.24em] text-[#8f8f8f]">This site</p>
              <p className="mt-5 text-base leading-8 text-[#b7b7b7]">
                {totalEntries} entries across 4 categories — anime, manga, movies, and games. Each one scored, tagged,
                and tracked. No algorithms, no recommendations. Just my own lists.
              </p>
              <div className="mt-5 flex gap-6">
                <Link to="/database/anime" className="font-mono-soft text-xs text-[#ce9178] transition hover:underline">
                  Anime ({animeEntries.length})
                </Link>
                <Link to="/database/manga" className="font-mono-soft text-xs text-[#4ec9b0] transition hover:underline">
                  Manga ({mangaEntries.length})
                </Link>
                <Link to="/database/movies" className="font-mono-soft text-xs text-[#dcdcaa] transition hover:underline">
                  Movies ({movieEntries.length})
                </Link>
                <Link to="/database/games" className="font-mono-soft text-xs text-[#569cd6] transition hover:underline">
                  Games ({gameEntries.length})
                </Link>
              </div>
            </div>

            <div className="clean-card rounded-[1.7rem] p-6 sm:p-8">
              <p className="font-mono-soft text-[10px] uppercase tracking-[0.24em] text-[#8f8f8f]">Colophon</p>
              <p className="mt-5 text-base leading-8 text-[#b7b7b7]">
                Built with React and Vite. Data stored locally. No backend, no tracking. Inspired by the VS Code editor
                because I spend more time in it than anywhere else.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DiscordCard open={discordOpen} onClose={() => setDiscordOpen(false)} />
    </>
  )
}
