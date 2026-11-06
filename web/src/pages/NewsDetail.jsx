import { getApiBase } from '../utils/apiBase.js';
import React, { useEffect, useState } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNewsBySlug } from '../redux/slices/newsSlice'
import { useLanguage } from '../context/LanguageContext'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import { getDiaryItemBySlug } from '../data/landingDiaryItems'

const NewsDetail = () => {
  const { id: slug } = useParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const { currentNews: articleData, loading } = useSelector((state) => state.news)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const diaryItem = getDiaryItemBySlug(slug)

  const isDashboard = location.pathname.startsWith('/dashboard/news')
  const backPath = isDashboard ? '/dashboard/news' : '/news'

  const handlePostComment = () => {
    if (!comment.trim()) return
    setComments([
      {
        id: Date.now(),
        text: comment.trim(),
        author: 'You',
        date: 'Just now',
      },
      ...comments,
    ])
    setComment('')
  }

  useEffect(() => {
    if (slug && !diaryItem) dispatch(fetchNewsBySlug(slug))
  }, [dispatch, slug, diaryItem])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug, articleData])

  if (!diaryItem && loading && !articleData) {
    return (
      <div className="min-h-screen bg-slate-50">
        {isDashboard && <DashboardHeader />}
        <div className="pt-32 flex justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!diaryItem && !articleData) {
    return (
      <div className="min-h-screen bg-slate-50">
        {isDashboard && <DashboardHeader />}
        <div className="max-w-3xl mx-auto pt-32 px-4 text-center">
          <p className="font-montserrat text-slate-600 mb-6">Article not found.</p>
          <Link to={backPath} className="font-jetbrains text-[10px] font-bold text-accent uppercase tracking-[0.2em] hover:underline">
            ← {isDashboard ? t('dashboardBackToNews') : t('backToBlog')}
          </Link>
        </div>
      </div>
    )
  }

  const article = diaryItem
    ? {
        category: diaryItem.kind === 'event' ? 'EVENT' : 'NEWS',
        title: diaryItem.title,
        date: diaryItem.dateLabel.toUpperCase(),
        views: null,
        commentsCount: 0,
        image: diaryItem.image,
        intro: diaryItem.intro,
        content: null,
        paragraphs: diaryItem.paragraphs,
      }
    : {
        category: articleData.categories?.[0]?.toUpperCase() || 'NEWS',
        title: articleData.title,
        date: new Date(articleData.publishedAt || articleData.createdAt)
          .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          .toUpperCase(),
        views:
          articleData.stats?.views >= 1000
            ? `${(articleData.stats.views / 1000).toFixed(1)}K`
            : String(articleData.stats?.views || '0'),
        commentsCount: articleData.comments?.length || 0,
        image: (() => {
          const url = articleData.imageUrl || articleData.coverImage || articleData.image
          if (!url) return '/news_placeholder.png'
          const rawBase = getApiBase()
          const baseUrl = rawBase.replace(/\/api\/v1\/?$/, '')
          return encodeURI(url.startsWith('http') ? url : `${baseUrl}/uploads/news/${url}`)
        })(),
        intro: articleData.summary?.replace(/<[^>]*>?/gm, '')?.replace('[&hellip;]', '...'),
        content: articleData.content,
        paragraphs: null,
      }

  return (
    <div className="min-h-screen bg-slate-50">
      {isDashboard && <DashboardHeader />}

      <article className={`max-w-3xl mx-auto px-4 md:px-6 ${isDashboard ? 'pt-28' : 'pt-32'} pb-16`}>
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 font-jetbrains text-[10px] font-bold text-accent uppercase tracking-[0.2em] hover:underline mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {isDashboard ? t('dashboardBackToNews') : t('backToBlog')}
        </Link>

        <header className="mb-8">
          <span className="font-jetbrains inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            {article.category}
          </span>
          <h1 className="font-newsreader italic text-3xl md:text-4xl lg:text-5xl text-slate-900 leading-tight font-light mb-4">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 font-jetbrains text-[10px] uppercase tracking-[0.15em] text-slate-500 pb-6 border-b border-slate-200">
            <span>{article.date}</span>
            {article.views != null && (
              <>
                <span aria-hidden>·</span>
                <span>{article.views} views</span>
              </>
            )}
            {article.commentsCount > 0 && (
              <>
                <span aria-hidden>·</span>
                <span>{article.commentsCount} comments</span>
              </>
            )}
          </div>
        </header>

        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm mb-10">
          <img
            src={article.image}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full aspect-[16/9] object-cover"
          />
        </div>

        {article.intro && (
          <div className="rounded-xl border border-accent/20 bg-accent/5 px-6 py-5 mb-8">
            <p className="font-newsreader italic text-xl text-slate-700 leading-relaxed">{article.intro}</p>
          </div>
        )}

        {article.paragraphs?.length > 0 && (
          <div className="news-content-html news-content-html--light mb-12">
            {article.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}

        {article.content && (
          <div
            className="news-content-html news-content-html--light mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
          <h2 className="flex items-center gap-2 font-jetbrains text-[11px] font-bold text-slate-900 uppercase tracking-[0.25em] mb-6">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            Comments ({comments.length})
          </h2>

          <div className="space-y-4 mb-6">
            {comments.length === 0 ? (
              <p className="font-montserrat text-sm text-slate-500 text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No comments yet. Be the first to share your thoughts.
              </p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="border-b border-slate-100 pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-jetbrains text-[10px] font-bold text-accent uppercase tracking-wider">{c.author}</span>
                    <span className="font-jetbrains text-[9px] text-slate-400 uppercase tracking-wider">{c.date}</span>
                  </div>
                  <p className="font-montserrat text-sm text-slate-700 leading-relaxed">{c.text}</p>
                </div>
              ))
            )}
          </div>

          <label className="block font-jetbrains text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-2" htmlFor="news-comment">
            Add a comment
          </label>
          <textarea
            id="news-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
            rows={4}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-montserrat text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-y min-h-[100px]"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handlePostComment}
              disabled={!comment.trim()}
              className="font-jetbrains px-6 py-2.5 rounded-xl bg-accent text-dark text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Post comment
            </button>
          </div>
        </section>
      </article>
    </div>
  )
}

export default NewsDetail
