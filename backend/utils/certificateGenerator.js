import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { getPearlsCertificateBgPath, PEARLS_CERTIFICATE_BG_REL } from './pearlsCertificateTheme.js';

/** A4 landscape — matches certificate.png layout */
const W = 842;
const H = 595;

function resolveBackgroundPath(template) {
  const candidates = [
    template?.image ? path.join(process.cwd(), template.image) : null,
    getPearlsCertificateBgPath(),
  ].filter(Boolean);
  for (const ip of candidates) {
    if (fs.existsSync(ip) && !ip.toLowerCase().endsWith('.svg')) return ip;
  }
  return null;
}

/** PDF = full certificate artwork only (no extra text layers on top of certificate.png). */
export const generateCertificatePDF = async ({ template, certificateData }) => {
  try {
    if (!template || !certificateData) throw new Error('Missing template or certificateData');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([W, H]);

    const bgPath = resolveBackgroundPath(template);
    if (!bgPath) {
      throw new Error(`Certificate background not found. Expected ${PEARLS_CERTIFICATE_BG_REL}`);
    }

    const bytes = fs.readFileSync(bgPath);
    const ext = path.extname(bgPath).toLowerCase();
    const img = ext === '.png' ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
    page.drawImage(img, { x: 0, y: 0, width: W, height: H });

    const bytesOut = await pdfDoc.save();
    const fn = `certificate-${Date.now()}.pdf`;
    const fp = `uploads/${fn}`;
    const dir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), fp), bytesOut);
    return fp;
  } catch (error) {
    console.error('Certificate Error:', error);
    throw new Error(`Certificate generation failed: ${error.message}`);
  }
};
