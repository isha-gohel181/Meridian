import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import {
  APP_DISPLAY_NAME,
  APP_TAGLINE,
  BRAND_TAGLINE_SECONDARY,
  LOGO_PATH,
  SUPPORT_EMAIL,
  SUPPORT_PHONE_ALT_TEL,
  WHATSAPP_URL,
  getSupportEmailDisplay,
  getSupportPhoneAltDisplay,
  getWhatsAppPhoneDisplay,
} from '../constants/brand';
import {
  MERIDIAN_APPROACH_SUMMARY,
  MERIDIAN_COMMITMENT,
  MERIDIAN_DIFFERENTIATORS,
  MERIDIAN_FUTURE_DIVISIONS,
  MERIDIAN_FUTURE_INTRO,
  MERIDIAN_FUTURE_NOTE,
  MERIDIAN_INTRO,
  MERIDIAN_MISSION,
  MERIDIAN_PHILOSOPHY,
  MERIDIAN_VISION,
} from '../constants/meridianLanding';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-animate',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
      );

      gsap.utils.toArray('.scroll-section').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
            },
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-800 overflow-hidden pt-24 pb-20">
      <section className="relative px-6 py-20 md:py-28 max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-brown/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10" />

        <div className="hero-animate mb-8">
          <img src={LOGO_PATH} alt={APP_DISPLAY_NAME} className="h-20 md:h-24 w-auto mx-auto object-contain" />
        </div>

        <p className="hero-animate font-jetbrains text-[10px] text-accent tracking-[0.45em] uppercase font-bold mb-4">
          About Us
        </p>

        <h1 className="hero-animate text-[clamp(1.75rem,4vw,2.75rem)] font-semibold text-brand-brown leading-tight tracking-tight mb-3">
          {APP_DISPLAY_NAME}
        </h1>

        <p className="hero-animate text-lg md:text-xl font-semibold text-brand-brown/90 mb-2">{APP_TAGLINE}</p>
        <p className="hero-animate text-base md:text-lg text-accent font-medium mb-8">{BRAND_TAGLINE_SECONDARY}</p>

        <div className="hero-animate space-y-5 text-left md:text-center text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl">
          <p>{MERIDIAN_PHILOSOPHY}</p>
          <p>{MERIDIAN_INTRO}</p>
          <p>{MERIDIAN_APPROACH_SUMMARY}</p>
        </div>
      </section>

      <section className="scroll-section px-6 py-12 max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-brand-brown mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed">{MERIDIAN_MISSION}</p>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-brand-brown mb-4">Our Vision</h2>
          <p className="text-slate-600 leading-relaxed">{MERIDIAN_VISION}</p>
        </div>
      </section>

      <section className="scroll-section px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-brown mb-8 text-center">What Makes Meridian Different?</h2>
        <ul className="space-y-4">
          {MERIDIAN_DIFFERENTIATORS.map((item) => (
            <li
              key={item.title}
              className="flex gap-4 bg-white rounded-xl p-5 border border-slate-100 shadow-sm"
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
              <div>
                <h3 className="font-semibold text-brand-brown">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="scroll-section px-6 py-16 max-w-4xl mx-auto bg-brand-brown text-white rounded-3xl mx-4 md:mx-auto md:max-w-4xl px-8 md:px-12">
        <p className="font-jetbrains text-[10px] tracking-[0.35em] uppercase text-accent font-bold mb-4">Future initiatives</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Our journey ahead</h2>
        <p className="text-white/85 leading-relaxed mb-6">{MERIDIAN_FUTURE_INTRO}</p>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm font-jetbrains tracking-wide text-accent mb-6">
          {MERIDIAN_FUTURE_DIVISIONS.map((name) => (
            <li key={name} className="flex items-center gap-2">
              <span className="text-accent">—</span> {name}
            </li>
          ))}
        </ul>
        <p className="text-white/80 text-sm leading-relaxed">{MERIDIAN_FUTURE_NOTE}</p>
      </section>

      <section className="scroll-section px-6 py-16 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-2xl font-bold text-brand-brown">Our commitment</h2>
        <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">{MERIDIAN_COMMITMENT}</p>
        <div className="pt-4 space-y-2">
          <p className="font-semibold text-brand-brown">
            {APP_DISPLAY_NAME} — {APP_TAGLINE}
          </p>
          <p className="text-slate-500 italic">Building foundations for learning. Creating possibilities for tomorrow.</p>
        </div>
      </section>

      <section className="scroll-section px-6 pb-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-lg">
          <h2 className="text-lg font-bold text-brand-brown mb-6 text-center">Get in touch</h2>
          <div className="space-y-4 font-jetbrains text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
              <span className="text-slate-500 uppercase tracking-wider text-xs">WhatsApp</span>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-brand-brown font-semibold hover:text-accent">
                {getWhatsAppPhoneDisplay()}
              </a>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
              <span className="text-slate-500 uppercase tracking-wider text-xs">Alternative phone</span>
              <a href={`tel:${SUPPORT_PHONE_ALT_TEL}`} className="text-brand-brown font-semibold hover:text-accent">
                {getSupportPhoneAltDisplay()}
              </a>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-slate-500 uppercase tracking-wider text-xs">Email</span>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-brown font-semibold hover:text-accent break-all">
                {getSupportEmailDisplay()}
              </a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/contact#enquiry"
              className="inline-flex px-8 py-3 bg-brand-brown hover:bg-brand-brown/90 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-colors"
            >
              Contact form
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
