import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SmoothScrollContext = createContext(null)

const MD_MIN = 768

export function getLandingScrollOffset() {
  if (typeof window === 'undefined') return 112
  return window.innerWidth >= MD_MIN ? 128 : 112
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function SmoothScrollProvider({ lenisRef, children }) {
  const scrollToElement = useCallback(
    (el, options = {}) => {
      if (!el) return

      const lenis = lenisRef?.current
      const reduced = prefersReducedMotion()
      const {
        offset = -getLandingScrollOffset(),
        duration = 1,
        immediate = reduced,
      } = options

      if (!lenis) {
        const top = el.getBoundingClientRect().top + window.scrollY + offset
        window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' })
        requestAnimationFrame(() => {
          try {
            ScrollTrigger.update()
          } catch {
            /* ignore */
          }
        })
        return
      }

      lenis.scrollTo(el, {
        offset,
        duration: immediate ? 0 : duration,
        immediate,
        onComplete: () => {
          try {
            ScrollTrigger.update()
          } catch {
            /* ignore */
          }
        },
      })
    },
    [lenisRef]
  )

  const scrollToId = useCallback(
    (id, options = {}) => {
      const normalized = String(id || '').replace(/^#/, '')
      if (!normalized) return
      const el = document.getElementById(normalized)
      scrollToElement(el, options)
    },
    [scrollToElement]
  )

  const value = useMemo(
    () => ({
      lenisRef,
      scrollToElement,
      scrollToId,
    }),
    [lenisRef, scrollToElement, scrollToId]
  )

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>
}

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext)
  if (!ctx) {
    return {
      lenisRef: { current: null },
      scrollToElement: (el, options = {}) => {
        if (!el) return
        const reduced = prefersReducedMotion()
        const offset = options.offset ?? -getLandingScrollOffset()
        const top = el.getBoundingClientRect().top + window.scrollY + offset
        window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' })
      },
      scrollToId: (id, options = {}) => {
        const normalized = String(id || '').replace(/^#/, '')
        const el = document.getElementById(normalized)
        if (!el) return
        const reduced = prefersReducedMotion()
        const offset = options.offset ?? -getLandingScrollOffset()
        const top = el.getBoundingClientRect().top + window.scrollY + offset
        window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' })
      },
    }
  }
  return ctx
}