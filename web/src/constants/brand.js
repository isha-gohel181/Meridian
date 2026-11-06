/** Product branding — keep in sync with backend utils/appBrand.js and admin constants/brand.ts */

export const APP_DISPLAY_NAME = 'Meridian Group of Education';
export const APP_SHORT_NAME = 'Meridian';
export const APP_TAGLINE = 'Knowledge. Excellence. Impact.';
export const BRAND_TAGLINE_SECONDARY = 'Empowering Minds. Inspiring Excellence.';
export const CERTIFICATE_ORGANIZATION_DEFAULT = 'Meridian Group of Education';
export const LOGO_PATH = '/meridian/logo.jpeg';
/** Faculty photo — add file at web/public/meridian/mentor.jpg when available */
export const MENTOR_IMAGE_PATH = '/meridian/mentor.jpg';
/** Default course certificate artwork (full design — overlays add name, course, date, serial) */
export const CERTIFICATE_DEFAULT_IMAGE = '/dental_acadmy/certificate.png';

export const MENTOR_NAME = 'Program Director';
export const MENTOR_TITLE = 'Lead Educator & Mentor';
export const MENTOR_CREDENTIALS = [
  'Structured learning pathways',
  'Hands-on skill development',
  'Mentor-led progress reviews',
];
export const MENTOR_STORY = [
  'Programs at Meridian Group of Education combine expert instruction, practical exercises, and structured feedback—so learners build confidence alongside knowledge.',
  'From foundational concepts to advanced topics, mentorship focuses on clear goals, thoughtful practice, and measurable progress.',
];

export const DEFAULT_SUPPORT_EMAIL = 'info@meridiangroupofeducation.in';
const envSupportEmail = (import.meta.env.VITE_SUPPORT_EMAIL || '').trim();
const isLegacyPearlsEmail = /32pearl|pearlsdental/i.test(envSupportEmail);
export const SUPPORT_EMAIL =
  envSupportEmail && !isLegacyPearlsEmail
    ? envSupportEmail
    : DEFAULT_SUPPORT_EMAIL;

const defaultWhatsAppE164 = '919731546948';
const defaultPrimaryE164 = '919731546948';
const defaultAltE164 = '918861198751';

/** E.164 without + for wa.me / tel */
export const WHATSAPP_PHONE_E164 =
  import.meta.env.VITE_WHATSAPP_PHONE?.replace(/\D/g, '') || defaultWhatsAppE164;
export const SUPPORT_PHONE_E164 =
  import.meta.env.VITE_SUPPORT_PHONE?.replace(/\D/g, '') || defaultPrimaryE164;
export const SUPPORT_PHONE_ALT_E164 =
  import.meta.env.VITE_SUPPORT_PHONE_ALT?.replace(/\D/g, '') || defaultAltE164;

export const SUPPORT_PHONE_TEL = `+${SUPPORT_PHONE_E164}`;
export const SUPPORT_PHONE_ALT_TEL = `+${SUPPORT_PHONE_ALT_E164}`;
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE_E164}`;

export const ABOUT_US_PARAGRAPH =
  'At Meridian Group of Education, we believe education is more than the acquisition of knowledge—it is the foundation for curiosity, confidence, creativity, and lifelong growth.';

export const ABOUT_US_FOOTER_EXCERPT =
  'Building foundations for learning. Creating possibilities for tomorrow.';

export function getSupportEmailDisplay() {
  return SUPPORT_EMAIL || DEFAULT_SUPPORT_EMAIL;
}

export function getSupportPhoneDisplay() {
  return '+91 97315 46948';
}

export function getWhatsAppPhoneDisplay() {
  return '+91 97315 46948';
}

export function getSupportPhoneAltDisplay() {
  return '+91 88611 98751';
}
