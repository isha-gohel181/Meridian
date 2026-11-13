import { resolveMediaUrl } from './apiBase'
import { DIARY_FEATURED, DIARY_NEWS, DIARY_UPCOMING } from '../data/landingDiaryItems'

export function resolveFeedImage(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/')) return path
  return resolveMediaUrl(path)
}

/** Map static diary rows into the same shape as the API feed */
export function staticDiaryFallback() {
  const featured =
    DIARY_FEATURED &&
    ({
      type: 'event',
      id: DIARY_FEATURED.slug,
      slug: DIARY_FEATURED.slug,
      title: DIARY_FEATURED.title,
      blurb: DIARY_FEATURED.blurb,
      image: DIARY_FEATURED.image,
      href: `/news/${DIARY_FEATURED.slug}`,
      kind: 'event',
      meta: DIARY_FEATURED.meta,
      month: DIARY_FEATURED.month,
      day: DIARY_FEATURED.day,
    })

  const side = DIARY_NEWS.slice(0, 2).map((item) => ({
    type: 'news',
    id: item.slug,
    slug: item.slug,
    title: item.title,
    blurb: item.blurb,
    image: item.image,
    href: `/news/${item.slug}`,
    kind: 'news',
    meta: item.meta,
  }))

  const upcoming = DIARY_UPCOMING.map((item) => ({
    type: 'event',
    id: item.slug,
    slug: item.slug,
    title: item.title,
    blurb: item.blurb,
    image: item.image,
    href: `/news/${item.slug}`,
    kind: 'event',
    meta: item.meta,
    month: item.month,
    day: item.day,
  }))

  return { featured, side, upcoming, fromApi: false }
}

export function normalizeApiFeedPayload(data) {
  if (!data) return null
  const mapItem = (item) => {
    if (!item) return null
    return {
      ...item,
      image: resolveFeedImage(item.image),
    }
  }
  const featured = mapItem(data.featured)
  const side = (data.side || []).map(mapItem).filter(Boolean)
  const upcoming = (data.upcoming || []).map(mapItem).filter(Boolean)
  if (!featured && side.length === 0 && upcoming.length === 0) return null
  return { featured, side, upcoming, fromApi: true }
}
