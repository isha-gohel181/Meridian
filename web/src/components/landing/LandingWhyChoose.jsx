import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
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

const PREVIEW_ID = 'why-meridian-preview'

const MotionImg = motion.img
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

function WhyPreviewCard({ activeIndex, altText, prefersReduced, previewId }) {
  const src = ITEM_IMAGES[activeIndex ?? 0]
  const transition = prefersReduced
    ? { duration: 0.15, ease: 'easeOut' }
    : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }

  return (
    <div
      {...(previewId ? { id: previewId, 'aria-live': 'polite' } : { 'aria-hidden': true })}
      className="relative aspect-[4/3] w-full min-h-[200px] max-w-md overflow-hidden rounded-2xl border border-white/[0.12] bg-black/30 shadow-[0_28px_90px_-24px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-[2px]"
    >
      <AnimatePresence mode="sync">
        <MotionImg
          key={src}
          src={src}
          alt={altText}
          decoding="async"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
          transition={transition}
        />
      </AnimatePresence>
    </div>
  )
}

const LandingWhyChoose = () => {
  const { t } = useLanguage()
  const prefersReduced = useReducedMotion()
  const olRef = useRef(null)

  const [activeIndex, setActiveIndex] = useState(null)
  const [showPreviewPanel, setShowPreviewPanel] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof matchMedia === 'undefined') return
    const mq = window.matchMedia('(min-width: 768px)')
    const sync = () => setShowPreviewPanel(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const displayIndex = activeIndex ?? 0
  const displayTitleKey = ITEM_KEYS[displayIndex]?.titleKey ?? ITEM_KEYS[0].titleKey
  const previewAlt = t(displayTitleKey)

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
              {t('landingWhyEyebrow')}
            </p>
            <h2 className="max-w-xl font-newsreader text-3xl font-medium tracking-tight sm:text-4xl md:text-[2.5rem]">
              {t('landingWhyTitle')}
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-white/65 md:col-span-5 md:justify-self-end md:text-lg md:text-right">
            {t('landingWhySub')}
          </p>
        </div>

        <div className="relative md:grid md:grid-cols-12 md:gap-10 lg:gap-14" onMouseLeave={resetActive}>
          <ol ref={olRef} className="border-t border-white/10 md:col-span-7">
            {ITEM_KEYS.map((item, index) => {
              const isRowLit = activeIndex === index
              return (
                <MotionLi
                  key={item.titleKey}
                  tabIndex={0}
                  aria-describedby={showPreviewPanel ? PREVIEW_ID : undefined}
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
                    'group relative grid gap-3 border-b border-white/10 py-8 outline-none md:grid-cols-12 md:items-baseline md:gap-8 md:py-10',
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
                    className="font-newsreader text-[clamp(3.25rem,8vw,5rem)] font-medium leading-none text-transparent transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent md:col-span-2"
                    style={{ WebkitTextStroke: '1px rgba(216, 184, 64, 0.55)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-newsreader text-2xl font-medium tracking-tight text-white transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent md:col-span-4 md:text-[1.65rem]">
                    {t(item.titleKey)}
                  </h3>
                  <MotionP
                    variants={rowMotion.desc}
                    animate={isRowLit ? 'active' : 'rest'}
                    initial={false}
                    whileHover={prefersReduced ? undefined : 'hover'}
                    transition={rowMotion.descTransition}
                    className="text-sm leading-relaxed text-white/70 md:col-span-6 md:text-[15px] md:leading-relaxed"
                  >
                    {t(item.descKey)}
                  </MotionP>
                </MotionLi>
              )
            })}
          </ol>

          <aside className="hidden md:col-span-5 md:block">
            <div className="sticky top-28">
              <WhyPreviewCard
                activeIndex={displayIndex}
                altText={previewAlt}
                prefersReduced={prefersReduced}
                previewId={PREVIEW_ID}
              />
            </div>
          </aside>
        </div>
      </div>
    </LandingReveal>
  )
}

export default LandingWhyChoose
