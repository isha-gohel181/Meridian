import { getImageBase } from './apiBase.js';

/**
 * Resolve a course thumbnail to an absolute URL, or null if none (no stock placeholders).
 */
export function resolveCourseThumbnail(thumb) {
  if (thumb == null || thumb === '') return null;
  const normalized = String(thumb).replace(/\\/g, '/').trim();
  if (!normalized || normalized === '/herocard.png') return null;
  if (/^https?:\/\//i.test(normalized)) return normalized;
  if (normalized.startsWith('data:')) return normalized;

  const base = getImageBase().replace(/\/api\/v1\/?$/, '');
  return normalized.startsWith('/') ? `${base}${normalized}` : `${base}/${normalized}`;
}
