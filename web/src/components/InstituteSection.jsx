import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ABOUT_US_PARAGRAPH } from '../constants/brand'

gsap.registerPlugin(ScrollTrigger)

const taught = [
  'Diagnosis & case selection',
  'Treatment planning & staging',
  'Fixed appliance mechanics',
  'Aligner therapy fundamentals',
  'Hands-on clinical workshops',
  'Mentor-led case discussions',
]

const InstituteSection = () => {
  const containerRef = useRef(null)
  const bannerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = [bannerRef.current, contentRef.current].filter(Boolean)
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
      className="relative w-full bg-slate-50 py-20 md:py-28 px-4 md:px-8 lg:px-12 overflow-hidden select-none"
    >
      {/* Subtle ambient accents */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#D8B840]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* One Side: Banner */}
        <div ref={bannerRef} className="order-2 lg:order-2">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl group">
            <img
              src="https://images.pexels.com/photos/3862599/pexels-photo-3862599.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Meridian Group of Education — learning institute"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/30 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Other Side: Institute Details */}
        <div ref={contentRef} className="order-1 lg:order-1 flex flex-col items-start space-y-6 text-left">

          {/* Overline */}
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#D8B840]/40" />
            <span className="font-jetbrains text-[10px] text-[#D8B840] tracking-[0.5em] uppercase font-bold">
              About the Institute
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-inter text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-[1.1] tracking-[-0.02em] font-light">
            A specialist institute for <span className="font-semibold text-accent">quality education</span>
          </h2>

          {/* Description */}
          <div className="space-y-3 max-w-2xl text-slate-700">
            <p className="text-sm sm:text-base md:text-lg leading-relaxed font-normal">
              {ABOUT_US_PARAGRAPH}
            </p>
          </div>

          {/* What We Teach */}
          <div className="w-full space-y-3 pt-1">
            <span className="font-jetbrains text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">
              What We Teach
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {taught.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-slate-800 font-jetbrains text-[11px] md:text-xs font-semibold">
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#D8B840]/10 text-[#D8B840] shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA → Courses */}
          <div className="pt-3">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#D8B840] hover:bg-[#1464a0] text-white rounded-xl font-jetbrains text-xs uppercase tracking-[0.2em] font-bold shadow-lg shadow-[#D8B840]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Explore All Courses
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </Link>
          </div>

        </div>

      </div>
    </section>
  )
}

export default InstituteSection
