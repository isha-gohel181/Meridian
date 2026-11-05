import { getApiBase, getImageBase } from '../utils/apiBase.js';
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

/** Stable default — avoid `reviews = []` in props (new array every render breaks useEffect). */
const EMPTY_REVIEWS = Object.freeze([])

const staticTestimonials = [
  {
    name: 'Dr. Ananya K.',
    role: 'General Dentist',
    company: 'Private Practice',
    tag: 'ORTHODONTIC TRAINING',
    outcome: 'Started first aligner cases',
    text: 'The case-selection framework and mentor reviews gave me clarity before I ever bonded a bracket. I finally feel structured—not guessing my way through treatment.',
    rating: 5,
    avatarGradient: 'from-amber-500 to-orange-500',
    initials: 'AK',
  },
  {
    name: 'Dr. Rohit M.',
    role: 'Clinical Associate',
    company: 'Multi-specialty Clinic',
    tag: 'HANDS-ON WORKSHOP',
    outcome: 'Confident with wire sequencing',
    text: 'Hands-on mechanics sessions translated directly to chairside. Troubleshooting loops and finishing steps were explained in a way textbooks never matched.',
    rating: 5,
    avatarGradient: 'from-emerald-600 to-teal-500',
    initials: 'RM',
  },
  {
    name: 'Dr. Priya S.',
    role: 'Practicing Dentist',
    company: 'Independent Clinic',
    tag: 'CASE DISCUSSIONS',
    outcome: 'Improved treatment planning',
    text: 'Live case discussions helped me revise plans mid-treatment instead of hoping things work out. The mentorship tone is practical and supportive.',
    rating: 5,
    avatarGradient: 'from-rose-500 to-amber-400',
    initials: 'PS',
  },
  {
    name: 'Dr. Karan V.',
    role: 'Dental Surgeon',
    company: 'Group Practice',
    tag: 'CONTINUING GUIDANCE',
    outcome: 'Better patient communication',
    text: 'Beyond mechanics, I learned how to set expectations and document progress—patients trust the process more when the plan is clear from day one.',
    rating: 5,
    avatarGradient: 'from-[#C96A1B] to-[#682701]',
    initials: 'KV',
  },
]

// Render 5 Golden Stars
const StarRating = ({ rating = 5 }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-[11px] font-bold text-slate-700 ml-1.5 font-jetbrains">5.0</span>
  </div>
)

const mapApiTestimonial = (r, idx) => {
  let avatar = null;
  if (r.image) {
    const rawBase = getImageBase();
    const baseUrl = rawBase.replace(/\/api\/v1\/?$/, '');
    avatar = `${baseUrl}${r.image.startsWith('/') ? '' : '/'}${r.image}`;
  }
  const name = r.name || (r.userId && r.userId.fullName) || 'Verified Student';
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'ST';
  return {
    name,
    role: r.role || 'Dental Professional',
    company: r.company || 'Clinical Practice',
    tag: r.tag || 'VERIFIED ALUMNI',
    outcome: r.outcome || 'Career Growth',
    text: r.message || r.reviewText || r.text || '',
    rating: r.rating || 5,
    image: avatar,
    initials,
    avatarGradient: staticTestimonials[idx % staticTestimonials.length].avatarGradient,
  };
};

const TestimonialsScroll = ({ reviews, variant = 'default' }) => {
  const { t } = useLanguage()
  const propReviews = Array.isArray(reviews) ? reviews : EMPTY_REVIEWS
  const ref = useRef(null)
  const colRefs = useRef([])
  const [columns, setColumns] = useState([])
  const [colCount, setColCount] = useState(3)
  const [apiTestimonials, setApiTestimonials] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(variant === 'landing')
  const isLanding = variant === 'landing'
  const propReviewCount = propReviews.length

  // Fetch approved testimonials from backend (landing page uses ?landing=true)
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
        const res = await fetch(`${baseUrl}/testimonials${query}`, {
          signal: controller.signal,
        })
        if (res.ok) {
          const json = await res.json()
          const items = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : [])
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

  // Harmonize testimonials from props, API, or rich static fallback
  const displayTestimonials = useMemo(() => {
    // 1. If explicit reviews prop passed with valid items (e.g. from CourseDetail)
    if (propReviewCount > 0) {
      const valid = propReviews.filter(r => r && (r.reviewText || r.text || r.message));
      if (valid.length > 0) {
        return valid.map((r, idx) => {
          let avatar = null;
          if (r.image) {
            const rawBase = getImageBase();
            const baseUrl = rawBase.replace(/\/api\/v1\/?$/, '');
            avatar = `${baseUrl}${r.image.startsWith('/') ? '' : '/'}${r.image}`;
          }
          const name = r.name || r.userName || "Verified Student";
          const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || "ST";
          return {
            name,
            role: r.designation || r.role || 'Dental Professional',
            company: r.company || 'Clinical Practice',
            tag: r.tag || "VERIFIED REVIEW",
            outcome: "Course Alum",
            text: r.reviewText || r.text || r.message || "",
            rating: r.rating || 5,
            image: avatar,
            initials,
            avatarGradient: staticTestimonials[idx % staticTestimonials.length].avatarGradient
          };
        });
      }
    }

    // 2. If API returned live approved testimonials
    if (apiTestimonials.length > 0) {
      const validApi = apiTestimonials.filter(r => r && (r.message || r.reviewText || r.text));
      if (validApi.length > 0) {
        return validApi.map((r, idx) => mapApiTestimonial(r, idx));
      }
    }

    // Landing page: admin-managed only (no hardcoded fallback)
    if (isLanding) {
      return [];
    }

    // Default home/course fallback when API is empty
    return staticTestimonials;
  }, [propReviews, propReviewCount, apiTestimonials, isLanding]);

  // Handle responsive column grouping and repetition for infinite scroll effect
  useEffect(() => {
    if (displayTestimonials.length === 0) return;

    const handleResize = () => {
      const width = window.innerWidth;
      let count = 3;
      if (width < 768) count = 1;
      else if (width < 1024) count = 2;

      setColCount(count);

      // Distribute testimonials across columns
      const base = Array.from({ length: count }, (_, ci) =>
        displayTestimonials.filter((_, i) => i % count === ci)
      );

      // Repeat columns so parallax scroll always has content
      const repeated = base.map(col => {
        if (col.length === 0) return [];
        const arr = [];
        const repeatTimes = displayTestimonials.length > 3 ? 5 : 2;
        for (let i = 0; i < repeatTimes; i++) arr.push(...col);
        return arr;
      });

      setColumns(repeated);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [displayTestimonials]);

  // Parallax animation with GSAP ScrollTrigger
  useEffect(() => {
    if (columns.length === 0 || columns.every(c => c.length === 0)) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo('.ts-heading',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%'
          }
        }
      );

      // Subtle parallax effect across columns
      if (displayTestimonials.length > 3) {
        const configs = [
          { y: -300, scrub: 1.1 },
          { y: 260, scrub: 0.9 },
          { y: -280, scrub: 1.0 }
        ];

        colRefs.current.forEach((col, i) => {
          if (!col || !configs[i]) return;
          gsap.to(col, {
            y: configs[i].y,
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: configs[i].scrub
            }
          });
        });
      }
    }, ref);

    return () => ctx.revert();
  }, [columns, displayTestimonials.length]);

  const isLowCount = displayTestimonials.length <= 3;

  if (loadingReviews) {
    return (
      <section className="w-full bg-gradient-to-b from-[#FFF9F3] to-[#f8fafc] py-16 md:py-20 px-4 md:px-8 border-t border-[#682701]/10">
        <div className="max-w-7xl mx-auto flex justify-center py-12">
          <div className="h-10 w-10 border-4 border-brand-brown/20 border-t-accent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (isLanding && displayTestimonials.length === 0) {
    return (
      <section className="w-full bg-gradient-to-b from-[#FFF9F3] to-[#f8fafc] py-16 md:py-24 px-4 md:px-8 border-t border-[#682701]/10">
        <p className="text-center py-12 font-montserrat text-sm font-medium uppercase tracking-[0.15em] text-description">
          {t('noReviewsAvailable')}
        </p>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      id="student-testimonials"
      className="relative w-full bg-slate-50 py-20 md:py-28 px-4 md:px-8 lg:px-12 overflow-hidden select-none border-t border-slate-200/60"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#C96A1B]/6 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16 space-y-4">
          <div className="ts-heading inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#C96A1B]/10 border border-[#C96A1B]/20 text-[#C96A1B]">
            <span className="w-2 h-2 rounded-full bg-[#C96A1B] animate-pulse" />
            <span className="font-jetbrains text-[10px] tracking-[0.35em] uppercase font-bold">
              Student Success Stories
            </span>
          </div>

          <h2 className="ts-heading font-inter text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] text-slate-900 leading-[1.12] tracking-[-0.02em] font-light">
            Voices from{' '}
            <span className="font-semibold text-[#C96A1B]">clinical learners</span>
          </h2>

          <p className="ts-heading text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            How hands-on orthodontic training, mentor-led case reviews, and structured programs help practitioners treat with more confidence.
          </p>

          <div className="ts-heading pt-2 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
              <span className="text-amber-500 font-bold">★ 5.0 / 5.0</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-700">Learner satisfaction</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
              <span className="text-[#C96A1B] font-bold">Case-based</span>
              <span className="text-slate-700">Curriculum</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
              <span className="text-emerald-600 font-bold">Mentor-led</span>
              <span className="text-slate-700">Guidance</span>
            </div>
          </div>
        </div>

        {/* Viewport for Parallax Cards */}
        <div
          className={`relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/40 backdrop-blur-xs shadow-inner ${
            isLowCount ? 'h-auto py-12' : ''
          }`}
          style={{ height: isLowCount ? 'auto' : (colCount === 1 ? '680px' : '820px') }}
        >
          {/* Top & Bottom Gradient Fade Masks */}
          {!isLowCount && (
            <>
              <div className="absolute top-0 left-0 right-0 h-28 md:h-36 bg-gradient-to-b from-slate-50 via-slate-50/90 to-transparent z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-28 md:h-36 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent z-20 pointer-events-none" />
            </>
          )}

          {/* Grid of Columns */}
          <div
            className={`flex gap-5 md:gap-6 px-4 md:px-6 items-start ${
              isLowCount ? 'relative inset-0' : 'absolute inset-0 top-auto'
            }`}
            style={{ top: isLowCount ? '0' : '-320px' }}
          >
            {columns.map((col, ci) => (
              <div
                key={`${ci}-${columns.length}`}
                ref={el => { colRefs.current[ci] = el }}
                className="flex flex-col gap-5 flex-1 min-w-0"
                style={{ marginTop: (!isLowCount && ci === 1) ? '-90px' : '0px' }}
              >
                {col.map((t, ti) => (
                  <div
                    key={ti}
                    className="group relative bg-white rounded-2xl p-6 md:p-7 border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.04)]
                               hover:shadow-[0_16px_36px_-6px_rgba(24,120,192,0.16)] hover:border-[#C96A1B]/40
                               transition-all duration-300 hover:-translate-y-1.5"
                  >
                    {/* Top Ocean Accent Line on Hover */}
                    <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-[#C96A1B] via-sky-400 to-[#C96A1B] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

                    {/* Tag badge and Quotation icon */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="font-jetbrains text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#C96A1B]/10 text-[#C96A1B] border border-[#C96A1B]/15">
                        {t.tag}
                      </span>
                      <svg
                        className="w-6 h-6 text-slate-200 group-hover:text-[#C96A1B]/30 transition-colors duration-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    {/* Star Rating */}
                    <div className="mb-3.5">
                      <StarRating rating={t.rating} />
                    </div>

                    {/* Review Testimonial Text */}
                    <p className="font-inter text-slate-700 text-[13px] md:text-[14px] leading-[1.75] font-normal tracking-tight mb-5">
                      "{t.text}"
                    </p>

                    {/* Student Info & Avatar */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div
                          className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 font-jetbrains text-xs font-bold text-white shadow-xs ${
                            t.image ? 'bg-slate-100' : `bg-gradient-to-tr ${t.avatarGradient || 'from-[#C96A1B] to-sky-400'}`
                          }`}
                        >
                          {t.image ? (
                            <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                          ) : (
                            t.initials || t.name.slice(0, 2).toUpperCase()
                          )}
                        </div>

                        {/* Name and Designation */}
                        <div className="min-w-0">
                          <h4 className="font-inter text-sm font-bold text-slate-900 truncate group-hover:text-[#C96A1B] transition-colors">
                            {t.name}
                          </h4>
                          <p className="font-jetbrains text-[10px] text-slate-500 truncate">
                            {t.role}
                          </p>
                        </div>
                      </div>

                      {/* Verified Badge */}
                      <div className="shrink-0 flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60" title="Verified Course Graduate">
                        <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Verified</span>
                      </div>
                    </div>

                    {/* Bottom Company Outcome Pill */}
                    {t.company && (
                      <div className="mt-3 pt-2 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C96A1B]/50" />
                        <span className="truncate">{t.company}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default TestimonialsScroll
