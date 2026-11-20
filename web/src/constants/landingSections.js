/**
 * Landing page section anchors — order matches web/src/pages/Home.jsx
 */
export const LANDING_SECTION_ANCHORS = [
  { id: 'hero', component: 'LandingPortalHero' },
  { id: 'stats', component: 'LandingStats' },
  { id: 'statement', component: 'LandingStatementFold' },
  { id: 'courses', component: 'LandingCoursesSection' },
  { id: 'student-testimonials', component: 'TestimonialsScroll' },
  { id: 'about', component: 'LandingAbout' },
  { id: 'diary', component: 'LandingDiary' },
  { id: 'why-meridian', component: 'LandingWhyChoose' },
  { id: 'faculty', component: 'LandingFacultyRoster' },
  { id: 'dates', component: 'LandingProgramDates' },
  { id: 'contact-cta', component: 'LandingContactCta' },
]

export const LANDING_SECTION_IDS = LANDING_SECTION_ANCHORS.map((s) => s.id)

/** First content block below the pinned hero portal */
export const LANDING_FIRST_SECTION_AFTER_HERO = 'stats'