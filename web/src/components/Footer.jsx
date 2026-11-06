import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import {
  APP_DISPLAY_NAME,
  LOGO_PATH,
  SUPPORT_EMAIL,
  ABOUT_US_FOOTER_EXCERPT,
  SUPPORT_PHONE_TEL,
  WHATSAPP_URL,
  getSupportEmailDisplay,
  getSupportPhoneDisplay,
  getSupportPhoneAltDisplay,
  getWhatsAppPhoneDisplay,
  SUPPORT_PHONE_ALT_TEL,
  APP_TAGLINE,
  BRAND_TAGLINE_SECONDARY,
} from '../constants/brand'

gsap.registerPlugin(ScrollTrigger)

const SOCIALS = [
  {
    href: 'https://www.facebook.com',
    label: 'Facebook',
    icon: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    href: 'https://x.com',
    label: 'X (Twitter)',
    icon: (
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154H7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298L17.61 20.644z" />
    ),
  },
  {
    href: 'https://www.instagram.com',
    label: 'Instagram',
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    href: 'https://youtube.com',
    label: 'YouTube',
    icon: (
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M10 15V9l6 3z" />
    ),
  },
  {
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
]

const linkClass =
  'text-[13px] text-brand-brown/70 transition-colors duration-200 hover:text-accent'

const Footer = () => {
  const { t } = useLanguage()
  const footerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-reveal', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
        },
        y: 16,
        opacity: 0,
        stagger: 0.06,
        duration: 0.7,
        ease: 'power3.out',
      })
    }, footerRef)

    requestAnimationFrame(() => {
      try {
        ScrollTrigger.refresh()
      } catch {
        /* ignore */
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-slate-50 text-brand-brown select-none"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-brown/20 to-transparent md:inset-x-14"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-7 pt-6 sm:px-8 md:pt-8 lg:px-12">
        <div className="grid gap-10 border-b border-brand-brown/10 pb-9 md:grid-cols-12 md:gap-8 lg:gap-12">
          <div className="footer-reveal md:col-span-5">
            <Link
              to="/"
              className="inline-block transition-opacity hover:opacity-80"
              aria-label={`${APP_DISPLAY_NAME} Home`}
            >
              <img
                alt={APP_DISPLAY_NAME}
                src={LOGO_PATH}
                className="h-11 w-auto max-w-[168px] object-contain md:h-12"
              />
            </Link>
            <p className="mt-4 max-w-sm font-newsreader text-xl italic leading-snug tracking-tight text-brand-brown md:text-[1.4rem]">
              {BRAND_TAGLINE_SECONDARY}
            </p>
            <p className="mt-3 max-w-sm font-newsreader text-sm leading-relaxed text-brand-brown/60">
              {ABOUT_US_FOOTER_EXCERPT}
            </p>
            <ul className="mt-6 space-y-2 font-newsreader text-[13px] text-brand-brown/75">
              <li>
                <a
                  href={`tel:${SUPPORT_PHONE_TEL}`}
                  className="transition-colors duration-200 hover:text-accent"
                >
                  {getSupportPhoneDisplay()}
                </a>
                <span className="px-2 text-brand-brown/25">/</span>
                <a
                  href={`tel:${SUPPORT_PHONE_ALT_TEL}`}
                  className="transition-colors duration-200 hover:text-accent"
                >
                  {getSupportPhoneAltDisplay()}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-accent"
                >
                  WhatsApp · {getWhatsAppPhoneDisplay()}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="break-all transition-colors duration-200 hover:text-accent"
                >
                  {getSupportEmailDisplay()}
                </a>
              </li>
            </ul>
            <p className="mt-4 font-jetbrains text-[9px] uppercase tracking-[0.18em] text-brand-brown/40">
              Mon–Sat · 10:00 AM – 7:00 PM IST
            </p>
          </div>

          <div className="footer-reveal grid grid-cols-2 gap-8 md:col-span-7 md:gap-10">
            <div>
              <p className="mb-4 font-jetbrains text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
                01 — {t('footerEssentialLinks')}
              </p>
              <ul className="space-y-2.5 font-newsreader">
                <li>
                  <Link to="/" className={linkClass}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about-us" className={linkClass}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className={linkClass}>
                    {t('navCourses')}
                  </Link>
                </li>
                <li>
                  <Link to="/news" className={linkClass}>
                    {t('navBlog')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className={linkClass}>
                    {t('navContact')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact#enquiry" className={linkClass}>
                    {t('footerEnquireLink')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-4 font-jetbrains text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
                02 — Policies
              </p>
              <ul className="space-y-2.5 font-newsreader">
                <li>
                  <Link to="/privacy-policy" className={linkClass}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-conditions" className={linkClass}>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/refund-policy" className={linkClass}>
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className={linkClass}>
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-reveal flex flex-col items-start justify-between gap-4 pt-5 sm:flex-row sm:items-center">
          <p className="font-newsreader text-sm text-brand-brown/55">
            © {new Date().getFullYear()} {APP_DISPLAY_NAME}
          </p>
          <div className="flex items-center gap-2">
            {SOCIALS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="flex size-8 items-center justify-center rounded-full border border-brand-brown/12 text-brand-brown/55 transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {item.icon}
                </svg>
              </a>
            ))}
          </div>
          <p className="font-jetbrains text-[10px] uppercase tracking-[0.28em] text-brand-brown/40">
            {APP_TAGLINE}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
