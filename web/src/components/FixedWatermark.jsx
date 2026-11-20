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
      className={`pointer-events-none fixed inset-0 z-[10] flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      <img
        src={LOGO_EMBLEM_PATH}
        alt=""
        className="h-auto w-[min(540px,78vw)] max-h-[72vh] translate-y-[4%] object-contain opacity-[0.045] mix-blend-multiply transition-opacity duration-500 supports-[mix-blend-mode:soft-light]:mix-blend-soft-light"
        draggable={false}
      />
    </div>
  )
}

export default FixedWatermark