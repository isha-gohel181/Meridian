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
  const value = String(path).trim();
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (value.startsWith('/meridian/') || value.startsWith('meridian/')) {
    return value.startsWith('/') ? value : `/${value}`;
  }
  if (value.startsWith('/uploads/') || value.startsWith('uploads/')) {
    const base = getImageBase();
    const clean = value.startsWith('/') ? value : `/${value}`;
    return `${base}${clean}`;
  }
  if (value.startsWith('/')) {
    const base = getImageBase();
    return `${base}${value}`;
  }
  if (!value.includes('/')) {
    const base = getImageBase();
    return `${base}/uploads/profiles/${value}`;
  }
  const base = getImageBase();
  return `${base}/${value}`;
}

export function getSocketBase() {
  const raw =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_BASE ||
    import.meta.env.VITE_BASE_URL ||
    DEV_DEFAULT;
  return String(raw).replace(/\/+$/, '');
}
