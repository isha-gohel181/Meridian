import Hero from '../components/Hero'
import MentorSection from '../components/MentorSection'
import InstituteSection from '../components/InstituteSection'
import CourseSlider from '../components/CourseSlider'
import LogoMarquee from '../components/LogoMarquee'
import EventHero from '../components/EventHero'
import StackingBanners from '../components/StackingBanners'
import TestimonialsScroll from '../components/TestimonialsScroll'
import GrowthSection from '../components/GrowthSection'
import BrandFeatures from '../components/BrandFeatures'
import { eventData } from '../constants/events'

const Home = ({ isLoaded }) => {
  return (
    <div className="w-full">
      <Hero isLoaded={isLoaded} />
      <CourseSlider />
      <InstituteSection />
      <MentorSection />

      {/* Dynamic Event Showcase */}
      {/* <EventHero events={eventData} /> */}
      
      <LogoMarquee />
      <StackingBanners />
      <TestimonialsScroll />
      <BrandFeatures />
      <GrowthSection />
    </div>
  )
}

export default Home
