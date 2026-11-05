import React, { useState, useEffect, useRef, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const categoryLabels = {
  course: 'Course',
  purchase: 'Purchase',
  technical: 'Technical',
}

const FAQSection = ({ course }) => {
  const containerRef = useRef(null)
  const { t } = useLanguage()

  const courseCustomFaqs = useMemo(() => {
    const raw = course?.faqs || course?.faq
    if (!Array.isArray(raw) || raw.length === 0) return []

    return raw
      .filter((f) => (f.question || f.q)?.trim() && (f.answer || f.a)?.trim())
      .map((f, i) => ({
        id: f._id || `c-faq-${i}`,
        q: f.question || f.q,
        a: f.answer || f.a,
        category: f.category || 'course',
      }))
  }, [course?.faqs, course?.faq])

  const dynamicFaqData = useMemo(() => {
    if (courseCustomFaqs.length === 0) return {}

    return courseCustomFaqs.reduce((acc, item) => {
      const key = categoryLabels[item.category] || item.category || 'Course'
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {})
  }, [courseCustomFaqs])

  const categories = Object.keys(dynamicFaqData)
  const [activeTab, setActiveTab] = useState(categories[0] || 'Course')
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => {
    if (categories.length > 0 && !dynamicFaqData[activeTab]) {
      setActiveTab(categories[0])
    }
  }, [course, categories, activeTab, dynamicFaqData])

  useEffect(() => {
    if (categories.length === 0) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-box',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          }
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [activeTab, categories.length])

  if (courseCustomFaqs.length === 0) {
    return null
  }

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto py-20 relative px-4 sm:px-6">

      <div className="space-y-6 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-[2px] bg-accent" />
          <span className="font-jetbrains text-xs text-accent tracking-[0.3em] uppercase font-bold">
            {t('faqTitle') || 'Frequently Asked Questions'}
          </span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <h2 className="font-newsreader italic text-4xl md:text-5xl lg:text-6xl text-normal font-light tracking-tight leading-tight max-w-2xl">
            {t('faqSubtitle') || 'Answers about this course'}
          </h2>

          {categories.length > 1 && (
            <div className="flex gap-4 border-b border-border pb-2 overflow-x-auto no-scrollbar">
              {categories.map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab)
                    setHoveredId(null)
                  }}
                  className={`font-montserrat text-xs tracking-wider uppercase font-bold transition-all duration-300 pb-2 relative whitespace-nowrap cursor-pointer
                       ${activeTab === tab ? 'text-accent font-black' : 'text-description hover:text-normal'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-accent" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {dynamicFaqData[activeTab]?.map((item) => (
          <div
            key={item.id}
            className={`faq-box group border rounded-xl transition-all duration-300 overflow-hidden
              ${hoveredId === item.id
                ? 'border-accent bg-accent/[0.04] shadow-md'
                : 'border-border bg-card hover:border-accent/40 hover:bg-slate-50/50 shadow-sm'}`}
          >
            <button
              type="button"
              onClick={() => setHoveredId(hoveredId === item.id ? null : item.id)}
              className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <h4 className="font-newsreader italic text-xl md:text-2xl text-normal font-normal tracking-tight leading-snug group-hover:text-accent transition-colors">
                  {item.q}
                </h4>
              </div>

              <div className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-300
                 ${hoveredId === item.id ? 'rotate-45 border-accent bg-accent text-white' : 'border-border bg-slate-50 text-description group-hover:border-accent/60 group-hover:text-normal'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            </button>

            {hoveredId === item.id && (
              <div className="px-5 md:px-6 pb-6 pt-0 border-t border-border/50 mt-2">
                <p className="font-montserrat text-sm md:text-base text-description leading-relaxed max-w-3xl pt-4 font-normal">
                  {item.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

    </section>
  )
}

export default FAQSection
