import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import LandingReveal from './LandingReveal'

const LandingMissionVision = () => {
  const { t } = useLanguage()

  return (
    <LandingReveal className="py-20 md:py-28 px-4 sm:px-6 lg:px-12 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 md:gap-0 rounded-3xl overflow-hidden border border-brand-brown/[0.1] shadow-card bg-white">
          <div className="p-10 md:p-14 md:border-r border-brand-brown/[0.08] relative">
            <div className="absolute top-8 right-8 w-24 h-24 border border-accent/25 rounded-full opacity-40 pointer-events-none" />
            <p className="font-jetbrains text-[10px] text-accent tracking-[0.4em] uppercase font-bold mb-4">{t('landingMissionLabel')}</p>
            <h2 className="font-newsreader text-2xl md:text-3xl text-brand-brown font-medium mb-6 leading-tight">{t('landingMissionHeading')}</h2>
            <p className="text-description leading-relaxed text-base md:text-[17px]">{t('landingMissionBody')}</p>
          </div>
          <div className="p-10 md:p-14 bg-gradient-to-br from-brand-brown/[0.03] to-slate-50/80 relative">
            <div className="absolute bottom-8 left-8 w-32 h-1 bg-accent/40 rounded-full" />
            <p className="font-jetbrains text-[10px] text-accent tracking-[0.4em] uppercase font-bold mb-4">{t('landingVisionLabel')}</p>
            <h2 className="font-newsreader text-2xl md:text-3xl text-brand-brown font-medium mb-6 leading-tight">{t('landingVisionHeading')}</h2>
            <p className="text-description leading-relaxed text-base md:text-[17px]">{t('landingVisionBody')}</p>
          </div>
        </div>
      </div>
    </LandingReveal>
  )
}

export default LandingMissionVision
