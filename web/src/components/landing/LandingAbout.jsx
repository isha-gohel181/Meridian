import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import MeridianBook from './MeridianBook'

const LandingAbout = () => {
  const { t } = useLanguage()

  return (
    <section
      id="about"
      className="relative scroll-mt-28 border-y border-brand-brown/[0.06] bg-slate-50 md:scroll-mt-32"
    >
      <div className="mx-auto grid max-w-7xl items-start lg:grid-cols-12 lg:gap-6">
        <div className="px-4 py-20 sm:px-6 md:py-28 lg:sticky lg:top-32 lg:col-span-5 lg:py-28 lg:pr-4 lg:pl-12">
          <p className="mb-4 font-jetbrains text-[10px] font-bold uppercase tracking-[0.45em] text-accent">
            {t('landingAboutEyebrow')}
          </p>
          <h2 className="font-newsreader text-3xl leading-[1.15] font-medium tracking-tight text-brand-brown sm:text-4xl md:text-[2.65rem]">
            {t('landingAboutTitle')}
          </h2>
          <div className="mt-8 h-px w-20 bg-accent/80" aria-hidden />
          <p className="mt-8 max-w-sm font-jetbrains text-xs uppercase leading-relaxed tracking-[0.2em] text-description">
            {t('landingCommitmentSnippet')}
          </p>
          <div className="mt-10 max-w-md space-y-6 text-base leading-relaxed text-description md:text-lg">
            <p className="text-lg font-medium leading-snug text-normal md:text-xl">{t('landingPhilosophy')}</p>
            <p>{t('landingIntro')}</p>
            <p>{t('landingApproachSummary')}</p>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <MeridianBook />
        </div>
      </div>
    </section>
  )
}

export default LandingAbout
