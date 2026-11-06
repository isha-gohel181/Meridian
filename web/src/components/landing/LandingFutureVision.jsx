import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { MERIDIAN_FUTURE_DIVISIONS } from '../../constants/meridianLanding'

const LandingFutureVision = () => {
  const { t } = useLanguage()

  return (
    <section id="future" className="scroll-mt-28 md:scroll-mt-32 py-20 md:py-28 px-4 sm:px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-12 md:mb-16">
          <p className="font-jetbrains text-[10px] text-accent tracking-[0.45em] uppercase font-bold mb-3">{t('landingFutureEyebrow')}</p>
          <h2 className="font-newsreader text-3xl sm:text-4xl md:text-[2.5rem] text-brand-brown font-medium tracking-tight mb-4">
            {t('landingFutureTitle')}
          </h2>
          <p className="text-description text-base md:text-lg leading-relaxed mb-3">{t('landingFutureIntro')}</p>
          <p className="inline-flex items-center gap-2 font-jetbrains text-[11px] uppercase tracking-[0.15em] text-accent font-bold border border-accent/35 bg-accent/5 px-3 py-1.5 rounded-lg">
            {t('landingFutureBadge')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {MERIDIAN_FUTURE_DIVISIONS.map((name) => (
            <div
              key={name}
              className="group rounded-2xl border border-brand-brown/10 bg-slate-50 px-6 py-5 md:px-8 md:py-6 flex items-start gap-4 hover:border-accent/40 hover:bg-white transition-colors duration-300"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent group-hover:scale-125 transition-transform" />
              <div>
                <p className="font-inter text-base md:text-lg font-semibold text-brand-brown leading-snug">{name}</p>
                <p className="font-jetbrains text-[10px] text-description uppercase tracking-wider mt-1">{t('landingFutureItemTag')}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 md:mt-12 text-description text-sm md:text-base leading-relaxed max-w-3xl border-l-2 border-accent/50 pl-6">
          {t('landingFutureNote')}
        </p>
      </div>
    </section>
  )
}

export default LandingFutureVision
