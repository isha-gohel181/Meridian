import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import gsap from 'gsap'
import { resolveMediaUrl } from '../../utils/apiBase'
import { useLanguage } from '../../context/LanguageContext'
import { LOGO_PATH } from '../../constants/brand'

const MAX_CARDS = 12
const STACK_COUNT = 4

function courseThumb(c) {
  return c.thumbnail || c.coverImage || c.featuredImageBanner || c.verticalCarouselImage || ''
}

const CourseDeck = () => {
  const { t } = useLanguage()
  const { courses, loading } = useSelector((s) => s.courses)
  const deckRef = useRef(null)
  const animatingRef = useRef(false)
  const pointerIdRef = useRef(null)
  const startXRef = useRef(0)
  const currentXRef = useRef(0)
  const topCardInnerRef = useRef(null)
  const suppressNextClickRef = useRef(false)

  const items = useMemo(() => {
    const list = (courses || []).filter((c) => c.isPublished !== false && (c._id || c.id))
    return list.slice(0, MAX_CARDS)
  }, [courses])

  const n = items.length
  const [rotation, setRotation] = useState(0)

  const applyCardTransform = useCallback((el, x, rot, scale) => {
    if (!el) return
    gsap.to(el, {
      x,
      rotation: rot,
      scale,
      duration: 0.12,
      overwrite: 'auto',
      ease: 'power2.out',
    })
  }, [])

  const resetTopCard = useCallback(() => {
    const el = topCardInnerRef.current
    if (!el) return
    gsap.to(el, { x: 0, rotation: 0, scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.6)' })
  }, [])

  const throwTopCard = useCallback(
    (direction) => {
      const deck = deckRef.current
      const el = topCardInnerRef.current
      if (!deck || !el || animatingRef.current || n === 0) return
      animatingRef.current = true
      const w = deck.offsetWidth || 320
      const targetX = direction * (w * 1.05)
      gsap.to(el, {
        x: targetX,
        y: -18,
        rotation: direction * 24,
        scale: 1.04,
        opacity: 0,
        duration: 0.45,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(el, { clearProps: 'all' })
          setRotation((r) => (n <= 1 ? 0 : (r + 1) % n))
          animatingRef.current = false
        },
      })
    },
    [n]
  )

  const onPointerDown = (e) => {
    if (animatingRef.current || n === 0) return
    const deck = deckRef.current
    if (!deck) return
    deck.setPointerCapture?.(e.pointerId)
    pointerIdRef.current = e.pointerId
    startXRef.current = e.clientX
    currentXRef.current = 0
    suppressNextClickRef.current = false
    const el = topCardInnerRef.current
    if (el) gsap.killTweensOf(el)
  }

  const onPointerMove = (e) => {
    if (pointerIdRef.current !== e.pointerId || !topCardInnerRef.current) return
    const deck = deckRef.current
    if (!deck) return
    const dx = e.clientX - startXRef.current
    currentXRef.current = dx
    if (Math.abs(dx) > 8) suppressNextClickRef.current = true
    const w = deck.offsetWidth || 320
    const rot = (dx / w) * 18
    const scale = 1 + Math.min(0.04, Math.abs(dx) / w / 12)
    applyCardTransform(topCardInnerRef.current, dx, rot, scale)
  }

  const onPointerUp = (e) => {
    if (pointerIdRef.current !== e.pointerId) return
    const deck = deckRef.current
    deck?.releasePointerCapture?.(e.pointerId)
    pointerIdRef.current = null
    const dx = currentXRef.current
    const w = deck?.offsetWidth || 320
    if (Math.abs(dx) > w * 0.1) {
      suppressNextClickRef.current = true
      throwTopCard(dx > 0 ? 1 : -1)
    } else {
      resetTopCard()
      if (Math.abs(dx) <= 8) suppressNextClickRef.current = false
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      throwTopCard(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      throwTopCard(-1)
    }
  }

  if (!loading && items.length === 0) {
    return (
      <div className="flex aspect-square w-full max-w-[min(100%,380px)] items-center justify-center rounded-2xl border border-dashed border-brand-brown/20 bg-slate-100 p-6 text-center text-sm text-description">
        {t('landingDeckEmpty')}
      </div>
    )
  }

  const displayDots = Math.min(6, n)
  const topCourseIndex = n > 0 ? rotation % n : 0

  return (
    <div className="w-full max-w-[min(100%,380px)]">
      <div
        ref={deckRef}
        role="application"
        tabIndex={0}
        aria-label={t('landingDeckAria')}
        className="relative aspect-square w-full touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        style={{ touchAction: 'pan-y' }}
      >
        {n > 0 &&
          Array.from({ length: STACK_COUNT }, (_, stackIdx) => {
            const courseIdx = (rotation + stackIdx) % n
            const course = items[courseIdx]
            if (!course) return null
            const cid = course._id || course.id
            const reactKey = `${cid}-d${stackIdx}`
            const isTop = stackIdx === 0
            const depth = stackIdx
            const imgUrl = resolveMediaUrl(courseThumb(course))
            const title = course.title || t('landingDeckUntitled')
            const shellClass = `h-full w-full overflow-hidden rounded-2xl border border-brand-brown/[0.12] bg-white shadow-lg shadow-brand-brown/15 ${
              isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none opacity-[0.96]'
            }`
            const wrapStyle = {
              zIndex: STACK_COUNT - depth,
              transform: `translate(${depth * 5}px, ${depth * 8}px) rotate(${depth * 2.5}deg) scale(${1 - depth * 0.018})`,
            }

            const inner = (
              <div
                ref={isTop ? topCardInnerRef : undefined}
                className={shellClass}
              >
                {imgUrl ? (
                  <img src={imgUrl} alt="" className="h-[58%] w-full object-cover" draggable={false} />
                ) : (
                  <div className="flex h-[58%] w-full items-center justify-center bg-slate-100">
                    <img src={LOGO_PATH} alt="" className="h-20 w-20 object-contain opacity-40" />
                  </div>
                )}
                <div className="flex flex-col justify-between p-5">
                  <p className="font-newsreader line-clamp-3 text-lg font-medium leading-snug text-brand-brown">{title}</p>
                  <span className="mt-4 font-jetbrains text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                    {t('landingDeckView')}
                  </span>
                </div>
              </div>
            )

            return (
              <div key={reactKey} className="absolute inset-0" style={wrapStyle}>
                {isTop ? (
                  <Link
                    to={`/course-detail/${cid}`}
                    className="absolute inset-0 block rounded-2xl focus:outline-none"
                    aria-label={`${title}. ${t('landingDeckDragHint')}`}
                    draggable={false}
                    onClickCapture={(ev) => {
                      if (suppressNextClickRef.current) {
                        ev.preventDefault()
                        suppressNextClickRef.current = false
                      }
                    }}
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="absolute inset-0" aria-hidden>
                    {inner}
                  </div>
                )}
              </div>
            )
          })}
      </div>
      <p className="mt-4 font-jetbrains text-[10px] uppercase tracking-[0.35em] text-description">{t('landingDeckHint')}</p>
      <div className="mt-3 flex justify-center gap-2" role="tablist" aria-label={t('landingDeckProgressLabel')}>
        {Array.from({ length: displayDots }, (_, i) => {
          const idx = (topCourseIndex + i) % n
          const active = i === 0
          return (
            <span
              key={`dot-${idx}-${i}`}
              className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-accent' : 'bg-brand-brown/20'}`}
              aria-hidden
            />
          )
        })}
      </div>
    </div>
  )
}

export default CourseDeck
