import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext'
import growthBannerBg from '../assets/images/growth_banner_bg.jpg'

gsap.registerPlugin(ScrollTrigger)

const GrowthSection = () => {
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Snappy and subtle reveal animation on scroll
      gsap.from('.growth-content > *', {
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 92%',
        },
        y: 16,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power3.out'
      })

      gsap.from('.growth-actions > *', {
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 92%',
        },
        y: 16,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power3.out',
        delay: 0.1
      })
    }, containerRef)

    requestAnimationFrame(() => {
      try { ScrollTrigger.refresh() } catch (e) { }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="w-full bg-slate-50 py-10 md:py-12 pb-14 md:pb-20 px-4 sm:px-6 md:px-10 lg:px-16 overflow-x-hidden select-none"
    >
      <div
        ref={cardRef}
        className="growth-card group max-w-7xl mx-auto rounded-2xl md:rounded-3xl relative overflow-hidden border border-[#682701]/20 shadow-accent-large p-8 sm:p-10 md:p-10 lg:px-12 lg:py-12 min-h-[320px] sm:min-h-[340px] md:min-h-[360px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10"
      >
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={growthBannerBg}
            alt=""
            aria-hidden
            className="w-full h-full object-cover object-center opacity-[0.12] mix-blend-overlay group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#C96A1B] via-[#a85614] to-[#682701]" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.28),transparent_55%)]" />

          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/20 blur-[90px] rounded-full" />
          <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-[#682701]/35 blur-[80px] rounded-full" />

          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        {/* Content Side */}
        <div className="growth-content flex flex-col items-center lg:items-start text-center lg:text-left gap-2 sm:gap-2.5 z-10 max-w-2xl">
          {/* Clean Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/25 backdrop-blur-md border border-white/40 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-jetbrains text-[9px] md:text-[10px] font-semibold tracking-wider text-white uppercase">
              {t('growthBadge')}
            </span>
          </div>

          <h2 className="font-inter text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
            <span>{t('growthHeadline1')} </span>
            <span className="text-white/95">{t('growthHeadline2')}</span>
          </h2>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal max-w-xl">
            {t('growthSub')}
          </p>

          {/* Feature Value Chips with Clean SVG Icons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
            {[
              {
                text: t('growthFeature1'),
                icon: (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M14 10v11M12 3L2 10h20L12 3z" />
                  </svg>
                )
              },
              {
                text: t('growthFeature2'),
                icon: (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                )
              },
              {
                text: t('growthFeature3'),
                icon: (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                )
              },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 border border-white/35 backdrop-blur-sm text-[11px] font-medium text-white transition-colors"
              >
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Side */}
        <div className="growth-actions flex flex-col items-stretch lg:items-end gap-4 z-10 w-full lg:w-auto lg:min-w-[280px] xl:min-w-[320px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 w-full">
            {/* Primary Action Button */}
            <Link
              to="/courses"
              className="w-full min-h-[48px] px-6 py-3.5 md:py-4 bg-white hover:bg-[#FFF9F3] text-accent font-inter font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-black/15 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
            >
              <span>{t('growthCtaPrimary')}</span>
              <svg
                className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </Link>

            {/* Secondary Action Button */}
            <Link
              to="/forum"
              className="w-full min-h-[48px] px-6 py-3.5 md:py-4 bg-white/15 hover:bg-white/25 text-white border border-white/45 hover:border-white/60 font-inter font-semibold text-sm tracking-wide rounded-xl backdrop-blur-md hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg
                className="w-3.5 h-3.5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>{t('growthCtaSecondary')}</span>
            </Link>
          </div>

          {/* Social Proof & Trust Metric */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 pt-0.5 text-white/90 text-[11px]">
            <div className="flex items-center gap-0.5 text-amber-200">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="font-semibold text-white">{t('growthRating')}</span>
            <span className="text-white/50">•</span>
            <span className="text-white font-medium">1,200+ Learners</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GrowthSection
