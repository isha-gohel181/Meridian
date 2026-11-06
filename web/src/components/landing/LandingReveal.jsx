import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const MotionSection = motion.section

/**
 * Scroll-reveal wrapper for landing sections. Respects prefers-reduced-motion.
 */
const LandingReveal = ({ children, className, id, ...rest }) => {
  const prefersReduced = useReducedMotion()

  return (
    <MotionSection
      id={id}
      className={className}
      initial={prefersReduced ? false : { opacity: 0, y: 28 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px', amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionSection>
  )
}

export default LandingReveal
