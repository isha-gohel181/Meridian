import { getApiBase, getImageBase } from '../utils/apiBase.js'
import React, { useEffect, useState, useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'

const EMPTY_REVIEWS = Object.freeze([])

const PHOTO_BASE = '/dental_acadmy/testimonials'

/** Defaults when API has no reviews — short quotes, local portrait photos */
const staticTestimonials = [
  {
    name: 'Dr. Isha Patel',
    meta: 'BDS · Ahmedabad',
    text: 'Case selection aur wire sequencing clear ho gaya—ab clinic me fixed cases confidently start karti hoon.',
    photo: `${PHOTO_BASE}/isha-patel.jpg`,
  },
  {
    name: 'Dr. Rahul Sharma',
    meta: 'MDS · Delhi NCR',
    text: 'Mechanics sessions bilkul chairside jaisi feel dete hain. Finishing ab guesswork nahi lagta.',
    photo: `${PHOTO_BASE}/rahul-sharma.jpg`,
  },
  {
    name: 'Dr. Meena Iyer',
    meta: 'BDS · Bengaluru',
    text: 'Live case discussions ne slow progress par plan revise karna sikhaya—textbook se zyada practical.',
    photo: `${PHOTO_BASE}/meena-iyer.jpg`,
  },
  {
    name: 'Dr. Arjun Desai',
    meta: 'BDS · Mumbai',
    text: 'Aligner staging aur patient communication structured modules me cover hua—selection ab confident lagti hai.',
    photo: `${PHOTO_BASE}/arjun-desai.jpg`,
  },
  {
    name: 'Dr. Kavya Reddy',
    meta: 'BDS · Hyderabad',
    text: 'Recorded lectures clinic ke beech dekh paati hoon; live doubts ne concepts seal kar diye.',
    photo: `${PHOTO_BASE}/kavya-reddy.jpg`,
  },
  {
    name: 'Dr. Vikram Singh',
    meta: 'BDS · Jaipur',
    text: 'Offline workshop me jo haath se seekha, wahi agle hafte clinic me use kiya.',
    photo: `${PHOTO_BASE}/vikram-singh.jpg`,
  },
]

const mapApiTestimonial = (r, idx) => {
  let photo = null
  if (r.image) {
    const rawBase = getImageBase()
    const baseUrl = rawBase.replace(/\/api\/v1\/?$/, '')
    photo = `${baseUrl}${r.image.startsWith('/') ? '' : '/'}${r.image}`
  } else {
    photo = staticTestimonials[idx % staticTestimonials.length].photo
  }
  const name = r.name || (r.userId && r.userId.fullName) || 'Verified Student'
  const role = r.role || r.designation || 'Dental Professional'
  const place = r.company || ''
  const meta = place ? `${role} · ${place}` : role
  return {
    name,
    meta,
    text: (r.message || r.reviewText || r.text || '').trim(),
    photo,
  }
}

const mapPropReview = (r, idx) => {
  let photo = null
  if (r.image) {
    const rawBase = getImageBase()
    const baseUrl = rawBase.replace(/\/api\/v1\/?$/, '')
    photo = `${baseUrl}${r.image.startsWith('/') ? '' : '/'}${r.image}`
  } else {
    photo = staticTestimonials[idx % staticTestimonials.length].photo
  }
  const name = r.name || r.userName || 'Verified Student'
  const role = r.designation || r.role || 'Dental Professional'
  const place = r.company || ''
  const meta = place ? `${role} · ${place}` : role
  return {
    name,
    meta,
    text: (r.reviewText || r.text || r.message || '').trim(),
    photo,
  }
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
    <p className="font-montserrat text-sm text-description leading-relaxed flex-1">&ldquo;{item.text}&rdquo;</p>
  </article>
)

const TestimonialsScroll = ({ reviews, variant = 'default' }) => {
  const { t } = useLanguage()
  const propReviews = Array.isArray(reviews) ? reviews : EMPTY_REVIEWS
  const [apiTestimonials, setApiTestimonials] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(variant === 'landing')
  const isLanding = variant === 'landing'
  const propReviewCount = propReviews.length

  useEffect(() => {
    if (propReviewCount > 0) {
      setLoadingReviews(false)
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 15000)

    const fetchLiveTestimonials = async () => {
      if (isLanding) setLoadingReviews(true)
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
        if (!controller.signal.aborted) setLoadingReviews(false)
      }
    }

    fetchLiveTestimonials()
    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [isLanding, propReviewCount])

  const displayTestimonials = useMemo(() => {
    if (propReviewCount > 0) {
      const valid = propReviews.filter((r) => r && (r.reviewText || r.text || r.message))
      if (valid.length > 0) return valid.map((r, idx) => mapPropReview(r, idx))
    }

    if (apiTestimonials.length > 0) {
      const validApi = apiTestimonials.filter((r) => r && (r.message || r.reviewText || r.text))
      if (validApi.length > 0) return validApi.map((r, idx) => mapApiTestimonial(r, idx))
    }

    return staticTestimonials
  }, [propReviews, propReviewCount, apiTestimonials])

  if (loadingReviews) {
    return (
      <section className="w-full bg-white py-16 md:py-20 px-4 md:px-8 border-y border-card-border">
        <div className="max-w-7xl mx-auto flex justify-center py-8">
          <div className="h-9 w-9 border-4 border-brand-brown/20 border-t-accent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  if (displayTestimonials.length === 0) return null

  return (
    <section id="student-testimonials" className="relative bg-white py-20 md:py-28 px-4 md:px-8 lg:px-12 border-y border-card-border">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12 md:mb-14 space-y-4">
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
