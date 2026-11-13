import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEventById } from '../redux/slices/eventSlice'
import { resolveMediaUrl } from '../utils/apiBase'
import { useLanguage } from '../context/LanguageContext'

const EventDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const { currentEvent, loading, error } = useSelector((state) => state.events)

  useEffect(() => {
    if (id) dispatch(fetchEventById(id))
  }, [dispatch, id])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (loading && !currentEvent) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center pt-32">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-brand-brown/20 border-t-accent" />
      </div>
    )
  }

  if (error || !currentEvent) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 pt-32 text-center">
        <p className="text-description">{error || 'Event not found.'}</p>
        <Link to="/" className="mt-6 inline-block text-sm font-semibold text-brand-brown hover:text-accent">
          ← {t('backToBlog') || 'Back'}
        </Link>
      </div>
    )
  }

  const thumb = currentEvent.thumbnail ? resolveMediaUrl(currentEvent.thumbnail) : ''
  const start = currentEvent.startDate ? new Date(currentEvent.startDate) : null
  const end = currentEvent.endDate ? new Date(currentEvent.endDate) : null
  const dateLine =
    start &&
    start.toLocaleString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const venueLine =
    currentEvent.type === 'online'
      ? 'Online'
      : [currentEvent.venue?.name, currentEvent.venue?.city].filter(Boolean).join(', ')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <Link to="/#diary" className="text-sm font-semibold text-brand-brown hover:text-accent">
          ← {t('landingDiaryViewAll') || 'Events & news'}
        </Link>

        <p className="mt-8 font-jetbrains text-[10px] font-bold uppercase tracking-[0.4em] text-accent">
          {t('landingDiaryEvent')}
        </p>
        <h1 className="mt-3 font-newsreader text-3xl font-medium tracking-tight text-brand-brown md:text-4xl">
          {currentEvent.title}
        </h1>
        {dateLine && <p className="mt-4 text-sm text-description">{dateLine}</p>}
        {end && start && end.getTime() !== start.getTime() && (
          <p className="mt-1 text-sm text-description">
            Ends{' '}
            {end.toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
        {venueLine && <p className="mt-2 text-sm font-medium text-brand-brown/80">{venueLine}</p>}

        {thumb && (
          <img
            src={thumb}
            alt=""
            className="mt-8 w-full rounded-2xl border border-brand-brown/10 object-cover max-h-[28rem]"
          />
        )}

        {currentEvent.description && (
          <div className="mt-10 text-base leading-relaxed text-description whitespace-pre-wrap">
            {typeof currentEvent.description === 'string'
              ? currentEvent.description.replace(/<[^>]+>/g, '')
              : ''}
          </div>
        )}

        {currentEvent.onlineLink?.url && (
          <a
            href={currentEvent.onlineLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex rounded-xl bg-brand-brown px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
          >
            Join online
          </a>
        )}
      </div>
    </div>
  )
}

export default EventDetail
