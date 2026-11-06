import React from 'react'
import { useLanguage } from '../context/LanguageContext'

const LearningPathSection = () => {
  const { t } = useLanguage()

  const steps = [
    { title: t('pathStep1Title'), desc: t('pathStep1Desc') },
    { title: t('pathStep2Title'), desc: t('pathStep2Desc') },
    { title: t('pathStep3Title'), desc: t('pathStep3Desc') },
    { title: t('pathStep4Title'), desc: t('pathStep4Desc') },
  ]

  return (
    <section className="relative bg-gradient-to-b from-dark to-[#E8EEF3]/40 py-20 md:py-28 px-4 md:px-8 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-jetbrains text-[10px] text-accent tracking-[0.5em] uppercase font-bold">
            {t('pathEyebrow')}
          </span>
          <h2 className="font-newsreader italic text-3xl sm:text-4xl md:text-5xl text-normal font-light">
            {t('pathTitle')}
          </h2>
        </div>

        <div className="relative">
          <ol className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <li key={step.title} className="relative flex flex-col items-center lg:items-start text-center lg:text-left">
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-8 z-0 h-[2px] bg-accent/30 pointer-events-none"
                    style={{ left: '2rem', width: 'calc(100% - 2rem + 1.5rem)' }}
                    aria-hidden
                  />
                )}
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-accent/30 shadow-sm flex items-center justify-center mb-4 relative z-10">
                  <span className="font-jetbrains text-lg font-bold text-accent">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-newsreader italic text-xl text-normal mb-2">{step.title}</h3>
                <p className="font-montserrat text-sm text-description leading-relaxed max-w-xs">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default LearningPathSection
