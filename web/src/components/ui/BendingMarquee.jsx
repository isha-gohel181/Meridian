'use client'

import { useEffect, useMemo, useRef } from 'react'
import { cn } from '@/lib/utils'
import './BendingMarquee.css'

const DEFAULT_ITEMS = ['Quality education', 'Expert mentors', 'Lifelong learning']

const BendingMarquee = ({
  items = DEFAULT_ITEMS,
  separator = '✳',
  panelWidth = 420,
  panelHeight = 520,
  bend = 50,
  depth = -200,
  perspective = 800,
  speed = 16,
  direction = 'left',
  rows = 1,
  rowGap = 22,
  itemGap = 26,
  bandPadding = 18,
  fontSize = 34,
  fontWeight = 600,
  letterSpacing = 1,
  color = '#fafafa',
  bandColor = '#111111',
  markSway = 14,
  pauseOnHover = true,
  pauseDamping = 0.7,
  fit = true,
  maxScale = 1,
  className,
  style,
}) => {
  const rootRef = useRef(null)
  const measureRefs = useRef([])
  const hoveredRef = useRef(false)
  const phrases = useMemo(
    () => (items?.length ? items.map(String) : DEFAULT_ITEMS),
    [items]
  )
  const rowCount = Math.max(1, Math.round(rows) || 1)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let last = performance.now()
    let velocity = motion.matches ? 0 : 1
    const offsets = Array.from({ length: rowCount }, () => 0)

    const layout = () => {
      const width = root.clientWidth
      const height = root.clientHeight || panelHeight
      const fittedPanel = Math.min(panelWidth, Math.max(160, width * 0.42))
      const rad = (Number(bend) * Math.PI) / 180
      const visualSide = Math.max(8, (width - fittedPanel) / 2)
      const wing = Math.cos(rad) > 0.08 ? visualSide / Math.cos(rad) : visualSide
      const scale = fit ? Math.min(maxScale, height / panelHeight) : 1
      root.style.setProperty('--bm-panel', `${fittedPanel}px`)
      root.style.setProperty('--bm-wing', `${Math.max(wing, 40)}px`)
      root.style.setProperty('--bm-scale', String(Number.isFinite(scale) && scale > 0 ? scale : 1))
    }

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const target = motion.matches || (pauseOnHover && hoveredRef.current) ? 0 : 1
      const damping = Math.max(0.05, pauseDamping)
      const k = 1 - Math.pow(0.001, dt / damping)
      velocity += (target - velocity) * k

      const duration = Math.max(0.5, speed)
      for (let row = 0; row < rowCount; row++) {
        const copy = measureRefs.current[row]
        const span = copy?.offsetWidth || 0
        if (span > 1 && velocity > 0.001) {
          const reverse = row % 2 === 1
          const goingLeft = reverse ? direction !== 'left' : direction === 'left'
          const delta = (span / duration) * velocity * dt
          offsets[row] += goingLeft ? -delta : delta
          offsets[row] %= span
          if (offsets[row] > 0) offsets[row] -= span
        }
        root.style.setProperty(`--bm-x-${row}`, `${offsets[row]}px`)
      }
      frame = requestAnimationFrame(tick)
    }

    const onResize = () => layout()
    const observer = new ResizeObserver(layout)
    observer.observe(root)
    layout()
    frame = requestAnimationFrame(tick)
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [
    bend,
    direction,
    fit,
    maxScale,
    panelHeight,
    panelWidth,
    pauseDamping,
    pauseOnHover,
    rowCount,
    speed,
  ])

  const renderCopy = (row, hidden, measure) => (
    <div
      className="bending-marquee__copy"
      ref={
        measure && !hidden
          ? (node) => {
              measureRefs.current[row] = node
            }
          : undefined
      }
      aria-hidden={hidden || undefined}
      style={{ gap: itemGap }}
    >
      {phrases.flatMap((phrase, index) => [
        <span key={`${hidden ? 'b' : 'a'}-${row}-p-${index}`} className="bending-marquee__item">
          {phrase}
        </span>,
        <span key={`${hidden ? 'b' : 'a'}-${row}-m-${index}`} className="bending-marquee__mark" aria-hidden>
          {separator}
        </span>,
      ])}
    </div>
  )

  const renderRows = (side) => {
    const extra = side === 'left' ? 'var(--bm-wing)' : side === 'right' ? 'calc(var(--bm-panel, 0px) * -1)' : '0px'
    const measure = side === 'center'

    return (
      <div className="bending-marquee__rows" style={{ gap: rowGap }}>
        {Array.from({ length: rowCount }, (_, row) => (
          <div
            key={row}
            className="bending-marquee__band"
            style={{
              backgroundColor: bandColor,
              color,
              paddingBlock: bandPadding,
              fontSize,
              fontWeight,
              letterSpacing: `${letterSpacing}px`,
            }}
          >
            <div
              className="bending-marquee__track"
              style={{
                transform: `translate3d(calc(var(--bm-x-${row}, 0px) + ${extra}), 0, 0)`,
                gap: itemGap,
              }}
            >
              {renderCopy(row, false, measure)}
              {renderCopy(row, true, false)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      className={cn('bending-marquee', className)}
      style={{
        perspective: `${perspective}px`,
        '--bending-marquee-sway': `${markSway}deg`,
        ...style,
      }}
      onMouseEnter={() => {
        hoveredRef.current = true
      }}
      onMouseLeave={() => {
        hoveredRef.current = false
      }}
    >
      <div className="bending-marquee__scene">
        <div
          className="bending-marquee__stage"
          style={{
            height: panelHeight,
            transform: `translateZ(${depth}px) scale(var(--bm-scale, 1))`,
          }}
        >
          <div
            className="bending-marquee__panel bending-marquee__panel--left"
            style={{
              width: 'var(--bm-wing)',
              height: panelHeight,
              transform: `rotateY(${bend}deg)`,
            }}
          >
            {renderRows('left')}
          </div>
          <div
            className="bending-marquee__panel bending-marquee__panel--center"
            style={{ width: 'var(--bm-panel, 380px)', height: panelHeight }}
          >
            {renderRows('center')}
          </div>
          <div
            className="bending-marquee__panel bending-marquee__panel--right"
            style={{
              width: 'var(--bm-wing)',
              height: panelHeight,
              transform: `rotateY(${-bend}deg)`,
            }}
          >
            {renderRows('right')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BendingMarquee
