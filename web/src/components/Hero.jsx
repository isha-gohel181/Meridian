import React from 'react'
import { WHATSAPP_URL, SUPPORT_PHONE_TEL, getSupportPhoneDisplay } from '../constants/brand'
import { useLanguage } from '../context/LanguageContext'

const HERO_BG = '/dental_acadmy/hero_bg.png'

const whatsAppHref = `${WHATSAPP_URL}?text=${encodeURIComponent('Hello 32 Pearls Dental Academy, I would like to know more about your orthodontic courses.')}`

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
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF9F3]/92 via-[#FFF9F3]/75 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/40 to-transparent sm:h-36" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="max-w-2xl flex flex-col items-start text-left space-y-6 md:space-y-7">
          <p className="font-jetbrains text-[10px] text-accent tracking-[0.45em] uppercase font-bold">
            {t('heroEyebrow')}
          </p>

          <div className="space-y-2 md:space-y-3">
            <h1 className="font-inter text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-normal leading-[1.1] tracking-[-0.02em] font-light">
              {t('heroTitle')}{' '}
              <span className="font-semibold text-accent">{t('heroTitleAccent')}</span>
            </h1>
          </div>

          <p className="max-w-xl text-sm sm:text-base md:text-lg text-description leading-relaxed font-normal">
            {t('heroSubline')}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-start gap-3 pt-2 w-full sm:w-auto">
            <a
              href="#courses"
              className="inline-flex justify-center px-7 py-3.5 bg-accent hover:bg-amber-600 text-white rounded-xl font-jetbrains text-xs uppercase tracking-[0.2em] font-bold shadow-lg shadow-accent-soft hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {t('browseCourses')}
            </a>
            <div className="flex flex-wrap gap-3">
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-white text-accent border border-accent rounded-xl font-jetbrains text-xs uppercase tracking-[0.15em] font-semibold hover:bg-accent hover:text-white active:scale-[0.98] transition-all shadow-xs flex-1 sm:flex-none"
              >
                {t('whatsAppCta')}
              </a>
              <a
                href={`tel:${SUPPORT_PHONE_TEL}`}
                className="inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-brand-brown/5 text-brand-brown border border-brand-brown/20 rounded-xl font-jetbrains text-xs uppercase tracking-[0.15em] font-semibold hover:bg-brand-brown hover:text-white active:scale-[0.98] transition-all flex-1 sm:flex-none"
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
