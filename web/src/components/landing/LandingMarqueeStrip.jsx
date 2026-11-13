import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import TextLoop from '../ui/TextLoop'

const MOBILE_MQ = '(max-width: 639px)'

/**
 * Full-width strip between landing sections. Ribbon follows a gentle wave.
 */
const LandingMarqueeStrip = () => {
  const { t } = useLanguage()
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_MQ).matches
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const mq = window.matchMedia(MOBILE_MQ)
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <div
      className="relative isolate w-full overflow-x-hidden overflow-y-visible bg-slate-50 py-2 sm:overflow-hidden sm:py-0 h-[clamp(13rem,58vw,16rem)] sm:h-[clamp(6rem,17vw,14.5rem)]"
      aria-hidden
    >
      <div className="absolute inset-0 flex items-center">
        <TextLoop
          className="text-loop--marquee-strip w-full"
          text={t('heroMarquee')}
          shape="wave"
          curviness={isMobile ? 22 : 38}
          tilt={0}
          speed={45}
          separator="·"
          fontSize={isMobile ? 36 : 26}
          fontWeight={700}
          letterSpacing={isMobile ? 0.9 : 1.5}
          uppercase={false}
          ribbon
          ribbonColor="#032746"
          ribbonWidth={isMobile ? 108 : 46}
          color="#FFFFFF"
          edgeFade={isMobile ? 0 : 0.38}
          preserveAspectRatio={isMobile ? 'xMidYMid slice' : 'xMidYMid meet'}
          pauseOnHover={false}
          cross={false}
        />
      </div>
    </div>
  )
}

export default LandingMarqueeStrip
