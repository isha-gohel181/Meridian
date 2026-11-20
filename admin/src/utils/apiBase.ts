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
  const value = String(path).trim();
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/meridian/") || value.startsWith("meridian/")) {
    const webPublic = (
      import.meta.env.VITE_WEB_URL ||
      import.meta.env.VITE_PUBLIC_WEB_URL ||
      ""
    ).replace(/\/+$/, "");
    const rel = value.startsWith("/") ? value : `/${value}`;
    return webPublic ? `${webPublic}${rel}` : rel;
  }
  if (value.startsWith("/uploads/") || value.startsWith("uploads/")) {
    const base = getImageBase();
    const clean = value.startsWith("/") ? value : `/${value}`;
    return `${base}${clean}`;
  }
  if (value.startsWith("/")) {
    return `${getImageBase()}${value}`;
  }
  if (!value.includes("/")) {
    return `${getImageBase()}/uploads/profiles/${value}`;
  }
  return `${getImageBase()}/${value}`;
}

export function getSocketBase(): string {
  const raw =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    DEV_DEFAULT;
  return String(raw).replace(/\/+$/, "");
}
