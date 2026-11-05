import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { LOGO_PATH, WHATSAPP_URL, SUPPORT_PHONE_TEL, getSupportPhoneDisplay } from '../constants/brand'
import { useLanguage } from '../context/LanguageContext'

const whatsAppHref = `${WHATSAPP_URL}?text=${encodeURIComponent('Hello 32 Pearls Dental Academy, I would like to know more about your orthodontic courses.')}`

const Hero = ({ isLoaded = true }) => {
  const { t } = useLanguage()
  const containerRef = useRef(null)
  const illustrationRef = useRef(null)

  useEffect(() => {
    if (isLoaded === false || !illustrationRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(illustrationRef.current, {
        y: -8,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [isLoaded])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[82vh] lg:min-h-[700px] bg-gradient-to-b from-[#FFF9F3] via-[#fdebd5] to-[#FFF9F3] flex items-center pt-32 sm:pt-36 lg:pt-36 pb-16 md:pb-20 lg:pb-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-hidden select-none"
    >
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#C96A1B]/12 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#C96A1B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#682701]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#E89A52]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-6 xl:gap-8">

        <div className="w-full lg:w-[47%] flex flex-col items-start text-left space-y-6 md:space-y-7 order-1 lg:pr-4">

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

        <div
          ref={illustrationRef}
          className="w-full lg:w-[53%] flex items-center justify-center lg:justify-end order-2 mt-6 lg:mt-0 relative"
        >
          <div className="absolute inset-0 bg-[#C96A1B]/15 rounded-full blur-3xl pointer-events-none scale-105 -z-10" />
          <div className="relative w-full max-w-[560px] sm:max-w-[640px] lg:max-w-none flex items-center justify-center lg:justify-end">
            <img
              src={LOGO_PATH}
              alt="32 Pearls Dental Academy"
              className="w-full h-auto max-h-[320px] sm:max-h-[380px] lg:max-h-[420px] object-contain drop-shadow-[0_20px_45px_rgba(104,39,1,0.22)] pointer-events-none select-none transition-transform duration-500 will-change-transform lg:scale-105 origin-center lg:origin-right"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
