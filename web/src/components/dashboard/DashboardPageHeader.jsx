import React from 'react'

/**
 * Shared dashboard page title — matches Dashboard News / Courses rhythm.
 */
const DashboardPageHeader = ({ eyebrow, title, subtitle, className = 'mb-10' }) => (
  <header className={`space-y-2 ${className}`.trim()}>
    {eyebrow ? (
      <span className="font-jetbrains text-[10px] text-accent tracking-[0.4em] uppercase block">{eyebrow}</span>
    ) : null}
    <h1 className="font-newsreader italic text-4xl md:text-6xl text-slate-900 tracking-tighter">{title}</h1>
    {subtitle ? (
      <p className="font-montserrat text-sm text-slate-500 mt-2 max-w-xl">{subtitle}</p>
    ) : null}
  </header>
)

export default DashboardPageHeader
