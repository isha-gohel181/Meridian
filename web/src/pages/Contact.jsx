import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { submitContactQuery, resetSupportState } from '../redux/slices/supportSlice';
import { useLanguage } from '../context/LanguageContext';
import {
    SUPPORT_EMAIL,
    SUPPORT_PHONE_TEL,
    WHATSAPP_URL,
    getSupportEmailDisplay,
    getSupportPhoneDisplay,
} from '../constants/brand';

const Contact = () => {
    const dispatch = useDispatch();
    const { t } = useLanguage();
    const { user } = useSelector((state) => state.auth);
    const { submitting, error, success } = useSelector((state) => state.support);

    const containerRef = useRef(null);
    const scanLineRef = useRef(null);

    const [formData, setFormData] = useState({
        userName: user?.name || user?.fullName || '',
        userEmail: user?.email || '',
        code: '+91',
        phoneNumber: '',
        subject: 'General Inquiry',
        description: ''
    });

    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

    useEffect(() => {
        dispatch(resetSupportState());
        window.scrollTo(0, 0);

        // GSAP Animations
        const ctx = gsap.context(() => {
            gsap.fromTo('.contact-reveal',
                { y: 40, opacity: 0, filter: 'blur(8px)' },
                {
                    y: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 1,
                    stagger: 0.12,
                    ease: 'power3.out',
                    delay: 0.1
                }
            );

            // Subtle scrolling scanline effect on details card
            if (scanLineRef.current) {
                gsap.to(scanLineRef.current, {
                    top: '100%',
                    duration: 5,
                    repeat: -1,
                    ease: 'none'
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [dispatch]);

    // Prefill user data if auth state changes
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                userName: prev.userName || user.name || user.fullName || '',
                userEmail: prev.userEmail || user.email || ''
            }));
        }
    }, [user]);

    // Handle ticket submission status changes
    useEffect(() => {
        if (success) {
            setShowSuccessOverlay(true);
            // Reset form
            setFormData({
                userName: user?.name || user?.fullName || '',
                userEmail: user?.email || '',
                code: '+91',
                phoneNumber: '',
                subject: 'General Inquiry',
                description: ''
            });
            dispatch(resetSupportState());
        }
    }, [success, dispatch, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.userName || !formData.userEmail || !formData.code || !formData.phoneNumber || !formData.subject) {
            alert('Please fill name, email, phone, and subject.');
            return;
        }

        const subject = formData.subject.trim();
        const subjectLower = subject.toLowerCase();
        let category = 'general';
        if (subjectLower.includes('billing') || subjectLower.includes('payment')) category = 'billing';
        else if (subjectLower.includes('course') || subjectLower.includes('cohort') || subjectLower.includes('enrollment')) category = 'course';
        else if (subjectLower.includes('technical') || subjectLower.includes('support')) category = 'technical';

        const payload = {
            name: formData.userName.trim(),
            email: formData.userEmail.trim(),
            phone: `${formData.code.trim()} ${formData.phoneNumber.trim()}`.trim(),
            message: `[${subject}] ${formData.description.trim() || 'No additional message.'}`,
            category,
        };

        dispatch(submitContactQuery(payload));
    };

    const subjectOptions = [
        'General Inquiry',
        'Course Enquiry',
        'Enrollment',
        'Hands-on Workshop',
        'Billing or Payment Issue',
        'Technical Support',
        'Feedback',
        'Collaboration',
        'Other',
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-400/30 relative overflow-x-hidden pt-28 md:pt-36 pb-24 px-4 md:px-12 lg:px-20">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-400 blur-[150px] rounded-full animate-float-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-300 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Contact Header */}
                <div className="mb-12 contact-reveal space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                        <span className="font-jetbrains text-[10px] text-accent tracking-[0.4em] uppercase">
                            {t('getInTouch')}
                        </span>
                    </div>
                    <h1 className="font-newsreader italic text-4xl md:text-6xl text-slate-900 tracking-tighter">
                        Contact Us
                    </h1>
                    <p className="font-jetbrains text-slate-600 text-sm max-w-xl leading-relaxed">
                        {t('contactDesc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-7 space-y-10 contact-reveal">
                        <div className="space-y-2">
                            <h2 className="font-newsreader italic text-3xl text-slate-900 font-bold tracking-tight uppercase">
                                {t('sendMessage')}
                            </h2>
                            <div className="h-[2px] w-12 bg-amber-400 mt-4" />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="font-jetbrains text-[9px] text-slate-600 uppercase tracking-[0.3em] font-bold">{t('yourNameLabel')} *</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleInputChange}
                                        placeholder={t('enterYourName')}
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl p-4 font-jetbrains text-xs text-slate-900 focus:border-amber-500 outline-none transition-all shadow-sm placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-jetbrains text-[9px] text-slate-600 uppercase tracking-[0.3em] font-bold">{t('emailAddressLabel')} *</label>
                                    <input
                                        type="email"
                                        name="userEmail"
                                        value={formData.userEmail}
                                        onChange={handleInputChange}
                                        placeholder={t('enterYourEmail')}
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl p-4 font-jetbrains text-xs text-slate-900 focus:border-amber-500 outline-none transition-all shadow-sm placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-1 space-y-2">
                                    <label className="font-jetbrains text-[9px] text-slate-600 uppercase tracking-[0.3em] font-bold">{t('phoneCodeLabel')} *</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        placeholder="+91"
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl p-4 font-jetbrains text-xs text-slate-900 focus:border-amber-500 outline-none transition-all shadow-sm"
                                    />
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <label className="font-jetbrains text-[9px] text-slate-600 uppercase tracking-[0.3em] font-bold">{t('phoneNumberLabel')} *</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder={t('enterYourPhone')}
                                        required
                                        className="w-full bg-white border border-slate-200 rounded-xl p-4 font-jetbrains text-xs text-slate-900 focus:border-amber-500 outline-none transition-all shadow-sm placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="font-jetbrains text-[9px] text-slate-600 uppercase tracking-[0.3em] font-bold block">{t('subjectLabel')} *</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-slate-200 rounded-xl p-4 font-jetbrains text-xs text-slate-900 focus:border-amber-500 outline-none transition-all shadow-sm cursor-pointer"
                                >
                                    {subjectOptions.map(opt => (
                                        <option key={opt} value={opt} className="bg-white text-slate-900">{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="font-jetbrains text-[9px] text-slate-600 uppercase tracking-[0.3em] font-bold">{t('messageLabel')}</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder={t('tellUsHowHelp')}
                                    rows="5"
                                    className="w-full bg-white border border-slate-200 rounded-xl p-4 outline-none focus:border-amber-500 transition-all font-jetbrains text-xs text-slate-900 resize-vertical shadow-sm placeholder:text-slate-400"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-amber-400 text-slate-950 py-5 rounded-xl flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 shadow-sm font-black font-jetbrains text-xs uppercase tracking-[0.4em]"
                            >
                                {submitting ? 'SENDING...' : t('sendMessageBtn')}
                            </button>

                            {error && <p className="font-jetbrains text-[10px] text-red-500 uppercase tracking-widest text-center italic">{error}</p>}
                        </form>
                    </div>

                    {/* Right Column: Office Coordinates / Support Info */}
                    <div className="lg:col-span-5 space-y-8 contact-reveal lg:sticky lg:top-28">
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-between shadow-xl">
                            {/* Scanning Effect */}
                            <div ref={scanLineRef} className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent z-10 opacity-40 shadow-sm" />

                            <div className="space-y-8">
                                {/* Header bracket */}
                                <div className="flex justify-between items-center opacity-40">
                                    <span className="font-jetbrains text-[8px] tracking-[0.4em] uppercase text-slate-500">Official Details</span>
                                    <div className="h-[1px] w-16 bg-slate-300" />
                                    <span className="font-jetbrains text-[8px] tracking-[0.1em] uppercase text-slate-500">32 Pearls Dental Academy</span>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="font-newsreader text-2xl italic text-slate-900 font-bold">32 Pearls Dental Academy</h3>
                                        <p className="font-jetbrains text-xs text-amber-800 font-bold uppercase tracking-wider">
                                            Orthodontic Education &amp; Clinical Training
                                        </p>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-slate-100">
                                        <span className="font-jetbrains text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 block">Phone</span>
                                        <div className="flex items-center gap-2">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 shrink-0">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>
                                            <a
                                                href={`tel:${SUPPORT_PHONE_TEL}`}
                                                className="font-jetbrains text-base md:text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors"
                                            >
                                                {getSupportPhoneDisplay()}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-slate-100">
                                        <span className="font-jetbrains text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 block">WhatsApp</span>
                                        <div className="flex items-center gap-2">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 shrink-0">
                                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                            </svg>
                                            <a
                                                href={WHATSAPP_URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-jetbrains text-base md:text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors"
                                            >
                                                {getSupportPhoneDisplay()}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-slate-100">
                                        <span className="font-jetbrains text-[9px] uppercase tracking-[0.3em] font-bold text-slate-500 block">Email Address</span>
                                        <div className="flex items-center gap-2">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 shrink-0">
                                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                            </svg>
                                            <a
                                                href={`mailto:${SUPPORT_EMAIL}`}
                                                className="font-jetbrains text-base md:text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors break-all"
                                            >
                                                {getSupportEmailDisplay()}
                                            </a>
                                        </div>
                                        <p className="font-jetbrains text-[9px] text-slate-500 uppercase tracking-wider">
                                            Response timeframe: <span className="text-amber-800 font-bold">24–48 hours</span>
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-[10px] text-amber-900 font-jetbrains uppercase tracking-wider">
                                            Support: Mon–Sat (10:00 AM – 7:00 PM IST)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Corner Brackets */}
                            <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-slate-200" />
                            <div className="absolute top-4 right-4 w-4 h-4 border-r border-t border-slate-200" />
                            <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b border-slate-200" />
                            <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-slate-200" />
                        </div>
                    </div>
                </div>
            </div>

            {/* SUCCESS OVERLAY */}
            {showSuccessOverlay && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
                    <div className="bg-white border border-slate-200 p-8 md:p-12 max-w-lg w-full relative overflow-hidden shadow-2xl rounded-3xl">
                        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-600 stroke-green-600">
                                    <path d="M20 6L9 17l-5-5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <div className="space-y-2">
                                <span className="font-jetbrains text-[9px] text-green-700 uppercase tracking-[0.4em] font-black">Message Sent</span>
                                <h3 className="font-newsreader italic text-3xl text-slate-900 font-bold tracking-tight">Thank You.</h3>
                                <p className="font-jetbrains text-[10px] text-slate-600 uppercase tracking-widest mt-2">
                                    We have received your message. Our team aims to respond within 24–48 hours.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowSuccessOverlay(false)}
                                className="mt-4 w-full bg-amber-400 text-slate-950 py-4 rounded-xl font-jetbrains text-xs font-black uppercase tracking-[0.3em] hover:scale-[1.02] transition-transform duration-300 shadow-sm"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contact;
