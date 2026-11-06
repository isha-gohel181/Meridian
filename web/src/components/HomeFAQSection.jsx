import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const HomeFAQSection = () => {
  const { t } = useLanguage()
  const [openId, setOpenId] = useState(null)

  const items = [
    { id: '1', q: t('homeFaq1Q'), a: t('homeFaq1A') },
    { id: '2', q: t('homeFaq2Q'), a: t('homeFaq2A') },
    { id: '3', q: t('homeFaq3Q'), a: t('homeFaq3A') },
    { id: '4', q: t('homeFaq4Q'), a: t('homeFaq4A') },
    { id: '5', q: t('homeFaq5Q'), a: t('homeFaq5A') },
    { id: '6', q: t('homeFaq6Q'), a: t('homeFaq6A') },
  ]

  return (
    <section className="max-w-7xl mx-auto py-20 md:py-28 relative px-4 sm:px-6 lg:px-8">
      <div className="space-y-6 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-[2px] bg-accent" />
          <span className="font-jetbrains text-xs text-accent tracking-[0.3em] uppercase font-bold">
            {t('faqTitle')}
          </span>
        </div>
        <h2 className="font-newsreader italic text-4xl md:text-5xl text-normal font-light tracking-tight leading-tight max-w-2xl">
          {t('faqSubtitle')}
        </h2>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isOpen = openId === item.id
          return (
            <div
              key={item.id}
              className={`group border rounded-xl transition-all duration-300 overflow-hidden
                ${isOpen ? 'border-accent bg-accent/[0.04] shadow-md' : 'border-border bg-card hover:border-accent/40 shadow-sm'}`}
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer gap-4"
              >
                <h3 className="font-newsreader italic text-lg md:text-xl text-normal font-normal leading-snug">
                  {item.q}
                </h3>
                <div
                  className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-300
                    ${isOpen ? 'rotate-45 border-accent bg-brand-brown text-white' : 'border-border bg-dark text-description'}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              </button>
              {isOpen && (
                <div className="px-5 md:px-6 pb-6 pt-0 border-t border-border/50">
                  <p className="font-montserrat text-sm md:text-base text-description leading-relaxed max-w-3xl pt-4">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default HomeFAQSection
