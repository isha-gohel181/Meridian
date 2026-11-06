import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLanguage } from '../../context/LanguageContext'

const LandingFacultyRoster = () => {
  const { t } = useLanguage()
  const { courses } = useSelector((s) => s.courses)

  const rows = useMemo(() => {
    const map = new Map()
    for (const c of courses || []) {
      const name = (c.mentorName || '').trim()
      if (!name) continue
      const title = (c.mentorTitle || '').trim()
      const key = name.toLowerCase()
      if (!map.has(key)) {
        map.set(key, { name, title, count: 0 })
      }
      const row = map.get(key)
      row.count += 1
      if (!row.title && title) row.title = title
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [courses])

  if (rows.length === 0) return null

  return (
    <section
      id="faculty"
      className="scroll-mt-28 md:scroll-mt-32 border-y border-brand-brown/[0.06] bg-slate-50 px-4 py-20 sm:px-6 md:px-10 lg:px-14"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-jetbrains text-[10px] font-bold uppercase tracking-[0.45em] text-accent">
          {t('landingFacultyEyebrow')}
        </p>
        <h2 className="font-newsreader text-3xl font-medium tracking-tight text-brand-brown sm:text-4xl">{t('landingFacultyTitle')}</h2>
        <p className="mt-3 max-w-2xl text-description">{t('landingFacultySub')}</p>

        <div className="mt-12 divide-y divide-brand-brown/10 border-y border-brand-brown/10" role="list">
          {rows.map((row) => (
            <div key={row.name} role="listitem" className="flex flex-wrap items-baseline justify-between gap-4 py-5 md:gap-8">
              <div className="min-w-0 flex-1">
                <p className="font-jetbrains text-[10px] font-bold uppercase tracking-[0.35em] text-accent">
                  {row.title || t('landingFacultyDefaultRole')}
                </p>
                <p className="font-newsreader mt-1 text-xl font-medium text-brand-brown md:text-2xl">{row.name}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className="font-jetbrains text-[10px] font-bold uppercase tracking-[0.3em] text-description">
                  {t('landingFacultyProgramsLabel')}
                </span>
                <p className="font-newsreader mt-1 text-2xl tabular-nums text-brand-brown">{row.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingFacultyRoster
