import { getApiBase } from '../utils/apiBase.js';
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourseDetail } from '../redux/slices/courseSlice';
import sanitizeDisplay from '../utils/textSanitize';
import LessonPageLayout from '../components/dashboard/LessonPageLayout';

const buildMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const rawBase = getApiBase();
    const baseUrl = rawBase.replace(/\/api\/v1\/?$/, '');
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

const DashboardFileLesson = () => {
    const { courseId, id } = useParams();
    const dispatch = useDispatch();
    const { currentCourse, detailLoading } = useSelector((state) => state.courses);

    useEffect(() => {
        if (!currentCourse || String(currentCourse._id) !== String(courseId)) {
            dispatch(fetchCourseDetail(courseId));
        }
    }, [courseId, dispatch, currentCourse]);

    let lessonData = null;
    let fileResource = null;
    if (currentCourse) {
        for (const m of currentCourse.modules || []) {
            for (const l of m.lessons || []) {
                const lid = l._id || l.id;
                if (String(lid) === String(id)) {
                    lessonData = l;
                    fileResource = l.files?.[0] || null;
                    break;
                }
            }
            if (lessonData) break;
        }
    }

    if (detailLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    if (!fileResource) {
        return (
            <LessonPageLayout
                courseId={courseId}
                eyebrow="Resource"
                title="File not found"
                subtitle="This resource may not be published yet."
            >
                <Link
                    to={`/dashboard/course/${courseId}`}
                    className="inline-flex px-6 py-3 rounded-xl bg-brand-brown text-white text-sm font-semibold hover:opacity-90"
                >
                    Back to course
                </Link>
            </LessonPageLayout>
        );
    }

    const fileUrl = buildMediaUrl(fileResource.filePath);
    const isPdf = (fileResource.fileType || '').toUpperCase() === 'PDF';
    const isImage = (fileResource.fileType || '').toUpperCase() === 'IMAGE';

    return (
        <LessonPageLayout
            courseId={courseId}
            eyebrow="Course resource"
            title={sanitizeDisplay(lessonData?.title || 'Download')}
            subtitle={`${fileResource.fileType || 'File'}${fileResource.language ? ` · ${fileResource.language}` : ''}`}
        >
            <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                                {sanitizeDisplay(lessonData?.title || 'Course file')}
                            </p>
                            <p className="text-sm text-slate-500">
                                {fileResource.downloadable !== false ? 'Download allowed' : 'View only'}
                            </p>
                        </div>
                    </div>
                    {fileUrl && (
                        <div className="flex gap-3 shrink-0">
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 rounded-xl bg-brand-brown text-white text-sm font-semibold hover:opacity-90"
                            >
                                Open
                            </a>
                            {fileResource.downloadable !== false && (
                                <a
                                    href={fileUrl}
                                    download
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                                >
                                    Download
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {fileUrl && isPdf && (
                    <iframe
                        title={lessonData?.title || 'PDF'}
                        src={fileUrl}
                        className="w-full h-[70vh] rounded-xl border border-slate-200 bg-slate-100"
                    />
                )}

                {fileUrl && isImage && (
                    <img
                        src={fileUrl}
                        alt={lessonData?.title || 'Resource'}
                        className="max-w-full rounded-xl border border-slate-200 mx-auto"
                    />
                )}
            </section>
        </LessonPageLayout>
    );
};

export default DashboardFileLesson;
