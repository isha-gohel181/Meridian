import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import sanitizeDisplay from '../utils/textSanitize'
import LessonTrackItem from '../components/dashboard/LessonTrackItem';
import MobileExclusiveModal from '../components/dashboard/MobileExclusiveModal';
import LockedModal from '../components/dashboard/LockedModal';
import authorizedFetch from '../utils/apiClient';
import { useTracker } from '../components/ActivityTracker';

const courseCurriculum = [
    {
        _id: 'm1',
        title: 'Architectural Foundations',
        lessons: [
            { _id: 'l1', title: 'Spatial Geometry & Theory', type: 'video', progress: 100 },
            { _id: 'l2', title: 'Material Resistance Protocol', type: 'video', progress: 45 },
            { _id: 'l3', title: 'Structure Validation Quiz', type: 'quiz', progress: 0 },
        ]
    },
    {
        _id: 'm2',
        title: 'Advanced System Integration',
        lessons: [
            { _id: 'l4', title: 'Dynamic Loading States', type: 'video', progress: 0 },
            { _id: 'l5', title: 'Security Perimeter Setup', type: 'video', progress: 0 },
        ]
    }
];

import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseDetail } from '../redux/slices/courseSlice';
import { fetchLessonsStatus, setLessonStatus } from '../redux/slices/dripSlice';
import socketService from '../services/socketService';

const DashboardCoursePlayer = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentCourse, detailLoading, error } = useSelector((state) => state.courses);
    const { user } = useSelector((state) => state.auth);
    const dripStatuses = useSelector((state) => state.drip?.statuses || {});
    const dripLoading = useSelector((state) => state.drip?.loading);
    const dripError = useSelector((state) => state.drip?.error);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
    const [lockedModalOpen, setLockedModalOpen] = useState(false);
    const [lockedModalMessage, setLockedModalMessage] = useState('');
    const [isObscured, setIsObscured] = useState(false);
    const [securityWarning, setSecurityWarning] = useState('');
    const containerRef = useRef(null);
    const syncProgressRef = useRef(null);
    const lastVideoSyncTimeRef = useRef(0);
    const isPlaybackActiveRef = useRef(false);
    const COMPLETE_THRESHOLD = 95;
    const { trackEvent } = useTracker();

    console.log('Current Course Data:', currentCourse);
    console.log('Selected Lesson:', selectedLesson);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (id) {
            dispatch(fetchCourseDetail(id));
        }
    }, [id, dispatch]);

    const reportIncidentRef = useRef(null);
    // Updated on every render so the latest selectedLesson and currentCourse are always available
    reportIncidentRef.current = async (incidentType, extraDetails = {}) => {
        if (!currentCourse || !user) return;
        try {
            const videoId = selectedLesson?.videoLessons?.[0]?._id || selectedLesson?.videoLessons?.[0]?.id || selectedLesson?.videoLessonId || selectedLesson?.videoId || null;
            const body = JSON.stringify({
                incidentType: incidentType,
                courseId: currentCourse._id || id,
                videoId: videoId || null,
                lessonId: selectedLesson?._id || null,
                details: {
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString(),
                    videoType: selectedLesson?.videoLessons?.[0]?.sourcePlatform || "unknown",
                    sessionId: "sess_" + Math.random().toString(36).substr(2, 9),
                    ...extraDetails
                }
            });
            await authorizedFetch('/security/incidents', { method: 'POST', body });
        } catch (e) {
            console.warn("Failed to report security incident:", e);
        }
    };

    // Anti-Piracy / Security Logic
    useEffect(() => {
        const preventDevTools = (e) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
                (e.ctrlKey && ['U', 'u'].includes(e.key)) ||
                (e.metaKey && e.altKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) // Mac specific
            ) {
                e.preventDefault();
                setSecurityWarning('Unauthorized action detected. Continued violations will result in account suspension.');
                if (reportIncidentRef.current) reportIncidentRef.current('DEV_TOOLS_OPEN_ATTEMPT', { key: e.key });
                return false;
            }
        };

        const preventRightClick = (e) => {
            e.preventDefault();
            setSecurityWarning('Unauthorized action detected. Inspecting or copying content is strictly prohibited.');
            if (reportIncidentRef.current) reportIncidentRef.current('RIGHT_CLICK_ATTEMPT');
            return false;
        };
        
        const preventCopyPaste = (e) => {
            e.preventDefault();
            setSecurityWarning('Unauthorized action detected. Copying course content is strictly prohibited.');
            return false;
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsObscured(true);
                if (reportIncidentRef.current) reportIncidentRef.current('SCREEN_OBSCURED', { reason: 'visibility_hidden' });
            } else {
                setIsObscured(false);
            }
        };

        const handleBlur = () => {
            setTimeout(() => {
                if (document.activeElement?.tagName === 'IFRAME') {
                    // User clicked inside the video player iframe; do not obscure
                    return;
                }
                if (document.hidden) {
                    setIsObscured(true);
                    if (reportIncidentRef.current) reportIncidentRef.current('SCREEN_OBSCURED', { reason: 'window_blur' });
                }
            }, 100);
        };
        const handleFocus = () => setIsObscured(false);

        // Add event listeners
        window.addEventListener('keydown', preventDevTools);
        document.addEventListener('contextmenu', preventRightClick);
        document.addEventListener('copy', preventCopyPaste);
        document.addEventListener('cut', preventCopyPaste);
        document.addEventListener('paste', preventCopyPaste);
        document.addEventListener('dragstart', preventCopyPaste);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            // Cleanup
            window.removeEventListener('keydown', preventDevTools);
            document.removeEventListener('contextmenu', preventRightClick);
            document.removeEventListener('copy', preventCopyPaste);
            document.removeEventListener('cut', preventCopyPaste);
            document.removeEventListener('paste', preventCopyPaste);
            document.removeEventListener('dragstart', preventCopyPaste);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    useEffect(() => {
        if (currentCourse && !detailLoading) {
            const ctx = gsap.context(() => {
                gsap.fromTo('.player-reveal',
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
        }
    }, [currentCourse, detailLoading]);

    // Automatically open first module accordion if none selected
    useEffect(() => {
        if (currentCourse && !selectedLesson && !detailLoading) {
            const firstModule = currentCourse.modules?.[0];
            if (firstModule) {
                setActiveAccordion(firstModule._id || 0);
            }
        }
    }, [currentCourse, detailLoading]);

    // Fetch unlock/progress statuses for lessons in currentCourse with bounded concurrency
    useEffect(() => {
        if (!currentCourse || !user) return;

        const lessons = [];
        (currentCourse.modules || []).forEach((m) => {
            (m.lessons || []).forEach((l) => {
                lessons.push({ ...(l || {}), courseId: currentCourse._id || id });
            });
        });

        if (lessons.length > 0) {
            dispatch(fetchLessonsStatus({ userId: user._id || user.id || user?.userId, lessons }));
        }
    }, [currentCourse, user, id, dispatch]);


    const refreshStatuses = () => {
        if (!currentCourse || !user) return;
        const lessons = [];
        (currentCourse.modules || []).forEach((m) => {
            (m.lessons || []).forEach((l) => lessons.push({ ...(l || {}), courseId: currentCourse._id || id }));
        });
        if (lessons.length > 0) dispatch(fetchLessonsStatus({ userId: user._id || user.id || user?.userId, lessons }));
    };

    const handleLessonPlay = async (lesson) => {
        // If lesson is a quiz, navigate to the quiz flow instead of video player
        const lid = lesson._id || lesson.id;
        const lessonStatus = dripStatuses[lid];
        if (lessonStatus && lessonStatus.unlocked === false) {
            setLockedModalMessage('This lesson is currently locked. Complete prerequisites to unlock it.');
            setLockedModalOpen(true);
            return;
        }
        // Check if OTP needs refresh (TTL is usually 300s / 5m)
        const video = lesson.videoLessons?.[0];
        const isVdoCipher = video?.sourcePlatform === 'videocypher';
        
        if (isVdoCipher && video.vdoCipherPlayback) {
            const fetchedAt = new Date(video.vdoCipherPlayback.fetchedAt).getTime();
            const now = new Date().getTime();
            const ageInSeconds = (now - fetchedAt) / 1000;
            
            // If OTP is older than 4 minutes (240s), refresh the whole course detail to get new tokens
            if (ageInSeconds > 240) {
                await dispatch(fetchCourseDetail(id));
                // After refresh, the lesson object in 'currentCourse' will have new tokens
                // We need to find the updated lesson object
                return; // The useEffect or a subsequent click will handle it, or we can find it now
            }
        }

        const isPhoneViewport =
            typeof window !== 'undefined' &&
            window.matchMedia('(max-width: 767px)').matches;

        if (lesson.ismobileOnly && isPhoneViewport && lesson.type !== 'quiz') {
            setIsMobileModalOpen(true);
            return;
        }

        trackEvent('play_lesson', {
            lessonId: lesson._id || lesson.id,
            title: lesson.title,
            type: lesson.type || 'video',
            courseId: currentCourse?._id || id,
        });

        try {
            const videoId = lesson.videoLessons?.[0]?._id || lesson.videoLessons?.[0]?.id || lesson.videoLessonId || lesson.videoId || null;
            if (videoId) {
                const body = JSON.stringify({ courseId: currentCourse._id || id, videoLessonId: videoId });
                const r = await authorizedFetch('/course-completion/update-last-video', { method: 'POST', body });
                if (r.status === 401) {
                    console.warn('update-last-video returned 401');
                }
            } else {
                console.warn('update-last-video skipped: no video id available for lesson', lesson._id || lesson.id);
            }
        } catch (e) {
            console.warn('update-last-video error', e);
        }

        if (lesson?.type === 'assignment') {
            navigate(`/dashboard/assignment/${id}/${lesson._id || lesson.id}`);
            return;
        }

        if (lesson?.type === 'text') {
            navigate(`/dashboard/reading/${id}/${lesson._id || lesson.id}`);
            return;
        }

        const hasVideoContent =
            (lesson.videoLessons?.length > 0) ||
            lesson.type === 'video-lesson' ||
            (lesson.fileUrl && !lesson.files?.length);
        if (lesson?.files?.length > 0 && !hasVideoContent) {
            navigate(`/dashboard/file/${id}/${lesson._id || lesson.id}`);
            return;
        }

        if (lesson?.type === 'quiz') {
            navigate(`/dashboard/quiz/${id}/${lesson._id || lesson.id}`);
            return;
        }

        setSelectedLesson(lesson);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const isDirectVideoUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        const clean = url.toLowerCase().split('?')[0];
        if (clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.ogg') || clean.endsWith('.mkv') || clean.endsWith('.mov')) {
            return true;
        }
        if (url.includes('/video/upload/') || url.includes('res.cloudinary.com')) {
            return true;
        }
        if (url.includes('blob:')) return true;
        return false;
    };

    const getVideoSrc = (lesson) => {
        if (!lesson) return '';
        
        // Handle case where videoLessons is an array
        if (Array.isArray(lesson.videoLessons) && lesson.videoLessons.length > 0) {
            const video = lesson.videoLessons[0];
            
            let decVideoId = video.videoId;
            let decSecureUrl = video.secureUrl;
            let decVideoUrl = video.videoUrl;
            if (video.isEncrypted) {
                const dec = (s) => s?.startsWith('ENC_') ? atob(s.replace('ENC_', '')).split('').reverse().join('') : s;
                decVideoId = dec(video.videoId);
                decSecureUrl = dec(video.secureUrl);
                decVideoUrl = dec(video.videoUrl);
            }

            if (video.sourcePlatform === 'videocypher' && video.vdoCipherPlayback) {
                return `https://player.vdocipher.com/v2/?otp=${video.vdoCipherPlayback.otp}&playbackInfo=${video.vdoCipherPlayback.playbackInfo}`;
            }
            if (video.sourcePlatform === 'youtube') {
                const ytId = decVideoId || decVideoUrl?.split('v=')[1]?.split('&')[0] || decSecureUrl?.split('v=')[1]?.split('&')[0] || decVideoUrl?.split('youtu.be/')[1]?.split('?')[0] || decVideoUrl;
                const origin = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : '';
                return `https://www.youtube.com/embed/${ytId}?enablejsapi=1&origin=${origin}&modestbranding=1&rel=0&controls=1&showinfo=0&fs=1`;
            }
            if (video.sourcePlatform === 'vimeo') {
                const url = decSecureUrl || decVideoUrl || video.embedUrl || '';
                if (url.includes('player.vimeo.com/video/')) {
                    const separator = url.includes('?') ? '&' : '?';
                    return `${url}${separator}api=1&title=0&byline=0&portrait=0&dnt=1`;
                }
                const cleanId = decVideoId || url.replace(/^https?:\/\/(?:www\.)?vimeo\.com\//, '').split('?')[0];
                return `https://player.vimeo.com/video/${cleanId}?api=1&title=0&byline=0&portrait=0&dnt=1`;
            }
            if (decVideoUrl) return decVideoUrl;
            if (decSecureUrl) return decSecureUrl;
        }
        
        // Handle direct fileUrl or legacy schema
        if (lesson.fileUrl) return lesson.fileUrl;
        if (lesson.video && lesson.video.url) {
            return lesson.video.url;
        }
        if (lesson.source) return lesson.source;
        
        return '';
    };

    const videoSrc = getVideoSrc(selectedLesson);

    const flatLessons = useMemo(() => {
        const list = [];
        (currentCourse?.modules || []).forEach((module) => {
            (module.lessons || []).forEach((lesson) => list.push(lesson));
        });
        return list;
    }, [currentCourse]);

    const selectedLessonIndex = useMemo(() => {
        if (!selectedLesson) return -1;
        const sid = selectedLesson._id || selectedLesson.id;
        return flatLessons.findIndex((l) => (l._id || l.id) === sid);
    }, [flatLessons, selectedLesson]);

    const goToAdjacentLesson = (delta) => {
        const nextIndex = selectedLessonIndex + delta;
        if (nextIndex < 0 || nextIndex >= flatLessons.length) return;
        handleLessonPlay(flatLessons[nextIndex]);
    };

    // Video progress: only from real playback (HTML5 timeupdate / iframe postMessage), not idle timers
    useEffect(() => {
        if (!selectedLesson || !user) return;
        const lid = selectedLesson._id || selectedLesson.id;
        if (!lid) return;

        isPlaybackActiveRef.current = false;

        const lessonDuration =
            (selectedLesson.duration ? Number(selectedLesson.duration) * 60 : 0) ||
            selectedLesson.videoLessons?.[0]?.duration ||
            300;

        const syncProgress = async (pct, currentTime, duration, isComplete = false, options = {}) => {
            const { allowWhenPaused = false } = options;
            if (!allowWhenPaused && !isComplete && !isPlaybackActiveRef.current) {
                return;
            }

            const roundedPct = Math.min(100, Math.max(0, Math.round(pct * 10) / 10));
            const prevProgress = dripStatuses[lid]?.progress || 0;
            if (roundedPct < prevProgress && !isComplete) return;

            const markComplete = isComplete || roundedPct >= COMPLETE_THRESHOLD;

            dispatch(setLessonStatus({
                lessonId: lid,
                status: {
                    progress: Math.max(prevProgress, roundedPct),
                    unlocked: true,
                    completed: markComplete,
                },
            }));

            const now = Date.now();
            if (!markComplete && now - lastVideoSyncTimeRef.current < 4000) {
                return;
            }
            lastVideoSyncTimeRef.current = now;

            try {
                const targetCourseId = currentCourse?._id || id;
                const videoId =
                    selectedLesson?.videoLessons?.[0]?._id ||
                    selectedLesson?.videoLessons?.[0]?.id ||
                    selectedLesson?.videoId ||
                    lid;

                await authorizedFetch(`/courses/${targetCourseId}/lessons/${lid}/progress`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        progressPercentage: roundedPct,
                        currentTime: Math.round(currentTime),
                        duration: Math.round(duration),
                        watchTime: Math.round(currentTime),
                        completed: markComplete,
                    }),
                });

                if (socketService?.socket?.connected) {
                    socketService.socket.emit('video-progress', {
                        videoId,
                        userId: user._id || user.id,
                        currentTime: Math.round(currentTime),
                        duration: Math.round(duration),
                        courseId: targetCourseId,
                        lessonId: lid,
                    });
                }

                if (markComplete && !dripStatuses[lid]?.completed) {
                    await authorizedFetch(`/${targetCourseId}/${lid}/complete`, { method: 'POST' });
                    refreshStatuses();
                }
            } catch (err) {
                console.warn('[Progress] Sync error:', err);
            }
        };

        syncProgressRef.current = (pct, cur, dur, done) =>
            syncProgress(pct, cur, dur, done, { allowWhenPaused: false });

        const handlePostMessage = (event) => {
            try {
                let data = event.data;
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        return;
                    }
                }
                if (!data) return;

                if (data.event === 'infoDelivery' && data.info) {
                    const { currentTime, duration, playerState } = data.info;
                    if (playerState === 1) isPlaybackActiveRef.current = true;
                    if (playerState === 2 || playerState === 0) isPlaybackActiveRef.current = false;
                    if (duration && currentTime !== undefined && isPlaybackActiveRef.current) {
                        const pct = (currentTime / duration) * 100;
                        syncProgress(pct, currentTime, duration, playerState === 0 || pct >= COMPLETE_THRESHOLD);
                    }
                }

                if (data.event === 'play') isPlaybackActiveRef.current = true;
                if (data.event === 'pause') isPlaybackActiveRef.current = false;

                if (data.event === 'timeupdate' && data.data && isPlaybackActiveRef.current) {
                    const { percent, seconds, duration } = data.data;
                    const dur = duration || lessonDuration;
                    const pct = percent != null ? percent * 100 : (seconds / dur) * 100;
                    syncProgress(pct, seconds, dur, pct >= COMPLETE_THRESHOLD);
                }
                if (data.event === 'ended') {
                    syncProgress(100, lessonDuration, lessonDuration, true, { allowWhenPaused: true });
                }

                if (data.type === 'play') isPlaybackActiveRef.current = true;
                if (data.type === 'pause') isPlaybackActiveRef.current = false;
                if (data.type === 'timeupdate' && data.currentTime !== undefined && isPlaybackActiveRef.current) {
                    const { currentTime, duration } = data;
                    const dur = duration || lessonDuration;
                    const pct = (currentTime / dur) * 100;
                    syncProgress(pct, currentTime, dur, pct >= COMPLETE_THRESHOLD);
                }
                if (data.type === 'ended') {
                    syncProgress(100, lessonDuration, lessonDuration, true, { allowWhenPaused: true });
                }
            } catch (e) {}
        };

        window.addEventListener('message', handlePostMessage);

        return () => {
            window.removeEventListener('message', handlePostMessage);
            isPlaybackActiveRef.current = false;
            syncProgressRef.current = null;
        };
    }, [selectedLesson?._id || selectedLesson?.id, currentCourse?._id, user?._id]);

    if (detailLoading) {
        return (
            <div className="min-h-screen bg-dark flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-8 space-y-6">
                <div className="bg-red-500/10 border border-red-500/20 p-12 text-center space-y-4 max-w-xl">
                    <p className="font-jetbrains text-[10px] text-red-500 uppercase tracking-[0.4em] font-black italic">Decryption Error</p>
                    <p className="font-newsreader italic text-2xl text-red-500/80">{error}</p>
                    <button 
                        onClick={() => dispatch(fetchCourseDetail(id))}
                        className="px-12 py-4 bg-red-500/20 text-red-500 font-jetbrains text-[10px] uppercase tracking-widest hover:bg-red-500/30 transition-all"
                    >
                        Re-establish Protocol
                    </button>
                </div>
            </div>
        );
    }

    if (!currentCourse) return null;

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-900 selection:bg-accent/20 relative overflow-x-hidden">
            <DashboardHeader />
            
            <main className="pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto">
                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-6 player-reveal opacity-0">
                        <div className="space-y-4">
                           <Link to="/dashboard/my-courses" className="font-jetbrains text-[10px] text-accent uppercase tracking-[0.3em] hover:text-slate-700 transition-colors flex items-center gap-2">
                               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
                               Return to Curriculum
                           </Link>
                           <h1 className="font-newsreader italic text-3xl md:text-5xl text-slate-900 tracking-tighter leading-tight">
                               {sanitizeDisplay(currentCourse.title)}
                           </h1>
                           <div className="flex items-center gap-3">
                               <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                               <span className="font-jetbrains text-[10px] text-accent uppercase tracking-[0.35em]">
                                   {selectedLesson ? sanitizeDisplay(selectedLesson.title) : 'Select a lesson to begin'}
                               </span>
                               <span className="font-jetbrains text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                                   · {currentCourse.modules?.length || 0} modules
                               </span>
                           </div>
                        </div>
                    </div>

                    <div className={`grid grid-cols-1 gap-8 ${selectedLesson ? 'xl:grid-cols-12' : ''}`}>
                    {/* Dashboard Video Area */}
                    {selectedLesson && (
                        <div className={`space-y-4 ${selectedLesson ? 'xl:col-span-8' : ''}`}>
                        <div 
                            className="animate-in fade-in duration-700 w-full aspect-video bg-black border border-slate-200 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-lg"
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            <div className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden">
                                {selectedLesson.type === 'video' || (selectedLesson.videoLessons?.length > 0) || selectedLesson.type === 'video-lesson' || selectedLesson.fileUrl ? (
                                    videoSrc ? (
                                        isDirectVideoUrl(videoSrc) ? (
                                            <video 
                                                src={videoSrc}
                                                controls
                                                playsInline
                                                className={`w-full h-full object-contain absolute inset-0 z-0 transition-all duration-300 ${isObscured ? 'opacity-0 pointer-events-none filter blur-xl' : 'opacity-100'}`}
                                                onPlay={() => {
                                                    isPlaybackActiveRef.current = true;
                                                }}
                                                onPause={() => {
                                                    isPlaybackActiveRef.current = false;
                                                }}
                                                onTimeUpdate={(e) => {
                                                    if (e.target.paused) return;
                                                    const cur = e.target.currentTime;
                                                    const dur = e.target.duration || ((selectedLesson.duration ? selectedLesson.duration * 60 : 0) || 300);
                                                    if (dur > 0 && syncProgressRef.current) {
                                                        const pct = (cur / dur) * 100;
                                                        syncProgressRef.current(pct, cur, dur, pct >= COMPLETE_THRESHOLD);
                                                    }
                                                }}
                                                onEnded={async () => {
                                                    const lid = selectedLesson._id || selectedLesson.id;
                                                    const targetCourseId = currentCourse?._id || id;
                                                    dispatch(setLessonStatus({
                                                        lessonId: lid,
                                                        status: { progress: 100, unlocked: true, completed: true }
                                                    }));
                                                    try {
                                                        await authorizedFetch(`/${targetCourseId}/${lid}/complete`, { method: 'POST' });
                                                        refreshStatuses();
                                                    } catch (e) {}
                                                }}
                                            />
                                        ) : (
                                            <iframe 
                                                src={videoSrc} 
                                                className={`w-full h-full border-0 absolute inset-0 z-0 transition-all duration-300 ${isObscured ? 'opacity-0 pointer-events-none filter blur-xl' : 'opacity-100'}`}
                                                allowFullScreen
                                                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                                                title={selectedLesson.title}
                                                onError={() => {
                                                    if (reportIncidentRef.current) {
                                                        reportIncidentRef.current('VDOCIPHER_PLAYER_ERROR', { error: 'Failed to initialize VdoPlayer' });
                                                    }
                                                }}
                                            />
                                        )
                                    ) : (
                                        <div className="text-center space-y-4 z-10 relative">
                                            <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                            </div>
                                            <p className="font-jetbrains text-[10px] text-red-500/80 uppercase tracking-widest">Media Source Not Found</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center space-y-4 z-10 relative">
                                        <div className="w-16 h-16 bg-accent/10 text-accent border border-accent/20 rounded-full flex items-center justify-center mx-auto">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zM12 6v6l4 2"/></svg>
                                        </div>
                                        <p className="font-jetbrains text-[10px] text-accent/80 uppercase tracking-widest">Protocol Type Unrecognized</p>
                                    </div>
                                )}
                                
                                {/* Obscured Overlay for Screen Sharing Prevention */}
                                {isObscured && (
                                    <div className="absolute inset-0 bg-black z-[100] flex flex-col items-center justify-center pointer-events-none">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20 mb-4">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M8 11h8"/><path d="M12 15V7"/>
                                        </svg>
                                        <p className="font-jetbrains text-[10px] text-white/50 uppercase tracking-[0.4em]">Content Protected</p>
                                    </div>
                                )}

                                {/* Security Watermark */}
                                {user?.email && (
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-50">
                                        <div className="absolute animate-float-slow opacity-[0.03] md:opacity-[0.05] whitespace-nowrap">
                                            <p className="font-jetbrains text-[10px] md:text-[14px] text-white tracking-[0.2em] font-black uppercase">
                                                {user.email} • {user.email} • {user.email}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                            <button
                                type="button"
                                disabled={selectedLessonIndex <= 0}
                                onClick={() => goToAdjacentLesson(-1)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                            >
                                ← Previous
                            </button>
                            <p className="text-sm text-slate-600 text-center truncate px-2">
                                {sanitizeDisplay(selectedLesson.title)}
                            </p>
                            <button
                                type="button"
                                disabled={selectedLessonIndex < 0 || selectedLessonIndex >= flatLessons.length - 1}
                                onClick={() => goToAdjacentLesson(1)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-brown text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                            >
                                Next →
                            </button>
                        </div>

                        {selectedLesson?.videoLessons?.[0]?.sourcePlatform === 'videocypher' && (
                            <div className="py-2 border-l-2 border-accent/30 pl-4">
                                <p className="font-jetbrains text-[10px] text-slate-500 uppercase tracking-wider leading-relaxed">
                                    If playback fails, disable incognito and allow protected content in browser settings.
                                </p>
                            </div>
                        )}
                        </div>
                    )}

                    {/* Course curriculum */}
                    <div className={`player-reveal opacity-0 space-y-4 ${selectedLesson ? 'xl:col-span-4 xl:sticky xl:top-24 xl:self-start max-h-[calc(100vh-7rem)] xl:overflow-y-auto' : 'xl:col-span-12'}`}>
                        <div className="flex items-center gap-4 mb-2">
                           <p className="font-jetbrains text-[10px] text-accent uppercase tracking-[0.35em] font-bold">Course content</p>
                           <div className="h-[1px] bg-slate-200 flex-1" />
                        </div>

                        {(dripLoading || dripError) && (
                            <p className="text-xs text-slate-400 mb-2">
                                {dripLoading ? 'Updating lesson progress…' : 'Could not refresh lesson progress.'}
                                {!dripLoading && (
                                    <button type="button" onClick={refreshStatuses} className="ml-2 text-[#D8B840] font-semibold hover:underline">
                                        Retry
                                    </button>
                                )}
                            </p>
                        )}

                        <div className="flex flex-col gap-4">
                            {currentCourse.modules?.map((module, i) => (
                                <div 
                                    key={module._id || i}
                                    className={`group border transition-all duration-300 overflow-hidden bg-white rounded-2xl shadow-sm
                                        ${activeAccordion === (module._id || i) ? 'border-[#D8B840]/50 ring-1 ring-[#D8B840]/20' : 'border-slate-200 hover:border-slate-300'}`}
                                >
                                    <button 
                                        type="button"
                                        onClick={() => setActiveAccordion(activeAccordion === (module._id || i) ? null : (module._id || i))}
                                        className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-11 h-11 border rounded-xl flex items-center justify-center text-xs font-bold transition-all
                                                ${activeAccordion === (module._id || i) ? 'bg-[#D8B840] text-white border-[#D8B840]' : 'bg-sky-50 border-sky-100 text-[#D8B840]'}`}>
                                                {String(i + 1).padStart(2, '0')}
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className={`text-lg md:text-xl font-semibold text-slate-900 tracking-tight capitalize`}>
                                                    {sanitizeDisplay(module.title)}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-medium">
                                                    {module.lessons?.length || 0} {module.lessons?.length === 1 ? 'lesson' : 'lessons'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`transition-transform duration-300 ${activeAccordion === (module._id || i) ? 'rotate-180 text-[#D8B840]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m18 15-6-6-6 6"/></svg>
                                        </div>
                                    </button>
                                    
                                    <div className={`transition-all duration-700 ease-in-out ${activeAccordion === (module._id || i) ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                        <div className="border-t border-slate-200 divide-y divide-slate-100">
                                            {module.lessons?.map((lesson, li) => {
                                                const lid = lesson._id || lesson.id || li;
                                                const status = dripStatuses[lid] || {};
                                                const progress = status.progress ?? lesson.progress ?? 0;
                                                const unlocked = typeof status.unlocked === 'boolean' ? status.unlocked : true;
                                                return (
                                                    <LessonTrackItem 
                                                        key={lesson._id || li}
                                                        title={lesson.title}
                                                                type={lesson.type}
                                                        progress={progress}
                                                        unlocked={unlocked}
                                                        isActive={selectedLesson?._id === lesson._id}
                                                        onPlay={() => handleLessonPlay(lesson)}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>
                </div>
            </main>

            {/* Modals */}
            <MobileExclusiveModal 
                isOpen={isMobileModalOpen} 
                onClose={() => setIsMobileModalOpen(false)} 
            />
            <LockedModal isOpen={lockedModalOpen} onClose={() => setLockedModalOpen(false)} message={lockedModalMessage} />

            {/* SECURITY WARNING MODAL */}
            {securityWarning && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
                    <div className="bg-dark border border-red-500/30 p-8 md:p-12 max-w-lg w-full relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)] group">
                        {/* Decorative background */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                        
                        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30 relative">
                                <div className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-20" />
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-red-500 stroke-red-500">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2.5" strokeLinecap="round" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </div>

                            <div className="space-y-2">
                                <p className="font-jetbrains text-[10px] text-red-500 uppercase tracking-[0.4em] font-black">Security Violation</p>
                                <h3 className="font-newsreader italic text-3xl md:text-4xl text-normal tracking-tight">Warning Issued.</h3>
                                <p className="font-jetbrains text-[11px] text-normal/70 uppercase tracking-widest mt-4 leading-relaxed">
                                    {securityWarning}
                                </p>
                            </div>

                            <button 
                                onClick={() => setSecurityWarning('')}
                                className="mt-4 w-full bg-red-500/20 text-red-500 py-5 font-jetbrains text-xs font-black uppercase tracking-[0.4em] hover:bg-red-500/30 transition-all duration-300 border border-red-500/30"
                            >
                                Acknowledge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardCoursePlayer;
