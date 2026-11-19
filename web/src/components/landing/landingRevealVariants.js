export const DEFAULT_EASE = [0.16, 1, 0.3, 1]
export const DEFAULT_DURATION = 0.65

/**
 * Parent variant: orchestrates stagger only (no extra opacity on the section).
 * Use with `motion` children that reference STAGGER_CHILD_VARIANTS.
 */
export const STAGGER_PARENT_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.02,
    },
  },
}

/**
 * Child variant: fade + slight rise — pair with a staggered LandingReveal parent.
 */
export const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DEFAULT_DURATION, ease: DEFAULT_EASE },
  },
}

/**
 * Scale + fade variant for cards, badges, and prominent blocks.
 */
export const STAGGER_SCALE_VARIANTS = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DEFAULT_DURATION, ease: DEFAULT_EASE },
  },
}
