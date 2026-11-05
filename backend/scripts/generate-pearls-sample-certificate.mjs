/**
 * Generates a sample PDF certificate on disk (no DB required).
 * Usage: node scripts/generate-pearls-sample-certificate.mjs
 */
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);

const { generateCertificatePDF } = await import('../utils/certificateGenerator.js');
const { PEARLS_CERTIFICATE_BG_REL } = await import('../utils/pearlsCertificateTheme.js');
const { CERTIFICATE_ORGANIZATION_DEFAULT } = await import('../utils/appBrand.js');

const outDir = path.join(root, 'uploads', 'samples');
fs.mkdirSync(outDir, { recursive: true });

const certificateUrl = await generateCertificatePDF({
  template: { image: PEARLS_CERTIFICATE_BG_REL },
  certificateData: {
    student_name: 'Dr. Sample Student',
    course_name: 'Orthodontic Foundations — Demo Course',
    completion_date: new Date(),
    instructor_name: 'Program Director',
    platform_name: CERTIFICATE_ORGANIZATION_DEFAULT,
    serial_number: '32P-DEMO-001',
    extra_lines: ['For successful completion of clinical orthodontic training.'],
  },
});

const absolute = path.join(root, certificateUrl.replace(/\//g, path.sep));
const sampleCopy = path.join(outDir, '32pearls_sample_certificate.pdf');
fs.copyFileSync(absolute, sampleCopy);

console.log('Sample certificate PDF:');
console.log(' ', sampleCopy);
console.log('Also saved as:', absolute);
