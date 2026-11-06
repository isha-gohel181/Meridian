import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLanguage } from '../context/LanguageContext'

function coursePrice(course) {
  if (!course) return null
  const sale = course.salePrice != null && Number(course.salePrice) > 0 ? Number(course.salePrice) : null
  const base = course.price != null && Number(course.price) > 0 ? Number(course.price) : null
  return sale ?? base
}

function courseDetailPath(course) {
  if (!course) return '/courses'
  const id = course._id || course.id
  return id ? `/course-detail/${id}` : '/courses'
}

const LandingPricingTeaser = () => {
  const { t } = useLanguage()
  const { courses, loading } = useSelector((state) => state.courses)

  const featured = useMemo(() => {
    const list = Array.isArray(courses) ? courses : []
    if (list.length === 0) return null
    return list.find((c) => c.isFeatured) || list[0]
  }, [courses])

  const fromPrice = coursePrice(featured)
  const plans = featured?.plans?.slice(0, 3) || []

  return (
    <section className="bg-white py-20 md:py-28 px-4 md:px-8 lg:px-12 border-t border-card-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="font-jetbrains text-[10px] text-accent tracking-[0.5em] uppercase font-bold">
            {t('pricingTeaserEyebrow')}
          </span>
          <h2 className="font-newsreader italic text-3xl sm:text-4xl md:text-5xl text-normal font-light">
            {t('pricingTeaserTitle')}
          </h2>
          <p className="font-montserrat text-sm text-description">{t('pricingTeaserSub')}</p>
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-card-border bg-dark/50 p-8 md:p-10 shadow-sm text-center">
          {loading && !featured && (
            <p className="font-montserrat text-sm text-description">{t('loadingCourses')}</p>
          )}

          {!loading && !featured && (
            <Link
              to="/courses"
              className="inline-flex px-8 py-3.5 bg-brand-brown text-white rounded-xl font-jetbrains text-xs uppercase tracking-[0.2em] font-bold shadow-accent-soft hover:bg-brand-brown/90 transition-colors"
            >
              {t('pricingBrowseAll')}
            </Link>
          )}

          {featured && (
            <>
              <p className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-2">
                {featured.title}
              </p>
              {fromPrice != null && (
                <p className="font-newsreader italic text-4xl text-normal mb-6">
                  {t('pricingFrom')}{' '}
                  <span className="text-accent font-semibold">₹{Number(fromPrice).toLocaleString('en-IN')}</span>
                </p>
              )}
              {plans.length > 0 && (
                <ul className="flex flex-wrap justify-center gap-2 mb-8">
                  {plans.map((p) => (
                    <li
                      key={p._id || p.name}
                      className="px-3 py-1.5 rounded-full bg-white border border-amber-200 font-jetbrains text-[10px] uppercase tracking-wide text-description"
                    >
                      {p.name || `${p.duration} ${p.durationType}`}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to={courseDetailPath(featured)}
                  className="px-6 py-3 bg-white border border-accent text-accent rounded-xl font-jetbrains text-xs uppercase tracking-[0.15em] font-bold hover:bg-accent hover:text-brand-brown transition-colors"
                >
                  {t('pricingViewCourse')}
                </Link>
                <Link
                  to={`${courseDetailPath(featured)}#pricing`}
                  className="px-6 py-3 bg-brand-brown text-white rounded-xl font-jetbrains text-xs uppercase tracking-[0.15em] font-bold shadow-accent-soft hover:bg-brand-brown/90 transition-colors"
                >
                  {t('pricingEnroll')}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default LandingPricingTeaser
