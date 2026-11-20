import { getApiBase, resolveMediaUrl } from '../utils/apiBase.js'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { useSelector } from 'react-redux'
import LandingReveal from './landing/LandingReveal'
import CircularGallery from './ui/CircularGallery'
import './landing/LandingVoices.css'

const MotionFigure = motion.figure

const EMPTY_REVIEWS = Object.freeze([])

const PHOTO_BASE = '/meridian/voices'

/** Defaults when API has no reviews — short quotes, local portrait photos */
const staticTestimonials = [
  {
    id: 'static-0',
    name: 'Isha Patel',
    meta: 'Grade 12 · Ahmedabad',
    text: 'Weekly structure finally made revision predictable—I stopped cramming the night before exams.',
    photo: `${PHOTO_BASE}/isha-patel.jpg`,
  },
  {
    id: 'static-1',
    name: 'Rahul Sharma',
    meta: 'Parent · Delhi NCR',
    text: 'We get clear updates on pace and doubts; our child asks questions in class without hesitation now.',
    photo: `${PHOTO_BASE}/rahul-sharma.jpg`,
  },
  {
    id: 'static-2',
    name: 'Meena Iyer',
    meta: 'Undergraduate · Bengaluru',
    text: 'Small-group sessions turned vague topics into steps I could actually practise on my own.',
    photo: `${PHOTO_BASE}/meena-iyer.jpg`,
  },
  {
    id: 'static-3',
    name: 'Arjun Desai',
    meta: 'Grade 11 · Mumbai',
    text: 'Faculty explain the “why” behind methods—not just answers—so I remember concepts longer.',
    photo: `${PHOTO_BASE}/arjun-desai.jpg`,
  },
  {
    id: 'static-4',
    name: 'Kavya Reddy',
    meta: 'Working learner · Hyderabad',
    text: 'Recorded lessons fit around my hours; live Q&A filled the gaps the same week.',
    photo: `${PHOTO_BASE}/kavya-reddy.jpg`,
  },
  {
    id: 'static-5',
    name: 'Vikram Singh',
    meta: 'Grade 10 · Jaipur',
    text: 'The workshop day made abstract ideas concrete—group practice helped more than solo notes.',
    photo: `${PHOTO_BASE}/vikram-singh.jpg`,
  },
]

const studentPhoto = (idx) => staticTestimonials[idx % staticTestimonials.length].photo

function isApprovedLandingRow(r) {
  if (!r) return false
  if (r.status && r.status !== 'approved') return false
  if (r.showOnLanding === false) return false
  return Boolean(r.message || r.reviewText || r.text)
}

const mapApiTestimonial = (r, idx) => {
  const photo = r.image ? resolveMediaUrl(r.image) : studentPhoto(idx)
  const name = r.name || (r.userId && r.userId.fullName) || 'Verified Student'
  const role = r.role || r.designation || 'Learner'
  const place = r.company || ''
  const meta = place ? `${role} · ${place}` : role
  const tag = (r.tag || '').trim()
  const outcome = (r.outcome || '').trim()
  const accent = [tag, outcome].filter(Boolean).join(' · ') || null
  const rating = typeof r.rating === 'number' && r.rating >= 1 && r.rating <= 5 ? r.rating : null

  return {
    id: r._id || `api-${idx}`,
    name,
    meta,
    text: (r.message || r.reviewText || r.text || '').trim(),
    photo,
    rating,
    accent,
  }
}

const mapPropReview = (r, idx) => {
  const photo = r.image ? resolveMediaUrl(r.image) : studentPhoto(idx)
  const name = r.name || r.userName || 'Verified Student'
  const role = r.designation || r.role || 'Learner'
  const place = r.company || ''
  const meta = place ? `${role} · ${place}` : role
  const tag = (r.tag || '').trim()
  const outcome = (r.outcome || '').trim()
  const accent = [tag, outcome].filter(Boolean).join(' · ') || null
  const rating = typeof r.rating === 'number' && r.rating >= 1 && r.rating <= 5 ? r.rating : null

  return {
    id: r._id || r.id || `prop-${idx}`,
    name,
    meta,
    text: (r.reviewText || r.text || r.message || '').trim(),
    photo,
    rating,
    accent,
  }
}

const HALFTONE_MASK =
  'radial-gradient(ellipse 92% 88% at 50% 42%, transparent 62%, #000 100%)'

const quoteEase = [0.22, 1, 0.36, 1]

const QuoteMark = () => (
  <svg
    aria-hidden
    viewBox="0 0 40 32"
    className="mb-5 h-7 w-9 text-accent md:mb-6 md:h-8 md:w-10"
    fill="currentColor"
  >
    <path d="M15.4 32H0V17.6C0 7.9 5.4 1.3 14 0v7.4c-4 .7-6.2 3.4-6.2 7.6H15.4V32Zm24.6 0H24.6V17.6C24.6 7.9 30 1.3 38.6 0v7.4c-4 .7-6.2 3.4-6.2 7.6H40V32Z" />
  </svg>
)

const StarRow = ({ rating, className = '' }) => {
  if (!rating) return null
  const label = `${rating} out of 5 stars`
  return (
    <div
      className={`flex items-center justify-center gap-0.5 ${className}`}
      role="img"
      aria-label={label}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`h-3.5 w-3.5 ${n <= rating ? 'text-accent' : 'text-white/25'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const TestimonialCard = ({ item }) => (
  <article className="flex flex-col h-full p-6 md:p-7 rounded-2xl bg-dark/80 border border-card-border hover:border-accent/25 transition-colors">
    <div className="flex items-center gap-4 mb-5">
      <img
        src={item.photo}
        alt=""
        width={56}
        height={56}
        className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
        loading="lazy"
        decoding="async"
      />
      <div className="min-w-0">
        <h3 className="font-montserrat text-sm md:text-base font-semibold text-normal truncate">{item.name}</h3>
        <p className="font-montserrat text-xs text-description truncate">{item.meta}</p>
      </div>
    </div>
    <StarRow rating={item.rating} className="mb-3 justify-start" />
    <p className="font-montserrat text-sm text-description leading-relaxed flex-1">&ldquo;{item.text}&rdquo;</p>
  </article>
)

const VoicesStage = ({ items, eyebrow, title, sub, label }) => {
  const [active, setActive] = useState(0)
  const galleryRef = useRef(null)
  const current = items[active] ?? items[0]
  const galleryItems = items.map((item) => ({
    image: item.photo,
    text: item.name,
    alt: item.meta ? `${item.name}, ${item.meta}` : item.name,
  }))

  const handleGoTo = (index) => {
    setActive(index)
    galleryRef.current?.goTo(index)
  }

  const handlePrev = () => {
    const prev = Math.max(0, active - 1)
    setActive(prev)
    galleryRef.current?.goTo(prev)
  }

  const handleNext = () => {
    const next = Math.min(items.length - 1, active + 1)
    setActive(next)
    galleryRef.current?.goTo(next)
  }

  return (
    <LandingReveal
      id="student-testimonials"
      className="relative scroll-mt-28 overflow-hidden bg-brand-brown text-white md:scroll-mt-32"
    >
      {/* Top transition seam from slate-50 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-50/10 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[58%] opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(216,184,64,0.7) 1.05px, transparent 1.15px)',
          backgroundSize: '5px 5px',
          maskImage: HALFTONE_MASK,
          WebkitMaskImage: HALFTONE_MASK,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[58%] opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 0.7px, transparent 0.85px)',
          backgroundSize: '9px 9px',
          maskImage: HALFTONE_MASK,
          WebkitMaskImage: HALFTONE_MASK,
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-2 pt-14 text-center sm:px-10 md:pt-20">
        {eyebrow ? (
          <p className="font-jetbrains text-[10px] font-bold uppercase tracking-[0.45em] text-accent">{eyebrow}</p>
        ) : null}
        <h2
          className={`font-newsreader text-3xl font-normal italic leading-[1.15] tracking-tight text-white sm:text-4xl md:text-[2.85rem] ${
            eyebrow ? 'mt-3' : ''
          }`}
        >
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">{sub}</p>
      </div>

      <div className="relative z-10 mx-auto mt-6 max-w-3xl px-6 text-center sm:px-10 md:mt-8">
        <div className="relative min-h-[7.5rem] md:min-h-[8.5rem]">
          <AnimatePresence mode="wait">
            {current && (
              <MotionFigure
                key={current.id || `${current.name}-${active}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: quoteEase }}
                className="relative flex flex-col items-center"
              >
                <QuoteMark />
                <blockquote className="font-newsreader text-[1.35rem] font-normal italic leading-[1.35] text-white sm:text-2xl md:text-[1.85rem]">
                  {current.text}
                </blockquote>
                <StarRow rating={current.rating} className="mt-5" />
                <figcaption className="mt-7 flex flex-col items-center gap-2">
                  <span className="h-px w-10 bg-accent/80" />
                  <cite className="font-newsreader not-italic text-lg text-white">{current.name}</cite>
                  {current.meta ? <span className="text-sm text-accent/90">{current.meta}</span> : null}
                  {current.accent ? (
                    <span className="max-w-md text-xs font-medium uppercase tracking-wide text-white/55">
                      {current.accent}
                    </span>
                  ) : null}
                </figcaption>
              </MotionFigure>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="landing-voices-gallery relative z-10 mt-4 md:mt-2">
        <div className="landing-voices-vignette" />
        <CircularGallery
          ref={galleryRef}
          items={galleryItems}
          bend={2.6}
          textColor="#f7f1de"
          borderRadius={0.08}
          font="500 30px Newsreader"
          scrollSpeed={2}
          scrollEase={0.05}
          itemSize={0.72}
          itemAspect={0.74}
          gap={0.28}
          wave={0.65}
          fadeEdges={0.16}
          shadow={0}
          showTitles
          snap
          loop={false}
          captureVerticalWheel={false}
          autoScroll={0.4}
          openOnClick={false}
          intro
          onActiveChange={setActive}
          aria-label={label}
        />
      </div>

      {/* Interactive pagination & navigation controls */}
      <div className="relative z-10 flex items-center justify-center gap-4 pb-10 pt-2 md:pb-12">
        <button
          type="button"
          onClick={handlePrev}
          disabled={active === 0}
          aria-label="Previous testimonial"
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all md:h-9 md:w-9 ${
            active === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:border-accent hover:bg-white/10 hover:text-accent'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {items.map((item, index) => (
            <button
              key={item.id || `${item.name}-${index}`}
              type="button"
              onClick={() => handleGoTo(index)}
              aria-label={`Go to testimonial ${index + 1}: ${item.name}`}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                index === active ? 'w-8 bg-accent shadow-sm' : 'w-2 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={active === items.length - 1}
          aria-label="Next testimonial"
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all md:h-9 md:w-9 ${
            active === items.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:border-accent hover:bg-white/10 hover:text-accent'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Bottom transition seam into LandingAbout (slate-50) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-black/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
      />
    </LandingReveal>
  )
}

const TestimonialsScroll = ({ reviews, variant = 'default' }) => {
  const { t } = useLanguage()
  const landingCopy = useSelector((state) => state.config?.settings?.landingTestimonials) || {}
  const propReviews = Array.isArray(reviews) ? reviews : EMPTY_REVIEWS
  const [apiTestimonials, setApiTestimonials] = useState([])
  const isLanding = variant === 'landing'
  const propReviewCount = propReviews.length
  const skipApiFetch = propReviewCount > 0
  const [fetchCompleted, setFetchCompleted] = useState(false)

  const loadingReviews = isLanding && propReviewCount === 0 && !fetchCompleted

  useEffect(() => {
    if (skipApiFetch) return

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 15000)

    const fetchLiveTestimonials = async () => {
      try {
        const base = getApiBase().replace(/\/$/, '')
        const query = isLanding ? '?landing=true' : ''
        const res = await fetch(`${base}/testimonials${query}`, { signal: controller.signal })
        if (res.ok) {
          const json = await res.json()
          const items = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []
          setApiTestimonials(items)
        } else {
          setApiTestimonials([])
        }
      } catch (err) {
        if (err?.name !== 'AbortError') setApiTestimonials([])
      } finally {
        window.clearTimeout(timeoutId)
        if (!controller.signal.aborted) setFetchCompleted(true)
      }
    }

    fetchLiveTestimonials()
    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [isLanding, skipApiFetch])

  const displayTestimonials = useMemo(() => {
    if (propReviewCount > 0) {
      const valid = propReviews.filter(
        (r) => r && (r.reviewText || r.text || r.message) && (!isLanding || isApprovedLandingRow(r))
      )
      if (valid.length > 0) return valid.map((r, idx) => mapPropReview(r, idx))
    }

    if (apiTestimonials.length > 0) {
      const validApi = apiTestimonials.filter(
        (r) => (r.message || r.reviewText || r.text) && (!isLanding || isApprovedLandingRow(r))
      )
      if (validApi.length > 0) return validApi.map((r, idx) => mapApiTestimonial(r, idx))
    }

    return staticTestimonials
  }, [propReviews, propReviewCount, apiTestimonials, isLanding])

  if (loadingReviews) {
    return (
      <section className={`w-full py-16 md:py-20 px-4 md:px-8 ${isLanding ? 'bg-brand-brown' : 'bg-white border-y border-card-border'}`}>
        <div className="site-container flex justify-center py-8">
          <div className={`h-9 w-9 border-4 rounded-full animate-spin ${isLanding ? 'border-white/20 border-t-accent' : 'border-brand-brown/20 border-t-accent'}`} />
        </div>
      </section>
    )
  }

  if (displayTestimonials.length === 0) return null

  if (isLanding) {
    const eyebrow = landingCopy.eyebrow || t('testimonialsEyebrow')
    const title = landingCopy.title || t('testimonialsTitle')
    const sub = landingCopy.subtitle || landingCopy.sub || t('testimonialsSub')
    return (
      <VoicesStage
        items={displayTestimonials}
        eyebrow={eyebrow}
        title={title}
        sub={sub}
        label={title}
      />
    )
  }

  return (
    <section id="student-testimonials" className="relative bg-white py-20 md:py-28 px-4 md:px-8 lg:px-12 border-y border-card-border">
      <div className="site-container">
        <div className="max-w-2xl mb-10 md:mb-12 space-y-4">
          <p className="font-jetbrains text-[10px] font-bold uppercase tracking-[0.45em] text-accent">
            {t('testimonialsEyebrow')}
          </p>
          <h2 className="font-newsreader italic text-3xl sm:text-4xl md:text-5xl text-normal font-light">
            {t('testimonialsTitle')}
          </h2>
          <p className="font-montserrat text-sm md:text-base text-description">{t('testimonialsSub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {displayTestimonials.map((item) => (
            <TestimonialCard key={item.id || `${item.name}-${item.meta}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsScroll
