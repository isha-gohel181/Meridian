import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import LandingReveal from './LandingReveal'

const ITEM_KEYS = [
  { titleKey: 'landingWhy1Title', descKey: 'landingWhy1Desc' },
  { titleKey: 'landingWhy2Title', descKey: 'landingWhy2Desc' },
  { titleKey: 'landingWhy3Title', descKey: 'landingWhy3Desc' },
  { titleKey: 'landingWhy4Title', descKey: 'landingWhy4Desc' },
  { titleKey: 'landingWhy5Title', descKey: 'landingWhy5Desc' },
]

const LandingWhyChoose = () => {
  const { t } = useLanguage()

  return (
    <LandingReveal
      id="why-meridian"
      className="relative scroll-mt-28 overflow-hidden bg-brand-brown px-4 py-20 text-white sm:px-6 md:scroll-mt-32 md:px-10 md:py-28 lg:px-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent md:inset-x-16"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end md:gap-10">
          <div className="md:col-span-7">
            <p className="mb-3 font-jetbrains text-[10px] font-bold uppercase tracking-[0.45em] text-accent">
              {t('landingWhyEyebrow')}
            </p>
            <h2 className="max-w-xl font-newsreader text-3xl font-medium tracking-tight sm:text-4xl md:text-[2.5rem]">
              {t('landingWhyTitle')}
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-white/65 md:col-span-5 md:justify-self-end md:text-lg md:text-right">
            {t('landingWhySub')}
          </p>
        </div>

        <ol className="border-t border-white/10">
          {ITEM_KEYS.map((item, index) => (
            <li
              key={item.titleKey}
              className="group grid gap-3 border-b border-white/10 py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10"
            >
              <span
                aria-hidden
                className="font-newsreader text-[clamp(3.25rem,8vw,5rem)] font-medium leading-none text-transparent transition-colors duration-300 group-hover:text-accent md:col-span-2"
                style={{ WebkitTextStroke: '1px rgba(216, 184, 64, 0.55)' }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-newsreader text-2xl font-medium tracking-tight text-white transition-colors duration-300 group-hover:text-accent md:col-span-4 md:text-[1.65rem]">
                {t(item.titleKey)}
              </h3>
              <p className="text-sm leading-relaxed text-white/70 md:col-span-6 md:text-[15px] md:leading-relaxed">
                {t(item.descKey)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </LandingReveal>
  )
}

export default LandingWhyChoose
