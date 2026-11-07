/*
  "The book that opens on scroll" from Animorio · https://animorio.com
  License: free on your own sites and your clients’ sites, paid work included.
  Not for resale, redistribution, templates or code collections · https://animorio.com/en/license/
  Page-turn math is the Animorio original. Meridian only changes color, copy, and where it sits.
*/

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../../context/LanguageContext'
import './MeridianBook.css'

gsap.registerPlugin(ScrollTrigger)

const MeridianBook = () => {
  const { t, language } = useLanguage()
  const container = useRef(null)

  useEffect(() => {
    const root = container.current
    if (!root) return

    let mounted = true
    const cleanups = []
    const addPageListener = (target, ...args) => {
      target.addEventListener(...args)
      cleanups.push(() => target.removeEventListener(...args))
    }
    const addTicker = (callback, ...args) => {
      gsap.ticker.add(callback, ...args)
      cleanups.push(() => gsap.ticker.remove(callback))
    }

    const ctx = gsap.context(() => {
      const pageFontsReady = new Promise((resolve) => {
        document.fonts.ready.then(() => mounted && resolve())
      })

      const PAGES = 7
      const SIZE = 1
      const CURL = 14
      const LIFT = 0.07
      const TILT = [56, 40]
      const TURN = [-9, -2]
      const FAN = 0.8
      const SMOOTH = 0.7
      const RIDE = 1

      const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches
      const $ = (s, r = root) => r.querySelector(s)
      const $$ = (s, r = root) => Array.from(r.querySelectorAll(s))
      const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
      const lerp = (a, b, t) => a + (b - a) * t
      const finestra = (p, a, b) => clamp((p - a) / (b - a), 0, 1)
      const dentroFuori = gsap.parseEase('power2.inOut')
      const esce = gsap.parseEase('power3.out')
      const S = 5

      const corsa = $('[data-corsa]')
      const palco = $('[data-palco]')
      const libro = $('[data-libro]')
      const ombra = $('[data-ombra]')
      const retro = $('.dorso-retro')
      const blocco = $('[data-blocco]')
      const piede = $('[data-taglio-piede]')
      const davantiTaglio = $('[data-taglio-davanti]')
      const pagineBox = $('[data-pagine]')
      const copertina = $('[data-copertina]')
      const fuori = $('.copertina__fuori')
      const dentro = $('.copertina__dentro')
      const spessore = $('.copertina__spessore')
      const luceCop = $('[data-luce-cop]')
      const luceDentro = $('[data-luce-dentro]')
      const ombraPagina = $('[data-ombra-pagina]')
      const nastro = $('[data-nastro]')
      const frase = $('[data-frase]')
      const cap = $('[data-cap]')
      const cenno = $('[data-cenno]')

      const N = Math.round(clamp(PAGES, 2, 14))
      const stato = { p: REDUCED ? 1 : 0, nasce: REDUCED ? 1 : 0, solleva: 0 }
      const mano = { x: 0, y: 0 }
      let W = 200
      let H = 264
      let T = 12
      let CT = 3
      let PW = 194
      let PH = 254
      let PX = 2
      let PY = 5

      const fogli = []
      for (let i = 0; i < N; i++) {
        const f = document.createElement('div')
        f.className = 'foglio'
        let padre = f
        const segmenti = []
        for (let s = 0; s < S; s++) {
          const seg = document.createElement('div')
          seg.className = 'segmento'
          const n = String(i + 1).padStart(2, '0')
          seg.innerHTML =
            `<div class="lato lato--fronte"><div class="pagina-testo" data-page="${i}" data-face="fronte"><p class="pagina-testo__n">${n}</p><p class="pagina-testo__riga"></p></div></div>` +
            '<div class="lato lato--retro"></div>'
          padre.appendChild(seg)
          segmenti.push(seg)
          padre = seg
        }
        pagineBox.appendChild(f)
        fogli.push({ el: f, segmenti, lati: segmenti.map((sg) => $$('.lato', sg)) })
      }
      cleanups.push(() => {
        fogli.forEach((f) => f.el.remove())
      })

      function misura() {
        const r = palco.getBoundingClientRect()
        const k = clamp(SIZE, 0.6, 1.3)
        W = Math.min(r.width * 0.36, r.height * 0.36, 270) * k
        H = W * 1.34
        T = Math.max(6, W * 0.055)
        CT = Math.max(2, W * 0.012)
        PX = W * 0.012
        PY = H * 0.022
        PW = W - PX * 2.2
        PH = H - PY * 2
        libro.style.width = `${W}px`
        libro.style.height = `${H}px`
        libro.style.marginTop = `${-H / 2}px`
        libro.style.setProperty('--titolo', `${W * 0.17}px`)
        libro.style.setProperty('--testo', `${W * 0.092}px`)
        libro.style.setProperty('--testo-piccolo', `${Math.max(8, W * 0.045)}px`)
        retro.style.cssText = `width:${W}px;height:${H}px;transform:translateZ(0px)`
        blocco.style.cssText = `left:${PX}px;top:${PY}px;width:${PW}px;height:${PH}px;transform:translateZ(${T}px)`
        piede.style.cssText = `left:${PX}px;top:${PY + PH}px;width:${PW}px;height:${T}px;transform:rotateX(90deg)`
        davantiTaglio.style.cssText = `left:${PX + PW}px;top:${PY}px;width:${T}px;height:${PH}px;transform:rotateY(-90deg)`
        nastro.style.cssText = `left:${PW * 0.075}px;top:${-PY * 0.4}px;width:${Math.max(4, W * 0.026)}px;height:${PH + PY * 2 + H * 0.12}px`
        copertina.style.width = `${W}px`
        copertina.style.height = `${H}px`
        fuori.style.transform = `translateZ(${CT / 2}px)`
        dentro.style.transform = `rotateY(180deg) translateZ(${CT / 2}px)`
        spessore.style.cssText = `left:${W}px;top:0;width:${CT}px;height:${H}px;transform:translateZ(${-CT / 2}px) rotateY(-90deg)`
        const sw = PW / S
        for (const f of fogli) {
          f.el.style.width = `${PW}px`
          f.el.style.height = `${PH}px`
          f.segmenti.forEach((seg, s) => {
            seg.style.width = `${sw + 1.6}px`
            seg.style.left = s === 0 ? '0px' : `${sw}px`
            seg.querySelectorAll('.pagina-testo').forEach((el) => {
              el.style.width = `${PW}px`
              el.style.transformOrigin = '0 0'
              el.style.transform = `translateX(${(-s * sw).toFixed(2)}px)`
            })
          })
        }
        ombra.style.width = `${W * 1.25}px`
        ombra.style.height = `${H * 0.95}px`
      }

      function disegna() {
        const p = stato.p
        const nasce = esce(stato.nasce)

        const c = dentroFuori(finestra(p, 0.05, 0.3))
        const apertura = esce(finestra(p, 0.05, 0.7))
        const fine = dentroFuori(finestra(p, 0.8, 0.95))
        const tilt = lerp(TILT[0], TILT[1], dentroFuori(finestra(p, 0.1, 0.95))) + mano.y * 5
        const giro = lerp(TURN[0], TURN[1], apertura) + mano.x * 4

        const sx = -W * 0.5 * (1 - apertura)
        const sy = lerp(H * 0.12, H * 0.06, apertura) + (1 - nasce) * 26
        libro.style.opacity = nasce.toFixed(3)
        libro.style.transform = `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, 0) rotateX(${tilt.toFixed(2)}deg) rotateZ(${giro.toFixed(2)}deg) scale(${(0.96 + 0.04 * nasce).toFixed(4)})`
        ombra.style.opacity = (0.85 * nasce).toFixed(3)
        ombra.style.transform = `translate3d(${(sx - W * 0.12 - W * apertura).toFixed(2)}px, ${(sy - H * 0.47 + H * 0.06).toFixed(2)}px, 0) rotateX(${tilt.toFixed(2)}deg) rotateZ(${giro.toFixed(2)}deg) scaleX(${(1 + apertura * 0.95).toFixed(3)})`

        const zDestra = T + (N + 1) * 0.9
        const zCop = lerp(zDestra, 0.2, c) + Math.sin(c * Math.PI) * W * 0.05
        copertina.style.transform = `translateZ(${zCop.toFixed(2)}px) rotateY(${(-179.6 * c).toFixed(2)}deg)`
        luceCop.style.opacity = (0.42 * Math.sin(Math.min(c, 0.5) * Math.PI)).toFixed(3)
        luceDentro.style.opacity = (0.32 * Math.max(0, 1 - c) * 2 * (c > 0.5 ? 1 : 0)).toFixed(3)

        let ombraSopra = 0
        fogli.forEach((f, i) => {
          const a = 0.3 + i * (0.46 / N)
          let turn = dentroFuori(finestra(p, a, a + 0.2))
          if (i === 0 && stato.solleva > 0 && turn < 0.02) turn = Math.max(turn, stato.solleva * 0.06)
          const angolo = -(180 - FAN * (N - i)) * turn
          const zR = T + (N - i) * 0.9
          const zL = CT + 0.6 + (i + 1) * 0.9
          const z = lerp(zR, zL, turn) + Math.sin(turn * Math.PI) * W * LIFT
          f.el.style.transform = `translate3d(${PX}px, ${PY}px, ${z.toFixed(2)}px) rotateY(${angolo.toFixed(2)}deg)`
          const piega = Math.sin(turn * Math.PI) * CURL + (i === 0 ? stato.solleva * 10 : 0)
          f.segmenti.forEach((seg, s) => {
            const b = s === 0 ? 0 : piega * (0.35 + s * 0.22)
            seg.style.transform = `rotateY(${b.toFixed(2)}deg)`
          })
          const buio = 0.1 * Math.sin(turn * Math.PI)
          f.lati.forEach((lati, s) => {
            lati[0].style.setProperty('--buio', (buio * (0.8 + s * 0.03)).toFixed(3))
            lati[1].style.setProperty('--buio', (buio * (0.55 + s * 0.05)).toFixed(3))
          })
          if (turn > 0 && turn < 1) ombraSopra = Math.max(ombraSopra, Math.sin(turn * Math.PI) * (turn < 0.5 ? 1 : 0.6))
        })
        ombraPagina.style.opacity = (0.38 * ombraSopra).toFixed(3)

        nastro.style.transform = `rotateZ(${(Math.sin(p * 40) * 2 * ombraSopra - 2).toFixed(2)}deg)`

        frase.style.opacity = fine.toFixed(3)
        frase.style.transform = `translateY(${((1 - fine) * W * 0.03).toFixed(2)}px)`
        frase.style.fontVariationSettings = `'opsz' 36, 'wght' ${Math.round(lerp(300, 430, fine))}`
        cap.style.opacity = (fine * 0.9).toFixed(3)
        cenno.style.opacity = REDUCED ? 0 : (1 - clamp(p / 0.05, 0, 1)).toFixed(3)
      }

      corsa.style.height = REDUCED ? '100lvh' : `${Math.round(100 + 320 * clamp(RIDE, 0.3, 4))}lvh`

      function regia() {
        gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: corsa,
            start: 'top 7rem',
            end: 'bottom bottom',
            scrub: SMOOTH > 0 ? SMOOTH : true,
          },
        }).to(stato, { p: 1, duration: 1 })
      }

      if (!REDUCED) {
        const vx = gsap.quickTo(mano, 'x', { duration: 1, ease: 'power3.out' })
        const vy = gsap.quickTo(mano, 'y', { duration: 1, ease: 'power3.out' })
        addPageListener(palco, 'pointermove', (e) => {
          const r = palco.getBoundingClientRect()
          vx((e.clientX - r.left) / r.width - 0.5)
          vy((e.clientY - r.top) / r.height - 0.5)
        })
        addPageListener(palco, 'pointerleave', () => {
          vx(0)
          vy(0)
        })
        addPageListener(palco, 'click', () => {
          gsap
            .timeline()
            .to(stato, { solleva: 1, duration: 0.35, ease: 'power2.out' })
            .to(stato, { solleva: 0, duration: 1.1, ease: 'elastic.out(1, 0.4)' })
        })
      }

      function entrata() {
        const testa = $$('[data-entra]')
        if (REDUCED) {
          gsap.from(palco, { opacity: 0, duration: 0.6, ease: 'none' })
          return
        }
        gsap
          .timeline({ delay: 0.15 })
          .to(stato, { nasce: 1, duration: 1.4, ease: 'none' }, 0)
          .from(testa, { y: -12, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'back.out(2)' }, 0.3)
      }

      addTicker(disegna)
      let attesa = null
      addPageListener(window, 'resize', () => {
        if (attesa) attesa.kill()
        attesa = gsap.delayedCall(0.1, () => {
          if (!mounted) return
          misura()
          ScrollTrigger.refresh()
        })
      })
      function apri() {
        if (!mounted) return
        misura()
        ctx.add(() => {
          if (!REDUCED) regia()
          entrata()
        })
        disegna()
        ScrollTrigger.refresh()
      }
      if (document.fonts && pageFontsReady) pageFontsReady.then(apri)
      else apri()
    }, root)

    return () => {
      mounted = false
      cleanups.forEach((undo) => undo())
      ctx.revert()
    }
  }, [])

  useEffect(() => {
    const root = container.current
    if (!root) return
    root.querySelectorAll('.pagina-testo').forEach((el) => {
      const n = Number(el.getAttribute('data-page')) + 1
      const kicker = el.querySelector('.pagina-testo__n')
      const line = el.querySelector('.pagina-testo__riga')
      if (kicker) kicker.textContent = t(`bookLeaf${n}Kicker`)
      if (line) line.textContent = t(`bookLeaf${n}Line`)
    })
  }, [language, t])

  return (
    <div ref={container} className="meridian-book">
      <section className="corsa" data-corsa="">
        <div className="palco" data-palco="">
          <div className="scena" data-scena="" aria-hidden="true">
            <div className="ombra" data-ombra="" />
            <div className="libro" data-libro="">
              <div className="dorso-retro faccia" />
              <div className="blocco faccia" data-blocco="">
                <div className="pagina-base">
                  <p className="pagina-base__capitolo" data-cap="">
                    {t('bookChapter')}
                  </p>
                  <p className="pagina-base__frase" data-frase="">
                    {t('bookSentence')}
                  </p>
                  <span className="pagina-base__ombra" data-ombra-pagina="" />
                </div>
                <div className="nastro" data-nastro="" />
              </div>
              <div className="taglio taglio--piede faccia" data-taglio-piede="" />
              <div className="taglio taglio--davanti faccia" data-taglio-davanti="" />
              <div className="pagine" data-pagine="" />
              <div className="copertina" data-copertina="">
                <div className="copertina__fuori faccia">
                  <span className="copertina__titolo">{t('bookCoverTitle')}</span>
                  <span className="copertina__autore">{t('bookCoverLine')}</span>
                  <span className="copertina__luce" data-luce-cop="" />
                </div>
                <div className="copertina__dentro faccia">
                  <span className="copertina__ex">{t('bookEndpaper')}</span>
                  <span className="copertina__luce" data-luce-dentro="" />
                </div>
                <div className="copertina__spessore faccia" />
              </div>
            </div>
          </div>
          <p className="sr-only">{t('bookSr')}</p>
          <p className="cenno" data-entra="">
            <span data-cenno="">{t('bookHint')}</span>
          </p>
        </div>
      </section>
    </div>
  )
}

export default MeridianBook
