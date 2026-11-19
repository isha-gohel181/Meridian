import React, { useMemo } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import LandingReveal from './LandingReveal'
import './LandingBendingMarquee.css'

const LandingBendingMarquee = () => {
  const { t } = useLanguage()

  const items = useMemo(() => {
    const raw = t('heroMarquee')
    return raw
      .split('·')
      .map((part) => part.trim())
      .filter(Boolean)
  }, [t])

  const sequence = (
    <div className="flex shrink-0 items-center gap-7 pr-7">
      {items.map((phrase) => (
        <span key={phrase} className="flex items-center gap-7">
          <span>{phrase}</span>
          <span className="text-accent" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </div>
  )

  return (
    <LandingReveal variant="fade" className="relative w-full bg-slate-50 py-8 sm:py-10" aria-hidden>
      <div className="landing-simple-marquee bg-brand-brown py-3.5 font-newsreader text-[1.15rem] font-semibold tracking-wide text-white sm:py-4 sm:text-[1.35rem]">
        <div className="landing-simple-marquee__track">
          {sequence}
          {sequence}
        </div>
      </div>
    </LandingReveal>
  )
}

export default LandingBendingMarquee
