import React from 'react'
import { Link } from 'react-router-dom'
import { APP_DISPLAY_NAME } from '../../constants/brand'
import { useLanguage } from '../../context/LanguageContext'

const LandingHomeClose = () => {
  const { t } = useLanguage()

  return (
    <section className="overflow-hidden border-t border-brand-brown/[0.08] bg-slate-50 px-4 py-16 sm:px-6 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-newsreader text-3xl font-medium tracking-tight text-brand-brown sm:text-4xl">{t('landingCloseTitle')}</h2>
            <p className="mt-3 text-sm leading-relaxed text-description md:text-base">{t('landingCloseFine')}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/contact#enquiry"
              className="inline-flex justify-center rounded-xl bg-brand-brown px-7 py-3.5 font-jetbrains text-xs font-bold uppercase tracking-[0.2em] text-white transition-transform hover:scale-[1.02]"
            >
              {t('enquireNow')}
            </Link>
            <Link
              to="/courses"
              className="inline-flex justify-center rounded-xl border border-brand-brown/25 px-7 py-3.5 font-jetbrains text-xs font-semibold uppercase tracking-[0.15em] text-brand-brown transition-colors hover:bg-brand-brown/5"
            >
              {t('browseCourses')}
            </Link>
          </div>
        </div>

        <div className="mt-14 overflow-hidden border-t border-brand-brown/15 pt-6">
          <p
            className="translate-y-6 select-none font-newsreader text-[clamp(3rem,14vw,9rem)] font-medium leading-[0.82] tracking-[-0.04em] text-brand-brown/12"
            aria-hidden
          >
            {APP_DISPLAY_NAME}
          </p>
        </div>
      </div>
    </section>
  )
}

export default LandingHomeClose
