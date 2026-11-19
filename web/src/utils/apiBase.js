const DEV_DEFAULT = 'http://localhost:5000';

export function getApiBase() {
  const raw =
    import.meta.env.VITE_BASE_URL ||
    import.meta.env.VITE_API_BASE ||
    DEV_DEFAULT;
  return String(raw).replace(/\/+$/, '');
}

export function getImageBase() {
  const raw =
    import.meta.env.VITE_IMAGE_URL ||
    import.meta.env.VITE_BASE_URL ||
    import.meta.env.VITE_API_BASE ||
    DEV_DEFAULT;
  return String(raw).replace(/\/+$/, '');
}

/** Build absolute URL for uploads / media paths from the API host */
export function resolveMediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads/') || path.startsWith('uploads/')) {
    const base = getImageBase();
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `${base}${clean}`;
  }
  // Public static asset served by Vite frontend (e.g. /meridian/..., /dental_acadmy/...)
  return path.startsWith('/') ? path : `/${path}`;
}

export function getSocketBase() {
  const raw =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_BASE ||
    import.meta.env.VITE_BASE_URL ||
    DEV_DEFAULT;
  return String(raw).replace(/\/+$/, '');
}
