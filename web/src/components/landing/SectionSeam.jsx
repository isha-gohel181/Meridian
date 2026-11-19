import React from 'react'

/**
 * SectionSeam: Luxury divider and transitional glow between landing sections.
 * Combines Meridian's gold identity with subtle ambient feathering for seamless section pacing.
 */
const SectionSeam = ({
  glow = true,
  glowColor = 'rgba(216, 184, 64, 0.08)',
  lineColor = 'via-accent/35',
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative w-full overflow-hidden ${className}`}
    >
      {glow ? (
        <div
          className="absolute inset-x-0 -top-6 h-12 w-full blur-xl"
          style={{
            background: `radial-gradient(ellipse 60% 100% at 50% 50%, ${glowColor}, transparent 70%)`,
          }}
        />
      ) : null}
      <div
        className={`mx-auto h-px w-full max-w-7xl bg-gradient-to-r from-transparent ${lineColor} to-transparent`}
      />
    </div>
  )
}

export default SectionSeam
