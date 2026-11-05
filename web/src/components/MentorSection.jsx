import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LOGO_PATH,
  MENTOR_IMAGE_PATH,
  MENTOR_NAME,
  MENTOR_TITLE,
  MENTOR_CREDENTIALS,
  MENTOR_STORY,
  WHATSAPP_URL,
} from '../constants/brand'
import { useLanguage } from '../context/LanguageContext'

const MentorSection = () => {
  const { t } = useLanguage()
  const [imgSrc, setImgSrc] = useState(MENTOR_IMAGE_PATH)
  const [imgFailed, setImgFailed] = useState(false)

  const handleImgError = () => {
    if (imgSrc !== LOGO_PATH) {
      setImgSrc(LOGO_PATH)
      return
    }
    setImgFailed(true)
  }

  return (
    <section className="relative w-full bg-white py-20 md:py-28 px-4 md:px-8 lg:px-12 overflow-hidden select-none">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C96A1B]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20 space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#C96A1B]/40" />
            <span className="font-jetbrains text-[10px] text-[#C96A1B] tracking-[0.5em] uppercase font-bold">
              {t('meetMentorEyebrow')}
            </span>
            <span className="w-8 h-[1px] bg-[#C96A1B]/40" />
          </div>
          <h2 className="font-newsreader italic text-3xl sm:text-4xl md:text-5xl text-normal leading-[1.1] font-light">
            {t('meetMentorTitle')}
          </h2>
          <p className="text-sm md:text-base text-description leading-relaxed">{t('meetMentorSub')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[400px] group">
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#C96A1B]/25 to-amber-200/30 rounded-[2.5rem] blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative rounded-[2rem] overflow-hidden border-2 border-white shadow-2xl aspect-[4/5] bg-gradient-to-br from-amber-50 to-[#fdebd5]">
                {!imgFailed ? (
                  <img
                    src={imgSrc}
                    alt={MENTOR_NAME}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={handleImgError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <img src={LOGO_PATH} alt="" className="max-h-40 opacity-40 object-contain" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/80 shadow-xl">
                  <p className="font-jetbrains text-[10px] font-bold text-accent uppercase tracking-wider">
                    {MENTOR_TITLE}
                  </p>
                  <p className="font-montserrat text-lg font-bold text-normal mt-1">{MENTOR_NAME}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
            <ul className="space-y-2 w-full">
              {MENTOR_CREDENTIALS.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 font-montserrat text-sm text-description"
                >
                  <span className="text-accent mt-0.5">✓</span>
                  {line}
                </li>
              ))}
            </ul>

            {MENTOR_STORY.map((para) => (
              <p key={para.slice(0, 24)} className="text-sm sm:text-base text-description leading-relaxed max-w-2xl">
                {para}
              </p>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent hover:bg-amber-600 text-white rounded-xl font-jetbrains text-xs uppercase tracking-[0.2em] font-bold shadow-accent-soft transition-all"
              >
                {t('browseCourses')}
              </Link>
              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent('Hello, I would like to speak with the faculty about orthodontic training.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-accent text-accent rounded-xl font-jetbrains text-xs uppercase tracking-[0.15em] font-semibold hover:bg-accent hover:text-white transition-all"
              >
                {t('whatsAppCta')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MentorSection
