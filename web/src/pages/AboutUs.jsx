import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ABOUT_US_PARAGRAPH, LOGO_PATH } from '../constants/brand';

gsap.registerPlugin(ScrollTrigger);

const focusAreas = [
  {
    title: 'Diagnosis & Case Selection',
    desc: 'Systematic assessment, records review, and case filtering for predictable orthodontic outcomes.',
  },
  {
    title: 'Treatment Planning',
    desc: 'Goal-oriented plans—from simple alignment to complex mechanics—with clear staging and monitoring.',
  },
  {
    title: 'Fixed Appliance Mechanics',
    desc: 'Hands-on training in bracket systems, wire sequencing, and troubleshooting common challenges.',
  },
  {
    title: 'Aligner Fundamentals',
    desc: 'Principles of clear-aligner therapy, staging, attachments, and refinement workflows.',
  },
  {
    title: 'Hands-on Workshops',
    desc: 'Chairside and lab-style sessions that translate theory into muscle memory and clinical confidence.',
  },
  {
    title: 'Live Case Discussions',
    desc: 'Mentor-led reviews of real cases—diagnosis, plan revisions, and long-term stability.',
  },
];

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
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-100 rounded-full blur-[120px] -z-10" />

        <div className="hero-animate mb-8">
          <img src={LOGO_PATH} alt="32 Pearls Dental Academy" className="h-20 md:h-24 w-auto mx-auto object-contain" />
        </div>

        <div className="hero-animate inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-8 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          About Us – 32 Pearls Dental Academy
        </div>

        <h1 className="hero-animate text-[clamp(2rem,5vw,3.5rem)] font-black text-slate-900 leading-[1.1] tracking-tight mb-8 max-w-4xl">
          Practical orthodontic education for confident clinical practice
        </h1>

        <p className="hero-animate text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed font-medium">
          {ABOUT_US_PARAGRAPH}
        </p>
      </section>

      <section className="scroll-section px-6 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100">
          {[
            { value: 'Hands-on', label: 'Clinical Workshops' },
            { value: 'Case-based', label: 'Learning Approach' },
            { value: 'Mentor-led', label: 'Guidance & Reviews' },
            { value: 'Ongoing', label: 'Clinical Support' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4">
              <span className="text-xl md:text-2xl font-black text-[#C96A1B] mb-2">{stat.value}</span>
              <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="scroll-section px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-square lg:aspect-auto lg:h-[520px]">
            <img
              src="https://images.pexels.com/photos/3862599/pexels-photo-3862599.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Orthodontic training at 32 Pearls Dental Academy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <h3 className="text-white text-2xl font-bold mb-3">Our Mission</h3>
              <p className="text-white/85 text-base leading-relaxed">
                To help dental practitioners move from theory to chairside competence—so every case is diagnosed clearly, planned thoughtfully, and managed with confidence.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Clinically oriented training that{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-[#C96A1B]">closes the practice gap</span>
            </h2>
            <div className="space-y-4 text-lg text-slate-600 leading-relaxed font-medium">
              <p>
                Many clinicians understand orthodontic concepts in theory but hesitate when treatment begins. We focus on structured skill-building: reading records, choosing mechanics, anticipating complications, and communicating with patients.
              </p>
              <p>
                Programs combine demonstrations, supervised practice, and ongoing mentor access—so you are never left alone when a case gets challenging.
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex w-fit items-center gap-2 px-8 py-4 bg-[#C96A1B] hover:bg-[#a85614] text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-colors"
            >
              View Courses
            </Link>
          </div>
        </div>
      </section>

      <section className="scroll-section px-6 py-24 bg-slate-900 text-white mt-16 rounded-[3rem] mx-4 md:mx-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Key Focus Areas</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Curriculum pillars designed for real-world orthodontic practice—not textbook memorization alone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {focusAreas.map((item) => (
              <div
                key={item.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold mb-3 text-amber-300">{item.title}</h3>
                <p className="text-white/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
