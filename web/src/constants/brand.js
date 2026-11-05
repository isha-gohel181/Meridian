/** Product branding — keep in sync with backend utils/appBrand.js and admin constants/brand.ts */

export const APP_DISPLAY_NAME = '32 Pearls Dental Academy';
export const APP_SHORT_NAME = '32 Pearls';
export const APP_TAGLINE = 'Professional Dental Education & Training';
export const CERTIFICATE_ORGANIZATION_DEFAULT = '32 Pearls Dental Academy';
export const LOGO_PATH = '/dental_acadmy/dental.jpeg';
/** Default course certificate artwork (full design — overlays add name, course, date, serial) */
export const CERTIFICATE_DEFAULT_IMAGE = '/dental_acadmy/certificate.png';

export const DEFAULT_SUPPORT_EMAIL = '32pearlsdentalacademy@gmail.com';
export const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL || DEFAULT_SUPPORT_EMAIL;

/** E.164 without + for wa.me / tel */
export const SUPPORT_PHONE_E164 = '918288008777';
export const SUPPORT_PHONE_TEL = `+${SUPPORT_PHONE_E164}`;
export const WHATSAPP_URL = `https://wa.me/${SUPPORT_PHONE_E164}`;

export const ABOUT_US_PARAGRAPH =
  '32 Pearls Dental Academy is dedicated to advancing orthodontic education through practical, clinically oriented training. We empower dental practitioners to confidently diagnose, plan, and manage orthodontic cases, from basic tooth alignment to advanced treatment mechanics. With expert mentorship, hands-on training, real-case discussions, and continuous clinical guidance, we bridge the gap between theoretical knowledge and successful orthodontic practice.';

export const ABOUT_US_FOOTER_EXCERPT =
  'Practical, clinically oriented orthodontic training for dental practitioners—diagnosis, treatment planning, hands-on mechanics, and mentor-led case discussions.';

export function getSupportEmailDisplay() {
  return SUPPORT_EMAIL || DEFAULT_SUPPORT_EMAIL;
}

export function getSupportPhoneDisplay() {
  return '+91 82880 08777';
}
