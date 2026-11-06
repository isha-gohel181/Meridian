import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLanguage } from '../../context/LanguageContext'
import CourseDeck from './CourseDeck'

const LandingProgramsShowcase = () => {
  const { t } = useLanguage()
  const courses = useSelector((s) => s.courses.courses)
  const courseDeckKey = useMemo(() => {
    const list = (courses || []).filter((c) => c.isPublished !== false && (c._id || c.id))
    return list
      .slice(0, 12)
      .map((c) => c._id || c.id)
      .join('|')
  }, [courses])

  return (
    <section
      id="programs"
      className="scroll-mt-28 md:scroll-mt-32 border-y border-brand-brown/[0.06] bg-white px-4 py-20 sm:px-6 md:px-10 lg:px-14"
    >
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="mb-3 font-jetbrains text-[10px] font-bold uppercase tracking-[0.45em] text-accent">
            {t('landingProgramsEyebrow')}
          </p>
          <h2 className="font-newsreader text-3xl font-medium tracking-tight text-brand-brown sm:text-4xl md:text-[2.6rem]">
            {t('landingProgramsTitle')}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-description md:text-lg">{t('landingProgramsSub')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/courses"
              className="inline-flex justify-center rounded-xl bg-brand-brown px-7 py-3.5 font-jetbrains text-xs font-bold uppercase tracking-[0.2em] text-white transition-transform hover:scale-[1.02]"
            >
              {t('browseCourses')}
            </Link>
            <Link
              to="/contact#enquiry"
              className="inline-flex justify-center rounded-xl border border-brand-brown/25 px-7 py-3.5 font-jetbrains text-xs font-semibold uppercase tracking-[0.15em] text-brand-brown transition-colors hover:bg-brand-brown/5"
            >
              {t('enquireNow')}
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <CourseDeck key={courseDeckKey} />
        </div>
      </div>
    </section>
  )
}

export default LandingProgramsShowcase
