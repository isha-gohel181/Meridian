import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchCourses } from '../redux/slices/courseSlice'
import LandingPortalHero from '../components/landing/LandingPortalHero'
import LandingStats from '../components/landing/LandingStats'
import LandingBendingMarquee from '../components/landing/LandingBendingMarquee'
import LandingMarqueeStrip from '../components/landing/LandingMarqueeStrip'
import LandingStatementFold from '../components/landing/LandingStatementFold'
import LandingCoursesSection from '../components/LandingCoursesSection'
import TestimonialsScroll from '../components/TestimonialsScroll'
import LandingDiary from '../components/landing/LandingDiary'
import LandingAbout from '../components/landing/LandingAbout'
import LandingWhyChoose from '../components/landing/LandingWhyChoose'
import LandingMissionVision from '../components/landing/LandingMissionVision'
import LandingFacultyRoster from '../components/landing/LandingFacultyRoster'
import LandingProgramDates from '../components/landing/LandingProgramDates'
import LandingHomeClose from '../components/landing/LandingHomeClose'
import LandingContactCta from '../components/landing/LandingContactCta'

const Home = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  return (
    <div className="w-full bg-slate-50">
      <LandingPortalHero />
      <LandingStats />
      <LandingBendingMarquee />
      <LandingStatementFold />
      <LandingCoursesSection />
      <TestimonialsScroll variant="landing" />
      <LandingAbout />
      <LandingDiary />
      <LandingWhyChoose />
      <LandingMissionVision />
      <LandingMarqueeStrip />
      <LandingFacultyRoster />
      <LandingProgramDates />
      <LandingHomeClose />
      <LandingContactCta />
    </div>
  )
}

export default Home
