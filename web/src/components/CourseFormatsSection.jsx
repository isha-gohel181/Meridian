import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const FormatCard = ({ title, desc, icon, ctaLabel }) => (
  <div className="group relative bg-white border border-card-border rounded-2xl p-6 md:p-8 shadow-sm hover:border-accent/35 hover:shadow-md transition-all duration-300">
    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-accent mb-5">
      {icon}
    </div>
    <h3 className="font-newsreader italic text-2xl text-normal font-light mb-3">{title}</h3>
    <p className="font-montserrat text-sm text-description leading-relaxed mb-6">{desc}</p>
    <Link
      to="/courses"
      className="inline-flex items-center gap-2 font-jetbrains text-[10px] uppercase tracking-[0.2em] font-bold text-accent group-hover:gap-3 transition-all"
    >
      {ctaLabel}
      <span aria-hidden>→</span>
    </Link>
  </div>
)

const CourseFormatsSection = () => {
  const { t } = useLanguage()

  const formats = [
    {
      title: t('formatLiveTitle'),
      desc: t('formatLiveDesc'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      title: t('formatRecordedTitle'),
      desc: t('formatRecordedDesc'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M8 10l6 4-6 4V10z" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      title: t('formatOfflineTitle'),
      desc: t('formatOfflineDesc'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3L2 9l10 6 10-6-10-6z" />
          <path d="M2 15l10 6 10-6" />
        </svg>
      ),
    },
  ]

  return (
    <section className="relative bg-dark py-20 md:py-28 px-4 md:px-8 lg:px-12 overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/8 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-accent/40" />
            <span className="font-jetbrains text-[10px] text-accent tracking-[0.5em] uppercase font-bold">
              {t('formatsEyebrow')}
            </span>
            <span className="w-8 h-[1px] bg-accent/40" />
          </div>
          <h2 className="font-newsreader italic text-3xl sm:text-4xl md:text-5xl text-normal font-light tracking-tight">
            {t('formatsTitle')}
          </h2>
          <p className="font-montserrat text-sm md:text-base text-description">{t('formatsSub')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {formats.map((f) => (
            <FormatCard key={f.title} title={f.title} desc={f.desc} icon={f.icon} ctaLabel={t('viewCourses')} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CourseFormatsSection
