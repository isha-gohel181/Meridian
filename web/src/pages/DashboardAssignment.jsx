import { getApiBase } from '../utils/apiBase.js';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourseDetail } from '../redux/slices/courseSlice';
import sanitizeDisplay from '../utils/textSanitize';
import LessonPageLayout from '../components/dashboard/LessonPageLayout';
import authorizedFetch from '../utils/apiClient';

const buildMediaUrl = (file) => {
    if (!file) return '#';
    if (file.startsWith('http')) return file;
    const rawBase = getApiBase();
    const baseUrl = rawBase.replace(/\/api\/v1\/?$/, '');
    return `${baseUrl}${file.startsWith('/') ? '' : '/'}${file}`;
};

const tabClass = (active) =>
    `px-5 py-3 text-sm font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
        active
            ? 'text-accent border-accent bg-white'
            : 'text-slate-500 border-transparent hover:text-slate-700'
    }`;

const DashboardAssignment = () => {
    const { courseId, id } = useParams();
    const dispatch = useDispatch();
    const { currentCourse, detailLoading } = useSelector((state) => state.courses);

    const [activeTab, setActiveTab] = useState('instructions'); // 'instructions', 'submission', 'my_submissions'
    const [writtenResponse, setWrittenResponse] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    const [submissionsLoading, setSubmissionsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!currentCourse || String(currentCourse._id) !== String(courseId)) {
            dispatch(fetchCourseDetail(courseId));
        }
    }, [courseId, dispatch, currentCourse]);

    useEffect(() => {
        if (activeTab === 'my_submissions' && id) {
            fetchUserSubmissions();
        }
    }, [activeTab, id]);

    const fetchUserSubmissions = async () => {
        if (!assignment?._id) return;
        setSubmissionsLoading(true);
        try {
            const response = await authorizedFetch(`/assignment-submissions/my`);
            if (response.ok) {
                const data = await response.json();
                // Filter submissions for this specific assignment
                const filtered = (data.data || []).filter(sub => {
                    const subAssignmentId = typeof sub.assignmentId === 'object' ? sub.assignmentId?._id : sub.assignmentId;
                    return String(subAssignmentId) === String(assignment._id);
                });
                setSubmissions(filtered);
            }
        } catch (error) {
            console.error('Failed to fetch submissions:', error);
        } finally {
            setSubmissionsLoading(false);
        }
    };

    // Find the lesson/assignment in the loaded course
    let assignment = null;
    let lessonTitle = '';
    if (currentCourse) {
        for (const m of currentCourse.modules || []) {
            for (const l of m.lessons || []) {
                const lid = l._id || l.id;
                if (String(lid) === String(id) && l.assignment) {
                    assignment = l.assignment;
                    lessonTitle = l.title;
                    break;
                }
            }
            if (assignment) break;
        }
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!writtenResponse && selectedFiles.length === 0) {
            alert('Please provide a written response or attach a file.');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('submissionText', writtenResponse);
            selectedFiles.forEach((file) => {
                formData.append('attachments', file);
            });
            formData.append('courseId', courseId);
            formData.append('lessonId', id);
            formData.append('assignmentId', assignment._id);

            const response = await authorizedFetch(`/assignment-submissions/`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setWrittenResponse('');
                setSelectedFiles([]);
                setShowSuccessModal(true);
                fetchUserSubmissions();
            } else {
                const err = await response.json();
                alert(err.message || 'Submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('An error occurred during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (detailLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    if (!assignment) {
        return (
            <LessonPageLayout
                courseId={courseId}
                eyebrow="Assignment"
                title="Assignment not found"
                subtitle="This assignment may not be published yet."
            >
                <Link to="/dashboard/my-courses" className="inline-flex px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:opacity-90">
                    Back to my courses
                </Link>
            </LessonPageLayout>
        );
    }

    const descriptionParagraphs = (assignment.description || '')
        .split('\n')
        .filter((p) => p.trim());

    return (
        <LessonPageLayout
            courseId={courseId}
            eyebrow="Assignment"
            title={sanitizeDisplay(assignment.title || lessonTitle)}
        >
            <div className="flex flex-wrap gap-1 border-b border-slate-200">
                {[
                    { id: 'instructions', label: 'Instructions' },
                    { id: 'submission', label: 'Submission' },
                    { id: 'my_submissions', label: 'My submissions' },
                ].map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={tabClass(activeTab === tab.id)}>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
                <div className="lg:col-span-8 space-y-6">
                    {activeTab === 'instructions' && (
                        <>
                            <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
                                <h2 className="text-sm font-semibold text-slate-800">Instructions</h2>
                                <div className="text-slate-700 leading-relaxed space-y-4">
                                    {descriptionParagraphs.length > 0 ? (
                                        descriptionParagraphs.map((para, i) => <p key={i}>{para}</p>)
                                    ) : (
                                        <p className="text-slate-500">No instructions provided.</p>
                                    )}
                                </div>
                            </section>
                            {(assignment.documentFile || assignment.attachmentFile) && (
                                <section className="space-y-4">
                                    <h2 className="text-sm font-semibold text-slate-800">Resources</h2>
                                    <div className="space-y-3">
                                        {assignment.documentFile && (
                                            <div className="flex items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                                                <div>
                                                    <p className="font-medium text-slate-900">Assignment document</p>
                                                    <p className="text-xs text-slate-500">PDF</p>
                                                </div>
                                                <a href={buildMediaUrl(assignment.documentFile)} target="_blank" rel="noopener noreferrer" className="shrink-0 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90">View PDF</a>
                                            </div>
                                        )}
                                        {assignment.attachmentFile && (
                                            <div className="flex items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                                                <div>
                                                    <p className="font-medium text-slate-900">Reference material</p>
                                                    <p className="text-xs text-slate-500">Attachment</p>
                                                </div>
                                                <a href={buildMediaUrl(assignment.attachmentFile)} target="_blank" rel="noopener noreferrer" className="shrink-0 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90">Open</a>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}
                        </>
                    )}

                    {activeTab === 'submission' && (
                        <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                            <h2 className="text-sm font-semibold text-slate-800">Submit your work</h2>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Written response</label>
                                <textarea
                                    value={writtenResponse}
                                    onChange={(e) => setWrittenResponse(e.target.value)}
                                    placeholder="Type your response here..."
                                    className="w-full h-56 rounded-xl border border-slate-200 p-4 text-slate-800 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Attachments</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="py-12 border-2 border-dashed border-slate-200 rounded-xl text-center cursor-pointer hover:border-accent/40 hover:bg-slate-50 transition-colors"
                                >
                                    <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                    <p className="text-sm text-slate-600">Click to browse files</p>
                                    <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, JPG, PNG, ZIP (max 10MB each)</p>
                                </div>
                                {selectedFiles.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {selectedFiles.map((file, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                                <span className="text-sm text-slate-700 truncate">{file.name}</span>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-red-500 text-sm">Remove</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                                {isSubmitting ? 'Submitting…' : 'Submit assignment'}
                            </button>
                        </section>
                    )}

                    {activeTab === 'my_submissions' && (
                        <section className="space-y-4">
                            <h2 className="text-sm font-semibold text-slate-800">My submissions</h2>
                            {submissionsLoading ? (
                                <p className="text-slate-500 py-8 text-center">Loading…</p>
                            ) : submissions.length === 0 ? (
                                <p className="text-slate-500 py-8 text-center">No submissions yet.</p>
                            ) : (
                                submissions.map((sub, i) => (
                                    <div key={i} className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
                                        <div className="flex flex-wrap justify-between gap-4">
                                            <div>
                                                <p className="text-xs text-slate-500">Submitted</p>
                                                <p className="text-sm font-medium text-slate-900">{new Date(sub.createdAt).toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500">Status</p>
                                                <p className="text-sm font-medium capitalize text-slate-900">{sub.status || 'Pending review'}</p>
                                            </div>
                                        </div>
                                        {sub.feedback && (
                                            <div className="pt-4 border-t border-slate-100">
                                                <p className="text-xs font-semibold text-accent mb-1">Feedback</p>
                                                <p className="text-sm text-slate-700">{sub.feedback}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </section>
                    )}
                </div>

                <aside className="lg:col-span-4 lg:sticky lg:top-28">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                        <h3 className="text-sm font-semibold text-slate-800">Details</h3>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between gap-4"><dt className="text-slate-500">Time limit</dt><dd className="font-medium text-slate-900">{assignment.duration} min</dd></div>
                            <div className="flex justify-between gap-4"><dt className="text-slate-500">Score</dt><dd className="font-medium text-slate-900">{assignment.score} / {assignment.maxScore}</dd></div>
                            <div className="flex justify-between gap-4"><dt className="text-slate-500">Language</dt><dd className="font-medium text-slate-900">{assignment.language}</dd></div>
                        </dl>
                        <button type="button" onClick={() => setActiveTab('submission')} className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90">
                            Go to submission
                        </button>
                    </div>
                </aside>
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                    <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-xl space-y-6 text-center">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <h2 className="font-newsreader italic text-2xl text-slate-900">Submitted successfully</h2>
                        <p className="text-sm text-slate-600">Your assignment was received. Feedback typically arrives within a few business days.</p>
                        <div className="flex flex-col gap-2">
                            <button type="button" onClick={() => { setShowSuccessModal(false); setActiveTab('my_submissions'); }} className="w-full py-3 rounded-xl bg-accent text-white font-semibold">View my submissions</button>
                            <button type="button" onClick={() => setShowSuccessModal(false)} className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </LessonPageLayout>
    );
};

export default DashboardAssignment;
