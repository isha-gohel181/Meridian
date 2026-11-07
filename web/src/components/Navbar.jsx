import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import RollingText from './RollingText'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Navbar = ({ isLoaded }) => {
  const { token, user } = useSelector((state) => state.auth)
  const isAuthenticated = Boolean(token || user)
  const { theme } = useTheme()
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const shutter1Ref = useRef(null)
  const shutter2Ref = useRef(null)
  const shutter3Ref = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const line3Ref = useRef(null)

  const scrollToSection = useCallback((hash) => {
    const id = hash.replace(/^#/, '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const handleHashNav = useCallback(
    (e, hash) => {
      e.preventDefault()
      setIsOpen(false)
      const id = hash.replace(/^#/, '')
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => scrollToSection(id), 80)
      } else {
        scrollToSection(id)
      }
    },
    [location.pathname, navigate, scrollToSection]
  )

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return
    const id = location.hash.replace('#', '')
    setTimeout(() => scrollToSection(id), 120)
  }, [location.pathname, location.hash, scrollToSection])

  const navContainerRef = useRef(null)
  const innerNavRef = useRef(null)
  const logoRef = useRef(null)
  const linksWrapRef = useRef(null)
  const buttonsWrapRef = useRef(null)
  const pillRef = useRef(null)

  const desktopLinkClass =
    'nav-slot nav-link-item group px-3.5 xl:px-4 py-2 rounded-xl font-inter text-[10px] xl:text-[11px] font-semibold uppercase transition-all duration-300 tracking-[0.12em] xl:tracking-[0.18em] relative z-10 text-slate-700 hover:text-slate-900 cursor-pointer'

  useEffect(() => {
    if (!isLoaded) return

    const ctx = gsap.context(() => {
      const internalTl = gsap.timeline()

      internalTl.fromTo(
        navContainerRef.current,
        { y: -15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          autoAlpha: 1,
          pointerEvents: 'auto',
          duration: 0.35,
          ease: 'power3.out',
        }
      )

      internalTl.fromTo(logoRef.current, { x: -4, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25 }, '-=0.15')
      internalTl.fromTo(
        '.nav-link-item',
        { y: 3, opacity: 0, scale: 0.99 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.02, duration: 0.35, ease: 'power3.out' },
        '-=0.15'
      )
      internalTl.fromTo(buttonsWrapRef.current, { x: 4, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25 }, '-=0.15')
    })

    return () => ctx.revert()
  }, [isLoaded])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(navContainerRef.current, {
        top: '1rem',
        width: '90%',
        maxWidth: '1350px',
        left: '50%',
        xPercent: -50,
      })
      gsap.set(innerNavRef.current, {
        borderRadius: '1rem',
        paddingTop: '0.35rem',
        paddingBottom: '0.35rem',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(24px)',
      })
    })

    return () => ctx.revert()
  }, [theme])

  const updatePillToActive = () => {
    if (!linksWrapRef.current || !pillRef.current) return
    const activeEl = linksWrapRef.current.querySelector('.nav-item-active, a.active, .router-active')
    if (activeEl) {
      const targetEl = activeEl.classList.contains('nav-slot')
        ? activeEl
        : activeEl.closest('.nav-slot') || activeEl
      gsap.to(pillRef.current, {
        left: targetEl.offsetLeft,
        width: targetEl.offsetWidth,
        duration: 0.35,
        ease: 'power3.out',
        autoAlpha: 1,
      })
    } else {
      gsap.to(pillRef.current, { autoAlpha: 0, duration: 0.3 })
    }
  }

  useEffect(() => {
    const timer = setTimeout(updatePillToActive, 50)
    return () => clearTimeout(timer)
  }, [location.pathname, t])

  const handleHover = (e) => {
    const targetEl = e.currentTarget.classList.contains('nav-slot')
      ? e.currentTarget
      : e.currentTarget.closest('.nav-slot') || e.currentTarget
    if (!pillRef.current) return
    gsap.to(pillRef.current, {
      left: targetEl.offsetLeft,
      width: targetEl.offsetWidth,
      duration: 0.35,
      ease: 'power3.out',
      autoAlpha: 1,
    })
  }

  const handleLeave = () => {
    updatePillToActive()
  }

  const tl = useRef(null)

  useEffect(() => {
    const contentWrap = document.getElementById('content-wrapper')
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true, defaults: { duration: 1.1, ease: 'expo.inOut' } })

      tl.current.to(
        contentWrap,
        {
          scale: 0.85,
          rotateY: -10,
          x: '-15%',
          borderRadius: '2rem',
          pointerEvents: 'none',
        },
        0
      )

      tl.current.to(navContainerRef.current, { autoAlpha: 0, scale: 0.9, duration: 0.8 }, 0)

      tl.current.to(menuRef.current, { autoAlpha: 1, duration: 0 }, 0)
      tl.current.fromTo(
        [shutter1Ref.current, shutter2Ref.current, shutter3Ref.current],
        { x: '100%' },
        { x: '0%', stagger: 0.1 },
        0
      )

      tl.current.fromTo('.menu-header', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.6)

      tl.current.fromTo(
        '.menu-item',
        { y: 40, opacity: 0, rotateX: -20, scale: 0.95, filter: 'blur(15px)' },
        { y: 0, opacity: 1, rotateX: 0, scale: 1, filter: 'blur(0px)', stagger: 0.1, duration: 1.2, ease: 'power3.out' },
        0.5
      )

      tl.current.fromTo(
        '.bg-shape',
        { scale: 0.3, opacity: 0, rotate: -45 },
        { scale: 1, opacity: 0.12, rotate: 0, stagger: 0.15, duration: 1.5 },
        0.5
      )

      gsap.to('.bg-shape-float', {
        y: '30px',
        x: '15px',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.8, from: 'random' },
      })
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (isOpen) {
      tl.current?.play()
    } else {
      tl.current?.reverse()
    }
  }, [isOpen])

  const toggleMenu = () => setIsOpen(!isOpen)

  const mobileLinkAfter = () => {
    setIsOpen(false)
  }

  const mobileHash = (e, hash) => {
    handleHashNav(e, hash)
  }

  return (
    <>
      <nav
        ref={navContainerRef}
        className="fixed z-[120] will-change-[transform,top,width] opacity-0 pointer-events-none"
      >
        <div className="absolute -inset-1.5 bg-accent/10 rounded-full blur-xl pointer-events-none" />

        <div
          ref={innerNavRef}
          className="flex items-center justify-between bg-white/92 rounded-2xl px-3 sm:px-5 md:px-7 py-1.5 border border-slate-200/90 shadow-[0_4px_30px_rgba(24,120,192,0.12)] backdrop-blur-2xl relative z-20 will-change-[padding,background-color]"
        >
          {/* Logo asset has heavy padding; scale inside overflow clip so the mark reads at full bar height */}
          <Link
            to="/"
            ref={logoRef}
            className="relative flex h-[3.25rem] w-[12.5rem] shrink-0 items-center justify-center overflow-hidden rounded-lg hover:opacity-90 sm:h-[3.75rem] sm:w-[14rem] md:h-[4.5rem] md:w-[15.5rem] lg:w-[17rem] transition-opacity"
            aria-label="Meridian Group of Education home"
          >
            <img
              src="/meridian/logo.jpeg"
              alt=""
              decoding="async"
              draggable={false}
              className="pointer-events-none h-full w-[265%] max-h-none max-w-none object-contain object-center sm:w-[255%] md:w-[240%] lg:w-[220%] [transform:translateZ(0)]"
            />
          </Link>

          <div
            ref={linksWrapRef}
            onMouseLeave={handleLeave}
            className="hidden xl:flex items-center gap-0.5 relative px-1 py-1 flex-1 justify-center min-w-0"
          >
            <div
              ref={pillRef}
              className="absolute top-1/2 -translate-y-1/2 h-8 bg-brand-brown/8 border border-brand-brown/15 rounded-xl pointer-events-none transition-all duration-300 z-0 opacity-0"
            />

            <NavLink
              to="/"
              end
              onMouseEnter={handleHover}
              className={({ isActive }) =>
                `${desktopLinkClass} ${isActive ? 'nav-item-active router-active text-brand-brown font-bold' : ''}`
              }
            >
              {t('home')}
            </NavLink>

            <a
              href="/#about"
              onClick={(e) => handleHashNav(e, 'about')}
              onMouseEnter={handleHover}
              className={desktopLinkClass}
            >
              {t('navAbout')}
            </a>

            <NavLink
              to="/courses"
              onMouseEnter={handleHover}
              className={({ isActive }) =>
                `${desktopLinkClass} ${isActive ? 'nav-item-active router-active text-brand-brown font-bold' : ''}`
              }
            >
              {t('navCourses')}
            </NavLink>

            <NavLink
              to="/news"
              onMouseEnter={handleHover}
              className={({ isActive }) =>
                `${desktopLinkClass} ${isActive ? 'nav-item-active router-active text-brand-brown font-bold' : ''}`
              }
            >
              {t('navBlog')}
            </NavLink>

            <NavLink
              to="/contact"
              onMouseEnter={handleHover}
              className={({ isActive }) =>
                `${desktopLinkClass} ${isActive ? 'nav-item-active router-active text-brand-brown font-bold' : ''}`
              }
            >
              {t('navContact')}
            </NavLink>
          </div>

          <div ref={buttonsWrapRef} className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/contact#enquiry"
              className="hidden sm:inline-flex relative group bg-accent text-brand-brown font-bold px-3 md:px-4 py-2 rounded-xl font-inter text-[9px] md:text-[10px] uppercase tracking-[0.12em] overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-md border border-accent/30"
            >
              <span className="relative z-10 font-black">{t('enquireNow')}</span>
              <div className="absolute inset-0 bg-white/35 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12" />
            </Link>

            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="relative group bg-brand-brown text-white font-bold px-3 md:px-5 py-2 rounded-xl font-inter text-[9px] md:text-[10px] uppercase tracking-[0.12em] md:tracking-[0.15em] overflow-hidden transition-all duration-300 hover:scale-[1.04] active:scale-95 shadow-accent-soft flex items-center justify-center gap-1.5"
            >
              <span className="relative z-10 font-black">{isAuthenticated ? t('dashboard') : t('signIn')}</span>
              <div className="absolute inset-0 bg-white/25 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12" />
            </Link>

            <button
              type="button"
              onClick={toggleMenu}
              className="xl:hidden w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center gap-[4px] relative z-[130] group hover:bg-brand-brown/10 hover:border-brand-brown/25 transition-colors"
              aria-expanded={isOpen}
              aria-label="Open menu"
            >
              <span ref={line1Ref} className="w-3.5 h-[2px] bg-slate-800 transition-colors group-hover:bg-brand-brown" />
              <span ref={line2Ref} className="w-4.5 h-[2px] bg-slate-800 transition-colors group-hover:bg-brand-brown" />
              <span ref={line3Ref} className="w-3.5 h-[2px] bg-slate-800 transition-colors group-hover:bg-brand-brown" />
            </button>
          </div>
        </div>
      </nav>

      <div
        ref={menuRef}
        className="fixed inset-0 z-[110] h-[100dvh] overflow-hidden opacity-0 invisible"
      >
        <div ref={shutter1Ref} className="absolute inset-0 bg-slate-50 translate-x-full" />
        <div
          ref={shutter2Ref}
          className="absolute inset-0 bg-amber-100/60 translate-x-full border-r border-amber-300/40 backdrop-blur-xl"
        />
        <div ref={shutter3Ref} className="absolute inset-0 bg-white translate-x-full overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] [background-size:200px_200px]" />

          <header className="menu-header absolute top-0 left-0 w-full px-8 md:px-12 py-8 md:py-10 flex items-center justify-between z-50">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="relative flex h-[4.25rem] w-[14.5rem] items-center justify-center overflow-hidden rounded-lg hover:opacity-90 sm:h-[4.75rem] sm:w-[16rem] md:h-[5.25rem] md:w-[18rem] transition-opacity"
              aria-label="Meridian Group of Education home"
            >
              <img
                src="/meridian/logo.jpeg"
                alt=""
                decoding="async"
                draggable={false}
                className="pointer-events-none h-full w-[250%] max-h-none max-w-none object-contain object-center md:w-[230%]"
              />
            </Link>

            <button
              type="button"
              onClick={toggleMenu}
              className="group w-12 h-12 md:w-14 md:h-14 flex items-center justify-center relative hover:scale-110 active:scale-90 transition-transform"
              aria-label="Close menu"
            >
              <div className="absolute inset-0 bg-slate-100 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-500 ease-expo" />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="relative transition-transform duration-700 group-hover:rotate-180">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-normal"
                />
              </svg>
            </button>
          </header>

          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 md:gap-10 px-8 text-center pt-28 md:pt-36 pb-12 overflow-y-auto">
            <div className="flex flex-col items-center gap-4 md:gap-5 w-full max-w-lg">
              <NavLink to="/" onClick={mobileLinkAfter} className="menu-item font-newsreader text-2xl sm:text-4xl md:text-6xl font-extralight text-slate-800 block w-full">
                <RollingText text={t('home')} className="md:h-16 h-7 sm:h-10" />
              </NavLink>
              <a
                href="/#about"
                onClick={(e) => mobileHash(e, 'about')}
                className="menu-item font-newsreader text-2xl sm:text-4xl md:text-6xl font-extralight text-slate-800 opacity-80 hover:opacity-100 block w-full"
              >
                <RollingText text={t('navAbout')} className="md:h-16 h-7 sm:h-10" />
              </a>
              <NavLink to="/courses" onClick={mobileLinkAfter} className="menu-item font-newsreader text-2xl sm:text-4xl md:text-6xl font-extralight text-slate-800 opacity-80 hover:opacity-100 block w-full">
                <RollingText text={t('navCourses')} className="md:h-16 h-7 sm:h-10" />
              </NavLink>
              <NavLink to="/news" onClick={mobileLinkAfter} className="menu-item font-newsreader text-2xl sm:text-4xl md:text-6xl font-extralight text-slate-800 opacity-80 hover:opacity-100 block w-full">
                <RollingText text={t('navBlog')} className="md:h-16 h-7 sm:h-10" />
              </NavLink>
              <NavLink to="/contact" onClick={mobileLinkAfter} className="menu-item font-newsreader text-2xl sm:text-4xl md:text-6xl font-extralight text-slate-800 opacity-80 hover:opacity-100 block w-full">
                <RollingText text={t('navContact')} className="md:h-16 h-7 sm:h-10" />
              </NavLink>
              <Link
                to="/contact#enquiry"
                onClick={mobileLinkAfter}
                className="menu-item mt-4 inline-flex items-center justify-center px-8 py-3.5 bg-accent text-brand-brown rounded-xl font-jetbrains text-[10px] uppercase tracking-[0.25em] font-bold"
              >
                {t('enquireNow')}
              </Link>
            </div>

            <div className="menu-item flex flex-col items-center gap-8 pt-2 w-full">
              <p className="font-jetbrains text-[9px] tracking-[0.3em] text-slate-500 uppercase italic">{t('navMobileTag')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
