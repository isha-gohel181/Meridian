import React from 'react'
import { Link } from 'react-router-dom'
import { TRAINING_IMAGES } from '../constants/trainingImages'
import { useLanguage } from '../context/LanguageContext'

const galleryItems = [
  { key: 'seminar', src: TRAINING_IMAGES.liveSeminar, captionKey: 'trainingCaptionSeminar', className: 'md:col-span-2 md:row-span-2 min-h-[220px] md:min-h-0' },
  { key: 'mentor', src: TRAINING_IMAGES.mentorSession, captionKey: 'trainingCaptionMentor', className: 'md:col-span-2 min-h-[200px]' },
  { key: 'workshop', src: TRAINING_IMAGES.handsOnWorkshop, captionKey: 'trainingCaptionWorkshop', className: 'md:col-span-2 min-h-[200px]' },
]

const TrainingExperienceSection = () => {
  const { t } = useLanguage()

  const highlights = [
    t('trainingHighlight1'),
    t('trainingHighlight2'),
    t('trainingHighlight3'),
  ]

  return (
    <section className="relative bg-white py-20 md:py-28 px-4 md:px-8 lg:px-12 overflow-hidden border-y border-card-border">
      <div className="absolute -top-24 right-0 w-[420px] h-[420px] bg-accent/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <div className="space-y-4">
              <span className="font-jetbrains text-[10px] text-accent tracking-[0.5em] uppercase font-bold">
                {t('trainingEyebrow')}
              </span>
              <h2 className="font-newsreader italic text-3xl sm:text-4xl md:text-[2.75rem] text-normal font-light leading-[1.08] tracking-tight">
                {t('trainingTitle')}
              </h2>
              <p className="font-montserrat text-sm md:text-base text-description leading-relaxed max-w-md">
                {t('trainingSub')}
              </p>
            </div>

            <ul className="space-y-3">
              {highlights.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 font-montserrat text-sm text-description leading-relaxed"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>

            <Link
              to="/courses"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-brand-brown hover:bg-brand-brown/90 text-white rounded-xl font-jetbrains text-xs uppercase tracking-[0.2em] font-bold shadow-lg shadow-accent-soft hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {t('trainingCta')}
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4 md:h-[min(520px,58vw)]">
              {galleryItems.map((item, index) => (
                <figure
                  key={item.key}
                  className={`group relative overflow-hidden rounded-2xl border border-card-border bg-[#F5F8FA] shadow-sm ${item.className}`}
                >
                  <img
                    src={item.src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/75 via-brand-brown/15 to-transparent pointer-events-none" />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <p className="font-jetbrains text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-amber-100/90 font-bold mb-1">
                      {t('trainingGalleryLabel')}
                    </p>
                    <p className="font-montserrat text-sm md:text-base font-semibold text-white leading-snug">
                      {t(item.captionKey)}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrainingExperienceSection
