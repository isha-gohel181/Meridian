import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const badges = [
  'Banking-Domain Knowledge',
  'Hands-on Testing & Automation',
  'Large-Scale UAT & Migration',
  'Second Innings in QA'
]

const enterprises = ['DBS Bank', 'ANZ Bank', 'Citi', 'Nucleus Software']

const MentorSection = () => {
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const contentRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = [cardRef.current, contentRef.current].filter(Boolean)

      gsap.set(els, { autoAlpha: 0, y: 30 })
      if (els.length > 0) {
        gsap.to(els, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%'
          }
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-white py-20 md:py-28 px-4 md:px-8 lg:px-12 overflow-hidden select-none"
    >
      {/* Subtle ambient accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#1878C0]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20 space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#1878C0]/40" />
            <span className="font-jetbrains text-[10px] text-[#1878C0] tracking-[0.5em] uppercase font-bold">
              Meet Your Mentor
            </span>
            <span className="w-8 h-[1px] bg-[#1878C0]/40" />
          </div>
          <h2 className="font-inter text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-slate-900 leading-[1.1] tracking-[-0.02em] font-light">
            Learn from <span className="font-semibold text-[#1878C0]">Industry Leadership</span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Two and a half decades of real-world QA and banking technology experience, distilled into practical mentorship.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left: Mentor Portrait Card */}
          <div ref={cardRef} className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[430px] group">

              {/* Ambient glow */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#1878C0]/30 via-sky-300/30 to-indigo-200/20 rounded-[2.5rem] blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Portrait Frame Card */}
              <div className="relative rounded-[2rem] overflow-hidden bg-white/70 backdrop-blur-xl border-2 border-white shadow-2xl p-3 pb-4">

                {/* Verified Pill Badge */}
                <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-md backdrop-blur-md">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#1878C0" className="shrink-0">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className="font-jetbrains text-[10px] font-bold text-slate-800 tracking-wider uppercase">
                    Verified Mentor
                  </span>
                </div>

                {/* Experience Badge */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1878C0] text-white shadow-md backdrop-blur-md">
                  <span className="text-[10px] font-bold font-jetbrains tracking-wider uppercase">
                    ⭐ 25+ Yrs QA Lead
                  </span>
                </div>

                {/* Main Image Frame */}
                <div className="relative rounded-[1.5rem] overflow-hidden aspect-[3/4] bg-slate-100">
                  <img
                    ref={imageRef}
                    src="/manoj_saxena.jpeg"
                    alt="Manoj Saxena - Senior QA & Banking Technology Specialist"
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent pointer-events-none" />

                  {/* Floating Bottom Card */}
                  <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/80 shadow-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-montserrat text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                        Manoj Saxena
                      </h3>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Active Mentorship" />
                    </div>
                    <p className="font-jetbrains text-[11px] font-bold text-[#1878C0] uppercase tracking-wider">
                      Senior QA Leader & Banking Tech Specialist
                    </p>
                    <p className="font-jetbrains text-[10px] text-slate-600 line-clamp-1 pt-0.5">
                      Ex-DBS • ANZ • Citi • Nucleus Software | APAC & India
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right: Extra Details */}
          <div ref={contentRef} className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">

            {/* Bio */}
            <div className="space-y-3 max-w-2xl text-slate-700">
              <p className="text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                Mentored by <strong className="font-bold text-slate-900">Manoj Saxena</strong> — a senior QA professional with <span className="font-semibold text-[#1878C0]">25+ years of industry leadership</span> across Software Testing, Quality Assurance, and Banking Technology.
              </p>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
                Having spearheaded large-scale testing, UAT, migration, automation, and QA transformations across India and APAC for top financial institutions including <strong className="font-semibold text-slate-800">DBS, ANZ, Citi, and Nucleus Software</strong>, Manoj bridges deep banking-domain knowledge with hands-on QA leadership.
              </p>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
                Empowering the next generation of testers with practical, industry-relevant testing skills — and helping domain professionals build their <strong className="font-semibold text-slate-900">second innings in QA and software testing</strong>.
              </p>
            </div>

            {/* Core Strengths Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-jetbrains text-[10px] md:text-xs font-semibold tracking-wide"
                >
                  ✓ {badge}
                </span>
              ))}
            </div>

            {/* Enterprise Experience Trust Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-slate-600 font-jetbrains text-[11px]">
              <span className="uppercase tracking-wider font-semibold text-slate-500">
                Enterprise Experience:
              </span>
              <div className="flex flex-wrap items-center gap-2 font-bold text-slate-800">
                {enterprises.map((org) => (
                  <span key={org} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md">
                    {org}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1878C0] hover:bg-[#1464a0] text-white rounded-xl font-jetbrains text-xs uppercase tracking-[0.2em] font-bold shadow-lg shadow-[#1878C0]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Connect with Manoj
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

export default MentorSection
