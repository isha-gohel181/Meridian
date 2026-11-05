import React from 'react'
import { useLanguage } from '../context/LanguageContext'

const AlumniCasesStrip = () => {
  const { t } = useLanguage()
  const chips = [
    t('alumniChip1'),
    t('alumniChip2'),
    t('alumniChip3'),
    t('alumniChip4'),
    t('alumniChip5'),
    t('alumniChip6'),
  ]

  return (
    <section className="bg-brand-brown/95 text-white py-10 md:py-12 px-4 md:px-8 border-y border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
        <div className="shrink-0 max-w-sm">
          <p className="font-jetbrains text-[10px] tracking-[0.4em] uppercase text-amber-100/80 font-bold mb-2">
            Alumni outcomes
          </p>
          <h2 className="font-newsreader italic text-2xl md:text-3xl font-light">{t('alumniStripTitle')}</h2>
          <p className="font-montserrat text-sm text-white/75 mt-2">{t('alumniStripSub')}</p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 flex-1">
          {chips.map((label) => (
            <span
              key={label}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 font-jetbrains text-[10px] md:text-xs uppercase tracking-wider font-semibold"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AlumniCasesStrip
