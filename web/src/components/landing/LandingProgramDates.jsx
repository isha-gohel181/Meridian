import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLanguage } from '../../context/LanguageContext'

function formatCourseDateRange(startDate, endDate) {
  if (!startDate) return '—'
  try {
    const start = new Date(startDate)
    const opts = { month: 'short', day: 'numeric', year: 'numeric' }
    const startStr = start.toLocaleDateString(undefined, opts)
    if (!endDate) return startStr
    const end = new Date(endDate)
    const endStr = end.toLocaleDateString(undefined, opts)
    return `${startStr} – ${endStr}`
  } catch {
    return String(startDate)
  }
}

function formatDurationMinutes(minutes) {
  if (minutes == null || Number.isNaN(Number(minutes)) || Number(minutes) <= 0) return '—'
  const m = Number(minutes)
  if (m < 60) return `${m} min`
  const h = Math.round(m / 60)
  return `${h} h`
}

function levelLabel(level, t) {
  if (!level || !Array.isArray(level) || level.length === 0) return '—'
  const map = {
    beginner: t('landingProgramLevelBeginner'),
    intermediate: t('landingProgramLevelIntermediate'),
    advanced: t('landingProgramLevelAdvanced'),
  }
  return level.map((l) => map[l] || l).join(', ')
}

const LandingProgramDates = () => {
  const { t } = useLanguage()
  const { courses } = useSelector((s) => s.courses)

  const rows = useMemo(() => {
    return (courses || [])
      .filter((c) => c.startDate && c.isPublished !== false)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  }, [courses])

  if (rows.length === 0) return null

  return (
    <section id="dates" className="scroll-mt-28 md:scroll-mt-32 bg-white px-4 py-20 sm:px-6 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-jetbrains text-[10px] font-bold uppercase tracking-[0.45em] text-accent">
          {t('landingDatesEyebrow')}
        </p>
        <h2 className="font-newsreader text-3xl font-medium tracking-tight text-brand-brown sm:text-4xl">{t('landingDatesTitle')}</h2>
        <p className="mt-3 max-w-2xl text-description">{t('landingDatesSub')}</p>

        <div className="mt-10 hidden border-b border-brand-brown/15 md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="font-jetbrains text-[10px] uppercase tracking-[0.28em] text-description">
                <th className="pb-4 pr-4 font-semibold">{t('landingDatesColProgram')}</th>
                <th className="pb-4 pr-4 font-semibold">{t('landingDatesColSchedule')}</th>
                <th className="pb-4 pr-4 font-semibold">{t('landingDatesColLevel')}</th>
                <th className="pb-4 font-semibold">{t('landingDatesColDuration')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-brown/10">
              {rows.map((c) => {
                const id = c._id || c.id
                return (
                  <tr key={id} className="text-sm text-description">
                    <td className="py-4 pr-4 align-top">
                      <Link
                        to={`/course-detail/${id}`}
                        className="font-newsreader text-base font-medium text-brand-brown underline-offset-4 hover:underline"
                      >
                        {c.title}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 align-top tabular-nums">{formatCourseDateRange(c.startDate, c.endDate)}</td>
                    <td className="py-4 pr-4 align-top">{levelLabel(c.level, t)}</td>
                    <td className="py-4 align-top tabular-nums">{formatDurationMinutes(c.duration)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-4 md:hidden">
          {rows.map((c) => {
            const id = c._id || c.id
            return (
              <div key={id} className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-2xl border border-brand-brown/[0.08] bg-slate-50 p-4 text-sm">
                <span className="font-jetbrains text-[9px] font-bold uppercase tracking-[0.28em] text-description">
                  {t('landingDatesColProgram')}
                </span>
                <span className="font-jetbrains text-[9px] font-bold uppercase tracking-[0.28em] text-description">
                  {t('landingDatesColSchedule')}
                </span>
                <span className="col-span-2 -mt-1">
                  <Link to={`/course-detail/${id}`} className="font-newsreader text-lg font-medium text-brand-brown">
                    {c.title}
                  </Link>
                </span>
                <span className="col-span-2 text-description tabular-nums">{formatCourseDateRange(c.startDate, c.endDate)}</span>
                <span className="font-jetbrains text-[9px] font-bold uppercase tracking-[0.28em] text-description">
                  {t('landingDatesColLevel')}
                </span>
                <span className="font-jetbrains text-[9px] font-bold uppercase tracking-[0.28em] text-description">
                  {t('landingDatesColDuration')}
                </span>
                <span className="text-description">{levelLabel(c.level, t)}</span>
                <span className="text-description tabular-nums">{formatDurationMinutes(c.duration)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default LandingProgramDates
