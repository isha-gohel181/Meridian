import React from 'react'
import { Link } from 'react-router-dom'
import { TRAINING_IMAGES } from '../constants/trainingImages'
import { useLanguage } from '../context/LanguageContext'

const FormatCard = ({ title, desc, imageSrc, imageAlt, ctaLabel }) => (
  <div className="group relative flex flex-col h-full bg-white border border-card-border rounded-2xl overflow-hidden shadow-sm hover:border-accent/35 hover:shadow-lg transition-all duration-300">
    <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F8FA]">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
    </div>
    <div className="flex flex-col flex-1 p-6 md:p-8">
      <h3 className="font-newsreader italic text-2xl text-normal font-light mb-3">{title}</h3>
      <p className="font-montserrat text-sm text-description leading-relaxed mb-6 flex-1">{desc}</p>
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 font-jetbrains text-[10px] uppercase tracking-[0.2em] font-bold text-accent group-hover:gap-3 transition-all"
      >
        {ctaLabel}
        <span aria-hidden>→</span>
      </Link>
    </div>
  </div>
)

const CourseFormatsSection = () => {
  const { t } = useLanguage()

  const formats = [
    {
      title: t('formatLiveTitle'),
      desc: t('formatLiveDesc'),
      imageSrc: TRAINING_IMAGES.liveSeminar,
      imageAlt: t('trainingCaptionSeminar'),
    },
    {
      title: t('formatRecordedTitle'),
      desc: t('formatRecordedDesc'),
      imageSrc: TRAINING_IMAGES.mentorSession,
      imageAlt: t('trainingCaptionMentor'),
    },
    {
      title: t('formatOfflineTitle'),
      desc: t('formatOfflineDesc'),
      imageSrc: TRAINING_IMAGES.handsOnWorkshop,
      imageAlt: t('trainingCaptionWorkshop'),
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
            <FormatCard
              key={f.title}
              title={f.title}
              desc={f.desc}
              imageSrc={f.imageSrc}
              imageAlt={f.imageAlt}
              ctaLabel={t('viewCourses')}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CourseFormatsSection
