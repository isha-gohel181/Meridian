import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import LandingReveal from './LandingReveal'

const LandingLearningApproach = () => {
  const { t } = useLanguage()

  const steps = [
    { nameKey: 'landingStep1Name', descKey: 'landingStep1Desc', num: '01' },
    { nameKey: 'landingStep2Name', descKey: 'landingStep2Desc', num: '02' },
    { nameKey: 'landingStep3Name', descKey: 'landingStep3Desc', num: '03' },
  ]

  return (
    <LandingReveal
      id="our-approach"
      className="scroll-mt-28 md:scroll-mt-32 py-20 md:py-28 px-4 sm:px-6 lg:px-12 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <p className="font-jetbrains text-[10px] text-accent tracking-[0.45em] uppercase font-bold mb-3">
            {t('landingApproachEyebrow')}
          </p>
          <h2 className="font-newsreader text-3xl sm:text-4xl md:text-[2.5rem] text-brand-brown font-medium tracking-tight">
            {t('landingApproachTitle')}
          </h2>
          <p className="mt-4 text-description text-base md:text-lg leading-relaxed">{t('landingApproachSub')}</p>
        </div>

        <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-10">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-12 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-gradient-to-r from-accent/50 to-transparent z-0"
                  aria-hidden
                />
              )}
              <article className="relative z-10 flex flex-col items-center text-center px-2">
                <span className="font-jetbrains text-[10px] tracking-[0.35em] text-accent uppercase mb-4">{step.num}</span>
                <div className="w-14 h-14 rounded-2xl bg-white border border-brand-brown/10 shadow-card flex items-center justify-center mb-6 text-2xl font-newsreader text-brand-brown">
                  {t(step.nameKey).charAt(0)}
                </div>
                <h3 className="font-inter text-xl font-semibold text-brand-brown mb-3">{t(step.nameKey)}</h3>
                <p className="text-description text-sm md:text-base leading-relaxed">{t(step.descKey)}</p>
              </article>
            </div>
          ))}
        </div>

        <div className="md:hidden space-y-6">
          {steps.map((step) => (
            <article
              key={step.num}
              className="rounded-2xl bg-white border border-brand-brown/10 p-6 shadow-card flex gap-4"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center font-jetbrains text-[10px] text-accent font-bold tracking-widest">
                {step.num}
              </div>
              <div>
                <h3 className="font-inter text-lg font-semibold text-brand-brown mb-2">{t(step.nameKey)}</h3>
                <p className="text-description text-sm leading-relaxed">{t(step.descKey)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </LandingReveal>
  )
}

export default LandingLearningApproach
