import { getApiBase } from '../utils/apiBase.js';
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourseDetail } from '../redux/slices/courseSlice';
import sanitizeDisplay from '../utils/textSanitize';
import LessonPageLayout from '../components/dashboard/LessonPageLayout';

const DashboardReading = () => {
    const { courseId, id } = useParams();
    const dispatch = useDispatch();
    const { currentCourse, detailLoading } = useSelector((state) => state.courses);

    useEffect(() => {
        if (!currentCourse || String(currentCourse._id) !== String(courseId)) {
            dispatch(fetchCourseDetail(courseId));
        }
    }, [courseId, dispatch, currentCourse]);

    let reading = null;
    let lessonData = null;
    if (currentCourse) {
        for (const m of currentCourse.modules || []) {
            for (const l of m.lessons || []) {
                const lid = l._id || l.id;
                if (String(lid) === String(id) && l.type === 'text') {
                    reading = l.textLessons?.[0];
                    lessonData = l;
                    break;
                }
            }
            if (reading) break;
        }
    }

    if (detailLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    if (!reading) {
        return (
            <LessonPageLayout
                courseId={courseId}
                eyebrow="Text lesson"
                title="Lesson not found"
                subtitle="This reading may not be published yet or the link is invalid."
            >
                <Link
                    to="/dashboard/my-courses"
                    className="inline-flex px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:opacity-90"
                >
                    Back to my courses
                </Link>
            </LessonPageLayout>
        );
    }

    const baseUrl = (getApiBase()).replace(/\/api\/v1\/?$/, '');

    return (
        <LessonPageLayout
            courseId={courseId}
            eyebrow="Text lesson"
            title={sanitizeDisplay(reading.title || lessonData.title)}
            subtitle={reading.subTitle ? sanitizeDisplay(reading.subTitle) : undefined}
        >
            {reading.summary && (
                <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                    <h2 className="font-jetbrains text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Summary
                    </h2>
                    <p className="text-slate-700 leading-relaxed">{reading.summary}</p>
                </section>
            )}

            <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="font-jetbrains text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                    Lesson content
                </h2>
                <div
                    className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-accent dashboard-reading-content"
                    dangerouslySetInnerHTML={{ __html: reading.content || '<p>No content yet.</p>' }}
                />
            </section>

            {reading.attachments?.length > 0 && (
                <section className="space-y-4">
                    <h2 className="font-jetbrains text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Downloads
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reading.attachments.map((file, index) => {
                            const href = file.file
                                ? `${baseUrl}${file.file.startsWith('/') ? '' : '/'}${file.file}`
                                : null;
                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm"
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium text-slate-900 truncate">
                                            {file.fileName || 'Resource file'}
                                        </p>
                                        {file.uploadedAt && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                {new Date(file.uploadedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    {href ? (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90"
                                        >
                                            Download
                                        </a>
                                    ) : (
                                        <span className="text-xs text-slate-400">Unavailable</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </LessonPageLayout>
    );
};

export default DashboardReading;
