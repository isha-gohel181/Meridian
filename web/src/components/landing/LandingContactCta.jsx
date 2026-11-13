import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { getWhatsAppEnquiryUrl } from '../../constants/brand'
import LandingReveal from './LandingReveal'

const HALFTONE_MASK =
  'radial-gradient(ellipse 58% 52% at 50% 46%, transparent 32%, #000 76%)'

const btnFocus =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-brown'

const LandingContactCta = () => {
  const { t } = useLanguage()
  const whatsappHref = getWhatsAppEnquiryUrl()

  return (
    <LandingReveal
      id="contact-cta"
      className="scroll-mt-28 bg-slate-50 pt-16 pb-12 md:scroll-mt-32 md:pt-20 md:pb-16"
    >
      <div className="site-container site-container--flush max-md:px-3 md:px-[var(--site-gutter)]">
        <div className="relative overflow-hidden rounded-2xl bg-brand-brown text-white shadow-[0_24px_80px_-28px_rgba(3,39,70,0.55)] ring-1 ring-white/10 md:rounded-[2.25rem]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden opacity-40"
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
            className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.22]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.55) 0.7px, transparent 0.85px)',
              backgroundSize: '9px 9px',
              maskImage: HALFTONE_MASK,
              WebkitMaskImage: HALFTONE_MASK,
            }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-[18%] h-72 w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[110px]" />
            <div className="absolute -bottom-24 -left-16 size-[22rem] rounded-full bg-white/[0.06] blur-[90px]" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
          />

          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 py-14 text-center sm:px-10 md:px-16 md:py-28">
            <p className="mb-5 font-jetbrains text-[10px] font-bold uppercase tracking-[0.45em] text-accent">
              {t('landingCtaEyebrow')}
            </p>
            <h2 className="mb-6 text-balance font-newsreader text-[1.65rem] font-medium leading-snug tracking-tight text-white sm:text-4xl md:text-[2.85rem] md:leading-[1.15]">
              {t('landingCtaTitle')}
            </h2>
            <p className="mb-10 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              {t('landingCtaSub')}
            </p>

            <div className="flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
              <Link
                to="/contact#enquiry"
                className={`inline-flex w-full justify-center rounded-xl bg-accent px-6 py-4 font-jetbrains text-xs font-bold uppercase tracking-[0.2em] text-brand-brown transition-colors hover:bg-accent-secondary sm:min-w-[200px] sm:w-auto sm:px-8 ${btnFocus}`}
                aria-label={`${t('enquireNow')} — open the enquiry form on the contact page`}
              >
                {t('enquireNow')}
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex w-full justify-center rounded-xl border border-white/25 px-5 py-4 text-center font-jetbrains text-xs font-semibold uppercase leading-snug tracking-[0.12em] text-white transition-colors hover:bg-white/10 sm:min-w-[200px] sm:w-auto sm:px-8 sm:tracking-[0.15em] ${btnFocus}`}
                aria-label={`${t('landingCtaWhatsApp')} — opens WhatsApp in a new tab`}
              >
                {t('landingCtaWhatsApp')}
              </a>
            </div>

            <p className="mt-6 text-sm text-white/65">{t('landingCtaSupportHint')}</p>
          </div>
        </div>
      </div>
    </LandingReveal>
  )
}

export default LandingContactCta
