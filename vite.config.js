import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const SITE = 'https://absolking.com'

/**
 * Routes that get their own static index.html at build time so Discord,
 * Twitter, etc. can read page-specific OG metadata. Real users still get
 * the SPA — these files load the same React bundle.
 */
const pages = [
  { route: 'about',            title: 'About',    desc: "Who I am, what this site is, and how it's built.",        image: 'about.png' },
  { route: 'blog',             title: 'Blog',     desc: "Notes on archives, design, and the things I'm thinking about.", image: 'blog.png' },
  { route: 'database',         title: 'Database', desc: 'The whole media archive — anime, games, movies, shows.', image: 'database.png' },
  { route: 'database/anime',   title: 'Anime',    desc: 'Completed, watching, on hold, and planning — out of 10.', image: 'anime.png' },
  { route: 'database/games',   title: 'Games',    desc: 'Played, playing, and backlog — with personal scores.',    image: 'games.png' },
  { route: 'database/movies',  title: 'Movies',   desc: 'Films worth keeping track of — ranked and categorised.', image: 'movies.png' },
  { route: 'database/shows',   title: 'Shows',    desc: 'Series with familiar status filters and quick notes.',    image: 'shows.png' },
]

function perPageOgPlugin() {
  return {
    name: 'per-page-og',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist')
      const indexPath = path.join(distDir, 'index.html')
      if (!fs.existsSync(indexPath)) {
        console.warn('[per-page-og] dist/index.html missing; skipping.')
        return
      }
      const baseHtml = fs.readFileSync(indexPath, 'utf-8')

      for (const p of pages) {
        const pageTitle = `${p.title} — ABSOLKING / Archive`
        const url = `${SITE}/${p.route}`
        const image = `${SITE}/og/${p.image}`

        let html = baseHtml
          .replace(/<title>[^<]*<\/title>/,
                   `<title>${pageTitle}</title>`)
          .replace(/<meta name="description" content="[^"]*"/,
                   `<meta name="description" content="${p.desc}"`)
          .replace(/<meta property="og:title" content="[^"]*"/,
                   `<meta property="og:title" content="${pageTitle}"`)
          .replace(/<meta property="og:description" content="[^"]*"/,
                   `<meta property="og:description" content="${p.desc}"`)
          .replace(/<meta property="og:url" content="[^"]*"/,
                   `<meta property="og:url" content="${url}"`)
          .replace(/<meta property="og:image" content="[^"]*"/,
                   `<meta property="og:image" content="${image}"`)
          .replace(/<meta name="twitter:title" content="[^"]*"/,
                   `<meta name="twitter:title" content="${pageTitle}"`)
          .replace(/<meta name="twitter:description" content="[^"]*"/,
                   `<meta name="twitter:description" content="${p.desc}"`)
          .replace(/<meta name="twitter:image" content="[^"]*"/,
                   `<meta name="twitter:image" content="${image}"`)

        const outDir = path.join(distDir, p.route)
        fs.mkdirSync(outDir, { recursive: true })
        fs.writeFileSync(path.join(outDir, 'index.html'), html)
        console.log(`[per-page-og] dist/${p.route}/index.html`)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), perPageOgPlugin()],
  base: '/',
})
