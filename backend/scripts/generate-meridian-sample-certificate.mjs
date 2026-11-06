/**
 * Generates a sample PDF certificate on disk (no DB required).
 * Usage: node scripts/generate-meridian-sample-certificate.mjs
 */
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);

const { generateCertificatePDF } = await import('../utils/certificateGenerator.js');
const { MERIDIAN_CERTIFICATE_BG_REL } = await import('../utils/meridianCertificateTheme.js');
const { CERTIFICATE_ORGANIZATION_DEFAULT } = await import('../utils/appBrand.js');

const outDir = path.join(root, 'uploads', 'samples');
fs.mkdirSync(outDir, { recursive: true });

const certificateUrl = await generateCertificatePDF({
  template: { image: MERIDIAN_CERTIFICATE_BG_REL },
  certificateData: {
    student_name: 'Sample Student',
    course_name: 'Foundations — Demo Course',
    completion_date: new Date(),
    instructor_name: 'Program Director',
    platform_name: CERTIFICATE_ORGANIZATION_DEFAULT,
    serial_number: 'MGE-DEMO-001',
    extra_lines: ['For successful completion of the program.'],
  },
});

const absolute = path.join(root, certificateUrl.replace(/\//g, path.sep));
const sampleCopy = path.join(outDir, 'meridian_sample_certificate.pdf');
fs.copyFileSync(absolute, sampleCopy);

console.log('Sample certificate PDF:');
console.log(' ', sampleCopy);
console.log('Also saved as:', absolute);
