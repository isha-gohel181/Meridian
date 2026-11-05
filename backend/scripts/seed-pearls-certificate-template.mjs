/**
 * Seeds the default published course certificate template for 32 Pearls Dental Academy.
 * Usage: node scripts/seed-pearls-certificate-template.mjs
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is not set in backend/.env');
  process.exit(1);
}

const { default: CertificateTemplate } = await import('../models/CertificateTemplate.js');
const { default: User } = await import('../models/user.js');
const { getDefaultPearlsTemplatePayload } = await import('../utils/pearlsCertificateTheme.js');

async function main() {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 30000 });
  console.log('Connected to MongoDB');

  const admin =
    (await User.findOne({ role: 'admin' }).select('_id').lean()) ||
    (await User.findOne({ roles: 'admin' }).select('_id').lean()) ||
    (await User.findOne().select('_id').lean());

  if (!admin?._id) {
    console.error('No user found to set as created_by. Create an admin user first.');
    process.exit(1);
  }

  const payload = getDefaultPearlsTemplatePayload(admin._id);

  const existing = await CertificateTemplate.findOne({
    title: payload.title,
    type: 'course',
  });

  let template;
  if (existing) {
    Object.assign(existing, payload);
    template = await existing.save();
    console.log('Updated existing template:', template._id.toString());
  } else {
    template = await CertificateTemplate.create(payload);
    console.log('Created template:', template._id.toString());
  }

  console.log('Title:', template.title);
  console.log('Status:', template.status);
  console.log('Background:', template.image);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
