import React from 'react';

const BRAND = '#C96A1B';

const LessonTrackItem = ({ title, progress, isActive, onPlay, unlocked = true, type = 'video' }) => {
    const getIcon = () => {
        switch (type) {
            case 'quiz':
                return (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                );
            case 'assignment':
                return (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                );
            case 'text':
                return (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                );
            default:
                return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>;
        }
    };

    const badge = (label, colors) => (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide ${colors}`}>
            {label}
        </span>
    );

    const getLabel = () => {
        switch (type) {
            case 'quiz':
                return badge('Quiz', 'bg-violet-100 text-violet-700');
            case 'assignment':
                return badge('Assignment', 'bg-orange-100 text-orange-700');
            case 'text':
                return badge('Reading', 'bg-cyan-100 text-cyan-800');
            default:
                return (
                    <>
                        {badge('Video', 'bg-sky-100 text-sky-800')}
                        {badge('Secure', 'bg-emerald-100 text-emerald-700')}
                    </>
                );
        }
    };

    const getButtonText = () => {
        switch (type) {
            case 'quiz': return 'Take quiz';
            case 'assignment': return 'Submit';
            case 'text': return 'Read';
            default: return 'Play';
        }
    };

    const pct = Math.min(100, Math.max(0, Number(progress) || 0));
    const progressLabel = typeof progress === 'number'
        ? (Math.round(progress) === progress ? `${progress}%` : `${progress.toFixed(1)}%`)
        : `${progress}%`;

    return (
        <div
            className={`group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 md:p-6 transition-colors
            ${isActive ? 'bg-sky-50/80' : 'bg-white hover:bg-slate-50/80'}`}
        >
            <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors"
                    style={{
                        backgroundColor: isActive ? `${BRAND}18` : '#f8fafc',
                        borderColor: isActive ? `${BRAND}40` : '#e2e8f0',
                        color: isActive ? BRAND : '#64748b',
                    }}
                >
                    {getIcon()}
                </div>

                <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm md:text-base font-semibold text-slate-900 truncate">
                            {title}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">{getLabel()}</div>
                    </div>

                    <div className="space-y-1.5 max-w-md">
                        <div className="flex justify-between text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                            <span>Progress</span>
                            <span>{progressLabel}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${pct}%`, backgroundColor: BRAND }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:pl-4 shrink-0">
                {unlocked ? (
                    <button
                        type="button"
                        onClick={onPlay}
                        className="w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
                        style={{ backgroundColor: BRAND }}
                    >
                        {getButtonText()}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onPlay}
                        disabled
                        className="w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        Locked
                    </button>
                )}
            </div>
        </div>
    );
};

export default LessonTrackItem;
