const DEFAULT_EASE = [0.22, 1, 0.36, 1]
const DEFAULT_DURATION = 0.55

/**
 * Parent variant: orchestrates stagger only (no extra opacity on the section).
 * Use with `motion` children that reference STAGGER_CHILD_VARIANTS.
 */
export const STAGGER_PARENT_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0,
    },
  },
}

/**
 * Child variant: fade + slight rise — pair with a staggered LandingReveal parent.
 */
export const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DEFAULT_DURATION, ease: DEFAULT_EASE },
  },
}
