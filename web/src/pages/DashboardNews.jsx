import { getApiBase } from '../utils/apiBase.js';
import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNews } from '../redux/slices/newsSlice'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardLoading from '../components/dashboard/DashboardLoading'
import { useLanguage } from '../context/LanguageContext'

const buildImageUrl = (n) => {
  const url = n.imageUrl || n.coverImage || n.image
  if (!url) return '/news_placeholder.png'
  const rawBase = getApiBase()
  const baseUrl = rawBase.replace(/\/api\/v1\/?$/, '')
  const finalUrl = url.startsWith('http') ? url : `${baseUrl}/uploads/news/${url}`
  return encodeURI(finalUrl)
}

const formatArticle = (n) => ({
  id: n.slug || n._id,
  category: n.categories?.[0]?.toUpperCase() || 'GENERAL',
  title: n.title,
  description: n.summary?.replace(/<[^>]*>?/gm, '')?.replace('[&hellip;]', '...'),
  date: new Date(n.publishedAt || n.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase(),
  views: n.stats?.views >= 1000 ? `${(n.stats.views / 1000).toFixed(1)}K` : String(n.stats?.views || '0'),
  image: buildImageUrl(n),
})

const FeaturedCard = ({ article }) => (
  <Link
    to={`/dashboard/news/${article.id}`}
    className="group block col-span-1 lg:col-span-8 relative min-h-[320px] md:min-h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-sm hover:shadow-md transition-shadow"
  >
    <img
      src={article.image}
      alt=""
      referrerPolicy="no-referrer"
      className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/20" />
    <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10">
      <span className="font-jetbrains inline-flex w-fit px-3 py-1 rounded-full bg-accent text-dark text-[10px] font-black uppercase tracking-[0.2em] mb-4">
        {article.category}
      </span>
      <h2 className="marketing-card-title text-2xl md:text-4xl text-white leading-snug mb-3 line-clamp-3 group-hover:text-accent transition-colors">
        {article.title}
      </h2>
      {article.description && (
        <p className="font-montserrat text-xs leading-relaxed text-slate-200 tracking-wide line-clamp-2 max-w-2xl mb-4">
          {article.description}
        </p>
      )}
      <div className="flex items-center gap-4 font-jetbrains text-[10px] text-slate-300 font-medium uppercase tracking-[0.15em] pt-4 border-t border-white/15">
        <span>{article.date}</span>
        <span>{article.views} views</span>
      </div>
    </div>
  </Link>
)

const SideCard = ({ article }) => (
  <Link
    to={`/dashboard/news/${article.id}`}
    className="group flex flex-col col-span-1 lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-accent/40 hover:shadow-md transition-all h-full"
  >
    <div className="aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 mb-5">
      <img
        src={article.image}
        alt=""
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <span className="font-jetbrains text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-2">{article.category}</span>
    <h3 className="marketing-card-title text-xl leading-snug group-hover:text-accent transition-colors line-clamp-2 mb-2">
      {article.title}
    </h3>
    <p className="font-montserrat text-xs leading-relaxed text-slate-500 line-clamp-2 flex-1">{article.description}</p>
    <span className="font-jetbrains text-[10px] text-slate-400 uppercase tracking-wider mt-4 pt-4 border-t border-slate-100">{article.date}</span>
  </Link>
)

const GridCard = ({ article }) => (
  <Link
    to={`/dashboard/news/${article.id}`}
    className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-accent/40 hover:shadow-md transition-all"
  >
    <div className="aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 mb-4">
      <img
        src={article.image}
        alt=""
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <span className="font-jetbrains text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-2">{article.category}</span>
    <h3 className="marketing-card-title text-lg leading-snug group-hover:text-accent line-clamp-2 mb-2">
      {article.title}
    </h3>
    <p className="font-montserrat text-xs leading-relaxed text-slate-500 line-clamp-2 flex-1">{article.description}</p>
    <div className="flex justify-between items-center font-jetbrains text-[10px] uppercase tracking-wider text-slate-400 mt-4 pt-3 border-t border-slate-100">
      <span>{article.date}</span>
      <span>{article.views} views</span>
    </div>
  </Link>
)

const DashboardNews = () => {
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const { newsList, loading, currentPage, totalPages } = useSelector((state) => state.news)
  const observerTarget = useRef(null)

  useEffect(() => {
    dispatch(fetchNews({ page: 1, limit: 12, status: 'active' }))
  }, [dispatch])

  const formattedArticles = newsList.map(formatArticle)
  const featuredMain = formattedArticles[0]
  const featuredSide = formattedArticles[1]
  const gridArticles = formattedArticles.slice(2)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && currentPage < totalPages) {
          dispatch(fetchNews({ page: currentPage + 1, limit: 12, status: 'active' }))
        }
      },
      { threshold: 0.1 }
    )
    if (observerTarget.current) observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [dispatch, currentPage, totalPages, loading])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />

      <main className="pt-24 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 space-y-2">
            <span className="font-jetbrains text-[10px] text-accent tracking-[0.4em] uppercase block">
              {t('dispatchHub') || 'Dispatch hub'}
            </span>
            <h1 className="font-newsreader italic text-4xl md:text-6xl text-slate-900 tracking-tighter">
              {t('news') || 'News'}
            </h1>
            <p className="font-montserrat text-sm text-slate-500 mt-2 max-w-xl">
              Course updates, industry insights, and announcements for enrolled students.
            </p>
          </header>

          {loading && newsList.length === 0 && (
            <div className="py-24 flex justify-center">
              <DashboardLoading />
            </div>
          )}

          {!loading && formattedArticles.length === 0 && (
            <div className="py-20 text-center border border-dashed border-slate-200 rounded-2xl bg-white">
              <h3 className="font-newsreader italic text-2xl text-slate-700 mb-2">No articles yet</h3>
              <p className="font-montserrat text-sm text-slate-500">Check back when your team publishes news.</p>
            </div>
          )}

          {featuredMain && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
              <FeaturedCard article={featuredMain} />
              {featuredSide && <SideCard article={featuredSide} />}
            </div>
          )}

          {gridArticles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridArticles.map((article) => (
                <GridCard key={article.id} article={article} />
              ))}
            </div>
          )}

          <div ref={observerTarget} className="py-12 flex justify-center">
            {loading && newsList.length > 0 && <DashboardLoading />}
            {!loading && currentPage >= totalPages && formattedArticles.length > 0 && (
              <span className="font-jetbrains text-[10px] text-slate-400 uppercase tracking-[0.3em]">End of archive</span>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardNews
