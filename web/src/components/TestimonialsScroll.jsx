import { getApiBase, getImageBase } from '../utils/apiBase.js'
import React, { useEffect, useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import LandingReveal from './landing/LandingReveal'
import CircularGallery from './ui/CircularGallery'
import './landing/LandingVoices.css'

const EMPTY_REVIEWS = Object.freeze([])

const PHOTO_BASE = '/meridian/voices'

/** Defaults when API has no reviews — short quotes, local portrait photos */
const staticTestimonials = [
  {
    name: 'Isha Patel',
    meta: 'Grade 12 · Ahmedabad',
    text: 'Weekly structure finally made revision predictable—I stopped cramming the night before exams.',
    photo: `${PHOTO_BASE}/isha-patel.jpg`,
  },
  {
    name: 'Rahul Sharma',
    meta: 'Parent · Delhi NCR',
    text: 'We get clear updates on pace and doubts; our child asks questions in class without hesitation now.',
    photo: `${PHOTO_BASE}/rahul-sharma.jpg`,
  },
  {
    name: 'Meena Iyer',
    meta: 'Undergraduate · Bengaluru',
    text: 'Small-group sessions turned vague topics into steps I could actually practise on my own.',
    photo: `${PHOTO_BASE}/meena-iyer.jpg`,
  },
  {
    name: 'Arjun Desai',
    meta: 'Grade 11 · Mumbai',
    text: 'Faculty explain the “why” behind methods—not just answers—so I remember concepts longer.',
    photo: `${PHOTO_BASE}/arjun-desai.jpg`,
  },
  {
    name: 'Kavya Reddy',
    meta: 'Working learner · Hyderabad',
    text: 'Recorded lessons fit around my hours; live Q&A filled the gaps the same week.',
    photo: `${PHOTO_BASE}/kavya-reddy.jpg`,
  },
  {
    name: 'Vikram Singh',
    meta: 'Grade 10 · Jaipur',
    text: 'The workshop day made abstract ideas concrete—group practice helped more than solo notes.',
    photo: `${PHOTO_BASE}/vikram-singh.jpg`,
  },
]

const studentPhoto = (idx) => staticTestimonials[idx % staticTestimonials.length].photo

const mapApiTestimonial = (r, idx, { preferStudentPhoto = false } = {}) => {
  let photo = studentPhoto(idx)
  if (!preferStudentPhoto && r.image) {
    const rawBase = getImageBase()
    const baseUrl = rawBase.replace(/\/api\/v1\/?$/, '')
    photo = `${baseUrl}${r.image.startsWith('/') ? '' : '/'}${r.image}`
  }
  const name = r.name || (r.userId && r.userId.fullName) || 'Verified Student'
  const role = r.role || r.designation || 'Learner'
  const place = r.company || ''
  const meta = place ? `${role} · ${place}` : role
  return {
    name,
    meta,
    text: (r.message || r.reviewText || r.text || '').trim(),
    photo,
  }
}

const mapPropReview = (r, idx, { preferStudentPhoto = false } = {}) => {
  let photo = studentPhoto(idx)
  if (!preferStudentPhoto && r.image) {
    const rawBase = getImageBase()
    const baseUrl = rawBase.replace(/\/api\/v1\/?$/, '')
    photo = `${baseUrl}${r.image.startsWith('/') ? '' : '/'}${r.image}`
  }
  const name = r.name || r.userName || 'Verified Student'
  const role = r.designation || r.role || 'Learner'
  const place = r.company || ''
  const meta = place ? `${role} · ${place}` : role
  return {
    name,
    meta,
    text: (r.reviewText || r.text || r.message || '').trim(),
    photo,
  }
}

const HALFTONE_MASK =
  'radial-gradient(ellipse 78% 62% at 50% 32%, transparent 42%, #000 84%)'

const quoteEase = [0.22, 1, 0.36, 1]

const QuoteMark = () => (
  <svg
    aria-hidden
    viewBox="0 0 40 32"
    className="mb-5 h-7 w-9 text-accent drop-shadow-[0_0_18px_rgba(216,184,64,0.4)] md:mb-6 md:h-8 md:w-10"
    fill="currentColor"
  >
    <path d="M15.4 32H0V17.6C0 7.9 5.4 1.3 14 0v7.4c-4 .7-6.2 3.4-6.2 7.6H15.4V32Zm24.6 0H24.6V17.6C24.6 7.9 30 1.3 38.6 0v7.4c-4 .7-6.2 3.4-6.2 7.6H40V32Z" />
  </svg>
)

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
    <p className="font-montserrat text-sm text-description leading-relaxed flex-1">&ldquo;{item.text}&rdquo;</p>
  </article>
)

const VoicesStage = ({ items, eyebrow, title, sub, label }) => {
  const [active, setActive] = useState(0)
  const current = items[active] ?? items[0]
  const galleryItems = items.map((item) => ({
    image: item.photo,
    text: item.name,
    alt: item.meta ? `${item.name}, ${item.meta}` : item.name,
  }))

  return (
    <LandingReveal
      id="student-testimonials"
      className="relative scroll-mt-28 overflow-hidden bg-brand-brown text-white md:scroll-mt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(216,184,64,0.7) 1.05px, transparent 1.15px)',
          backgroundSize: '5px 5px',
          maskImage: HALFTONE_MASK,
          WebkitMaskImage: HALFTONE_MASK,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 0.7px, transparent 0.85px)',
          backgroundSize: '9px 9px',
          maskImage: HALFTONE_MASK,
          WebkitMaskImage: HALFTONE_MASK,
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[8%] h-64 w-[42rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />
        <div className="absolute -bottom-24 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-white/[0.05] blur-[100px]" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-2 pt-14 text-center sm:px-10 md:pt-20">
        <p className="mb-5 font-jetbrains text-[10px] font-bold uppercase tracking-[0.45em] text-accent">
          {eyebrow}
        </p>
        <h2 className="font-newsreader italic text-3xl font-normal leading-[1.15] tracking-tight text-white sm:text-4xl md:text-[2.85rem]">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">{sub}</p>
      </div>

      <div className="relative z-10 mx-auto mt-6 max-w-3xl px-6 text-center sm:px-10 md:mt-8">
        <div className="relative min-h-[7.5rem] md:min-h-[8.5rem]">
          <AnimatePresence mode="wait">
            {current && (
              <motion.figure
                key={`${current.name}-${active}`}
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
                <figcaption className="mt-7 flex flex-col items-center gap-2">
                  <span className="h-px w-10 bg-accent/80" />
                  <cite className="font-newsreader not-italic text-lg text-white">{current.name}</cite>
                  {current.meta && (
                    <span className="font-jetbrains text-[10px] font-medium uppercase tracking-[0.28em] text-accent">
                      {current.meta}
                    </span>
                  )}
                </figcaption>
              </motion.figure>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div
        className="landing-voices-gallery relative z-10 mt-4 md:mt-2"
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
      >
        <div className="landing-voices-vignette" />
        <CircularGallery
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
          shadow={0.38}
          showTitles
          snap
          autoScroll={0.4}
          openOnClick={false}
          intro
          onActiveChange={setActive}
          aria-label={label}
          data-lenis-prevent=""
          data-lenis-prevent-wheel=""
        />
      </div>

      <div className="relative z-10 flex justify-center gap-2 pb-10 pt-1 md:pb-12">
        {items.map((item, index) => (
          <span
            key={`${item.name}-${index}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === active ? 'w-7 bg-accent' : 'w-1.5 bg-white/25'
            }`}
            aria-hidden
          />
        ))}
      </div>
    </LandingReveal>
  )
}

const TestimonialsScroll = ({ reviews, variant = 'default' }) => {
  const { t } = useLanguage()
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
        const rawBase = getApiBase()
        const baseUrl = rawBase.replace(/\/api\/v1\/?$/, '')
        const query = isLanding ? '?landing=true' : ''
        const res = await fetch(`${baseUrl}/testimonials${query}`, { signal: controller.signal })
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
      const valid = propReviews.filter((r) => r && (r.reviewText || r.text || r.message))
      if (valid.length > 0) return valid.map((r, idx) => mapPropReview(r, idx, { preferStudentPhoto: isLanding }))
    }

    if (apiTestimonials.length > 0) {
      const validApi = apiTestimonials.filter((r) => r && (r.message || r.reviewText || r.text))
      if (validApi.length > 0) return validApi.map((r, idx) => mapApiTestimonial(r, idx, { preferStudentPhoto: isLanding }))
    }

    return staticTestimonials
  }, [propReviews, propReviewCount, apiTestimonials, isLanding])

  if (loadingReviews) {
    return (
      <section className={`w-full py-16 md:py-20 px-4 md:px-8 ${isLanding ? 'bg-brand-brown' : 'bg-white border-y border-card-border'}`}>
        <div className="max-w-7xl mx-auto flex justify-center py-8">
          <div className={`h-9 w-9 border-4 rounded-full animate-spin ${isLanding ? 'border-white/20 border-t-accent' : 'border-brand-brown/20 border-t-accent'}`} />
        </div>
      </section>
    )
  }

  if (displayTestimonials.length === 0) return null

  if (isLanding) {
    return (
      <VoicesStage
        items={displayTestimonials}
        eyebrow={t('testimonialsEyebrow')}
        title={t('testimonialsTitle')}
        sub={t('testimonialsSub')}
        label={t('testimonialsTitle')}
      />
    )
  }

  return (
    <section id="student-testimonials" className="relative bg-white py-20 md:py-28 px-4 md:px-8 lg:px-12 border-y border-card-border">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-10 md:mb-12 space-y-4">
          <span className="font-jetbrains text-[10px] text-accent tracking-[0.5em] uppercase font-bold">
            {t('testimonialsEyebrow')}
          </span>
          <h2 className="font-newsreader italic text-3xl sm:text-4xl md:text-5xl text-normal font-light">
            {t('testimonialsTitle')}
          </h2>
          <p className="font-montserrat text-sm md:text-base text-description">{t('testimonialsSub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {displayTestimonials.map((item) => (
            <TestimonialCard key={`${item.name}-${item.meta}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsScroll
