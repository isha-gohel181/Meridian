import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchCourses } from '../redux/slices/courseSlice'
import { fetchSettings } from '../redux/slices/configSlice'
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
import SectionSeam from '../components/landing/SectionSeam'
import FixedWatermark from '../components/FixedWatermark'

const Home = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCourses())
    dispatch(fetchSettings())
  }, [dispatch])

  return (
    <div className="w-full bg-slate-50">
      <FixedWatermark />
      <LandingPortalHero />
      <SectionSeam glow={true} lineColor="via-accent/25" />
      <LandingStats />
      <SectionSeam glow={false} lineColor="via-accent/20" />
      <LandingBendingMarquee />
      <LandingStatementFold />
      <SectionSeam glow={true} lineColor="via-accent/30" />
      <LandingCoursesSection />
      <TestimonialsScroll variant="landing" />
      <SectionSeam glow={false} lineColor="via-accent/20" />
      <LandingAbout />
      <LandingDiary />
      <SectionSeam glow={false} lineColor="via-accent/20" />
      <LandingWhyChoose />
      <SectionSeam glow={true} lineColor="via-accent/30" />
      <LandingMissionVision />
      <LandingMarqueeStrip />
      <LandingFacultyRoster />
      <SectionSeam glow={true} lineColor="via-accent/25" />
      <LandingProgramDates />
      <LandingHomeClose />
      <LandingContactCta />
    </div>
  )
}

export default Home
