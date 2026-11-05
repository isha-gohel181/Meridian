import React from 'react'
import { CERTIFICATE_DEFAULT_IMAGE } from '../constants/brand'
import { useLanguage } from '../context/LanguageContext'

const LandingCertificateSection = () => {
  const { t } = useLanguage()

  return (
    <section className="bg-dark py-20 md:py-28 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-4 order-2 lg:order-1">
          <span className="font-jetbrains text-[10px] text-accent tracking-[0.5em] uppercase font-bold">
            {t('landingCertEyebrow')}
          </span>
          <h2 className="font-newsreader italic text-3xl sm:text-4xl md:text-5xl text-normal font-light">
            {t('landingCertTitle')}
          </h2>
          <p className="font-montserrat text-sm md:text-base text-description leading-relaxed max-w-md">
            {t('landingCertSub')}
          </p>
        </div>
        <div className="order-1 lg:order-2 relative group">
          <div className="absolute -inset-3 bg-accent/10 blur-2xl rounded-2xl opacity-60 group-hover:opacity-90 transition-opacity" />
          <div className="relative bg-white p-1.5 rounded-xl shadow-2xl border border-card-border overflow-hidden">
            <img
              src={CERTIFICATE_DEFAULT_IMAGE}
              alt="32 Pearls Dental Academy certificate of completion"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingCertificateSection
