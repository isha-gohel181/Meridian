import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
  const footerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-reveal', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
        },
        y: 20,
        opacity: 0,
        filter: 'blur(6px)',
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out'
      })
    }, footerRef)

    requestAnimationFrame(() => {
      try { ScrollTrigger.refresh() } catch (e) { }
    })

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-gradient-to-b from-[#1878C0] to-[#11598f] text-white border-t border-white/15 overflow-hidden select-none"
    >
      {/* Decorative Ambient Background Soft Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/20 blur-[140px] rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-black/40 blur-[140px] rounded-full" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/15">
          
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="footer-reveal lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity" aria-label="XpertQA.in Home">
              <img
                alt="XpertQA.in"
                className="h-11 md:h-12 w-auto object-contain brightness-0 invert drop-shadow-md"
                src="/logos/osa_logo.png"
              />
            </Link>

            <p className="font-jetbrains text-xs md:text-sm text-white/85 leading-relaxed max-w-sm">
              Empowering aspiring and working professionals with industry-grade software testing, automated QA frameworks, and hands-on project coaching.
            </p>

            <div className="font-jetbrains text-xs text-white/75 pt-1">
              <span className="font-semibold text-white">Business Activity:</span> Computer Programming, Consultancy and Related Services
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="X (Twitter)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154H7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298L17.61 20.644z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M10 15V9l6 3z" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="footer-reveal lg:col-span-2 space-y-4">
            <h4 className="font-montserrat text-xs uppercase tracking-[0.2em] font-bold text-white/95">
              Platform
            </h4>
            <ul className="space-y-2.5 font-jetbrains text-xs">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-white/80 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-white/80 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                  QA Forum
                </Link>
              </li>
              <li>
                <Link to="/gig" className="text-white/80 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                  Work & Gigs
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-white/80 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                  Industry News
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-white/80 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Policy (2 cols) */}
          <div className="footer-reveal lg:col-span-2 space-y-4">
            <h4 className="font-montserrat text-xs uppercase tracking-[0.2em] font-bold text-white/95">
              Policies
            </h4>
            <ul className="space-y-2.5 font-jetbrains text-xs">
              <li>
                <Link to="/privacy-policy" className="text-white/80 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-white/80 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-white/80 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors hover:translate-x-0.5 inline-block">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Registered Office & Contact Info (4 cols) */}
          <div className="footer-reveal lg:col-span-4 space-y-4">
            <h4 className="font-montserrat text-xs uppercase tracking-[0.2em] font-bold text-white/95">
              Registered Office
            </h4>

            <div className="space-y-3 font-jetbrains text-xs text-white/85">
              <div className="flex items-start gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/90 shrink-0 mt-0.5">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p className="leading-relaxed">
                  Flat 74, Green City Apartments, Block 5, Gulmohar Road, Trilanga, Bhopal, Madhya Pradesh – 462039, India
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/90 shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href="tel:+916263384994" className="hover:text-white hover:underline transition-colors">
                  +91 62633 84994
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/90 shrink-0">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a href="mailto:xsmartqa.com@gmail.com" className="hover:text-white hover:underline transition-colors break-all">
                  xsmartqa.com@gmail.com
                </a>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Support: Mon–Sat (10:00 AM – 7:00 PM IST)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright and Tagline */}
        <div className="footer-reveal pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-jetbrains text-xs text-white/75">
          <p className="tracking-wide text-center sm:text-left">
            © {new Date().getFullYear()} XpertQA.in. All rights reserved.
          </p>

          <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 text-center sm:text-right">
            Software Testing & QA Excellence
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
