import React, { useEffect } from 'react';
import gsap from 'gsap';

const Terms = () => {
  useEffect(() => {
    gsap.fromTo('.terms-animate',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="terms-animate text-4xl md:text-5xl font-newsreader font-bold text-amber-600 mb-8">Terms & Conditions</h1>

        <div className="terms-animate space-y-6 text-base leading-relaxed">
          <p><strong>Effective Date:</strong> January 1, 2026</p>
          <p>
            Welcome to 32 Pearls Dental Academy. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">1. Use of the Platform</h2>
          <p>
            32 Pearls Dental Academy provides educational courses, training programs, consultancy, and technical study materials. You agree to use the platform only for lawful purposes and in a way that respects intellectual property and community guidelines.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">2. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You must immediately notify us of any unauthorized use of your account.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">3. Intellectual Property</h2>
          <p>
            All content on the 32 Pearls Dental Academy platform, including video lessons, audio sessions, e-books, practice test series, certifications, and logos, is the exclusive property of 32 Pearls Dental Academy. You may not reproduce, record, distribute, or modify any content without prior written permission.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">4. Educational Disclaimer</h2>
          <p>
            32 Pearls Dental Academy strives to provide insightful and authentic knowledge and guidance. Courses, certifications, and consultations are for skill development, professional guidance, and educational purposes.
          </p>

          <h2 className="text-xl font-bold text-amber-600 mt-6">5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the platform after any changes indicates your acceptance of the new terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
