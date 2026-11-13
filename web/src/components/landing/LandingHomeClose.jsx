import React from 'react'
import { Link } from 'react-router-dom'
import { APP_DISPLAY_NAME } from '../../constants/brand'
import { useLanguage } from '../../context/LanguageContext'
import LandingReveal from './LandingReveal'

const LandingHomeClose = () => {
  const { t } = useLanguage()

  return (
    <LandingReveal className="overflow-x-hidden bg-slate-50 py-16 max-sm:overflow-y-visible sm:overflow-hidden">
      <div className="site-container">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-newsreader text-3xl font-medium tracking-tight text-brand-brown sm:text-4xl">{t('landingCloseTitle')}</h2>
            <p className="mt-3 text-sm leading-relaxed text-description md:text-base">{t('landingCloseFine')}</p>
            <Link
              to="/#contact-cta"
              className="mt-4 inline-block text-sm font-semibold text-brand-brown underline-offset-4 hover:text-accent hover:underline"
            >
              {t('landingCloseContactLink')}
            </Link>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/courses"
              className="inline-flex justify-center rounded-xl bg-brand-brown px-7 py-3.5 font-jetbrains text-xs font-bold uppercase tracking-[0.2em] text-white transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {t('browseCourses')}
            </Link>
          </div>
        </div>

        <div className="mt-14 overflow-x-hidden pt-4 pb-6 sm:overflow-hidden sm:pb-2 sm:pt-6">
          <p
            className="translate-y-1 select-none font-newsreader text-[clamp(2.35rem,12vw,9rem)] font-medium leading-[0.88] tracking-[-0.04em] text-brand-brown/12 sm:translate-y-6 sm:leading-[0.82]"
            aria-hidden
          >
            {APP_DISPLAY_NAME}
          </p>
        </div>
      </div>
    </LandingReveal>
  )
}

export default LandingHomeClose
