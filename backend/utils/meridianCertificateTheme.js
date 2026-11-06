import fs from 'fs';
import path from 'path';
import { APP_DISPLAY_NAME, APP_TAGLINE, CERTIFICATE_ORGANIZATION_DEFAULT } from './appBrand.js';

/** Backend copy of web/public/dental_acadmy/certificate.png */
export const MERIDIAN_CERTIFICATE_BG_REL = 'assets/certificates/certificate.png';

export function getMeridianCertificateBgPath() {
  return path.join(process.cwd(), MERIDIAN_CERTIFICATE_BG_REL);
}

export function getMeridianCertificateBackgroundHtml() {
  const bgPath = getMeridianCertificateBgPath();
  if (fs.existsSync(bgPath)) {
    const bgPathUrl = bgPath.replace(/\\/g, '/');
    return `<img src="file://${bgPathUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:0;" alt="Certificate" />`;
  }
  return `<div style="position:absolute;inset:0;background:#F5F8FA;border:4px solid #032746;z-index:0;"></div>`;
}

/** All dynamic overlays off — artwork in certificate.png is shown as-is. */
export const DEFAULT_MERIDIAN_TEMPLATE_ELEMENTS = {
  student_name: { enable: false, content: '[student_name]', position_x: 0, position_y: 0 },
  user_certificate_additional: { enable: false, content: '[user_certificate_additional]', position_x: 0, position_y: 0 },
  date: { enable: false, content: '[date]', position_x: 0, position_y: 0, display_date: 'textual' },
  hint: { enable: false, content: '[serial_number]', position_x: 0, position_y: 0 },
  instructor_name: { enable: false, content: '[instructor_name]', position_x: 0, position_y: 0 },
  body: { enable: false, content: '', position_x: 0, position_y: 0 },
  platform_name: { enable: false, content: '', position_x: 0, position_y: 0 },
  title: { enable: false, content: '', position_x: 0, position_y: 0 },
  subtitle: { enable: false, content: '', position_x: 0, position_y: 0 },
  qr_code: { enable: false, content: '[qr_code]', position_x: 0, position_y: 0 },
  platform_signature: { enable: false, content: '[platform_signature]', position_x: 0, position_y: 0 },
  stamp: { enable: false, content: '[stamp]', position_x: 0, position_y: 0 },
};

export function getDefaultMeridianTemplatePayload(createdById) {
  return {
    locale: 'EN',
    title: 'Meridian — Course Completion',
    image: MERIDIAN_CERTIFICATE_BG_REL.replace(/\\/g, '/'),
    type: 'course',
    status: 'publish',
    template_contents: '<div class="certificate-template-container"></div>',
    elements: DEFAULT_MERIDIAN_TEMPLATE_ELEMENTS,
    created_by: createdById,
  };
}

export { APP_DISPLAY_NAME, APP_TAGLINE, CERTIFICATE_ORGANIZATION_DEFAULT };
