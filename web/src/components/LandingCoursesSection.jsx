import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import sanitizeDisplay from '../utils/textSanitize'
import { resolveCourseThumbnail } from '../utils/courseThumbnail.js'
import { useLanguage } from '../context/LanguageContext'

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

const LandingCourseCard = ({ course }) => {
  const { t } = useLanguage()
  const id = course._id || course.id
  const { label, original } = courseListPrice(course)
  const thumb = resolveCourseThumbnail(course.thumbnail)
  const category =
    course.categoryId?.name || course.category?.name || course.category || t('landingCoursesCategoryFallback')
  const desc = course.shortDescription || course.description || ''

  return (
    <Link
      to={id ? `/course-detail/${id}` : '/courses'}
      className="group flex flex-col h-full rounded-2xl border border-card-border bg-dark/80 overflow-hidden hover:border-accent/30 transition-colors"
    >
      <div className="relative aspect-[16/10] bg-[#FFF9F3] border-b border-card-border overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center px-6 text-center">
            <span className="font-jetbrains text-[10px] uppercase tracking-[0.25em] text-accent/50">
              {t('noPreview')}
            </span>
          </div>
        )}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 border border-card-border font-jetbrains text-[9px] uppercase tracking-wider font-bold text-accent">
          {formatLabel(course)}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5 md:p-6 gap-2">
        <span className="font-jetbrains text-[9px] uppercase tracking-[0.3em] text-accent font-bold truncate">
          {sanitizeDisplay(String(category))}
        </span>
        <h3 className="font-newsreader italic text-xl md:text-2xl text-normal font-light leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {sanitizeDisplay(course.title)}
        </h3>
        {desc ? (
          <p className="font-montserrat text-sm text-description leading-relaxed line-clamp-2 flex-1">{desc}</p>
        ) : (
          <div className="flex-1" />
        )}
        <div className="flex items-end justify-between gap-3 pt-4 mt-2 border-t border-card-border">
          <div className="min-w-0">
            <p className="font-jetbrains text-[9px] uppercase tracking-wider text-description mb-0.5">
              {t('landingCoursesFrom')}
            </p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-montserrat text-base font-bold text-normal">{label}</span>
              {original && (
                <span className="font-montserrat text-xs text-description line-through">{original}</span>
              )}
            </div>
          </div>
          <span className="shrink-0 font-jetbrains text-[10px] uppercase tracking-[0.15em] font-bold text-accent group-hover:translate-x-0.5 transition-transform">
            {t('landingCoursesCta')} →
          </span>
        </div>
      </div>
    </Link>
  )
}

const SkeletonCard = () => (
  <div className="rounded-2xl border border-card-border bg-dark/40 overflow-hidden animate-pulse">
    <div className="aspect-[16/10] bg-white/40" />
    <div className="p-6 space-y-3">
      <div className="h-2 w-24 bg-white/50 rounded" />
      <div className="h-6 w-full bg-white/50 rounded" />
      <div className="h-4 w-full bg-white/40 rounded" />
    </div>
  </div>
)

const LandingCoursesSection = () => {
  const { t } = useLanguage()
  const { courses, loading } = useSelector((state) => state.courses)

  const displayed = useMemo(() => {
    const list = Array.isArray(courses) ? courses.filter((c) => c && (c._id || c.id)) : []
    if (list.length === 0) return []
    const sorted = [...list].sort((a, b) => {
      const af = a.isFeatured ? 1 : 0
      const bf = b.isFeatured ? 1 : 0
      return bf - af
    })
    return sorted.slice(0, 6)
  }, [courses])

  return (
    <section id="courses" className="relative bg-[#FFF9F3]/40 py-20 md:py-28 px-4 md:px-8 lg:px-12 border-y border-card-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 md:mb-14">
          <div className="max-w-2xl space-y-4">
            <span className="font-jetbrains text-[10px] text-accent tracking-[0.5em] uppercase font-bold">
              {t('landingCoursesEyebrow')}
            </span>
            <h2 className="font-newsreader italic text-3xl sm:text-4xl md:text-5xl text-normal font-light">
              {t('landingCoursesTitle')}
            </h2>
            <p className="font-montserrat text-sm md:text-base text-description">{t('landingCoursesSub')}</p>
          </div>
          <Link
            to="/courses"
            className="inline-flex self-start lg:self-auto items-center justify-center px-6 py-3 rounded-xl border border-accent text-accent font-jetbrains text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-accent hover:text-white transition-colors"
          >
            {t('landingCoursesViewAll')}
          </Link>
        </div>

        {loading && displayed.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-card-border bg-white/60">
            <p className="font-montserrat text-sm text-description mb-6">{t('noCoursesAvailable')}</p>
            <Link
              to="/courses"
              className="inline-flex px-6 py-3 bg-accent text-white rounded-xl font-jetbrains text-[10px] uppercase tracking-[0.2em] font-bold shadow-accent-soft hover:bg-amber-600 transition-colors"
            >
              {t('browseCourses')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {displayed.map((course) => (
              <LandingCourseCard key={course._id || course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default LandingCoursesSection
