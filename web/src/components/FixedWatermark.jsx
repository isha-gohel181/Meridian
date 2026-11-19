import React from 'react'
import { LOGO_EMBLEM_PATH } from '../constants/brand'

/**
 * FixedWatermark: Persistent, non-intrusive center background brand watermark fixed across viewport scrolling.
 * Guaranteed zero interaction blocking via pointer-events-none.
 */
const FixedWatermark = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-20 flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      <img
        src={LOGO_EMBLEM_PATH}
        alt=""
        className="h-auto w-[min(540px,78vw)] max-h-[72vh] object-contain opacity-[0.035] transition-opacity duration-500"
        draggable={false}
      />
    </div>
  )
}

export default FixedWatermark
