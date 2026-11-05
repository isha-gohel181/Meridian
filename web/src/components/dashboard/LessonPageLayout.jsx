import React from 'react'
import { Link } from 'react-router-dom'
import DashboardHeader from './DashboardHeader'

/**
 * Shared shell for text, assignment, quiz, and file-style lesson pages.
 */
const LessonPageLayout = ({
  courseId,
  backLabel = 'Back to course',
  eyebrow,
  title,
  subtitle,
  children,
}) => (
  <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-accent/20">
    <DashboardHeader />
    <main className="pt-24 pb-12 px-4 md:px-8 max-w-5xl mx-auto">
      <div className="space-y-8">
        <div className="space-y-4">
          {courseId && (
            <Link
              to={`/dashboard/course/${courseId}`}
              className="font-jetbrains text-[10px] text-accent uppercase tracking-[0.3em] hover:text-slate-700 transition-colors inline-flex items-center gap-2"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="m15 18-6-6 6-6" />
              </svg>
              {backLabel}
            </Link>
          )}
          {eyebrow && (
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              <span className="font-jetbrains text-[10px] text-accent uppercase tracking-[0.35em]">
                {eyebrow}
              </span>
            </div>
          )}
          <h1 className="font-newsreader italic text-3xl md:text-5xl text-slate-900 tracking-tighter leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </main>
  </div>
)

export default LessonPageLayout
