import React from 'react'
import { Link } from 'react-router-dom'
import { WHATSAPP_URL, SUPPORT_PHONE_TEL, getSupportPhoneDisplay } from '../constants/brand'
import { useLanguage } from '../context/LanguageContext'

const HERO_BG = '/meridian/hero_bg.png'

const whatsAppHref = `${WHATSAPP_URL}?text=${encodeURIComponent(
  'Hello Meridian Group of Education, I would like to know more about your programs.'
)}`

const Hero = () => {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-[82vh] lg:min-h-[700px] flex items-center pt-32 sm:pt-36 lg:pt-36 pb-16 md:pb-20 lg:pb-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-hidden select-none">
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center lg:object-right"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F8FA]/95 via-[#F5F8FA]/82 to-[#F5F8FA]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/10 via-transparent to-white/25" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/50 to-transparent sm:h-32" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="max-w-2xl flex flex-col items-start text-left space-y-6 md:space-y-7">
          <p className="font-jetbrains text-[10px] text-accent tracking-[0.45em] uppercase font-bold">
            {t('heroEyebrow')}
          </p>

          <div className="space-y-3 md:space-y-4">
            <h1 className="font-newsreader text-3xl sm:text-4xl md:text-5xl lg:text-[3.15rem] text-brand-brown leading-[1.12] tracking-[-0.02em] font-medium">
              {t('heroTitle')}
            </h1>
          </div>

          <p className="max-w-xl text-sm sm:text-base md:text-lg text-description leading-relaxed font-normal">
            {t('heroSubline')}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-start gap-3 pt-2 w-full sm:w-auto">
            <Link
              to="/contact#enquiry"
              className="inline-flex justify-center px-7 py-3.5 bg-brand-brown hover:bg-brand-brown/92 text-white rounded-xl font-jetbrains text-xs uppercase tracking-[0.2em] font-bold shadow-lg shadow-brand-brown/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {t('enquireNow')}
            </Link>
            <div className="flex flex-wrap gap-3">
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-white text-brand-brown border border-brand-brown/20 rounded-xl font-jetbrains text-xs uppercase tracking-[0.15em] font-semibold hover:border-accent hover:text-accent active:scale-[0.98] transition-all shadow-xs flex-1 sm:flex-none"
              >
                {t('landingCtaWhatsApp')}
              </a>
              <a
                href={`tel:${SUPPORT_PHONE_TEL}`}
                className="inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-transparent text-brand-brown border border-brand-brown/25 rounded-xl font-jetbrains text-xs uppercase tracking-[0.15em] font-semibold hover:bg-brand-brown/5 active:scale-[0.98] transition-all flex-1 sm:flex-none"
              >
                {t('callCta')} · {getSupportPhoneDisplay()}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
