import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import ScrollStack, { ScrollStackItem } from '../ui/ScrollStack'

/**
 * Statement photos (Unsplash, saved locally):
 * 01 https://unsplash.com/photos/8b0e65b80b4e — desk / laptop study
 * 02 https://unsplash.com/photos/66273c2fd55f — small-group collaboration
 * 03 https://unsplash.com/photos/9a054b0db644 — workshop study
 */
const STATEMENT_CARDS = [
  {
    indexKey: 'landingStatementIndex',
    beforeKey: 'landingStatementBodyBefore',
    accentKey: 'landingStatementBodyAccent',
    afterKey: 'landingStatementBodyAfter',
    image: '/meridian/statement-01.jpg',
    altKey: 'landingStatementImageAlt1',
  },
  {
    indexKey: 'landingStatementIndex2',
    beforeKey: 'landingStatementBodyBefore2',
    accentKey: 'landingStatementBodyAccent2',
    afterKey: 'landingStatementBodyAfter2',
    image: '/meridian/statement-02.jpg',
    altKey: 'landingStatementImageAlt2',
  },
  {
    indexKey: 'landingStatementIndex3',
    beforeKey: 'landingStatementBodyBefore3',
    accentKey: 'landingStatementBodyAccent3',
    afterKey: 'landingStatementBodyAfter3',
    image: '/meridian/statement-03.jpg',
    altKey: 'landingStatementImageAlt3',
  },
]

const CARD_STYLE = {
  height: 'auto',
  minHeight: 'min(72vh, 36rem)',
}

const LandingStatementFold = () => {
  const { t } = useLanguage()

  return (
    <section id="statement" className="scroll-mt-28 md:scroll-mt-32 bg-slate-50">
      <ScrollStack
        useWindowScroll
        smoothScroll={false}
        stackPosition={120}
        itemDistance={100}
        itemStackDistance={24}
        itemScale={0.04}
        baseScale={0.9}
        dimAmount={0.12}
        holdDistance={240}
        className="py-8 md:py-12"
      >
        {STATEMENT_CARDS.map((card) => (
          <ScrollStackItem
            key={card.indexKey}
            itemClassName="overflow-hidden border border-brand-brown/[0.08] bg-slate-50 p-6 text-brand-brown shadow-none sm:p-8 md:p-10 lg:p-12"
            style={CARD_STYLE}
          >
            <div className="flex h-full min-h-[inherit] flex-col justify-center gap-10 md:flex-row md:items-center md:gap-12 lg:gap-16">
              <div className="max-w-xl shrink-0 md:max-w-[min(32rem,44vw)]">
                <p className="mb-4 font-jetbrains text-[10px] font-bold uppercase tracking-[0.45em] text-accent">
                  {t('landingStatementEyebrow')}
                </p>
                <div className="flex items-start gap-4">
                  <span
                    className="font-newsreader text-[clamp(4rem,14vw,7rem)] font-medium leading-none text-transparent"
                    style={{ WebkitTextStroke: '1px rgba(3, 39, 70, 0.35)' }}
                    aria-hidden
                  >
                    {t(card.indexKey)}
                  </span>
                  <p
                    className="pt-2 font-newsreader text-[clamp(1.5rem,3.6vw,3.25rem)] font-medium leading-[1.15] tracking-tight text-brand-brown"
                    style={{ maxWidth: '22ch' }}
                  >
                    {t(card.beforeKey)}{' '}
                    <span className="text-accent">{t(card.accentKey)}</span>
                    {t(card.afterKey)}
                  </p>
                </div>
              </div>

              <div className="relative min-h-[200px] flex-1 md:min-h-0">
                <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl bg-sky-50 md:ml-auto md:max-w-none">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-10 size-48 rounded-full bg-sky-100/90 blur-2xl"
                  />
                  <img
                    src={card.image}
                    alt={t(card.altKey)}
                    className="relative z-[1] h-full w-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  )
}

export default LandingStatementFold
