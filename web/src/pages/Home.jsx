import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchCourses } from '../redux/slices/courseSlice'
import Hero from '../components/Hero'
import CourseFormatsSection from '../components/CourseFormatsSection'
import TrainingExperienceSection from '../components/TrainingExperienceSection'
import LandingCoursesSection from '../components/LandingCoursesSection'
import WhyPearlsSection from '../components/WhyPearlsSection'
import LearningPathSection from '../components/LearningPathSection'
import MentorSection from '../components/MentorSection'
import AlumniCasesStrip from '../components/AlumniCasesStrip'
import TestimonialsScroll from '../components/TestimonialsScroll'
import LandingCertificateSection from '../components/LandingCertificateSection'
import LandingPricingTeaser from '../components/LandingPricingTeaser'
import HomeFAQSection from '../components/HomeFAQSection'

const Home = ({ isLoaded }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  return (
    <div className="w-full">
      <Hero isLoaded={isLoaded} />
      <CourseFormatsSection />
      <TrainingExperienceSection />
      <LandingCoursesSection />
      <WhyPearlsSection />
      <LearningPathSection />
      <MentorSection />
      <AlumniCasesStrip />
      <TestimonialsScroll variant="landing" />
      <LandingCertificateSection />
      <LandingPricingTeaser />
      <HomeFAQSection />
    </div>
  )
}

export default Home
