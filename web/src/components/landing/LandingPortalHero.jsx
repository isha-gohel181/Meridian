import React, { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { WHATSAPP_URL } from '../../constants/brand'
import { useLanguage } from '../../context/LanguageContext'
import { resolveMediaUrl } from '../../utils/apiBase'

gsap.registerPlugin(ScrollTrigger)

const HERO_BG = '/meridian/hero_bg_1.png'
const SECTION_SCROLL_VH = 250

const whatsAppHref = `${WHATSAPP_URL}?text=${encodeURIComponent(
  'Hello Meridian Group of Education, I would like to know more about your programs.'
)}`

function splitHeroTitle(title) {
  if (!title) return ['', '']
  const dot = title.indexOf('. ')
  if (dot !== -1) {
    return [title.slice(0, dot + 1).trim(), title.slice(dot + 2).trim()].filter(Boolean)
  }
  const mid = Math.floor(title.length / 2)
  const leftSpace = title.lastIndexOf(' ', mid)
  if (leftSpace > 0) {
    return [title.slice(0, leftSpace), title.slice(leftSpace + 1)]
  }
  const half = Math.ceil(title.length / 2)
  return [title.slice(0, half), title.slice(half)]
}

const HeroActions = ({
  variant,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
}) => {
  const rest = variant === 'rest'
  const isExternalSecondary =
    secondaryCtaLink?.startsWith('http://') || secondaryCtaLink?.startsWith('https://')

  return (
    <div className={`mt-8 flex flex-wrap items-center gap-3 ${rest ? 'flex-row justify-start' : 'flex-col sm:flex-row justify-center'}`}>
      <Link
        to={primaryCtaLink || '/courses'}
        className={`inline-flex justify-center rounded-xl px-7 py-3.5 font-jetbrains text-xs font-bold uppercase tracking-[0.2em] transition-transform hover:scale-[1.02] active:scale-[0.98] ${
          rest ? 'bg-white text-brand-brown' : 'bg-brand-brown text-white'
        }`}
      >
        {primaryCtaText}
      </Link>
      <a
        href={secondaryCtaLink || whatsAppHref}
        target={isExternalSecondary ? '_blank' : '_self'}
        rel={isExternalSecondary ? 'noopener noreferrer' : undefined}
        className={`inline-flex items-center justify-center rounded-xl px-6 py-3.5 font-jetbrains text-xs font-semibold uppercase tracking-[0.15em] transition-transform hover:scale-[1.02] active:scale-[0.98] ${
          rest ? 'bg-brand-brown text-white' : 'bg-white text-brand-brown'
        }`}
      >
        {secondaryCtaText}
      </a>
    </div>
  )
}

const HeroCopy = ({
  variant,
  parts,
  line2,
  heading,
  subline,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
}) => {
  const rest = variant === 'rest'
  const TitleTag = heading ? 'h1' : 'p'

  if (rest) {
    return (
      <div className="site-container flex min-h-[calc(100dvh-58px)] flex-col justify-center items-start text-left">
        <div className="w-full max-w-xl text-left">
          <TitleTag
            className="font-newsreader text-3xl font-medium leading-[1.12] tracking-[-0.02em] text-white sm:text-4xl md:text-5xl lg:text-[3.15rem]"
          >
            <span className="block">{parts[0]}</span>
            {line2 ? <span className="mt-1 block">{line2}</span> : null}
          </TitleTag>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base md:text-lg">
            {subline}
          </p>
          <HeroActions
            variant={variant}
            primaryCtaText={primaryCtaText}
            primaryCtaLink={primaryCtaLink}
            secondaryCtaText={secondaryCtaText}
            secondaryCtaLink={secondaryCtaLink}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="site-container mx-auto flex w-full max-w-2xl flex-col items-center justify-center text-center">
      <TitleTag
        className="font-newsreader text-3xl font-medium leading-[1.12] tracking-[-0.02em] text-brand-brown sm:text-4xl md:text-5xl lg:text-[3.15rem]"
      >
        <span className="block">{parts[0]}</span>
        {line2 ? <span className="mt-1 block">{line2}</span> : null}
      </TitleTag>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-description sm:text-base md:text-lg mx-auto">
        {subline}
      </p>
    </div>
  )
}

const ScrollChevron = () => (
  <svg
    className="motion-safe:animate-bounce h-4 w-4 text-brand-brown/70"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const LandingPortalHero = () => {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  const panelLRef = useRef(null)
  const panelRRef = useRef(null)
  const imgRef = useRef(null)
  const veilRef = useRef(null)
  const overlayRef = useRef(null)
  const scrimRef = useRef(null)
  const dotLRef = useRef(null)
  const dotRRef = useRef(null)
  const introCopyRef = useRef(null)
  const restCopyRef = useRef(null)
  const scrollHintRef = useRef(null)

  const heroSettings = useSelector((state) => state.config?.settings?.landingHero) || {}
  const heroTitle = heroSettings.title || t('heroTitle')
  const heroSubline = heroSettings.subline || t('heroSubline')
  const primaryCtaText = heroSettings.primaryCtaText || t('browseCourses')
  const primaryCtaLink = heroSettings.primaryCtaLink || '/courses'
  const secondaryCtaText = heroSettings.secondaryCtaText || t('landingCtaWhatsApp')
  const secondaryCtaLink = heroSettings.secondaryCtaLink || whatsAppHref
  const bgImage = heroSettings.bgImage ? resolveMediaUrl(heroSettings.bgImage) : HERO_BG

  const parts = useMemo(() => splitHeroTitle(heroTitle), [heroTitle])
  const line2 = parts[1] || ''

  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (reducedMotion.current) {
      gsap.set(panelLRef.current, { xPercent: -105 })
      gsap.set(panelRRef.current, { xPercent: 105 })
      gsap.set(imgRef.current, { scale: 1 })
      gsap.set(overlayRef.current, { opacity: 0.12 })
      gsap.set(veilRef.current, { opacity: 0.45 })
      gsap.set(scrimRef.current, { opacity: 1 })
      gsap.set(dotLRef.current, { left: '14%', top: '20%', xPercent: -50, yPercent: -50 })
      gsap.set(dotRRef.current, { left: '86%', top: '78%', xPercent: -50, yPercent: -50 })
      gsap.set(introCopyRef.current, { autoAlpha: 0, y: 0, pointerEvents: 'none' })
      gsap.set(restCopyRef.current, { opacity: 1, y: 0, pointerEvents: 'auto' })
      gsap.set(scrollHintRef.current, { opacity: 0, pointerEvents: 'none' })
      if (introCopyRef.current) introCopyRef.current.inert = true
      if (restCopyRef.current) restCopyRef.current.inert = false
      if (scrollHintRef.current) {
        scrollHintRef.current.inert = true
        scrollHintRef.current.setAttribute('aria-hidden', 'true')
      }
      return undefined
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const restOn = self.progress >= 0.7
            const hintHidden = self.progress >= 0.32
            if (introCopyRef.current) introCopyRef.current.inert = restOn
            if (restCopyRef.current) restCopyRef.current.inert = !restOn
            if (scrollHintRef.current) {
              scrollHintRef.current.inert = hintHidden
              scrollHintRef.current.setAttribute('aria-hidden', hintHidden ? 'true' : 'false')
            }
          },
        },
      })

      tl.fromTo(panelLRef.current, { xPercent: 0 }, { xPercent: -105, ease: 'none', duration: 1 }, 0)
        .fromTo(panelRRef.current, { xPercent: 0 }, { xPercent: 105, ease: 'none', duration: 1 }, 0)
        .fromTo(imgRef.current, { scale: 1.08 }, { scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 0.12, ease: 'none', duration: 1 }, 0)
        .fromTo(veilRef.current, { opacity: 0.3 }, { opacity: 0.48, ease: 'none', duration: 1 }, 0)
        .fromTo(
          dotLRef.current,
          { left: '50%', top: '50%', xPercent: -50, yPercent: -50 },
          { left: '14%', top: '20%', xPercent: -50, yPercent: -50, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          dotRRef.current,
          { left: '50%', top: '50%', xPercent: -50, yPercent: -50 },
          { left: '86%', top: '78%', xPercent: -50, yPercent: -50, ease: 'none', duration: 1 },
          0
        )
        .fromTo(scrollHintRef.current, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 10, ease: 'none', duration: 0.28 }, 0.12)
        .fromTo(scrollHintRef.current, { pointerEvents: 'auto' }, { pointerEvents: 'none', duration: 0.01 }, 0.32)
        .fromTo(
          introCopyRef.current,
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -16, ease: 'none', duration: 0.72 },
          0.04
        )
        .fromTo(introCopyRef.current, { pointerEvents: 'auto' }, { pointerEvents: 'none', duration: 0.01 }, 0.4)
        .fromTo(scrimRef.current, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.3 }, 0.68)
        .fromTo(restCopyRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, ease: 'none', duration: 0.32 }, 0.7)
        .fromTo(restCopyRef.current, { pointerEvents: 'none' }, { pointerEvents: 'auto', duration: 0.01 }, 0.78)
    }, section)

    const refresh = () => {
      try {
        ScrollTrigger.refresh()
      } catch {
        /* ignore */
      }
    }
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(refresh)
    }
    requestAnimationFrame(refresh)
    window.addEventListener('resize', refresh)

    return () => {
      window.removeEventListener('resize', refresh)
      ctx.revert()
    }
  }, [parts, line2])

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-slate-50"
      style={{ minHeight: `${SECTION_SCROLL_VH}vh` }}
      aria-label={t('landingPortalHeroAria')}
    >
      <div className="sticky top-0 isolate min-h-[100dvh] overflow-hidden pt-[58px]">
        <div className="absolute inset-0 z-0">
          <img
            ref={imgRef}
            alt=""
            src={bgImage}
            className="absolute inset-0 h-full w-full object-cover object-center lg:object-[28%_center]"
            loading="eager"
            fetchPriority="high"
          />
          <div
            ref={overlayRef}
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{
              background: 'linear-gradient(135deg, rgba(196, 162, 58, 0.28) 0%, rgba(3, 39, 70, 0.38) 100%)',
            }}
            aria-hidden
          />
          <div
            ref={veilRef}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(245,248,250,0.2)_45%,rgba(3,39,70,0.42)_100%)]"
            aria-hidden
          />
        </div>

        <div
          ref={panelLRef}
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[55%] bg-slate-50"
          aria-hidden
        />
        <div
          ref={panelRRef}
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[55%] bg-slate-50"
          aria-hidden
        />

        <div
          ref={scrimRef}
          className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-[min(44rem,65%)] bg-gradient-to-r from-brand-brown/95 via-brand-brown/70 to-transparent opacity-0"
          aria-hidden
        />

        <div
          ref={dotLRef}
          className="pointer-events-none absolute z-[2] h-2.5 w-2.5 rounded-full border border-accent bg-transparent ring-2 ring-accent/35"
          aria-hidden
        />
        <div
          ref={dotRRef}
          className="pointer-events-none absolute z-[2] h-2.5 w-2.5 rounded-full border border-brand-brown bg-transparent ring-2 ring-brand-brown/30"
          aria-hidden
        />

        <div
          ref={introCopyRef}
          className="absolute inset-x-0 top-[58px] z-[3] flex min-h-[calc(100dvh-58px)] justify-center"
        >
          <HeroCopy
            variant="intro"
            parts={parts}
            line2={line2}
            heading
            subline={heroSubline}
            primaryCtaText={primaryCtaText}
            primaryCtaLink={primaryCtaLink}
            secondaryCtaText={secondaryCtaText}
            secondaryCtaLink={secondaryCtaLink}
          />
        </div>

        <div ref={restCopyRef} className="absolute inset-x-0 top-[58px] z-[3] opacity-0" aria-hidden inert>
          <HeroCopy
            variant="rest"
            parts={parts}
            line2={line2}
            heading={false}
            subline={heroSubline}
            primaryCtaText={primaryCtaText}
            primaryCtaLink={primaryCtaLink}
            secondaryCtaText={secondaryCtaText}
            secondaryCtaLink={secondaryCtaLink}
          />
        </div>

        <div
          ref={scrollHintRef}
          className="pointer-events-none absolute bottom-8 left-1/2 z-[3] flex -translate-x-1/2 flex-col items-center gap-2"
          aria-label={t('landingPortalScrollAria')}
        >
          <span className="font-jetbrains text-[10px] font-bold uppercase tracking-[0.4em] text-brand-brown/75">
            {t('landingPortalScrollHint')}
          </span>
          <ScrollChevron />
        </div>
      </div>
    </section>
  )
}

export default LandingPortalHero
