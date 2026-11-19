import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DEFAULT_DURATION, DEFAULT_EASE } from './landingRevealVariants'

const MotionSection = motion.section

const DEFAULT_VIEWPORT = { once: true, margin: '-50px', amount: 0.15 }

const VARIANTS_MAP = {
  'fade-up': {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  'scale-fade': {
    hidden: { opacity: 0, y: 18, scale: 0.985 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
}

/**
 * Scroll-reveal wrapper for landing sections. Respects prefers-reduced-motion.
 *
 * @param {boolean} [stagger=false] — use staggered children; pass `motion.div` blocks using STAGGER_CHILD_VARIANTS
 * @param {'fade-up' | 'scale-fade' | 'fade'} [variant='fade-up'] — motion profile
 * @param {number} [staggerChildren=0.08] — delay between staggered children (seconds)
 * @param {number} [delayChildren=0.02] — delay before first child animates
 */
const LandingReveal = ({
  children,
  className,
  id,
  stagger = false,
  variant = 'fade-up',
  staggerChildren: staggerChildrenDelay = 0.08,
  delayChildren = 0.02,
  viewport = DEFAULT_VIEWPORT,
  ...rest
}) => {
  const prefersReduced = useReducedMotion()

  if (stagger && !prefersReduced) {
    const parentVariants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerChildrenDelay,
          delayChildren,
        },
      },
    }

    return (
      <MotionSection
        id={id}
        className={className}
        variants={parentVariants}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        {...rest}
      >
        {children}
      </MotionSection>
    )
  }

  const selectedVariant = VARIANTS_MAP[variant] || VARIANTS_MAP['fade-up']

  return (
    <MotionSection
      id={id}
      className={className}
      initial={prefersReduced ? false : selectedVariant.hidden}
      whileInView={prefersReduced ? undefined : selectedVariant.visible}
      viewport={viewport}
      transition={{ duration: DEFAULT_DURATION, ease: DEFAULT_EASE }}
      {...rest}
    >
      {children}
    </MotionSection>
  )
}

export default LandingReveal
