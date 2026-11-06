import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import TextLoop from '../ui/TextLoop'

/**
 * Full-width strip between landing sections. Ribbon follows a gentle wave.
 */
const LandingMarqueeStrip = () => {
  const { t } = useLanguage()

  return (
    <div
      className="relative isolate h-[clamp(5.25rem,17vw,14.5rem)] w-full overflow-hidden bg-slate-50"
      aria-hidden
    >
      <div className="absolute inset-x-0 top-1/2 w-full -translate-y-1/2 opacity-[0.97]">
        <TextLoop
          text={t('heroMarquee')}
          shape="wave"
          curviness={38}
          tilt={0}
          speed={50}
          separator="·"
          fontSize={26}
          fontWeight={700}
          letterSpacing={1.5}
          uppercase={false}
          ribbon
          ribbonColor="#032746"
          ribbonWidth={46}
          color="#FFFFFF"
          edgeFade={0.38}
          pauseOnHover={false}
          cross={false}
        />
      </div>
    </div>
  )
}

export default LandingMarqueeStrip
