import React, { useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../redux/slices/courseSlice'
import sanitizeDisplay from '../utils/textSanitize'
import RollingText from './RollingText'
import { resolveCourseThumbnail } from '../utils/courseThumbnail.js'
import { useLanguage } from '../context/LanguageContext'

const CourseSlider = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const { courses: apiCourses, loading } = useSelector((state) => state.courses)

  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const cardsRef = useRef([])
  const bordersRef = useRef([])

  const animRef = useRef(null)
  const posRef = useRef(0)
  const isHoveredRef = useRef(false)
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartPosRef = useRef(0)
  const hasMovedRef = useRef(false)

  const baseCourses = useMemo(() => apiCourses ?? [], [apiCourses])

  const items = useMemo(() => {
    if (baseCourses.length === 0) return []
    let combined = [...baseCourses]
    while (combined.length < 16) {
      combined = [...combined, ...baseCourses]
    }
    return [...combined, ...combined, ...combined]
  }, [baseCourses])

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  useEffect(() => {
    if (items.length === 0) return undefined

    let lastTime = performance.now()
    const autoSpeed = 48

    const updateSlider = (now) => {
      const delta = (now - lastTime) / 1000
      lastTime = now

      if (!isDraggingRef.current && trackRef.current && sectionRef.current) {
        const speed = isHoveredRef.current ? autoSpeed * 0.25 : autoSpeed
        posRef.current -= speed * delta

        const totalWidth = trackRef.current.scrollWidth
        const setWidth = totalWidth / 3
        if (setWidth > 0) {
          if (posRef.current <= -setWidth * 2) posRef.current += setWidth
          if (posRef.current > 0) posRef.current -= setWidth
        }

        trackRef.current.style.transform = `translateX(${posRef.current}px)`

        const sectionRect = sectionRef.current.getBoundingClientRect()
        const centerX = sectionRect.left + sectionRect.width / 2

        cardsRef.current.forEach((cardEl, idx) => {
          if (!cardEl) return
          const rect = cardEl.getBoundingClientRect()
          const cardCenter = rect.left + rect.width / 2
          const dist = Math.abs(cardCenter - centerX)
          const scale = dist < 200 ? 1 + (1 - dist / 200) * 0.12 : 0.85
          const opacity = dist < 200 ? 0.5 + (1 - dist / 200) * 0.5 : 0.5
          const borderOpacity = dist < 75 ? Math.max(0, 1 - dist / 75) : 0

          cardEl.style.transform = `scale(${scale.toFixed(3)}, ${scale.toFixed(3)})`
          cardEl.style.opacity = opacity.toFixed(3)

          const borderEl = bordersRef.current[idx]
          if (borderEl) borderEl.style.opacity = borderOpacity.toFixed(3)
        })
      }

      animRef.current = requestAnimationFrame(updateSlider)
    }

    if (trackRef.current) {
      const setWidth = trackRef.current.scrollWidth / 3
      if (setWidth > 0) posRef.current = -setWidth
    }

    animRef.current = requestAnimationFrame(updateSlider)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [items])

  const handleMouseDown = (e) => {
    isDraggingRef.current = true
    hasMovedRef.current = false
    dragStartXRef.current = e.clientX
    dragStartPosRef.current = posRef.current
  }

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - dragStartXRef.current
    if (Math.abs(dx) > 4) hasMovedRef.current = true
    posRef.current = dragStartPosRef.current + dx
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true
      hasMovedRef.current = false
      dragStartXRef.current = e.touches[0].clientX
      dragStartPosRef.current = posRef.current
    }
  }

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return
    const dx = e.touches[0].clientX - dragStartXRef.current
    if (Math.abs(dx) > 4) hasMovedRef.current = true
    posRef.current = dragStartPosRef.current + dx
  }

  const handleTouchEnd = () => {
    isDraggingRef.current = false
  }

  const handleCardClick = (course) => {
    if (hasMovedRef.current) return
    navigate(`/course-detail/${course._id || course.id}`)
  }

  const getImageUrl = (course) => {
    const imgPath =
      course.thumbnail ||
      course.coverImage ||
      course.horizontalCarouselImage ||
      course.verticalCarouselImage
    return resolveCourseThumbnail(imgPath)
  }

  if (loading && baseCourses.length === 0) {
    return (
      <section className="relative w-full py-12 md:py-16 bg-gradient-to-b from-[#FFF9F3] to-[#f8fafc]">
        <p className="text-center py-12 font-montserrat text-sm font-medium uppercase tracking-[0.15em] text-description">
          {t('loadingCourses')}
        </p>
      </section>
    )
  }

  if (baseCourses.length === 0) {
    return (
      <section className="relative w-full py-12 md:py-16 px-6 bg-gradient-to-b from-[#FFF9F3] to-[#f8fafc]">
        <p className="text-center py-20 font-montserrat text-sm font-medium uppercase tracking-[0.15em] text-description">
          {t('noCoursesAvailable')}
        </p>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-8 md:py-14 pb-16 md:pb-24 overflow-hidden select-none bg-gradient-to-b from-[#FFF9F3] via-[#FFF9F3]/60 to-[#f8fafc]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        handleMouseUp()
        isHoveredRef.current = false
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute top-0 left-0 z-20 w-[14vw] md:w-[18vw] h-full bg-gradient-to-r from-[#FFF9F3] to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 z-20 w-[14vw] md:w-[18vw] h-full bg-gradient-to-l from-[#FFF9F3] to-transparent pointer-events-none" />

      <div
        ref={trackRef}
        className="flex items-center gap-7 md:gap-9 lg:gap-11 will-change-transform cursor-grab active:cursor-grabbing py-6"
      >
        {items.map((course, idx) => (
          <div
            key={`${course._id || course.id}-${idx}`}
            ref={(el) => (cardsRef.current[idx] = el)}
            onClick={() => handleCardClick(course)}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseEnter={() => (isHoveredRef.current = true)}
            onMouseLeave={() => (isHoveredRef.current = false)}
            className="slider-card relative flex-shrink-0 w-[185px] md:w-[200px] cursor-pointer group"
            style={{ opacity: 0.5, transform: 'scale(0.85, 0.85)' }}
          >
            <div
              ref={(el) => (bordersRef.current[idx] = el)}
              className="card-border absolute -inset-[2px] rounded-lg border-2 border-accent shadow-accent-large opacity-0 pointer-events-none transition-opacity duration-300"
              style={{ opacity: 0 }}
            />

            <div className="relative border border-slate-200/90 p-2.5 flex flex-col gap-2 overflow-hidden transition-colors duration-500 group-hover:border-accent/50 bg-white rounded-md shadow-md">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#FFF9F3] rounded-sm border border-[#682701]/10">
                {getImageUrl(course) ? (
                  <img
                    alt={sanitizeDisplay(course.title)}
                    className="w-full h-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-105"
                    src={getImageUrl(course)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center px-2">
                    <span className="font-jetbrains text-[7px] uppercase tracking-widest text-[#682701]/35 text-center">
                      {t('noPreview') || 'No preview'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 px-1 pb-1">
                <div className="flex items-center gap-2 text-accent justify-between border-b border-slate-100 pb-1.5">
                  <RollingText
                    text={course.category?.name || course.category || course.tag || 'COURSE'}
                    className="font-montserrat text-[8px] tracking-[0.22em] font-bold uppercase leading-none h-3.5 truncate max-w-[130px]"
                  />
                  <div className="pointer-events-none text-accent">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <h3 className="font-newsreader text-sm text-slate-900 font-normal tracking-tight leading-[1.2] line-clamp-2 min-h-[2.4em]">
                  {sanitizeDisplay(course.title)}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CourseSlider
