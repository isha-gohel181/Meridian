import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import LandingReveal from './LandingReveal'

const LandingWhatWeOffer = () => {
  const { t } = useLanguage()

  const rows = [
    { titleKey: 'landingOffer1Title', descKey: 'landingOffer1Desc', accent: 'border-l-accent' },
    { titleKey: 'landingOffer2Title', descKey: 'landingOffer2Desc', accent: 'border-l-brand-brown' },
    { titleKey: 'landingOffer3Title', descKey: 'landingOffer3Desc', accent: 'border-l-accent' },
    { titleKey: 'landingOffer4Title', descKey: 'landingOffer4Desc', accent: 'border-l-brand-brown' },
  ]

  return (
    <LandingReveal
      id="what-we-offer"
      className="scroll-mt-28 md:scroll-mt-32 py-20 md:py-28 px-4 sm:px-6 lg:px-12 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-14 md:mb-20">
          <p className="font-jetbrains text-[10px] text-accent tracking-[0.45em] uppercase font-bold mb-3">
            {t('landingOfferEyebrow')}
          </p>
          <h2 className="font-newsreader text-3xl sm:text-4xl md:text-[2.5rem] text-brand-brown font-medium tracking-tight">
            {t('landingOfferTitle')}
          </h2>
          <p className="mt-4 text-description text-base md:text-lg leading-relaxed">{t('landingOfferSub')}</p>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {[rows[0], rows[1]].map((row) => (
              <article
                key={row.titleKey}
                className={`group rounded-2xl bg-slate-50 border border-brand-brown/[0.08] p-8 md:p-10 border-l-4 ${row.accent} shadow-card hover:shadow-lg transition-shadow duration-300`}
              >
                <h3 className="font-inter text-xl md:text-2xl text-brand-brown font-semibold tracking-tight mb-3">
                  {t(row.titleKey)}
                </h3>
                <p className="text-description leading-relaxed text-[15px] md:text-base">{t(row.descKey)}</p>
              </article>
            ))}
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-brand-brown text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-brown via-brand-brown to-[#021a2e] opacity-95" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 md:border-r border-white/10">
                <h3 className="font-inter text-xl md:text-2xl font-semibold mb-3 text-accent">{t(rows[2].titleKey)}</h3>
                <p className="text-white/85 leading-relaxed text-[15px] md:text-base">{t(rows[2].descKey)}</p>
              </div>
              <div className="p-8 md:p-12 bg-white/[0.04]">
                <h3 className="font-inter text-xl md:text-2xl font-semibold mb-3 text-accent">{t(rows[3].titleKey)}</h3>
                <p className="text-white/85 leading-relaxed text-[15px] md:text-base">{t(rows[3].descKey)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingReveal>
  )
}

export default LandingWhatWeOffer
