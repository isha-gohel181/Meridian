/** Product branding — keep in sync with backend utils/appBrand.js */
export const APP_DISPLAY_NAME = "32 Pearls Dental Academy";
export const APP_SHORT_NAME = "32 Pearls";
export const APP_TAGLINE = "Professional Dental Education & Training";
export const CERTIFICATE_ORGANIZATION_DEFAULT = "32 Pearls Dental Academy";
/** Same asset as student web — admin/public/dental_acadmy/dental.jpeg */
export const LOGO_PATH = "/dental_acadmy/dental.jpeg";
export const CERTIFICATE_DEFAULT_IMAGE = "/dental_acadmy/certificate.png";

/**
 * Landing / web theme (web/src/index.css + Footer.jsx):
 * accent #C96A1B, brand-brown #682701, cream #FFF9F3
 */
export const BRAND_ACCENT_HEX = "#C96A1B";
export const BRAND_BROWN_HEX = "#682701";
export const BRAND_CREAM_HEX = "#FFF9F3";

/** Same gradient as web landing footer: from accent → brown */
export const BRAND_LANDING_GRADIENT_CLASS =
  "bg-gradient-to-b from-brand-500 to-brand-800";

export const BRAND_SIDEBAR_CLASS = BRAND_LANDING_GRADIENT_CLASS;
export const BRAND_ACCENT_CLASS = BRAND_LANDING_GRADIENT_CLASS;

export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || "";

export function getSupportEmailDisplay(): string {
  return SUPPORT_EMAIL || "Contact support";
}
