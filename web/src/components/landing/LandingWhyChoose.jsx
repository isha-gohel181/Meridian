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

/** Row motion: paired with floating preview — transform-only, no layout jump. */
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

const PREVIEW_W = 240
const PREVIEW_H = 180
const OFFSET_X = 24
const OFFSET_Y = -PREVIEW_H / 2

/** Editorial “hover reveal” lists often lerp ~12–18% per frame toward the pointer — readable lag, not glued. */
const LERP = 0.16
const ROT_LERP = 0.12
const MAX_TILT_DEG = 5

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max)
}

function WhyPreviewCard({ activeIndex, prefersReduced, previewId }) {
  const src = ITEM_IMAGES[activeIndex ?? 0]
  const transition = prefersReduced
    ? { duration: 0.15, ease: 'easeOut' }
    : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }

  return (
    <div
      {...(previewId ? { id: previewId, 'aria-live': 'polite' } : { 'aria-hidden': true })}
      className="relative h-[180px] w-[240px] overflow-hidden rounded-2xl border border-white/[0.12] bg-black/30 shadow-[0_28px_90px_-24px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-[2px] will-change-transform"
    >
      <AnimatePresence mode="sync">
        <MotionImg
          key={src}
          src={src}
          alt=""
          decoding="async"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
          initial={
            prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 1.04 }
          }
          animate={{ opacity: 1, scale: 1 }}
          exit={
            prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 1.02 }
          }
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
  const previewRef = useRef(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const rotateRef = useRef(0)
  const rotateTargetRef = useRef(0)
  const lastPointerRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)
  const runFrameRef = useRef(() => {})

  const [activeIndex, setActiveIndex] = useState(null)
  const [finePointer, setFinePointer] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof matchMedia === 'undefined') return
    const mq = window.matchMedia('(pointer: fine)')
    const sync = () => setFinePointer(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const applyTransform = useCallback(() => {
    const el = previewRef.current
    if (!el) return
    const { x, y } = currentRef.current
    const r = rotateRef.current
    el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg)`
  }, [])

  const tick = useCallback(() => {
    const el = previewRef.current
    if (!el) return

    const tx = targetRef.current.x
    const ty = targetRef.current.y
    let cx = currentRef.current.x
    let cy = currentRef.current.y

    if (prefersReduced || !finePointer) {
      cx = tx
      cy = ty
      rotateRef.current = 0
    } else {
      cx += (tx - cx) * LERP
      cy += (ty - cy) * LERP
      const rt = rotateTargetRef.current
      rotateRef.current += (rt - rotateRef.current) * ROT_LERP
    }

    currentRef.current.x = cx
    currentRef.current.y = cy
    applyTransform()

    const still =
      Math.abs(tx - cx) > 0.35 ||
      Math.abs(ty - cy) > 0.35 ||
      Math.abs(rotateTargetRef.current - rotateRef.current) > 0.02

    if (still && activeIndex !== null) {
      rafRef.current = requestAnimationFrame(runFrameRef.current)
    } else {
      rafRef.current = null
    }
  }, [activeIndex, applyTransform, finePointer, prefersReduced])

  useEffect(() => {
    runFrameRef.current = tick
  }, [tick])

  const scheduleTick = useCallback(() => {
    if (rafRef.current == null && activeIndex !== null) {
      rafRef.current = requestAnimationFrame(runFrameRef.current)
    }
  }, [activeIndex])

  const setPointerTarget = useCallback(
    (clientX, clientY, prevX, prevY) => {
      if (typeof window === 'undefined') return
      const vw = window.innerWidth
      const vh = window.innerHeight
      let x = clientX + OFFSET_X
      let y = clientY + OFFSET_Y
      x = clamp(x, 8, vw - PREVIEW_W - 8)
      y = clamp(y, 8, vh - PREVIEW_H - 8)
      targetRef.current = { x, y }

      if (!prefersReduced && finePointer && prevX != null && prevY != null) {
        const vx = clientX - prevX
        rotateTargetRef.current = clamp(vx * 0.12, -MAX_TILT_DEG, MAX_TILT_DEG)
      } else {
        rotateTargetRef.current = 0
      }
      lastPointerRef.current = { x: clientX, y: clientY }
    },
    [finePointer, prefersReduced],
  )

  useEffect(() => {
    return () => stopLoop()
  }, [stopLoop])

  useEffect(() => {
    if (activeIndex === null) {
      stopLoop()
    }
  }, [activeIndex, stopLoop])

  useEffect(() => {
    const onScroll = () => {
      if (activeIndex === null || typeof document === 'undefined') return
      const active = document.activeElement
      if (active instanceof HTMLLIElement && olRef.current?.contains(active)) {
        const r = active.getBoundingClientRect()
        const px = r.right
        const py = r.top + r.height / 2
        setPointerTarget(px, py, null, null)
        currentRef.current = { ...targetRef.current }
        rotateTargetRef.current = 0
        rotateRef.current = 0
        applyTransform()
      }
    }
    window.addEventListener('scroll', onScroll, true)
    return () => window.removeEventListener('scroll', onScroll, true)
  }, [activeIndex, applyTransform, setPointerTarget])

  const resetActive = useCallback(() => {
    setActiveIndex(null)
    rotateTargetRef.current = 0
    rotateRef.current = 0
    stopLoop()
  }, [stopLoop])

  const handleRowBlur = useCallback((e) => {
    if (!olRef.current?.contains(e.relatedTarget)) {
      setActiveIndex(null)
      stopLoop()
    }
  }, [stopLoop])

  const handleListMouseMove = useCallback(
    (e) => {
      if (activeIndex === null) return
      const prev = lastPointerRef.current
      setPointerTarget(e.clientX, e.clientY, prev.x, prev.y)
      scheduleTick()
    },
    [activeIndex, scheduleTick, setPointerTarget],
  )

  const showPreview = activeIndex !== null
  const useFollow =
    showPreview && !prefersReduced && finePointer && typeof window !== 'undefined'

  const rowMotion = useMemo(() => buildRowMotion(!!prefersReduced), [prefersReduced])

  const handleMouseEnterRow = useCallback(
    (e, index) => {
      setActiveIndex(index)
      lastPointerRef.current = { x: e.clientX, y: e.clientY }
      setPointerTarget(e.clientX, e.clientY, null, null)
      currentRef.current = { ...targetRef.current }
      rotateRef.current = 0
      rotateTargetRef.current = 0
      requestAnimationFrame(() => {
        applyTransform()
        scheduleTick()
      })
    },
    [applyTransform, scheduleTick, setPointerTarget],
  )

  return (
    <LandingReveal
      id="why-meridian"
      className="relative scroll-mt-28 overflow-hidden bg-brand-brown px-4 py-20 text-white sm:px-6 md:scroll-mt-32 md:px-10 md:py-28 lg:px-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent md:inset-x-16"
      />

      <div className="relative mx-auto max-w-7xl">
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

        <div className="relative" onMouseLeave={resetActive}>
          {/* Desktop + fine pointer: floating card — lerp follow + light tilt (editorial index pattern) */}
          {useFollow && (
            <div
              ref={previewRef}
              className="pointer-events-none fixed left-0 top-0 z-30 hidden will-change-transform md:block"
              style={{
                transform: 'translate3d(0,0,0)',
              }}
            >
              <WhyPreviewCard
                activeIndex={activeIndex}
                prefersReduced={prefersReduced}
                previewId={PREVIEW_ID}
              />
            </div>
          )}

          {/* Coarse pointer / reduced motion: anchored card (no cursor follow) */}
          {showPreview && !useFollow && (
            <div
              className={clsx(
                'pointer-events-none z-30',
                prefersReduced || !finePointer
                  ? 'fixed bottom-6 right-4 w-[min(42%,11rem)] md:right-8 md:top-1/2 md:w-60 md:-translate-y-1/2'
                  : '',
              )}
            >
              <WhyPreviewCard
                activeIndex={activeIndex}
                prefersReduced={prefersReduced}
                previewId={PREVIEW_ID}
              />
            </div>
          )}

          <ol
            ref={olRef}
            className="border-t border-white/10"
            onMouseMove={handleListMouseMove}
          >
            {ITEM_KEYS.map((item, index) => {
              const isRowLit = activeIndex === index
              return (
                <MotionLi
                  key={item.titleKey}
                  tabIndex={0}
                  aria-describedby={showPreview ? PREVIEW_ID : undefined}
                  variants={rowMotion.li}
                  animate={isRowLit ? 'active' : 'rest'}
                  initial={false}
                  whileHover={prefersReduced ? undefined : 'hover'}
                  whileFocus={prefersReduced ? undefined : 'hover'}
                  transition={rowMotion.transition}
                  onMouseEnter={(e) => handleMouseEnterRow(e, index)}
                  onFocus={(e) => {
                    setActiveIndex(index)
                    const r = e.currentTarget.getBoundingClientRect()
                    const px = r.right
                    const py = r.top + r.height / 2
                    lastPointerRef.current = { x: px, y: py }
                    setPointerTarget(px, py, null, null)
                    currentRef.current = { ...targetRef.current }
                    rotateRef.current = 0
                    rotateTargetRef.current = 0
                    requestAnimationFrame(() => {
                      applyTransform()
                      scheduleTick()
                    })
                  }}
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
        </div>
      </div>
    </LandingReveal>
  )
}

export default LandingWhyChoose
