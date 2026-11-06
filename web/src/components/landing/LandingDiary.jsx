import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import LandingReveal from './LandingReveal'
import { DIARY_FEATURED, DIARY_NEWS, DIARY_UPCOMING } from '../../data/landingDiaryItems'

const Chip = ({ children }) => (
  <span className="inline-flex font-jetbrains text-[9px] font-bold uppercase tracking-[0.28em] text-accent">
    {children}
  </span>
)

const LandingDiary = () => {
  const { t } = useLanguage()

  return (
    <LandingReveal
      id="diary"
      className="scroll-mt-28 border-y border-brand-brown/[0.06] bg-white px-4 py-20 sm:px-6 md:scroll-mt-32 md:px-10 md:py-28 lg:px-14"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 font-jetbrains text-[10px] font-bold uppercase tracking-[0.45em] text-accent">
              {t('landingDiaryEyebrow')}
            </p>
            <h2 className="font-newsreader text-3xl font-medium tracking-tight text-brand-brown sm:text-4xl md:text-[2.5rem]">
              {t('landingDiaryTitle')}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-description md:text-lg">{t('landingDiarySub')}</p>
          </div>
          <Link
            to="/news"
            className="inline-flex shrink-0 items-center font-jetbrains text-[10px] font-bold uppercase tracking-[0.28em] text-brand-brown transition-colors hover:text-accent"
          >
            {t('landingDiaryViewAll')}
            <span aria-hidden className="ml-2">
              →
            </span>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-12 md:gap-5">
          <Link
            to={`/news/${DIARY_FEATURED.slug}`}
            className="group relative min-h-[22rem] overflow-hidden rounded-2xl bg-brand-brown text-white shadow-[0_24px_80px_-28px_rgba(3,39,70,0.45)] transition-shadow duration-300 hover:shadow-[0_28px_90px_-24px_rgba(3,39,70,0.55)] md:col-span-7 md:min-h-[26rem]"
          >
            <img
              src={DIARY_FEATURED.image}
              alt={DIARY_FEATURED.alt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-brand-brown via-brand-brown/70 to-brand-brown/15"
            />
            <div className="relative z-10 flex h-full min-h-[22rem] flex-col justify-end p-7 md:min-h-[26rem] md:p-9">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-10">
                <div className="flex shrink-0 flex-col items-start">
                  <span className="font-jetbrains text-[10px] font-bold uppercase tracking-[0.35em] text-accent">
                    {DIARY_FEATURED.month}
                  </span>
                  <span className="font-newsreader text-5xl font-medium leading-none tracking-tight md:text-6xl">
                    {DIARY_FEATURED.day}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <Chip>{t('landingDiaryEvent')}</Chip>
                  <h3 className="mt-3 font-newsreader text-2xl font-medium leading-tight tracking-tight transition-colors group-hover:text-accent md:text-[1.85rem]">
                    {DIARY_FEATURED.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 md:text-[15px]">{DIARY_FEATURED.blurb}</p>
                  <p className="mt-5 font-jetbrains text-[10px] uppercase tracking-[0.22em] text-white/60">
                    {DIARY_FEATURED.meta}
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <div className="grid gap-4 md:col-span-5">
            {DIARY_NEWS.map((item) => (
              <Link
                key={item.slug}
                to={`/news/${item.slug}`}
                className="group flex min-h-[11.5rem] overflow-hidden rounded-2xl border border-brand-brown/[0.08] bg-slate-50 transition-all duration-300 hover:border-accent/40 hover:shadow-card"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-[7.5rem] shrink-0 object-cover transition-transform duration-700 group-hover:scale-105 sm:w-40 md:w-[9.5rem]"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-center p-5 md:p-6">
                  <Chip>{t('landingDiaryNews')}</Chip>
                  <h3 className="mt-2 font-newsreader text-lg font-medium tracking-tight text-brand-brown transition-colors group-hover:text-accent md:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-description">{item.blurb}</p>
                  <p className="mt-3 font-jetbrains text-[10px] uppercase tracking-[0.22em] text-brand-brown/45">{item.meta}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <ul className="mt-4 divide-y divide-brand-brown/10 overflow-hidden rounded-2xl border border-brand-brown/[0.08] bg-slate-50 md:mt-5">
          {DIARY_UPCOMING.map((item) => (
            <li key={item.slug}>
              <Link
                to={`/news/${item.slug}`}
                className="group flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-white sm:flex-row sm:items-start sm:gap-6 md:px-6"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="font-jetbrains text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
                      {t('landingDiaryEvent')}
                    </span>
                    <span className="font-newsreader text-lg font-medium text-brand-brown">
                      {item.day} {item.month}
                    </span>
                    <span className="min-w-0 flex-1 font-newsreader text-lg text-brand-brown transition-colors group-hover:text-accent">
                      {item.title}
                    </span>
                    <span className="font-jetbrains text-[10px] uppercase tracking-[0.2em] text-description">{item.meta}</span>
                  </div>
                  <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-description">{item.blurb}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </LandingReveal>
  )
}

export default LandingDiary
