import React, { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LandingReveal from './landing/LandingReveal'
import { STAGGER_CHILD_VARIANTS } from './landing/landingRevealVariants'
import sanitizeDisplay from '../utils/textSanitize'
import { resolveCourseThumbnail } from '../utils/courseThumbnail.js'
import { useLanguage } from '../context/LanguageContext'
import { LANDING_COURSES } from '../data/landingCourses'

function courseListPrice(course) {
  const sale = course?.salePrice != null && Number(course.salePrice) > 0 ? Number(course.salePrice) : null
  const base = course?.price != null && Number(course.price) > 0 ? Number(course.price) : null
  const active = sale ?? base
  const hasSale = sale != null && base != null && sale < base
  if (active == null) return { label: 'Enquire', original: null }
  return {
    label: `₹${Number(active).toLocaleString('en-IN')}`,
    original: hasSale ? `₹${Number(base).toLocaleString('en-IN')}` : null,
  }
}

function formatLabel(course) {
  const mode = (course?.deliveryMode || course?.courseType || '').toString().toLowerCase()
  if (mode.includes('live')) return 'Live'
  if (mode.includes('record')) return 'Recorded'
  if (mode.includes('offline') || mode.includes('in-person')) return 'Offline'
  const plans = course?.plans
  if (Array.isArray(plans) && plans.length > 0) {
    const names = plans.map((p) => (p?.name || '').toLowerCase()).join(' ')
    if (names.includes('offline')) return 'Offline'
    if (names.includes('live')) return 'Live'
  }
  return 'Program'
}

function mapApiCourse(course, t) {
  const id = course._id || course.id
  const { label, original } = courseListPrice(course)
  return {
    key: String(id),
    href: id ? `/course-detail/${id}` : '/courses',
    title: sanitizeDisplay(course.title),
    blurb: sanitizeDisplay(course.shortDescription || course.description || ''),
    chip: formatLabel(course),
    category: sanitizeDisplay(
      String(course.categoryId?.name || course.category?.name || course.category || t('landingCoursesCategoryFallback'))
    ),
    price: label,
    original,
    image: resolveCourseThumbnail(course.thumbnail) || '/meridian/statement-01.jpg',
    alt: sanitizeDisplay(course.title),
  }
}

const LandingCoursesSection = () => {
  const { t } = useLanguage()
  const prefersReduced = useReducedMotion()
  const { courses, loading } = useSelector((state) => state.courses)
  const [active, setActive] = useState(0)

  const catalogCount = Array.isArray(courses) ? courses.filter((c) => c && (c._id || c.id)).length : 0

  const displayed = useMemo(() => {
    const list = Array.isArray(courses) ? courses.filter((c) => c && (c._id || c.id)) : []

    if (list.length === 0) {
      return LANDING_COURSES.map((item) => ({ ...item, href: '/courses', original: null }))
    }

    const featured = list.filter((c) => c.isPublished !== false && c.isFeatured === true)
    const sorted = [...featured].sort((a, b) => {
      const ra = a.featuredRank ?? 99
      const rb = b.featuredRank ?? 99
      if (ra !== rb) return ra - rb
      const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
      const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
      return tb - ta
    })

    return sorted.slice(0, 6).map((course) => mapApiCourse(course, t))
  }, [courses, t])

  const isDemoFallback = catalogCount === 0 && displayed.length > 0
  const isFeaturedEmpty = !loading && catalogCount > 0 && displayed.length === 0

  useEffect(() => {
    if (active >= displayed.length) {
      setActive(0)
    }
  }, [displayed.length, active])

  const current = displayed[Math.min(active, Math.max(displayed.length - 1, 0))] || displayed[0]

  const HeaderBlock = prefersReduced ? 'div' : motion.div
  const GridBlock = prefersReduced ? 'div' : motion.div
  const staggerProps = prefersReduced
    ? {}
    : { variants: STAGGER_CHILD_VARIANTS }

  return (
    <LandingReveal
      id="courses"
      stagger={!prefersReduced}
      className="scroll-mt-28 border-b border-brand-brown/[0.06] bg-slate-50 py-20 md:scroll-mt-32 md:py-28"
    >
      <div className="site-container">
        <HeaderBlock
          {...staggerProps}
          className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <p className="font-jetbrains text-[10px] font-bold uppercase tracking-[0.45em] text-accent">
              {t('landingCoursesEyebrow')}
            </p>
            <h2 className="mt-3 font-newsreader text-3xl font-medium tracking-tight text-brand-brown sm:text-4xl md:text-[2.5rem]">
              {t('landingCoursesTitle')}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-description md:text-lg">{t('landingCoursesSub')}</p>
          </div>
          <Link
            to="/courses"
            className="inline-flex shrink-0 justify-center rounded-xl bg-brand-brown px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            {t('landingCoursesViewAll')}
          </Link>
        </HeaderBlock>

        {loading && catalogCount === 0 ? (
          <div className="overflow-hidden rounded-[1.75rem] border border-brand-brown/[0.08] bg-white">
            <div className="h-80 animate-pulse bg-slate-100 md:h-[36rem]" aria-hidden />
            <motion.div className="divide-y divide-brand-brown/10" aria-hidden>
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse bg-slate-50" />
              ))}
            </motion.div>
          </div>
        ) : null}

        {!loading && isFeaturedEmpty ? (
          <motion.div
            {...staggerProps}
            className="rounded-[1.75rem] border border-brand-brown/[0.08] bg-white px-8 py-16 text-center md:px-12"
          >
            <p className="font-newsreader text-2xl font-medium text-brand-brown md:text-3xl">{t('landingCoursesEmptyTitle')}</p>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-description">{t('landingCoursesEmptySub')}</p>
            <Link
              to="/courses"
              className="mt-8 inline-flex justify-center rounded-xl bg-brand-brown px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              {t('landingCoursesViewAll')}
            </Link>
          </motion.div>
        ) : null}

        {!isFeaturedEmpty && (!loading || catalogCount > 0) && displayed.length > 0 ? (
          <GridBlock
            {...staggerProps}
            className="grid overflow-hidden rounded-[1.75rem] border border-brand-brown/[0.08] bg-white lg:grid-cols-12"
          >
            <div className="relative min-h-[20rem] bg-brand-brown lg:col-span-7 lg:min-h-[36rem]">
              {displayed.map((item, index) => (
                <img
                  key={item.key}
                  src={item.image}
                  alt={index === active ? item.alt : ''}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                    index === active ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-brand-brown via-brand-brown/35 to-transparent"
              />
              {current ? (
                <div className="absolute inset-x-0 bottom-0 z-10 p-7 md:p-10">
                  <span className="text-sm font-medium text-accent">
                    {current.chip}
                    <span className="mx-2 text-white/40">·</span>
                    {current.category}
                  </span>
                  <p className="mt-3 max-w-lg font-newsreader text-3xl font-medium leading-tight tracking-tight text-white md:text-4xl">
                    {current.title}
                  </p>
                  {current.blurb ? (
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80 md:text-[15px]">{current.blurb}</p>
                  ) : null}
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="text-sm text-white/75">
                      {t('landingCoursesFrom')} {current.price}
                      {current.original ? <span className="ml-2 line-through opacity-70">{current.original}</span> : null}
                    </span>
                    <Link
                      to={isDemoFallback ? '/courses' : current.href}
                      className="text-sm font-semibold text-accent transition-colors hover:text-white"
                    >
                      {t('landingCoursesCta')} →
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            <ol className="divide-y divide-brand-brown/10 lg:col-span-5">
              {displayed.map((item, index) => {
                const isActive = index === active
                return (
                  <li key={item.key}>
                    <Link
                      to={isDemoFallback ? '/courses' : item.href}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      className={`group flex items-start gap-4 px-5 py-5 transition-colors md:px-7 ${
                        isActive ? 'bg-brand-brown text-white' : 'bg-white text-brand-brown hover:bg-slate-50'
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold text-accent">{item.chip}</span>
                        <span className="mt-1 block font-newsreader text-lg leading-snug md:text-xl">{item.title}</span>
                      </span>
                      <span
                        className={`shrink-0 pt-1 text-sm tabular-nums ${
                          isActive ? 'text-white/70' : 'text-description'
                        }`}
                      >
                        {item.price}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </GridBlock>
        ) : null}
      </div>
    </LandingReveal>
  )
}

export default LandingCoursesSection
