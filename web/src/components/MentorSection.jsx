import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const badges = [
  'Hands-on clinical workshops',
  'Real-case treatment reviews',
  'Step-by-step mechanics training',
  'Ongoing mentor support',
]

const MentorSection = () => {
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const contentRef = useRef(null)

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
            start: 'top 75%',
          },
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
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C96A1B]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20 space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#C96A1B]/40" />
            <span className="font-jetbrains text-[10px] text-[#C96A1B] tracking-[0.5em] uppercase font-bold">
              Expert Mentorship
            </span>
            <span className="w-8 h-[1px] bg-[#C96A1B]/40" />
          </div>
          <h2 className="font-inter text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-slate-900 leading-[1.1] tracking-[-0.02em] font-light">
            Learn with <span className="font-semibold text-[#C96A1B]">clinical guidance</span> at every step
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            From first records to finishing mechanics—our mentors help you think like a clinician, not just follow a checklist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div ref={cardRef} className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[400px] group">
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#C96A1B]/25 to-amber-200/30 rounded-[2.5rem] blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative rounded-[2rem] overflow-hidden border-2 border-white shadow-2xl aspect-[4/5]">
                <img
                  src="https://images.pexels.com/photos/3845816/pexels-photo-3845816.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Orthodontic mentorship and hands-on training"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/80 shadow-xl">
                  <p className="font-jetbrains text-[10px] font-bold text-[#C96A1B] uppercase tracking-wider">
                    Mentor-led programs
                  </p>
                  <p className="font-montserrat text-lg font-bold text-slate-900 mt-1">
                    Practice-ready orthodontic skills
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div ref={contentRef} className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
            <div className="space-y-3 max-w-2xl text-slate-700">
              <p className="text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                Programs are built around <span className="font-semibold text-[#C96A1B]">live demonstrations</span>, supervised practice, and structured case reviews—so you build judgment alongside technique.
              </p>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
                Whether you are starting your first aligner cases or refining fixed-appliance mechanics, mentors help you anticipate challenges, adjust plans, and communicate clearly with patients.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-jetbrains text-[10px] md:text-xs font-semibold tracking-wide"
                >
                  ✓ {badge}
                </span>
              ))}
            </div>

            <div className="pt-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C96A1B] hover:bg-[#a85614] text-white rounded-xl font-jetbrains text-xs uppercase tracking-[0.2em] font-bold shadow-lg shadow-[#C96A1B]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Talk to our team
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
