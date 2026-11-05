import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './AuthShowcase.css'

const SLIDES = [
  {
    image: '/dental_acadmy/login-clinic.jpg',
    fallback: '/dental_acadmy/dental.jpeg',
  },
  {
    image: '/dental_acadmy/login-showcase-1.jpg',
    fallback: '/dental_acadmy/testimonials/meena-iyer.jpg',
  },
]

const AuthShowcase = () => {
  const { t } = useLanguage()
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length)
    }, 9000)
    return () => window.clearInterval(timer)
  }, [])

  const slide = SLIDES[slideIndex]

  return (
    <div className="auth-showcase">
      <div className="auth-showcase__glow auth-showcase__glow--a" aria-hidden />
      <div className="auth-showcase__glow auth-showcase__glow--b" aria-hidden />

      <header className="auth-showcase__header">
        <span className="auth-showcase__eyebrow">{t('authShowcaseEyebrow')}</span>
        <h2 className="auth-showcase__title">{t('authShowcaseTitle')}</h2>
        <p className="auth-showcase__lead">{t('authShowcaseLead')}</p>
      </header>

      <div className="auth-showcase__visual">
        <div className="auth-showcase__photo-wrap">
          {SLIDES.map((s, i) => (
            <img
              key={s.image}
              src={s.image}
              alt=""
              className={`auth-showcase__photo ${i === slideIndex ? 'is-active' : ''}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = s.fallback
              }}
            />
          ))}
          <div className="auth-showcase__photo-shade" aria-hidden />
        </div>

        <blockquote className="auth-showcase__quote-card">
          <div className="auth-showcase__quote-head">
            <img
              src="/dental_acadmy/testimonials/isha-patel.jpg"
              alt=""
              className="auth-showcase__avatar"
              loading="lazy"
              decoding="async"
            />
            <div>
              <p className="auth-showcase__author">{t('authShowcaseAuthor')}</p>
              <p className="auth-showcase__role">{t('authShowcaseRole')}</p>
            </div>
          </div>
          <p className="auth-showcase__quote">&ldquo;{t('authShowcaseQuote')}&rdquo;</p>
        </blockquote>
      </div>

      <ul className="auth-showcase__pills">
        <li>{t('authShowcasePill1')}</li>
        <li>{t('authShowcasePill2')}</li>
        <li>{t('authShowcasePill3')}</li>
      </ul>

      <div className="auth-showcase__footer">
        <div className="auth-showcase__stats">
          <div>
            <span className="auth-showcase__stat-value">500+</span>
            <span className="auth-showcase__stat-label">{t('activeLearners')}</span>
          </div>
          <div>
            <span className="auth-showcase__stat-value">Live</span>
            <span className="auth-showcase__stat-label">{t('authShowcaseStatMentor')}</span>
          </div>
        </div>

        <div className="auth-showcase__dots" role="tablist" aria-label="Showcase slides">
          {SLIDES.map((_, i) => (
            <button
              key={SLIDES[i].image}
              type="button"
              role="tab"
              aria-selected={i === slideIndex}
              className={`auth-showcase__dot ${i === slideIndex ? 'is-active' : ''}`}
              onClick={() => setSlideIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AuthShowcase
