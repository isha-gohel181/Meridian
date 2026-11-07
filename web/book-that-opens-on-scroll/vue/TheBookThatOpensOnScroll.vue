<!--
  "The book that opens on scroll" from Animorio · https://animorio.com
  License: free on your own sites and your clients’ sites, paid work included.
  Not for resale, redistribution, templates or code collections · https://animorio.com/en/license/
-->
<script setup>
/* The book that opens on scroll, as a Vue 3 component. Made by Animorio from the demo's own code.
   npm install gsap lenis @fontsource-variable/newsreader @fontsource-variable/instrument-sans
   Call destroy() on the Lenis instance when the component goes away. */

import { ref, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import '@fontsource-variable/newsreader';
import '@fontsource-variable/instrument-sans';

gsap.registerPlugin(ScrollTrigger);

const container = ref(null);
let ctx;

onMounted(() => {
  ctx = gsap.context(() => {
    const cleanups = [];
    let mounted = true;
    const addPageListener = (target, ...args) => { target.addEventListener(...args); cleanups.push(() => target.removeEventListener(...args)); };
    const pageFontsReady = new Promise((resolve) => document.fonts.ready.then(() => mounted && resolve()));
    const addTicker = (callback, ...args) => { gsap.ticker.add(callback, ...args); cleanups.push(() => gsap.ticker.remove(callback)); };

    /* The book that opens on scroll
       A made-up publisher, Bramble Press, in the minimal style. The stage sticks while you scroll. In the middle a closed
       clothbound book lies on the table, seen from above and in front: cloth cover with the title pressed in, the edge of
       the stacked pages showing along the tail, a red ribbon bookmark poking out at the bottom. Scrolling opens it: the
       cover swings on its hinge, rises, turns over and lies down on the left showing the endpaper; then a few thin pages
       follow one after another, each curving as it turns, lifting off the stack, throwing a soft shadow on the page below
       and landing on the left with a hair of a fan. The book glides so the open spread ends in the middle, the camera
       lowers a little, and on the last page the first sentence of chapter one settles in. Scroll back up and it closes.
       The pointer tilts the book a few degrees on a spring; a click lifts the corner of the top page. */

    /* ---- valori da cambiare ---- */
    const PAGES = 7;              /* how many thin pages turn after the cover (2 to 14) */
    const SIZE = 1;               /* how big the book is (1 = fits the screen) */
    const CURL = 14;              /* how much a page curves while it turns, in degrees per strip */
    const LIFT = 0.07;            /* how high a turning page rises off the stack, as a fraction of the page width */
    const TILT = [56, 40];        /* how much the book leans back at the start and at the end, in degrees */
    const TURN = [-9, -2];        /* how much the book is turned on the table at the start and at the end, in degrees */
    const FAN = 0.8;              /* how much the turned pages fan out on the left, in degrees */
    const SMOOTH = 0.7;           /* how softly the book follows the scroll, in seconds (0 = glued to it) */
    const RIDE = 1;               /* how much scroll the whole thing takes: 2 is twice as long */

    gsap.registerPlugin(ScrollTrigger);

    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const finestra = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
    const dentroFuori = gsap.parseEase('power2.inOut');
    const esce = gsap.parseEase('power3.out');
    const S = 5; /* strips per page */

    const corsa = $('[data-corsa]');
    const palco = $('[data-palco]');
    const libro = $('[data-libro]');
    const ombra = $('[data-ombra]');
    const retro = $('.dorso-retro');
    const blocco = $('[data-blocco]');
    const piede = $('[data-taglio-piede]');
    const davantiTaglio = $('[data-taglio-davanti]');
    const pagineBox = $('[data-pagine]');
    const copertina = $('[data-copertina]');
    const fuori = $('.copertina__fuori');
    const dentro = $('.copertina__dentro');
    const spessore = $('.copertina__spessore');
    const luceCop = $('[data-luce-cop]');
    const luceDentro = $('[data-luce-dentro]');
    const ombraPagina = $('[data-ombra-pagina]');
    const nastro = $('[data-nastro]');
    const frase = $('[data-frase]');
    const cap = $('[data-cap]');
    const cenno = $('[data-cenno]');

    const N = Math.round(clamp(PAGES, 2, 14));
    const stato = { p: REDUCED ? 1 : 0, nasce: REDUCED ? 1 : 0, solleva: 0 };
    const mano = { x: 0, y: 0 };
    let W = 200, H = 264, T = 12, CT = 3, PW = 194, PH = 254, PX = 2, PY = 5;

    /* ---------------------------------------------------------------- the pages, built once */
    const fogli = [];
    for (let i = 0; i < N; i++) {
      const f = document.createElement('div');
      f.className = 'foglio';
      let padre = f;
      const segmenti = [];
      for (let s = 0; s < S; s++) {
        const seg = document.createElement('div');
        seg.className = 'segmento';
        seg.innerHTML = '<div class="lato lato--fronte"></div><div class="lato lato--retro"></div>';
        padre.appendChild(seg);
        segmenti.push(seg);
        padre = seg;
      }
      pagineBox.appendChild(f);
      fogli.push({ el: f, segmenti, lati: segmenti.map((sg) => $$('.lato', sg)) });
    }

    /* ---------------------------------------------------------------- sizes, in pixels, measured on the stage */
    function misura() {
      const r = palco.getBoundingClientRect();
      const k = clamp(SIZE, 0.6, 1.3);
      W = Math.min(r.width * 0.36, r.height * 0.36, 270) * k;
      H = W * 1.34;
      T = Math.max(6, W * 0.055);
      CT = Math.max(2, W * 0.012);
      PX = W * 0.012;
      PY = H * 0.022;
      PW = W - PX * 2.2;
      PH = H - PY * 2;
      libro.style.width = `${W}px`;
      libro.style.height = `${H}px`;
      libro.style.marginTop = `${-H / 2}px`;
      libro.style.setProperty('--titolo', `${W * 0.17}px`);
      libro.style.setProperty('--testo', `${W * 0.092}px`);
      libro.style.setProperty('--testo-piccolo', `${Math.max(8, W * 0.045)}px`);
      retro.style.cssText = `width:${W}px;height:${H}px;transform:translateZ(0px)`;
      blocco.style.cssText = `left:${PX}px;top:${PY}px;width:${PW}px;height:${PH}px;transform:translateZ(${T}px)`;
      piede.style.cssText = `left:${PX}px;top:${PY + PH}px;width:${PW}px;height:${T}px;transform:rotateX(90deg)`;
      davantiTaglio.style.cssText = `left:${PX + PW}px;top:${PY}px;width:${T}px;height:${PH}px;transform:rotateY(-90deg)`;
      nastro.style.cssText = `left:${PW * 0.075}px;top:${-PY * 0.4}px;width:${Math.max(4, W * 0.026)}px;height:${PH + PY * 2 + H * 0.12}px`;
      copertina.style.width = `${W}px`;
      copertina.style.height = `${H}px`;
      fuori.style.transform = `translateZ(${CT / 2}px)`;
      dentro.style.transform = `rotateY(180deg) translateZ(${CT / 2}px)`;
      spessore.style.cssText = `left:${W}px;top:0;width:${CT}px;height:${H}px;transform:translateZ(${-CT / 2}px) rotateY(-90deg)`;
      const sw = PW / S;
      for (const f of fogli) {
        f.el.style.width = `${PW}px`;
        f.el.style.height = `${PH}px`;
        f.segmenti.forEach((seg, s) => {
          seg.style.width = `${sw + 1.6}px`;
          seg.style.left = s === 0 ? '0px' : `${sw}px`;
        });
      }
      ombra.style.width = `${W * 1.25}px`;
      ombra.style.height = `${H * 0.95}px`;
    }

    /* ---------------------------------------------------------------- one frame */
    function disegna() {
      const p = stato.p;
      const nasce = esce(stato.nasce);

      /* the cover first, then the pages one after another, then the sentence */
      const c = dentroFuori(finestra(p, 0.05, 0.3));
      const apertura = esce(finestra(p, 0.05, 0.7));
      const fine = dentroFuori(finestra(p, 0.8, 0.95));
      const tilt = lerp(TILT[0], TILT[1], dentroFuori(finestra(p, 0.1, 0.95))) + mano.y * 5;
      const giro = lerp(TURN[0], TURN[1], apertura) + mano.x * 4;

      /* the book glides so that the closed book and then the open spread sit in the middle */
      const sx = -W * 0.5 * (1 - apertura);
      const sy = lerp(H * 0.12, H * 0.06, apertura) + (1 - nasce) * 26;
      libro.style.opacity = nasce.toFixed(3);
      libro.style.transform = `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, 0) rotateX(${tilt.toFixed(2)}deg) rotateZ(${giro.toFixed(2)}deg) scale(${(0.96 + 0.04 * nasce).toFixed(4)})`;
      ombra.style.opacity = (0.85 * nasce).toFixed(3);
      ombra.style.transform = `translate3d(${(sx - W * 0.12 - W * apertura).toFixed(2)}px, ${(sy - H * 0.47 + H * 0.06).toFixed(2)}px, 0) rotateX(${tilt.toFixed(2)}deg) rotateZ(${giro.toFixed(2)}deg) scaleX(${(1 + apertura * 0.95).toFixed(3)})`;

      /* the cover: rigid, it rises a little while it turns and lies down on the left */
      const zDestra = T + (N + 1) * 0.9;
      const zCop = lerp(zDestra, 0.2, c) + Math.sin(c * Math.PI) * W * 0.05;
      copertina.style.transform = `translateZ(${zCop.toFixed(2)}px) rotateY(${(-179.6 * c).toFixed(2)}deg)`;
      luceCop.style.opacity = (0.42 * Math.sin(Math.min(c, 0.5) * Math.PI)).toFixed(3);
      luceDentro.style.opacity = (0.32 * Math.max(0, 1 - c) * 2 * (c > 0.5 ? 1 : 0)).toFixed(3);

      /* the pages: each one has its window of scroll; while it turns it lifts and curves, the free edge trailing */
      let ombraSopra = 0;
      fogli.forEach((f, i) => {
        const a = 0.3 + i * (0.46 / N);
        let t = dentroFuori(finestra(p, a, a + 0.2));
        if (i === 0 && stato.solleva > 0 && t < 0.02) t = Math.max(t, stato.solleva * 0.06);
        const angolo = -(180 - FAN * (N - i)) * t;
        const zR = T + (N - i) * 0.9;
        const zL = CT + 0.6 + (i + 1) * 0.9;
        const z = lerp(zR, zL, t) + Math.sin(t * Math.PI) * W * LIFT;
        f.el.style.transform = `translate3d(${PX}px, ${PY}px, ${z.toFixed(2)}px) rotateY(${angolo.toFixed(2)}deg)`;
        const piega = Math.sin(t * Math.PI) * CURL + (i === 0 ? stato.solleva * 10 : 0);
        f.segmenti.forEach((seg, s) => {
          const b = s === 0 ? 0 : piega * (0.35 + s * 0.22);
          seg.style.transform = `rotateY(${b.toFixed(2)}deg)`;
        });
        const buio = 0.1 * Math.sin(t * Math.PI);
        f.lati.forEach((lati, s) => {
          const v = (buio * (0.8 + s * 0.03)).toFixed(3);
          lati[0].style.setProperty('--buio', v);
          lati[1].style.setProperty('--buio', (buio * (0.55 + s * 0.05)).toFixed(3));
        });
        if (t > 0 && t < 1) ombraSopra = Math.max(ombraSopra, Math.sin(t * Math.PI) * (t < 0.5 ? 1 : 0.6));
      });
      ombraPagina.style.opacity = (0.38 * ombraSopra).toFixed(3);

      /* the ribbon sways a little while the pages pass over it */
      nastro.style.transform = `rotateZ(${(Math.sin(p * 40) * 2 * ombraSopra - 2).toFixed(2)}deg)`;

      /* the first sentence of chapter one settles on the last page */
      frase.style.opacity = fine.toFixed(3);
      frase.style.transform = `translateY(${((1 - fine) * W * 0.03).toFixed(2)}px)`;
      frase.style.fontVariationSettings = `'opsz' 36, 'wght' ${Math.round(lerp(300, 430, fine))}`;
      cap.style.opacity = (fine * 0.9).toFixed(3);
      cenno.style.opacity = REDUCED ? 0 : (1 - clamp(p / 0.05, 0, 1)).toFixed(3);
    }

    /* ---------------------------------------------------------------- scrolling */
    corsa.style.height = REDUCED ? '100lvh' : `${Math.round(100 + 320 * clamp(RIDE, 0.3, 4))}lvh`;
    if (!REDUCED && typeof Lenis !== 'undefined') {
      const lenis = new Lenis({ autoRaf: false, lerp: 0.09 });
      lenis.on('scroll', ScrollTrigger.update);
      addTicker((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    function regia() {
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: corsa, start: 'top top', end: 'bottom bottom', scrub: SMOOTH > 0 ? SMOOTH : true },
      }).to(stato, { p: 1, duration: 1 });
    }

    /* ---------------------------------------------------------------- the pointer: a few degrees of tilt, a lifted corner */
    if (!REDUCED) {
      const vx = gsap.quickTo(mano, 'x', { duration: 1, ease: 'power3.out' });
      const vy = gsap.quickTo(mano, 'y', { duration: 1, ease: 'power3.out' });
      palco.addEventListener('pointermove', (e) => {
        const r = palco.getBoundingClientRect();
        vx((e.clientX - r.left) / r.width - 0.5);
        vy((e.clientY - r.top) / r.height - 0.5);
      });
      palco.addEventListener('pointerleave', () => { vx(0); vy(0); });
      palco.addEventListener('click', () => {
        gsap.timeline()
          .to(stato, { solleva: 1, duration: 0.35, ease: 'power2.out' })
          .to(stato, { solleva: 0, duration: 1.1, ease: 'elastic.out(1, 0.4)' });
      });
    }

    /* ---------------------------------------------------------------- the entrance */
    function entrata() {
      const testa = $$('[data-entra]');
      if (REDUCED) {
        gsap.from(palco, { opacity: 0, duration: 0.6, ease: 'none' });
        return;
      }
      gsap.timeline({ delay: 0.15 })
        .to(stato, { nasce: 1, duration: 1.4, ease: 'none' }, 0)
        .from(testa, { y: -12, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'back.out(2)' }, 0.3);
    }

    addTicker(disegna);
    let attesa = null;
    addPageListener(window, 'resize', () => {
      if (attesa) attesa.kill();
      attesa = gsap.delayedCall(0.1, () => { misura(); ScrollTrigger.refresh(); });
    });
    function apri() {
      misura();
      if (!REDUCED) regia();
      entrata();
      disegna();
      ScrollTrigger.refresh();
    }
    if (document.fonts && pageFontsReady) pageFontsReady.then(apri);
    else apri();

    return () => {
      cleanups.forEach((undo) => undo());
      mounted = false;
    };
  }, container.value);
});

onBeforeUnmount(() => ctx.revert());
</script>

<template>
  <div ref="container" style="display: contents">
    <main>
      <section class="corsa" data-corsa>
        <div class="palco" data-palco>
          <header class="testa">
            <a class="marchio" href="#" data-entra>Bramble Press</a>
            <p class="testa__nota" data-entra>The autumn list</p>
          </header>

          <div class="scena" data-scena aria-hidden="true">
            <div class="ombra" data-ombra></div>
            <div class="libro" data-libro>
              <div class="dorso-retro faccia"></div>
              <div class="blocco faccia" data-blocco>
                <div class="pagina-base">
                  <p class="pagina-base__capitolo" data-cap>Chapter one</p>
                  <p class="pagina-base__frase" data-frase>Some stories wait for the&nbsp;right&nbsp;page.</p>
                  <span class="pagina-base__ombra" data-ombra-pagina></span>
                </div>
                <div class="nastro" data-nastro></div>
              </div>
              <div class="taglio taglio--piede faccia" data-taglio-piede></div>
              <div class="taglio taglio--davanti faccia" data-taglio-davanti></div>
              <div class="pagine" data-pagine></div>

              <div class="copertina" data-copertina>
                <div class="copertina__fuori faccia">
                  <span class="copertina__titolo">Small<br>Hours</span>
                  <span class="copertina__autore">M. Arden</span>
                  <span class="copertina__luce" data-luce-cop></span>
                </div>
                <div class="copertina__dentro faccia">
                  <span class="copertina__ex">Bramble Press</span>
                  <span class="copertina__luce" data-luce-dentro></span>
                </div>
                <div class="copertina__spessore faccia"></div>
              </div>
            </div>
          </div>
          <p class="sr-only">Small Hours, by M. Arden. Chapter one: Some stories wait for the right page.</p>

          <p class="cenno" data-entra><span data-cenno>Scroll to open the book</span></p>
        </div>
      </section>
      <section class="dopo">
        <p class="dopo__testo">Small Hours is out in November, clothbound, 212 pages.</p>
      </section>
    </main>
  </div>
</template>

<!-- not scoped: the script builds part of the markup itself, and those elements would miss Vue's scoped attribute -->
<style>
/* The book that opens on scroll: a made-up publisher, Bramble Press. The stage sticks while you scroll; the book, its
   pages, the shadows and the light are placed by the script, which also reads the colours below. */
:root {
  --tavolo: #f2eee6;         /* the table, the page around the book */
  --inchiostro: #191714;     /* the text */
  --tenue: #8d877c;          /* the small text */
  --tela: #cfc6b4;           /* the cloth of the cover */
  --tela-scura: #b9af9b;     /* the cloth of the back cover and the spine */
  --risguardo: #e6dfd0;      /* the endpaper inside the cover */
  --carta: #fbf8f1;          /* the pages */
  --taglio: #ece5d6;         /* the edge of the stacked pages */
  --accento: #d9482b;        /* the ribbon bookmark, the only colour */
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
}

body {
  background: var(--tavolo);
  color: var(--inchiostro);
  font-family: 'Instrument Sans Variable', 'Instrument Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

html.lenis,
html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* ---------------------------------------------------------------- the stage */
.corsa {
  position: relative;
  height: 420lvh; /* the script sets the real height from RIDE */
}

.palco {
  position: sticky;
  top: 0;
  height: 100lvh;
  overflow: hidden;
  background: var(--tavolo);
}

.testa {
  position: absolute;
  inset: 0 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: clamp(14px, 3.2vh, 30px) clamp(16px, 4vw, 44px);
  z-index: 2;
}

.marchio {
  color: var(--inchiostro);
  text-decoration: none;
  font-family: 'Newsreader Variable', 'Newsreader', Georgia, serif;
  font-size: clamp(14px, 1.4vw, 17px);
  font-weight: 560;
  letter-spacing: 0.01em;
}

.testa__nota,
.cenno {
  margin: 0;
  font-size: clamp(11px, 1vw, 13px);
  color: var(--tenue);
  letter-spacing: 0.02em;
}

.cenno {
  position: absolute;
  left: 0;
  right: 0;
  bottom: clamp(14px, 4vh, 34px);
  text-align: center;
  z-index: 2;
}

/* ---------------------------------------------------------------- the book */
.scena {
  position: absolute;
  inset: 0;
  perspective: 1700px;
  perspective-origin: 50% 30%;
}

.libro,
.libro * {
  transform-style: preserve-3d;
}

.libro {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: 0 50%;
}

.faccia,
.libro .foglio,
.libro .segmento {
  position: absolute;
  left: 0;
  top: 0;
}

.dorso-retro {
  background: var(--tela-scura);
  border-radius: 1px 3px 3px 1px;
}

.blocco {
  background: var(--carta);
}

.pagina-base {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(90deg, rgba(60, 45, 25, 0.10), rgba(60, 45, 25, 0) 9%), var(--carta);
  font-family: 'Newsreader Variable', 'Newsreader', Georgia, serif;
}

.pagina-base__capitolo {
  position: absolute;
  left: 15%;
  right: 12%;
  top: 22%;
  margin: 0;
  font-style: italic;
  font-size: var(--testo-piccolo, 11px);
  color: var(--tenue);
  letter-spacing: 0.02em;
}

.pagina-base__frase {
  position: absolute;
  left: 15%;
  right: 12%;
  top: 30%;
  margin: 0;
  font-size: var(--testo, 20px);
  line-height: 1.16;
  font-variation-settings: 'opsz' 36;
  color: var(--inchiostro);
  text-wrap: balance;
}

.pagina-base__ombra {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(40, 30, 15, 0.55), rgba(40, 30, 15, 0) 70%);
  opacity: 0;
  pointer-events: none;
}

.nastro {
  position: absolute;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.12) 45%, rgba(0, 0, 0, 0.1)), var(--accento);
  transform-origin: 50% 0;
  border-radius: 0 0 1px 1px;
}

/* the tail of the ribbon is cut in a little V */
.nastro::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 7px;
  background: linear-gradient(to bottom right, transparent 49%, var(--tavolo) 51%) left / 50% 100% no-repeat,
    linear-gradient(to bottom left, transparent 49%, var(--tavolo) 51%) right / 50% 100% no-repeat;
}

.taglio {
  transform-origin: 0 0;
  background: repeating-linear-gradient(var(--verso, 180deg), var(--taglio) 0 1.2px, #d9d0bd 1.2px 1.6px);
}

.taglio--davanti {
  --verso: 90deg;
}

/* the pages: each one is a few thin strips hinged one on the next, so it can curve while it turns */
.foglio {
  transform-origin: 0 50%;
}

.segmento {
  height: 100%;
  transform-origin: 0 50%;
}

.segmento > .lato {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0.6px 0 rgba(90, 70, 40, 0.16), inset 0 -0.6px 0 rgba(90, 70, 40, 0.16);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  background: var(--carta);
}

.segmento > .lato--retro {
  transform: rotateY(180deg);
  background: #f8f5ee;
}

.lato::after {
  content: '';
  position: absolute;
  inset: 0;
  background: #2a2216;
  opacity: var(--buio, 0);
}

.copertina {
  transform-origin: 0 50%;
}

.copertina__fuori,
.copertina__dentro {
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 1px 3px 3px 1px;
  overflow: hidden;
}

.copertina__fuori {
  background:
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.07) 0 1px, transparent 1px 3px),
    repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.05) 0 1px, transparent 1px 3px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0) 7%, rgba(255, 255, 255, 0.08) 8%, rgba(0, 0, 0, 0) 12%),
    var(--tela);
}

.copertina__titolo {
  position: absolute;
  left: 16%;
  right: 10%;
  top: 18%;
  font-family: 'Newsreader Variable', 'Newsreader', Georgia, serif;
  font-size: var(--titolo, 34px);
  font-weight: 520;
  line-height: 0.95;
  letter-spacing: -0.01em;
  color: #b8ae99;
  /* pressed into the cloth: a dark line above each stroke, a light one below */
  text-shadow: 0 -1px 0 rgba(70, 55, 35, 0.45), 0 1px 0 rgba(255, 255, 255, 0.45);
}

.copertina__autore {
  position: absolute;
  left: 16%;
  bottom: 12%;
  font-size: var(--testo-piccolo, 11px);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #aa9f88;
  text-shadow: 0 -1px 0 rgba(70, 55, 35, 0.35), 0 1px 0 rgba(255, 255, 255, 0.4);
}

.copertina__dentro {
  transform: rotateY(180deg);
  background: linear-gradient(270deg, rgba(60, 45, 25, 0.12), rgba(60, 45, 25, 0) 10%), var(--risguardo);
}

.copertina__ex {
  position: absolute;
  left: 0;
  right: 0;
  top: 46%;
  text-align: center;
  font-family: 'Newsreader Variable', 'Newsreader', Georgia, serif;
  font-style: italic;
  font-size: var(--testo-piccolo, 11px);
  color: #a99f8c;
}

.copertina__luce {
  position: absolute;
  inset: 0;
  background: #20190f;
  opacity: 0;
  pointer-events: none;
}

.copertina__spessore {
  background: var(--tela-scura);
  transform-origin: 0 0;
}

.ombra {
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(60, 45, 25, 0.3), rgba(60, 45, 25, 0.12) 60%, rgba(60, 45, 25, 0));
  filter: blur(14px);
  transform-origin: 0 50%;
}

/* ---------------------------------------------------------------- after the book */
.dopo {
  min-height: 60lvh;
  display: grid;
  place-items: center;
  padding: 40px 20px;
}

.dopo__testo {
  margin: 0;
  max-width: 34ch;
  text-align: center;
  font-family: 'Newsreader Variable', 'Newsreader', Georgia, serif;
  font-size: clamp(16px, 2vw, 22px);
  color: var(--tenue);
}
</style>
