/**
 * Central product branding for emails, certificates, and defaults.
 */
export const APP_DISPLAY_NAME =
  process.env.EMAIL_SENDER_NAME ||
  process.env.APP_NAME ||
  "32 Pearls Dental Academy";

export const APP_SHORT_NAME = "32 Pearls";

export const APP_TAGLINE = "Professional Dental Education & Training";

export const CERTIFICATE_ORGANIZATION_DEFAULT =
  process.env.CERTIFICATE_ORGANIZATION || APP_DISPLAY_NAME;

export function getAppBrand() {
  return {
    displayName: APP_DISPLAY_NAME,
    shortName: APP_SHORT_NAME,
    tagline: APP_TAGLINE,
    certificateOrganization: CERTIFICATE_ORGANIZATION_DEFAULT,
  };
}
