import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { LOGO_PATH } from '../constants/brand'

const Hero = ({ isLoaded = true }) => {
  const containerRef = useRef(null)
  const headingRef = useRef(null)
  const descRef = useRef(null)
  const ctaRef = useRef(null)
  const illustrationRef = useRef(null)

  useEffect(() => {
    if (isLoaded === false) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 1.1 }
      })

      const textEls = [
        headingRef.current,
        descRef.current,
        ctaRef.current
      ].filter(Boolean)

      if (textEls.length > 0) {
        tl.fromTo(textEls,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, duration: 1 },
          0.1
        )
      }

      if (illustrationRef.current) {
        tl.fromTo(illustrationRef.current,
          { y: 35, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
          0.2
        )

        // Subtle continuous floating motion for an alive, premium SaaS feel
        gsap.to(illustrationRef.current, {
          y: -8,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.4
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [isLoaded])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[82vh] lg:min-h-[700px] bg-gradient-to-b from-[#FFF9F3] via-[#fdebd5] to-[#FFF9F3] flex items-center pt-32 sm:pt-36 lg:pt-36 pb-16 md:pb-20 lg:pb-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-hidden select-none"
    >
      {/* Warm brand ambient glow (no sky blue) */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#C96A1B]/12 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#C96A1B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#682701]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#E89A52]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Two-Column Layout Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-6 xl:gap-8">

        {/* Left Column (47%): All existing hero content, aligned to the left */}
        <div className="w-full lg:w-[47%] flex flex-col items-start text-left space-y-6 md:space-y-7 order-1 lg:pr-4">

          {/* Main Title */}
          <div ref={headingRef} className="space-y-2 md:space-y-3">
            <h1 className="font-inter text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-slate-900 leading-[1.1] tracking-[-0.02em] font-light">
              Advance your practice with{' '}
              <span className="font-semibold text-[#C96A1B]">clinical orthodontic training</span>
            </h1>
          </div>

          {/* Short Subtitle */}
          <p
            ref={descRef}
            className="max-w-xl text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal"
          >
            Diagnose, plan, and manage orthodontic cases with confidence—through hands-on workshops, real-case discussions, and continuous mentor guidance at <strong className="font-semibold text-slate-900">32 Pearls Dental Academy</strong>.
          </p>

          {/* Call to Actions */}
          <div ref={ctaRef} className="flex flex-wrap items-center justify-start gap-4 pt-2">
            <Link
              to="/courses"
              className="px-7 py-3.5 bg-accent hover:bg-[#a85614] text-white rounded-xl font-jetbrains text-xs uppercase tracking-[0.2em] font-bold shadow-lg shadow-accent-soft hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Explore Courses
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-white text-accent border border-accent rounded-xl font-jetbrains text-xs uppercase tracking-[0.2em] font-semibold hover:bg-accent hover:text-white active:scale-[0.98] transition-all shadow-xs"
            >
              Contact Us
            </Link>
          </div>

        </div>

        {/* Right Column: brand logo visual */}
        <div
          ref={illustrationRef}
          className="w-full lg:w-[53%] flex items-center justify-center lg:justify-end order-2 mt-6 lg:mt-0 relative"
        >
          {/* Ambient soft glow aura behind illustration */}
          <div className="absolute inset-0 bg-[#C96A1B]/15 rounded-full blur-3xl pointer-events-none scale-105 -z-10" />

          {/* Pure transparent QA testing illustration - prominent, balanced sizing */}
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
