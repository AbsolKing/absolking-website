import Hero from '../components/Hero'
import NavigationCards from '../components/NavigationCards'
import FeaturedPosts from '../components/FeaturedPosts'
import AboutPreview from '../components/AboutPreview'
import DatabaseSection from '../components/DatabaseSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <NavigationCards />
      <FeaturedPosts />
      <AboutPreview />
      <DatabaseSection />
    </>
  )
}
