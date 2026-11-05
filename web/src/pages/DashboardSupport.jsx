import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { useDispatch, useSelector } from 'react-redux';
import {
    createSupportTicket,
    fetchMyTickets,
    fetchTicketById,
    addTicketMessage,
    resetSupportState,
    clearSelectedTicket,
} from '../redux/slices/supportSlice';
import { useLanguage } from '../context/LanguageContext';

const SUPPORT_CATEGORIES = ['general', 'technical', 'billing', 'course'];

const DashboardSupport = () => {
    const dispatch = useDispatch();
    const { t } = useLanguage();
    const {
        tickets,
        selectedTicket,
        loading,
        detailLoading,
        replySending,
        submitting,
        error,
        success,
    } = useSelector((state) => state.support);
    const { user } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('raise');
    const [queryType, setQueryType] = useState('general');
    const [charCount, setCharCount] = useState(0);
    const [showEmojis, setShowEmojis] = useState(false);
    const [notice, setNotice] = useState(null);
    const [replyText, setReplyText] = useState('');
    const containerRef = useRef(null);
    const fileInputRef = useRef(null);
    const noticeTimerRef = useRef(null);

    const quickEmojis = ['🆘', '⚠️', '🐞', '💳', '📧', '📎', '💬', '⚡'];

    // Form State
    const [formData, setFormData] = useState({
        userName: user?.name || '',
        userEmail: user?.email || '',
        userPhone: '',
        subject: '',
        description: '',
        priority: 'medium',
        attachment: null
    });

    useEffect(() => {
        if (activeTab === 'my') {
            dispatch(clearSelectedTicket());
            dispatch(fetchMyTickets());
        }
    }, [dispatch, activeTab]);

    const clearNoticeTimer = () => {
        if (noticeTimerRef.current) {
            clearTimeout(noticeTimerRef.current);
            noticeTimerRef.current = null;
        }
    };

    const showNotice = (payload, autoDismissMs) => {
        clearNoticeTimer();
        setNotice(payload);
        if (autoDismissMs) {
            noticeTimerRef.current = setTimeout(() => setNotice(null), autoDismissMs);
        }
    };

    useEffect(() => () => clearNoticeTimer(), []);

    useEffect(() => {
        if (success) {
            showNotice(
                {
                    type: 'success',
                    title: t('ticketSubmittedSuccessTitle'),
                    message: t('ticketSubmittedSuccess'),
                },
                12000
            );
            setFormData({
                userName: user?.name || '',
                userEmail: user?.email || '',
                userPhone: '',
                subject: '',
                description: '',
                priority: 'medium',
                attachment: null
            });
            setCharCount(0);
            if (fileInputRef.current) fileInputRef.current.value = '';
            dispatch(fetchMyTickets());
            dispatch(resetSupportState());
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [success, dispatch, user, t]);

    useEffect(() => {
        if (error) {
            showNotice({ type: 'error', title: t('supportSubmitErrorTitle'), message: error });
            dispatch(resetSupportState());
        }
    }, [error, dispatch, t]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'description') setCharCount(value.length);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 10 * 1024 * 1024) {
            showNotice({ type: 'error', message: t('supportFileTooLarge') }, 8000);
            return;
        }
        setFormData(prev => ({ ...prev, attachment: file }));
    };

    const addEmoji = (emoji) => {
        setFormData(prev => ({ ...prev, description: prev.description + emoji }));
        setCharCount(prev => prev + emoji.length);
        setShowEmojis(false);
    };

    const handleSubmit = () => {
        if (!formData.subject || !formData.description || !formData.userEmail) {
            showNotice({ type: 'error', message: t('supportFormValidationError') }, 8000);
            return;
        }
        setNotice(null);
        clearNoticeTimer();

        const data = new FormData();
        data.append('subject', `${formData.subject}`);
        const category = SUPPORT_CATEGORIES.includes(queryType) ? queryType : 'general';
        data.append('category', category);
        data.append('description', formData.description);
        data.append('priority', formData.priority);
        data.append('userName', formData.userName);
        data.append('userEmail', formData.userEmail);
        data.append('userPhone', formData.userPhone);
        if (formData.attachment) {
            data.append('attachment', formData.attachment);
        }

        dispatch(createSupportTicket(data));
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            gsap.fromTo('.support-reveal',
                { y: 20, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.8, 
                    stagger: 0.1, 
                    ease: 'power3.out' 
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [activeTab]);

    const formatCategory = (cat) => {
        const labels = {
            general: t('supportCatGeneral'),
            technical: t('supportCatTechnical'),
            billing: t('supportCatBilling'),
            course: t('supportCatCourse'),
        };
        return labels[cat] || cat;
    };

    const formatStatus = (status) => {
        const labels = {
            open: t('supportStatusOpen'),
            in_progress: t('supportStatusInProgress'),
            resolved: t('supportStatusResolved'),
            closed: t('supportStatusClosed'),
        };
        return labels[status] || status;
    };

    const openTicket = (ticketId) => {
        if (!ticketId) return;
        setReplyText('');
        dispatch(fetchTicketById(ticketId));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSendReply = (e) => {
        e.preventDefault();
        const message = replyText.trim();
        if (!message || !selectedTicket?._id) return;
        dispatch(addTicketMessage({ ticketId: selectedTicket._id, message }))
            .unwrap()
            .then(() => {
                setReplyText('');
                dispatch(fetchMyTickets());
            })
            .catch((msg) => {
                showNotice({ type: 'error', message: msg || t('supportReplyFailed') }, 8000);
            });
    };

    const queryTypes = [
        { id: 'general', title: 'General inquiry', desc: 'Questions about the academy', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
        { id: 'technical', title: 'Technical support', desc: 'Login, video, or app issues', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' },
        { id: 'course', title: 'Course & enrollment', desc: 'Lessons, access, certificates', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' },
        { id: 'billing', title: 'Billing & payments', desc: 'Invoices, refunds, plans', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z' },
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-400/30 relative overflow-x-hidden">
            <DashboardHeader />
            
            <main className="pt-24 pb-16 px-4 md:px-12">
                <div className="max-w-[1600px] mx-auto space-y-12">
                    {/* Header Section */}
                    <div className="space-y-3 support-reveal opacity-0">
                        <h1 className="font-newsreader italic text-4xl md:text-5xl text-slate-900 font-light tracking-tight leading-none">
                            {t('supportCenter')}
                        </h1>
                        <p className="font-montserrat text-sm text-slate-600 max-w-xl">
                            {t('supportPageSubtitle')}
                        </p>
                    </div>

                    {notice && (
                        <div
                            role={notice.type === 'success' ? 'status' : 'alert'}
                            className={`rounded-2xl border p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
                                notice.type === 'success'
                                    ? 'bg-[#FFF9F3] border-accent/30'
                                    : 'bg-red-50 border-red-200'
                            }`}
                        >
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div
                                    className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${
                                        notice.type === 'success' ? 'bg-accent/15 text-accent' : 'bg-red-100 text-red-600'
                                    }`}
                                >
                                    {notice.type === 'success' ? (
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                                            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                                        </svg>
                                    )}
                                </div>
                                <div className="min-w-0 space-y-1">
                                    {notice.title && (
                                        <p className="font-montserrat text-base font-semibold text-slate-900">{notice.title}</p>
                                    )}
                                    <p className="font-montserrat text-sm text-slate-600 leading-relaxed">{notice.message}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                                {notice.type === 'success' && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNotice(null);
                                            clearNoticeTimer();
                                            setActiveTab('my');
                                            dispatch(fetchMyTickets());
                                        }}
                                        className="px-4 py-2.5 rounded-xl bg-accent text-white font-montserrat text-sm font-semibold hover:brightness-105 transition-all"
                                    >
                                        {t('viewMyTickets')}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNotice(null);
                                        clearNoticeTimer();
                                    }}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-montserrat text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors"
                                >
                                    {t('dismissNotice')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tab Switcher */}
                    <div className="flex flex-col md:flex-row justify-between items-center py-6 border-y border-slate-200 gap-6 support-reveal opacity-0">
                        <div className="flex items-center gap-4 bg-slate-100 p-1.5 border border-slate-200 rounded-2xl w-full md:w-auto">
                            <button 
                                onClick={() => setActiveTab('raise')}
                                className={`font-jetbrains text-xs font-black uppercase tracking-[0.3em] transition-all relative px-10 py-3 rounded-xl  
                                  ${activeTab === 'raise' ? 'text-slate-950 bg-amber-400 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
                            >
                                {t('raiseTicket')}
                            </button>
                            <button 
                                onClick={() => setActiveTab('my')}
                                className={`font-jetbrains text-xs font-black uppercase tracking-[0.3em] transition-all relative px-10 py-3 rounded-xl 
                                  ${activeTab === 'my' ? 'text-slate-950 bg-amber-400 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
                            >
                                {t('myTickets')}
                            </button>
                        </div>
                    </div>

                    {activeTab === 'raise' ? (
                        <div className="space-y-16">
                            {/* Layout Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                                {/* Contact Info */}
                                <div className="space-y-10 support-reveal opacity-0">
                                    <h3 className="font-montserrat text-lg font-semibold text-slate-900">{t('contactInfo')}</h3>
                                    
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="font-jetbrains text-xs font-bold tracking-[0.2em] uppercase text-slate-600">{t('fullNameLabel')} *</label>
                                                <div className="relative group">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m8-11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        name="userName"
                                                        value={formData.userName}
                                                        onChange={handleInputChange}
                                                        placeholder={t('enterYourName')} 
                                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-amber-500 transition-all font-jetbrains text-xs text-slate-900 tracking-widest uppercase placeholder:text-slate-400 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="font-jetbrains text-xs font-bold tracking-[0.2em] uppercase text-slate-600">{t('emailAddressLabel')} *</label>
                                                <div className="relative group">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>
                                                    </div>
                                                    <input 
                                                        type="email" 
                                                        name="userEmail"
                                                        value={formData.userEmail}
                                                        onChange={handleInputChange}
                                                        placeholder={t('enterYourEmail')} 
                                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-amber-500 transition-all font-jetbrains text-xs text-slate-900 tracking-widest uppercase placeholder:text-slate-400 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="font-jetbrains text-xs font-bold tracking-[0.2em] uppercase text-slate-600">{t('phoneNumberLabel')}</label>
                                                <div className="relative group">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                                    </div>
                                                    <input 
                                                        type="tel" 
                                                        name="userPhone"
                                                        value={formData.userPhone}
                                                        onChange={handleInputChange}
                                                        placeholder={t('enterYourPhone')} 
                                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-amber-500 transition-all font-jetbrains text-xs text-slate-900 tracking-widest uppercase placeholder:text-slate-400 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="font-jetbrains text-xs font-bold tracking-[0.2em] uppercase text-slate-600">{t('subjectLabel')} *</label>
                                                <div className="relative group">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        name="subject"
                                                        value={formData.subject}
                                                        onChange={handleInputChange}
                                                        placeholder="SUBJECT" 
                                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-amber-500 transition-all font-jetbrains text-xs text-slate-900 tracking-widest uppercase placeholder:text-slate-400 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Select Query */}
                                <div className="space-y-10 support-reveal opacity-0">
                                    <h3 className="font-montserrat text-lg font-semibold text-slate-900">{t('supportCategory')}</h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {queryTypes.map((type) => (
                                            <div 
                                                key={type.id}
                                                onClick={() => setQueryType(type.id)}
                                                className={`p-6 border rounded-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[150px] shadow-sm
                                                  ${queryType === type.id ? 'bg-amber-50 border-amber-400 shadow-md' : 'bg-white border-slate-200 hover:border-amber-300'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                                                  ${queryType === type.id ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600'}`}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={type.icon}/></svg>
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className={`font-jetbrains text-xs font-bold uppercase tracking-[0.2em] ${queryType === type.id ? 'text-amber-900' : 'text-slate-900'}`}>{type.title}</h4>
                                                    <p className="font-jetbrains text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">{type.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Description & Attachments */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 support-reveal opacity-0">
                                <div className="lg:col-span-8 space-y-10">
                                    <div className="space-y-2">
                                       <p className="font-jetbrains text-[9px] text-amber-800 uppercase tracking-[0.4em] font-black italic">{t('detailedDossierTag')}</p>
                                       <h3 className="font-newsreader italic text-3xl text-slate-900 font-bold tracking-tight uppercase leading-none">{t('intelligenceBriefingTitle')}</h3>
                                    </div>
                                    <div className="relative">
                                        <textarea 
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder={t('describeSituationPlaceholder')}
                                            className="w-full bg-white border border-slate-200 rounded-2xl p-6 h-64 outline-none focus:border-amber-500 transition-all font-jetbrains text-xs text-slate-900 tracking-widest uppercase resize-none placeholder:text-slate-400 shadow-sm"
                                        />
                                        
                                        {/* Emoji Trigger */}
                                        <div className="absolute top-4 right-4 flex items-center gap-2">
                                            <button 
                                                onClick={() => setShowEmojis(!showEmojis)}
                                                className={`p-2 transition-colors ${showEmojis ? 'text-amber-600' : 'text-slate-400 hover:text-amber-600'}`}
                                                title="Neural Symbols"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                                            </button>
                                            
                                            {showEmojis && (
                                                <div className="absolute top-12 right-0 bg-white border border-slate-200 rounded-xl p-3 flex gap-2 z-50 shadow-xl animate-in fade-in slide-in-from-top-2">
                                                    {quickEmojis.map(emoji => (
                                                        <button 
                                                            key={emoji}
                                                            onClick={() => addEmoji(emoji)}
                                                            className="hover:scale-125 transition-transform p-1"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute bottom-6 right-8 font-jetbrains text-[10px] text-amber-800 font-bold tracking-widest uppercase">
                                            {charCount} / 1000
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-4 space-y-10">
                                    <div className="space-y-2">
                                       <p className="font-jetbrains text-[9px] text-amber-800 uppercase tracking-[0.4em] font-black italic">{t('supportingAssetsTag')}</p>
                                       <h3 className="font-newsreader italic text-3xl text-slate-900 font-bold tracking-tight uppercase leading-none">{t('attachmentsTitle')}</h3>
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden" 
                                        accept="image/*,.pdf"
                                    />
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-2xl p-10 h-64 flex flex-col items-center justify-center gap-4 hover:border-amber-400 transition-all cursor-pointer group bg-white shadow-sm
                                          ${formData.attachment ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all
                                          ${formData.attachment ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600 group-hover:bg-amber-400 group-hover:text-slate-950'}`}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                {formData.attachment ? <path d="M20 6L9 17l-5-5"/> : <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5-5 5 5m-5-5v12"/>}
                                            </svg>
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="font-jetbrains text-xs font-bold uppercase tracking-[0.2em] text-slate-900">
                                                {formData.attachment ? formData.attachment.name : t('submitAssetsLabel')}
                                            </p>
                                            <p className="font-jetbrains text-[9px] text-slate-400 uppercase tracking-widest font-bold">{t('fileTypesMax')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="support-reveal opacity-0 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div className="space-y-1.5 min-w-0">
                                        <p className="font-montserrat text-base font-semibold text-slate-900">
                                            {t('supportSubmitReadyTitle')}
                                        </p>
                                        <p className="font-montserrat text-sm text-slate-600 leading-relaxed">
                                            {t('supportSubmitReadyHint')}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="inline-flex shrink-0 items-center justify-center gap-2.5 w-full lg:w-auto min-h-[52px] px-8 py-3.5 rounded-xl bg-accent text-white font-montserrat text-base font-semibold shadow-accent-soft hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                {t('submittingTicket')}
                                            </>
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                                    <path d="M22 2L11 13" />
                                                    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                                                </svg>
                                                {t('submitTicket')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : selectedTicket ? (
                        <div className="support-reveal opacity-0 space-y-6">
                            <button
                                type="button"
                                onClick={() => dispatch(clearSelectedTicket())}
                                className="inline-flex items-center gap-2 font-montserrat text-sm font-medium text-accent hover:underline"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
                                {t('backToTickets')}
                            </button>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="space-y-2 min-w-0">
                                        <p className="font-jetbrains text-xs text-accent font-semibold">
                                            #{selectedTicket._id?.slice(-6).toUpperCase()}
                                        </p>
                                        <h2 className="font-newsreader text-2xl md:text-3xl text-slate-900 font-light leading-snug break-words">
                                            {selectedTicket.subject}
                                        </h2>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-montserrat text-xs font-medium">
                                            {formatCategory(selectedTicket.category)}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 font-montserrat text-xs font-medium capitalize">
                                            {formatStatus(selectedTicket.status)}
                                        </span>
                                    </div>
                                </div>

                                <p className="font-montserrat text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                                    {selectedTicket.description}
                                </p>

                                <div className="space-y-3 pt-2 border-t border-slate-100">
                                    <h3 className="font-montserrat text-sm font-semibold text-slate-900">{t('ticketConversation')}</h3>
                                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                                        {(selectedTicket.messages || []).map((msg, idx) => (
                                            <div key={msg._id || idx} className="rounded-xl bg-[#FFF9F3] border border-slate-100 p-4">
                                                <p className="font-montserrat text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                                                    {msg.message || '—'}
                                                </p>
                                                <p className="font-montserrat text-xs text-slate-500 mt-2">
                                                    {msg.timestamp || msg.createdAt
                                                        ? new Date(msg.timestamp || msg.createdAt).toLocaleString()
                                                        : ''}
                                                </p>
                                            </div>
                                        ))}
                                        {(selectedTicket.messages || []).length === 0 && (
                                            <p className="font-montserrat text-sm text-slate-500">{t('noTicketMessages')}</p>
                                        )}
                                    </div>
                                </div>

                                {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
                                    <form onSubmit={handleSendReply} className="space-y-3 pt-2 border-t border-slate-100">
                                        <label className="block font-montserrat text-sm font-medium text-slate-900">
                                            {t('ticketReplyLabel')}
                                        </label>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            rows={3}
                                            placeholder={t('ticketReplyPlaceholder')}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 font-montserrat text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/15 resize-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={replySending || !replyText.trim()}
                                            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-xl bg-accent text-white font-montserrat text-sm font-semibold disabled:opacity-50"
                                        >
                                            {replySending ? t('submittingTicket') : t('sendReply')}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    ) : detailLoading ? (
                        <div className="py-20 text-center font-montserrat text-sm text-slate-500 animate-pulse">
                            {t('loadingTicketDetail')}
                        </div>
                    ) : (
                        <div className="support-reveal opacity-0 space-y-6">
                            <h3 className="font-montserrat text-lg font-semibold text-slate-900">{t('myTicketsHeading')}</h3>

                            <div className="overflow-hidden border border-slate-200 bg-white rounded-2xl shadow-sm overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[640px]">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="p-4 md:p-5 font-montserrat text-xs font-semibold text-slate-600">{t('ticketIdCol')}</th>
                                            <th className="p-4 md:p-5 font-montserrat text-xs font-semibold text-slate-600">{t('ticketSubjectCol')}</th>
                                            <th className="p-4 md:p-5 font-montserrat text-xs font-semibold text-slate-600">{t('classificationCol')}</th>
                                            <th className="p-4 md:p-5 font-montserrat text-xs font-semibold text-slate-600">{t('currentStateCol')}</th>
                                            <th className="p-4 md:p-5 font-montserrat text-xs font-semibold text-slate-600 text-right">{t('timestampCol')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="p-12 text-center font-montserrat text-sm text-slate-500">{t('loadingTickets')}</td>
                                            </tr>
                                        ) : tickets.length > 0 ? (
                                            tickets.map((ticket) => (
                                                <tr
                                                    key={ticket._id}
                                                    onClick={() => openTicket(ticket._id)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            openTicket(ticket._id);
                                                        }
                                                    }}
                                                    tabIndex={0}
                                                    role="button"
                                                    className="hover:bg-amber-50/50 transition-colors cursor-pointer focus:outline-none focus-visible:bg-amber-50/80"
                                                >
                                                    <td className="p-4 md:p-5 font-jetbrains text-xs text-accent font-semibold">#{ticket._id?.slice(-6).toUpperCase()}</td>
                                                    <td className="p-4 md:p-5 font-montserrat text-sm font-medium text-slate-900">{ticket.subject}</td>
                                                    <td className="p-4 md:p-5">
                                                        <span className="font-montserrat text-xs text-slate-600">{formatCategory(ticket.category)}</span>
                                                    </td>
                                                    <td className="p-4 md:p-5">
                                                        <span className="inline-flex items-center gap-2 font-montserrat text-xs text-slate-700">
                                                            <span className={`w-2 h-2 rounded-full ${ticket.status === 'resolved' || ticket.status === 'closed' ? 'bg-green-500' : ticket.status === 'open' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                                            {formatStatus(ticket.status)}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 md:p-5 text-right font-montserrat text-xs text-slate-500">
                                                        {ticket.createdAt
                                                            ? new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                                            : '—'}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="p-12 text-center font-montserrat text-sm text-slate-500">{t('noTicketsYet')}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardSupport;
