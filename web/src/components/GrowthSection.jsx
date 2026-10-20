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
      className="w-full bg-dark py-6 md:py-8 pb-12 md:pb-16 px-4 sm:px-6 md:px-10 lg:px-16 overflow-x-hidden select-none"
    >
      {/* Sleek Compact CTA Banner Card with Realistic QA Background */}
      <div
        ref={cardRef}
        className="growth-card group max-w-7xl mx-auto rounded-2xl md:rounded-3xl relative overflow-hidden border border-[#1878C0]/35 shadow-[0_15px_35px_-10px_rgba(24,120,192,0.3)] p-6 sm:p-8 md:p-8 lg:px-12 lg:py-7 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8"
      >
        {/* Realistic QA Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={growthBannerBg}
            alt="Quality Assurance and Software Testing Workspace"
            className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Brand-aligned Dark Ocean Blue Overlays for Perfect Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#041627]/95 via-[#072440]/85 to-[#0e4875]/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041627] via-transparent to-[#041627]/50" />

          {/* Ambient Brand Glows */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#1878C0]/30 blur-[80px] rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full" />

          {/* Top & Bottom Accent Borders */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
        </div>

        {/* Content Side */}
        <div className="growth-content flex flex-col items-center lg:items-start text-center lg:text-left gap-2 sm:gap-2.5 z-10 max-w-2xl">
          {/* Clean Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-jetbrains text-[9px] md:text-[10px] font-semibold tracking-wider text-sky-100 uppercase">
              {t('growthBadge')}
            </span>
          </div>

          {/* Main Headline with Highlight */}
          <h2 className="font-inter text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
            <span>{t('growthHeadline1')} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-white to-emerald-200">
              {t('growthHeadline2')}
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed font-normal max-w-xl">
            {t('growthSub')}
          </p>

          {/* Feature Value Chips with Clean SVG Icons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
            {[
              {
                text: t('growthFeature1'),
                icon: (
                  <svg className="w-3 h-3 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M14 10v11M12 3L2 10h20L12 3z" />
                  </svg>
                )
              },
              {
                text: t('growthFeature2'),
                icon: (
                  <svg className="w-3 h-3 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                )
              },
              {
                text: t('growthFeature3'),
                icon: (
                  <svg className="w-3 h-3 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                )
              },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-sm text-[11px] font-medium text-white transition-colors"
              >
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Side */}
        <div className="growth-actions flex flex-col items-center lg:items-end gap-3 z-10 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto">
            {/* Primary Action Button */}
            <Link
              to="/courses"
              className="w-full sm:w-[200px] lg:w-[210px] px-6 py-3 bg-white hover:bg-sky-50 text-[#1878C0] font-inter font-bold text-xs sm:text-sm tracking-wide rounded-xl shadow-lg shadow-black/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
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
              className="w-full sm:w-[200px] lg:w-[210px] px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-white/40 font-inter font-semibold text-xs sm:text-sm tracking-wide rounded-xl backdrop-blur-md hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg
                className="w-3.5 h-3.5 text-sky-200"
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
          <div className="flex items-center gap-2 pt-0.5 text-sky-100/90 text-[11px]">
            <div className="flex items-center gap-0.5 text-amber-300">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="font-semibold text-white">{t('growthRating')}</span>
            <span className="text-white/40">•</span>
            <span className="text-sky-200 font-medium">1,200+ Learners</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GrowthSection
