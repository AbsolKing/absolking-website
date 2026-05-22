import { Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import AboutPage from './pages/AboutPage'
import DatabasePage from './pages/DatabasePage'
import AnimeBrowserPage from './pages/AnimeBrowserPage'
import GamesBrowserPage from './pages/GamesBrowserPage'
import MoviesBrowserPage from './pages/MoviesBrowserPage'
import BrowsePage from './pages/BrowsePage'
import AnimePage from './pages/database/AnimePage'
import GamesPage from './pages/database/GamesPage'
import MoviesPage from './pages/database/MoviesPage'
import MangaPage from './pages/database/MangaPage'
import NotFoundPage from './pages/NotFoundPage'

// ── Blog posts ──
import WhyIStillLikeKeepingAPersonalArchive from './pages/blog/why-i-still-like-keeping-a-personal-archive'
import TheDifferenceBetweenADatabaseAndAnArchive from './pages/blog/the-difference-between-a-database-and-an-archive'
import GlassInterfacesCalmSpacingAndNotOverdesigningYourHomepage from './pages/blog/glass-interfaces-calm-spacing-and-not-overdesigning-your-homepage'

// ── Anime reviews ──
import AngelBeatsReview from './pages/reviews/anime/angel-beats'

// ── Game reviews ──
import SlayTheSpire2Review from './pages/reviews/games/slay-the-spire-2'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/database" element={<DatabasePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/anime" element={<AnimeBrowserPage />} />
        <Route path="/games" element={<GamesBrowserPage />} />
        <Route path="/movies" element={<MoviesBrowserPage />} />
        <Route path="/database/anime" element={<AnimePage />} />
        <Route path="/database/games" element={<GamesPage />} />
        <Route path="/database/movies" element={<MoviesPage />} />
        <Route path="/database/manga" element={<MangaPage />} />

        {/* Blog posts */}
        <Route path="/blog/why-i-still-like-keeping-a-personal-archive" element={<WhyIStillLikeKeepingAPersonalArchive />} />
        <Route path="/blog/the-difference-between-a-database-and-an-archive" element={<TheDifferenceBetweenADatabaseAndAnArchive />} />
        <Route path="/blog/glass-interfaces-calm-spacing-and-not-overdesigning-your-homepage" element={<GlassInterfacesCalmSpacingAndNotOverdesigningYourHomepage />} />

        {/* Anime reviews */}
        <Route path="/reviews/anime/angel-beats" element={<AngelBeatsReview />} />

        {/* Game reviews */}
        <Route path="/reviews/games/slay-the-spire-2" element={<SlayTheSpire2Review />} />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
