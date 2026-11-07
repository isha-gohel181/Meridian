import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const MotionSection = motion.section

const DEFAULT_VIEWPORT = { once: true, margin: '-60px', amount: 0.2 }
const DEFAULT_EASE = [0.22, 1, 0.36, 1]
const DEFAULT_DURATION = 0.55

/**
 * Scroll-reveal wrapper for landing sections. Respects prefers-reduced-motion.
 *
 * @param {boolean} [stagger=false] — use staggered children; pass `motion.div` blocks using STAGGER_CHILD_VARIANTS from `./landingRevealVariants`
 * @param {number} [staggerChildren=0.08] — delay between staggered children (seconds)
 * @param {number} [delayChildren=0] — delay before first child animates
 */
const LandingReveal = ({
  children,
  className,
  id,
  stagger = false,
  staggerChildren: staggerChildrenDelay = 0.08,
  delayChildren = 0,
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
        viewport={DEFAULT_VIEWPORT}
        {...rest}
      >
        {children}
      </MotionSection>
    )
  }

  return (
    <MotionSection
      id={id}
      className={className}
      initial={prefersReduced ? false : { opacity: 0, y: 28 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={DEFAULT_VIEWPORT}
      transition={{ duration: DEFAULT_DURATION, ease: DEFAULT_EASE }}
      {...rest}
    >
      {children}
    </MotionSection>
  )
}

export default LandingReveal
