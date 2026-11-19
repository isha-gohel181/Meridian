import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import MeridianBook from './MeridianBook'
import LandingReveal from './LandingReveal'
import { STAGGER_CHILD_VARIANTS } from './landingRevealVariants'
import SectionSeam from './SectionSeam'

const MotionDiv = motion.div

const LandingAbout = () => {
  const { t } = useLanguage()

  return (
    <LandingReveal
      id="about"
      stagger
      className="relative scroll-mt-28 border-b border-brand-brown/[0.06] bg-slate-50 md:scroll-mt-32"
    >
      <SectionSeam glow={true} className="absolute top-0 inset-x-0" />
      <div className="site-container grid items-start lg:grid-cols-12 lg:gap-6">
        <MotionDiv
          variants={STAGGER_CHILD_VARIANTS}
          className="py-20 md:py-28 lg:sticky lg:top-32 lg:col-span-5 lg:py-28 lg:pr-4"
        >
          <h2 className="font-newsreader text-3xl leading-[1.15] font-medium tracking-tight text-brand-brown sm:text-4xl md:text-[2.65rem]">
            {t('landingAboutTitle')}
          </h2>
          <div className="mt-8 h-px w-20 bg-accent/80" aria-hidden />
          <p className="mt-8 max-w-md text-base font-medium leading-relaxed text-brand-brown/85 md:text-lg">
            {t('landingCommitmentSnippet')}
          </p>
          <div className="mt-10 max-w-md space-y-6 text-base leading-relaxed text-description md:text-lg">
            <p className="text-lg font-medium leading-snug text-normal md:text-xl">{t('landingPhilosophy')}</p>
            <p>{t('landingIntro')}</p>
            <p>{t('landingApproachSummary')}</p>
          </div>
        </MotionDiv>
        <MotionDiv
          variants={STAGGER_CHILD_VARIANTS}
          className="min-w-0 max-md:-mx-[var(--site-gutter)] max-md:w-[calc(100%+2*var(--site-gutter))] lg:col-span-7"
        >
          <MeridianBook />
        </MotionDiv>
      </div>
    </LandingReveal>
  )
}

export default LandingAbout
