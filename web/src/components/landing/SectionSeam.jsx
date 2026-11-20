import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DEFAULT_DURATION, DEFAULT_EASE } from './landingRevealVariants'

/**
 * Luxury divider and transitional glow between landing sections.
 * Combines Meridian's gold identity with subtle ambient feathering for seamless section pacing.
 */
const SectionSeam = ({
  glow = true,
  glowColor = 'rgba(216, 184, 64, 0.08)',
  lineColor = 'via-accent/35',
  className = '',
}) => {
  const prefersReduced = useReducedMotion()

  const motionProps = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, scaleX: 0.6 },
        whileInView: { opacity: 1, scaleX: 1 },
        viewport: { once: true, amount: 0.5, margin: '-20px' },
        transition: { duration: DEFAULT_DURATION * 0.85, ease: DEFAULT_EASE },
      }

  const glowMotionProps = prefersReduced
    ? {}
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, amount: 0.5 },
        transition: { duration: DEFAULT_DURATION, ease: DEFAULT_EASE },
      }

  const LineTag = prefersReduced ? 'div' : motion.div
  const GlowTag = prefersReduced ? 'div' : motion.div

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative w-full overflow-hidden ${className}`}
    >
      {glow ? (
        <GlowTag
          {...glowMotionProps}
          className="absolute inset-x-0 -top-6 h-12 w-full blur-xl"
          style={{
            background: `radial-gradient(ellipse 60% 100% at 50% 50%, ${glowColor}, transparent 70%)`,
          }}
        />
      ) : null}
      <LineTag
        {...motionProps}
        style={prefersReduced ? undefined : { transformOrigin: 'center' }}
        className={`mx-auto h-px w-full max-w-7xl bg-gradient-to-r from-transparent ${lineColor} to-transparent`}
      />
    </div>
  )
}

export default SectionSeam