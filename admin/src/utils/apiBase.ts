const DEV_DEFAULT = "http://localhost:5000";

export function getApiBase(): string {
  const raw =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BASE_URL ||
    DEV_DEFAULT;
  return String(raw).replace(/\/+$/, "");
}

export function getImageBase(): string {
  const raw =
    import.meta.env.VITE_IMAGE_URL ||
    import.meta.env.VITE_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    DEV_DEFAULT;
  return String(raw).replace(/\/+$/, "");
}

export function resolveMediaUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = getImageBase();
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/${normalized}`;
}

export function getSocketBase(): string {
  const raw =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    DEV_DEFAULT;
  return String(raw).replace(/\/+$/, "");
}
