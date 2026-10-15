import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

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
      className="relative min-h-[82vh] lg:min-h-[700px] bg-gradient-to-b from-[#a9cdea] via-[#d7e9f9] to-[#eef7fe] flex items-center pt-32 sm:pt-36 lg:pt-36 pb-16 md:pb-20 lg:pb-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-hidden select-none"
    >
      {/* Decorative ambient backdrop lights */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#1878C0]/15 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-sky-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#1878C0]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#1878C0]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Two-Column Layout Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-6 xl:gap-8">

        {/* Left Column (47%): All existing hero content, aligned to the left */}
        <div className="w-full lg:w-[47%] flex flex-col items-start text-left space-y-6 md:space-y-7 order-1 lg:pr-4">

          {/* Main Title */}
          <div ref={headingRef} className="space-y-2 md:space-y-3">
            <h1
              className="font-newsreader text-3xl sm:text-4xl md:text-5xl lg:text-[2.9rem] xl:text-[3.4rem] text-slate-900 leading-[1.08] tracking-[-0.01em] font-light"
            >
              Master Software Testing <br className="hidden sm:inline" />
              &amp; Quality Assurance
            </h1>
            <h2
              className="font-newsreader text-2xl sm:text-3xl md:text-4xl lg:text-[2.3rem] xl:text-[2.7rem] leading-[1.12] tracking-[-0.01em] font-light"
            >
              <span className="text-[#1878C0]">with real-world</span>{' '}
              <span className="text-slate-900">Banking Tech Leadership</span>
            </h2>
          </div>

          {/* Short Subtitle */}
          <p
            ref={descRef}
            className="max-w-xl text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal"
          >
            Learn from <strong className="font-semibold text-slate-900">Manoj Saxena</strong> — a senior QA leader with 25+ years of experience across Software Testing, Quality Assurance, and Banking Technology.
          </p>

          {/* Call to Actions */}
          <div ref={ctaRef} className="flex flex-wrap items-center justify-start gap-4 pt-2">
            <Link
              to="/courses"
              className="px-7 py-3.5 bg-[#1878C0] hover:bg-[#1464a0] text-white rounded-xl font-jetbrains text-xs uppercase tracking-[0.2em] font-bold shadow-lg shadow-[#1878C0]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Explore QA Programs
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-white text-accent border border-accent rounded-xl font-jetbrains text-xs uppercase tracking-[0.2em] font-semibold hover:bg-accent hover:text-white active:scale-[0.98] transition-all shadow-xs"
            >
              Book Consultation
            </Link>
          </div>

        </div>

        {/* Right Column (53%): High-quality QA Software Testing Illustration - scaled up to balance left text */}
        <div
          ref={illustrationRef}
          className="w-full lg:w-[53%] flex items-center justify-center lg:justify-end order-2 mt-6 lg:mt-0 relative"
        >
          {/* Ambient soft glow aura behind illustration */}
          <div className="absolute inset-0 bg-[#1878C0]/15 rounded-full blur-3xl pointer-events-none scale-105 -z-10" />

          {/* Pure transparent QA testing illustration - prominent, balanced sizing */}
          <div className="relative w-full max-w-[560px] sm:max-w-[640px] lg:max-w-none flex items-center justify-center lg:justify-end">
            <img
              src="/xpertQa.in/Young Man Testing Software on Laptop.png"
              alt="Young Man Testing Software on Laptop"
              className="w-full h-auto max-h-[460px] sm:max-h-[520px] lg:max-h-[580px] xl:max-h-[660px] 2xl:max-h-[720px] object-contain drop-shadow-[0_16px_36px_rgba(24,120,192,0.15)] pointer-events-none select-none transition-transform duration-500 will-change-transform lg:scale-110 xl:scale-120 2xl:scale-125 origin-center lg:origin-right"
              loading="eager"
            />
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero
