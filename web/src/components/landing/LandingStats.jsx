import React, { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useLanguage } from '../../context/LanguageContext'
import { LANDING_STATS } from '../../constants/landingStats'
import { resolveMediaUrl } from '../../utils/apiBase'
import LandingReveal from './LandingReveal'

const MotionDiv = motion.div
const MotionLi = motion.li

/** Meridian-themed pastel cards (gold / warm rose / sky / soft violet) */
const CARD_TONE_CLASSES = {
  gold: { bg: 'bg-amber-100', label: 'text-amber-900/80' },
  warm: { bg: 'bg-rose-100', label: 'text-rose-900/78' },
  sky: { bg: 'bg-sky-100', label: 'text-sky-900/78' },
  lavender: { bg: 'bg-violet-100', label: 'text-violet-900/78' },
}

const LABEL_KEYS = [
  'landingStatLearnersLabel',
  'landingStatProgramsLabel',
  'landingStatSupportLabel',
  'landingStatRatingLabel',
]

const LandingStats = () => {
  const { t } = useLanguage()
  const prefersReduced = useReducedMotion()
  const statsSettings = useSelector((state) => state.config?.settings?.landingStats) || {}

  const sectionTitle = statsSettings.title || t('landingStatsSectionTitle')
  const sectionSubtitle = statsSettings.subtitle || t('landingStatsSectionSub')

  const imageSrc = statsSettings.image
    ? resolveMediaUrl(statsSettings.image)
    : LANDING_STATS.imageSrc
  const imageAlt = statsSettings.imageAlt || t(LANDING_STATS.imageAltKey)

  const metrics = useMemo(() => {
    if (Array.isArray(statsSettings.metrics) && statsSettings.metrics.length > 0) {
      return statsSettings.metrics.map((item, i) => ({
        value: item.value ?? LANDING_STATS.metrics[i]?.value ?? '',
        label: item.label ?? (LABEL_KEYS[i] ? t(LABEL_KEYS[i]) : ''),
        tone: item.tone ?? LANDING_STATS.metrics[i]?.tone ?? 'gold',
      }))
    }
    return LANDING_STATS.metrics.map((item) => ({
      value: item.value,
      label: t(item.labelKey),
      tone: item.tone,
    }))
  }, [statsSettings.metrics, t])

  return (
    <LandingReveal
      id="stats"
      variant="fade-up"
      className="scroll-mt-28 border-y border-brand-brown/[0.06] bg-white py-16 md:scroll-mt-32"
    >
      <div className="site-container">
        <MotionDiv
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px', amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-newsreader text-3xl font-medium tracking-tight text-brand-brown sm:text-4xl md:text-[2.45rem]">
            {sectionTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-description md:text-lg">
            {sectionSubtitle}
          </p>
        </MotionDiv>

        <MotionDiv
          className="mt-14 grid gap-8 lg:mt-16 lg:grid-cols-2 lg:items-stretch lg:gap-10"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px', amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Aspect ratio sets row height on large screens; right column stretches to match */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-brand-brown/10 bg-slate-50 shadow-card sm:aspect-[16/10]">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand-brown/25 via-transparent to-accent/10" />
          </div>

          <ul className="grid h-full min-h-0 grid-cols-2 grid-rows-[1fr_1fr] gap-3 sm:gap-4 md:gap-5">
            {metrics.map((item, i) => {
              const tone = CARD_TONE_CLASSES[item.tone] ?? CARD_TONE_CLASSES.gold
              return (
                <MotionLi
                  key={`${item.label}-${i}`}
                  className={`flex min-h-0 flex-col justify-center rounded-2xl px-5 py-6 shadow-sm sm:px-6 sm:py-7 md:px-8 md:py-8 ${tone.bg}`}
                  initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                  whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.4,
                    delay: prefersReduced ? 0 : i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <p className="font-newsreader text-3xl font-semibold leading-none tracking-tight text-brand-brown sm:text-4xl md:text-[2.75rem]">
                    {item.value}
                  </p>
                  <p
                    className={`mt-2 max-w-[14ch] font-jetbrains text-[9px] font-semibold uppercase leading-snug tracking-[0.18em] sm:text-[10px] sm:tracking-[0.2em] ${tone.label}`}
                  >
                    {item.label}
                  </p>
                </MotionLi>
              )
            })}
          </ul>
        </MotionDiv>
      </div>
    </LandingReveal>
  )
}

export default LandingStats