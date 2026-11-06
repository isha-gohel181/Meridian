import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { WHATSAPP_URL } from '../../constants/brand'
import LandingReveal from './LandingReveal'

const enquireHref = `${WHATSAPP_URL}?text=${encodeURIComponent(
  'Hello Meridian Group of Education, I would like to enquire about your programmes.'
)}`

const HALFTONE_MASK =
  'radial-gradient(ellipse 58% 52% at 50% 46%, transparent 32%, #000 76%)'

const LandingContactCta = () => {
  const { t } = useLanguage()

  return (
    <LandingReveal
      id="contact-cta"
      className="scroll-mt-28 md:scroll-mt-32 bg-slate-50 px-4 pt-16 pb-5 sm:px-6 md:px-10 md:pt-20 md:pb-6 lg:px-14"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-brand-brown text-white shadow-[0_24px_80px_-28px_rgba(3,39,70,0.55)] ring-1 ring-white/10 md:rounded-[2.25rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(216,184,64,0.72) 1.05px, transparent 1.15px)',
            backgroundSize: '5px 5px',
            maskImage: HALFTONE_MASK,
            WebkitMaskImage: HALFTONE_MASK,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.55) 0.7px, transparent 0.85px)',
            backgroundSize: '9px 9px',
            maskImage: HALFTONE_MASK,
            WebkitMaskImage: HALFTONE_MASK,
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[18%] h-72 w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[110px]" />
          <div className="absolute -bottom-24 -left-16 size-[22rem] rounded-full bg-white/[0.06] blur-[90px]" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center sm:px-10 md:px-16 md:py-28">
          <p className="mb-5 font-jetbrains text-[10px] font-bold uppercase tracking-[0.45em] text-accent">
            {t('landingCtaEyebrow')}
          </p>
          <h2 className="mb-6 font-newsreader text-3xl font-medium leading-[1.15] tracking-tight text-white sm:text-4xl md:text-[2.85rem]">
            {t('landingCtaTitle')}
          </h2>
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {t('landingCtaSub')}
          </p>

          <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Link
              to="/contact#enquiry"
              className="inline-flex min-w-[200px] justify-center rounded-xl bg-accent px-8 py-4 font-jetbrains text-xs font-bold uppercase tracking-[0.2em] text-brand-brown shadow-lg shadow-black/20 transition-colors hover:bg-accent-secondary"
            >
              {t('enquireNow')}
            </Link>
            <a
              href={enquireHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-[200px] justify-center rounded-xl border border-white/25 px-8 py-4 font-jetbrains text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-white/10"
            >
              {t('landingCtaWhatsApp')}
            </a>
          </div>
        </div>
      </div>
    </LandingReveal>
  )
}

export default LandingContactCta
