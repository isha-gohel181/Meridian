import News from '../models/News.js';
import Event from '../models/Event.js';

export const parseBool = (value) =>
  value === true || value === 'true' || value === '1' || value === 1;

const NEWS_STATUSES = ['active', 'published'];

const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function ensureNewsSlug(data) {
  if (data.slug) return data;
  const base = slugify(data.title || data.articleTitle || 'news');
  if (base) data.slug = base;
  return data;
}

export function applyNewsLandingFields(data, body = {}) {
  if (body.showOnLanding !== undefined) {
    data.showOnLanding = parseBool(body.showOnLanding);
  }
  if (body.landingFeatured !== undefined) {
    data.landingFeatured = parseBool(body.landingFeatured);
  }
  if (body.landingKind !== undefined) {
    const kind = body.landingKind;
    if (['news', 'vlog', 'interview'].includes(kind)) {
      data.landingKind = kind;
    }
  }
  if (data.landingFeatured && !data.showOnLanding) {
    data.showOnLanding = true;
  }
  return data;
}

export function applyEventLandingFields(data, body = {}) {
  if (body.showOnLanding !== undefined) {
    data.showOnLanding = parseBool(body.showOnLanding);
  }
  if (body.landingFeatured !== undefined) {
    data.landingFeatured = parseBool(body.landingFeatured);
  }
  if (body.cardSummary !== undefined) {
    data.cardSummary = String(body.cardSummary || '').trim().slice(0, 280);
  }
  if (data.landingFeatured && !data.showOnLanding) {
    data.showOnLanding = true;
  }
  return data;
}

/** Clear featured flag on all other news/events when pinning a new featured item */
export async function clearOtherLandingFeatured({ excludeNewsId, excludeEventId } = {}) {
  const newsFilter = { landingFeatured: true };
  const eventFilter = { landingFeatured: true };
  if (excludeNewsId) newsFilter._id = { $ne: excludeNewsId };
  if (excludeEventId) eventFilter._id = { $ne: excludeEventId };
  await Promise.all([
    News.updateMany(newsFilter, { $set: { landingFeatured: false } }),
    Event.updateMany(eventFilter, { $set: { landingFeatured: false } }),
  ]);
}

const truncate = (text, max = 200) => {
  const s = String(text || '').trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
};

const formatEventMeta = (event) => {
  const parts = [];
  if (event.type === 'online') parts.push('Online');
  else if (event.type === 'offline' && event.venue?.city) parts.push(event.venue.city);
  else if (event.type === 'hybrid') parts.push('Hybrid');
  if (event.startDate) {
    const d = new Date(event.startDate);
    parts.push(
      d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }) +
        ' IST'
    );
  }
  return parts.filter(Boolean).join(' · ') || 'Event';
};

const monthDay = (date) => {
  const d = new Date(date);
  return {
    month: d.toLocaleString('en-US', { month: 'short' }),
    day: String(d.getDate()),
  };
};

const normalizeNewsItem = (doc) => {
  const slug = doc.slug || doc._id?.toString();
  return {
    type: 'news',
    id: doc._id.toString(),
    slug,
    title: doc.title || doc.articleTitle,
    blurb: truncate(doc.excerpt || doc.summary, 200),
    image: doc.coverImage || doc.imageUrl || '',
    href: `/news/${slug}`,
    kind: doc.landingKind || 'news',
    meta: doc.publishedAt
      ? new Date(doc.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : '',
    publishedAt: doc.publishedAt,
  };
};

const normalizeEventItem = (doc, { includeDateBlock = false } = {}) => {
  const start = doc.startDate ? new Date(doc.startDate) : null;
  const { month, day } = start ? monthDay(start) : { month: '', day: '' };
  return {
    type: 'event',
    id: doc._id.toString(),
    title: doc.title,
    blurb: truncate(doc.cardSummary || doc.description, 200),
    image: doc.thumbnail || '',
    href: `/events/${doc._id}`,
    kind: 'event',
    meta: formatEventMeta(doc),
    month,
    day,
    startDate: doc.startDate,
    ...(includeDateBlock ? { month, day } : {}),
  };
};

export async function getActivityFeed(limit = 8) {
  const now = new Date();

  const [featuredNews, featuredEvents] = await Promise.all([
    News.find({
      showOnLanding: true,
      landingFeatured: true,
      status: { $in: NEWS_STATUSES },
    })
      .sort({ publishedAt: -1 })
      .limit(1)
      .lean(),
    Event.find({
      showOnLanding: true,
      landingFeatured: true,
      status: 'published',
      isDeleted: { $ne: true },
    })
      .sort({ startDate: -1 })
      .limit(1)
      .lean(),
  ]);

  let featured = null;
  const featuredEvent = featuredEvents[0];
  const featuredNewsDoc = featuredNews[0];
  if (featuredEvent && featuredNewsDoc) {
    const eventTime = new Date(featuredEvent.startDate || 0).getTime();
    const newsTime = new Date(featuredNewsDoc.publishedAt || 0).getTime();
    featured =
      eventTime >= newsTime
        ? normalizeEventItem(featuredEvent, { includeDateBlock: true })
        : normalizeNewsItem(featuredNewsDoc);
  } else if (featuredEvent) {
    featured = normalizeEventItem(featuredEvent, { includeDateBlock: true });
  } else if (featuredNewsDoc) {
    featured = normalizeNewsItem(featuredNewsDoc);
  }

  const featuredNewsId = featured?.type === 'news' ? featured.id : null;
  const featuredEventId = featured?.type === 'event' ? featured.id : null;

  const side = await News.find({
    showOnLanding: true,
    landingFeatured: { $ne: true },
    status: { $in: NEWS_STATUSES },
    ...(featuredNewsId ? { _id: { $ne: featuredNewsId } } : {}),
  })
    .sort({ publishedAt: -1 })
    .limit(2)
    .lean();

  const upcoming = await Event.find({
    showOnLanding: true,
    landingFeatured: { $ne: true },
    status: 'published',
    isDeleted: { $ne: true },
    startDate: { $gte: now },
    ...(featuredEventId ? { _id: { $ne: featuredEventId } } : {}),
  })
    .sort({ startDate: 1 })
    .limit(Math.min(5, limit))
    .lean();

  return {
    featured,
    side: side.map(normalizeNewsItem),
    upcoming: upcoming.map((e) => normalizeEventItem(e, { includeDateBlock: true })),
  };
}
