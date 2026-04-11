import { Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import AboutPage from './pages/AboutPage'
import DatabasePage from './pages/DatabasePage'
import AnimePage from './pages/database/AnimePage'
import GamesPage from './pages/database/GamesPage'
import MoviesPage from './pages/database/MoviesPage'
import ShowsPage from './pages/database/ShowsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/database" element={<DatabasePage />} />
        <Route path="/database/anime" element={<AnimePage />} />
        <Route path="/database/games" element={<GamesPage />} />
        <Route path="/database/movies" element={<MoviesPage />} />
        <Route path="/database/shows" element={<ShowsPage />} />
      </Route>
    </Routes>
  )
}
