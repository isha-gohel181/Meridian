import React, { useCallback, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import { useLanguage } from '../../context/LanguageContext'
import LandingReveal from './LandingReveal'

const ITEM_KEYS = [
  { titleKey: 'landingWhy1Title', descKey: 'landingWhy1Desc' },
  { titleKey: 'landingWhy2Title', descKey: 'landingWhy2Desc' },
  { titleKey: 'landingWhy3Title', descKey: 'landingWhy3Desc' },
  { titleKey: 'landingWhy4Title', descKey: 'landingWhy4Desc' },
  { titleKey: 'landingWhy5Title', descKey: 'landingWhy5Desc' },
]

/** Placeholder photos from `web/public/meridian/` — swap paths anytime. */
const ITEM_IMAGES = [
  '/meridian/diary/cohort.jpg',
  '/meridian/diary/workshop.jpg',
  '/meridian/statement-01.jpg',
  '/meridian/statement-02.jpg',
  '/meridian/stats_community.jpg',
]

const MotionLi = motion.li
const MotionP = motion.p
const MotionAccent = motion.div

/** Row motion: paired with right-column preview — transform-only, no layout jump. */
function buildRowMotion(prefersReduced) {
  if (prefersReduced) {
    return {
      li: {
        rest: {},
        active: {},
        hover: {},
      },
      desc: {
        rest: { opacity: 0.7 },
        active: { opacity: 0.88 },
        hover: { opacity: 0.9 },
      },
      accent: {
        rest: { scaleX: 0 },
        active: { scaleX: 1 },
        hover: { scaleX: 1 },
      },
      transition: { duration: 0.15, ease: 'easeOut' },
      descTransition: { duration: 0.15, ease: 'easeOut' },
    }
  }
  return {
    li: {
      rest: { x: 0 },
      active: { x: 5 },
      hover: { x: 8 },
    },
    desc: {
      rest: { opacity: 0.7, x: 0 },
      active: { opacity: 0.92, x: 2 },
      hover: { opacity: 0.96, x: 3 },
    },
    accent: {
      rest: { scaleX: 0 },
      active: { scaleX: 1 },
      hover: { scaleX: 1 },
    },
    transition: { type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    descTransition: {
      type: 'tween',
      duration: 0.3,
      delay: 0.03,
      ease: [0.22, 1, 0.36, 1],
    },
  }
}

const LandingWhyChoose = () => {
  const { t } = useLanguage()
  const prefersReduced = useReducedMotion()
  const olRef = useRef(null)

  const [activeIndex, setActiveIndex] = useState(null)
  const whySettings = useSelector((state) => state.config?.settings?.landingWhyChoose) || {}

  const eyebrow = whySettings.eyebrow || t('landingWhyEyebrow')
  const title = whySettings.title || t('landingWhyTitle')
  const subtitle = whySettings.subtitle || t('landingWhySub')

  const items = useMemo(() => {
    if (Array.isArray(whySettings.items) && whySettings.items.length > 0) {
      return whySettings.items.map((item, idx) => ({
        number: item.number || String(idx + 1).padStart(2, '0'),
        title: item.title,
        desc: item.description || item.desc,
        image: item.image || ITEM_IMAGES[idx % ITEM_IMAGES.length],
      }))
    }
    return ITEM_KEYS.map((keyObj, idx) => ({
      number: String(idx + 1).padStart(2, '0'),
      title: t(keyObj.titleKey),
      desc: t(keyObj.descKey),
      image: ITEM_IMAGES[idx % ITEM_IMAGES.length],
    }))
  }, [whySettings.items, t])

  const resetActive = useCallback(() => {
    setActiveIndex(null)
  }, [])

  const handleRowBlur = useCallback((e) => {
    if (!olRef.current?.contains(e.relatedTarget)) {
      setActiveIndex(null)
    }
  }, [])

  const rowMotion = useMemo(() => buildRowMotion(!!prefersReduced), [prefersReduced])

  const handleMouseEnterRow = useCallback((index) => {
    setActiveIndex(index)
  }, [])

  return (
    <LandingReveal
      id="why-meridian"
      className="relative scroll-mt-28 overflow-hidden bg-brand-brown py-20 text-white md:scroll-mt-32 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent md:inset-x-16"
      />

      <div className="relative site-container">
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end md:gap-10">
          <div className="md:col-span-7">
            <p className="mb-3 font-jetbrains text-[10px] font-bold uppercase tracking-[0.45em] text-accent">
              {eyebrow}
            </p>
            <h2 className="max-w-xl font-newsreader text-3xl font-medium tracking-tight sm:text-4xl md:text-[2.5rem]">
              {title}
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-white/65 md:col-span-5 md:justify-self-end md:text-lg md:text-right">
            {subtitle}
          </p>
        </div>

        <div className="relative" onMouseLeave={resetActive}>
          <ol ref={olRef} className="min-w-0 border-t border-white/10">
            {items.map((item, index) => {
              const isRowLit = activeIndex === index
              return (
                <MotionLi
                  key={item.number || index}
                  tabIndex={0}
                  variants={rowMotion.li}
                  animate={isRowLit ? 'active' : 'rest'}
                  initial={false}
                  whileHover={prefersReduced ? undefined : 'hover'}
                  whileFocus={prefersReduced ? undefined : 'hover'}
                  transition={rowMotion.transition}
                  onMouseEnter={() => handleMouseEnterRow(index)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={handleRowBlur}
                  className={clsx(
                    'group relative flex flex-col gap-3 border-b border-white/10 py-8 outline-none md:flex-row md:items-center md:gap-6 md:py-9 lg:gap-10 lg:py-10',
                    'focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-brown',
                  )}
                >
                  <MotionAccent
                    aria-hidden
                    variants={rowMotion.accent}
                    animate={isRowLit ? 'active' : 'rest'}
                    initial={false}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-accent/55 via-accent/25 to-transparent"
                  />
                  <span
                    aria-hidden
                    className="shrink-0 font-newsreader text-4xl font-medium leading-none text-transparent transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent md:w-20 md:text-5xl"
                    style={{ WebkitTextStroke: '1px rgba(196, 162, 58, 0.55)' }}
                  >
                    {item.number}
                  </span>
                  <h3 className="font-newsreader text-2xl font-medium tracking-tight text-white transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent md:min-w-[10rem] md:max-w-[38%] md:flex-1 md:shrink-0 md:text-[1.65rem]">
                    {item.title}
                  </h3>
                  <MotionP
                    variants={rowMotion.desc}
                    animate={isRowLit ? 'active' : 'rest'}
                    initial={false}
                    whileHover={prefersReduced ? undefined : 'hover'}
                    transition={rowMotion.descTransition}
                    className="min-w-0 flex-1 text-sm leading-relaxed text-white/70 md:text-[15px] md:leading-relaxed"
                  >
                    {item.desc}
                  </MotionP>
                </MotionLi>
              )
            })}
          </ol>
        </div>
      </div>
    </LandingReveal>
  )
}

export default LandingWhyChoose
