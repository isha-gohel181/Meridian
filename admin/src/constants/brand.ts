/** Product branding — keep in sync with backend utils/appBrand.js */
export const APP_DISPLAY_NAME = "Meridian Group of Education";
export const APP_SHORT_NAME = "Meridian";
export const APP_TAGLINE = "Knowledge. Excellence. Impact.";
export const CERTIFICATE_ORGANIZATION_DEFAULT = "Meridian Group of Education";
export const LOGO_PATH = "/meridian/logo.jpeg";
export const CERTIFICATE_DEFAULT_IMAGE = "/dental_acadmy/certificate.png";

/**
 * Landing / web theme (web/src/index.css + Footer.jsx):
 * navy #032746, gold #D8B840, ice #F5F8FA
 */
export const BRAND_ACCENT_HEX = "#D8B840";
export const BRAND_PRIMARY_HEX = "#032746";
export const BRAND_ICE_HEX = "#F5F8FA";

/** Same gradient as web landing footer: navy depth */
export const BRAND_LANDING_GRADIENT_CLASS =
  "bg-gradient-to-b from-brand-700 to-brand-900";

/** Same solid navy as dashboard "Platform Revenue" card (Home.tsx: bg-brand-500) */
export const BRAND_SIDEBAR_CLASS =
  "bg-brand-500 border-r border-white/10 shadow-md shadow-black/20";
export const BRAND_ACCENT_CLASS = BRAND_LANDING_GRADIENT_CLASS;

export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || "";

export function getSupportEmailDisplay(): string {
  return SUPPORT_EMAIL || "Contact support";
}
