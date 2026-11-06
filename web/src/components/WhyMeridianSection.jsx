import React from 'react'
import { useLanguage } from '../context/LanguageContext'

const icons = [
  (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 19h16M6 16l3-8 4 6 3-4 2 6" />
    </svg>
  ),
  (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 15l3-3 2 2 5-5" />
    </svg>
  ),
  (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3v18M3 12h18" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
]

const WhyMeridianSection = () => {
  const { t } = useLanguage()

  const features = [
    { title: t('focus01Title'), desc: t('focus01Desc') },
    { title: t('focus02Title'), desc: t('focus02Desc') },
    { title: t('focus03Title'), desc: t('focus03Desc') },
    { title: t('focus04Title'), desc: t('focus04Desc') },
    { title: t('focus05Title'), desc: t('focus05Desc') },
    { title: t('focus06Title'), desc: t('focus06Desc') },
  ]

  return (
    <section className="relative bg-white py-20 md:py-28 px-4 md:px-8 lg:px-12 border-y border-card-border">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14 space-y-4">
          <span className="font-jetbrains text-[10px] text-accent tracking-[0.5em] uppercase font-bold">
            {t('whyMeridianEyebrow')}
          </span>
          <h2 className="font-newsreader italic text-3xl sm:text-4xl md:text-5xl text-normal font-light">
            {t('whyMeridianTitle')}
          </h2>
          <p className="font-montserrat text-sm md:text-base text-description">{t('whyMeridianSub')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {features.map((f, i) => {
            const Icon = icons[i] || icons[0]
            return (
              <div
                key={f.title}
                className="p-6 rounded-2xl bg-dark/80 border border-card-border hover:border-accent/30 transition-colors"
              >
                <Icon className="w-8 h-8 text-accent mb-4" />
                <h3 className="font-montserrat text-base font-semibold text-normal mb-2">{f.title}</h3>
                <p className="font-montserrat text-sm text-description leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyMeridianSection
