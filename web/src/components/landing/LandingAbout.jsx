import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import LandingReveal from './LandingReveal'

const LandingAbout = () => {
  const { t } = useLanguage()

  return (
    <LandingReveal
      id="about"
      className="relative scroll-mt-28 md:scroll-mt-32 py-20 md:py-28 px-4 sm:px-6 lg:px-12 bg-slate-50 border-y border-brand-brown/[0.06]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <p className="font-jetbrains text-[10px] text-accent tracking-[0.45em] uppercase font-bold mb-4">
              {t('landingAboutEyebrow')}
            </p>
            <h2 className="font-newsreader text-3xl sm:text-4xl md:text-[2.65rem] text-brand-brown leading-[1.15] font-medium tracking-tight">
              {t('landingAboutTitle')}
            </h2>
            <div className="mt-8 h-px w-20 bg-accent/80" aria-hidden />
            <p className="mt-8 font-jetbrains text-xs text-description uppercase tracking-[0.2em] leading-relaxed max-w-sm">
              {t('landingCommitmentSnippet')}
            </p>
          </div>
          <div className="lg:col-span-7 space-y-6 text-description text-base md:text-lg leading-relaxed">
            <p className="text-normal font-medium text-lg md:text-xl leading-snug">{t('landingPhilosophy')}</p>
            <p>{t('landingIntro')}</p>
            <p>{t('landingApproachSummary')}</p>
          </div>
        </div>
      </div>
    </LandingReveal>
  )
}

export default LandingAbout
