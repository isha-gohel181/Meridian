/**
 * One-time migration: upload only MongoDB-referenced local images to Cloudinary.
 *
 * Usage:
 *   node scripts/migrateImagesToCloudinary.js           # dry-run (default)
 *   node scripts/migrateImagesToCloudinary.js --apply   # upload + update DB
 */
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { connectToDatabase } from '../db/connect.js';
import { uploadImageBuffer, isCloudinaryUrl } from '../services/cloudinaryService.js';
import '../config/cloudinary.js';
import Setting from '../models/setting.js';
import Course from '../models/Course.js';
import News from '../models/News.js';
import Event from '../models/Event.js';
import User from '../models/user.js';
import Testimonial from '../models/Testimonial.js';
import Banner from '../models/Banner.js';
import BlogPost from '../models/BlogPost.js';
import Module from '../models/Module.js';
import CourseCategory from '../models/CourseCategory.js';
import CourseBundle from '../models/CourseBundle.js';
import FreeContent from '../models/FreeContent.js';
import TestSeries from '../models/TestSeries.js';
import Ebook from '../models/Ebook.js';
import JobPosting from '../models/JobPosting.js';
import CertificateTemplate from '../models/CertificateTemplate.js';
import Notification from '../models/Notifications.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_ROOT = path.join(process.cwd(), 'uploads');
const apply = process.argv.includes('--apply');

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|jfif)$/i;

function isLikelyImageValue(value) {
  if (!value || typeof value !== 'string') return false;
  if (isCloudinaryUrl(value)) return false;
  if (value.startsWith('/meridian/')) return false;
  return IMAGE_EXT.test(value) || value.includes('/uploads/') || value.includes('uploads\\');
}

function normalizeToRelative(uploadValue) {
  const normalized = uploadValue.replace(/\\/g, '/');
  const idx = normalized.indexOf('uploads/');
  if (idx >= 0) return normalized.substring(idx);
  if (normalized.startsWith('/uploads/')) return normalized.slice(1);
  if (!normalized.includes('/')) return `uploads/${normalized}`;
  return normalized.replace(/^\//, '');
}

function localFilePath(relative) {
  const rel = normalizeToRelative(relative);
  return path.join(process.cwd(), rel);
}

function collectStrings(value, bucket) {
  if (value == null) return;
  if (typeof value === 'string') {
    if (isLikelyImageValue(value)) bucket.add(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v) => collectStrings(v, bucket));
    return;
  }
  if (typeof value === 'object') {
    Object.values(value).forEach((v) => collectStrings(v, bucket));
  }
}

async function uploadLocalFile(relative, collection) {
  const full = localFilePath(relative);
  if (!fs.existsSync(full)) return { status: 'missing', relative, full };
  const buffer = fs.readFileSync(full);
  if (!apply) return { status: 'dry-run', relative };
  const { secureUrl } = await uploadImageBuffer(buffer, {
    folder: `legacy/${collection}`,
    originalName: path.basename(full),
  });
  return { status: 'uploaded', relative, secureUrl };
}

async function migrateDocument(Model, collection, extraPaths = []) {
  const docs = await Model.find({}).lean();
  let updates = 0;
  for (const doc of docs) {
    const bucket = new Set();
    collectStrings(doc, bucket);
    extraPaths.forEach((p) => {
      const v = p.split('.').reduce((o, k) => o?.[k], doc);
      if (v) bucket.add(v);
    });
    if (!bucket.size) continue;

  const patch = JSON.parse(JSON.stringify(doc));
  let changed = false;

    for (const raw of bucket) {
      const result = await uploadLocalFile(raw, collection);
      if (result.status === 'uploaded') {
        changed = replaceInObject(patch, raw, result.secureUrl) || changed;
      }
    }

    if (changed && apply) {
      await Model.replaceOne({ _id: doc._id }, patch);
      updates += 1;
    }
  }
  return updates;
}

function replaceInObject(node, from, to) {
  let changed = false;
  if (node == null) return false;
  if (typeof node === 'string') return false;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      if (typeof node[i] === 'string' && node[i] === from) {
        node[i] = to;
        changed = true;
      } else if (replaceInObject(node[i], from, to)) changed = true;
    }
    return changed;
  }
  if (typeof node === 'object') {
    for (const key of Object.keys(node)) {
      if (typeof node[key] === 'string' && node[key] === from) {
        node[key] = to;
        changed = true;
      } else if (replaceInObject(node[key], from, to)) changed = true;
    }
  }
  return changed;
}

async function migrateSettings() {
  const settings = await Setting.find({}).lean();
  let updates = 0;
  for (const doc of settings) {
    const bucket = new Set();
    collectStrings(doc.value, bucket);
    if (!bucket.size) continue;
    const nextValue = JSON.parse(JSON.stringify(doc.value));
    let changed = false;
    for (const raw of bucket) {
      const result = await uploadLocalFile(raw, 'settings');
      if (result.status === 'uploaded') {
        changed = replaceInObject(nextValue, raw, result.secureUrl) || changed;
      }
    }
    if (changed && apply) {
      await Setting.updateOne({ _id: doc._id }, { $set: { value: nextValue } });
      updates += 1;
    }
  }
  return updates;
}

async function main() {
  dotenv.config();
  await connectToDatabase();

  const report = {
    mode: apply ? 'apply' : 'dry-run',
    startedAt: new Date().toISOString(),
    collections: {},
  };

  const refs = new Set();
  const models = [
    [Course, 'courses'],
    [News, 'news'],
    [Event, 'events'],
    [User, 'users'],
    [Testimonial, 'testimonials'],
    [Banner, 'banners'],
    [BlogPost, 'blog'],
    [Module, 'modules'],
    [CourseCategory, 'categories'],
    [CourseBundle, 'bundles'],
    [FreeContent, 'free-content'],
    [TestSeries, 'test-series'],
    [Ebook, 'ebooks'],
    [JobPosting, 'jobs'],
    [CertificateTemplate, 'certificate-templates'],
    [Notification, 'notifications'],
  ];

  for (const [Model, name] of models) {
    const docs = await Model.find({}).lean();
    docs.forEach((d) => collectStrings(d, refs));
    report.collections[name] = await migrateDocument(Model, name);
  }

  const settings = await Setting.find({}).lean();
  settings.forEach((s) => collectStrings(s.value, refs));
  report.settingsUpdated = await migrateSettings();

  report.uniqueReferences = refs.size;
  report.finishedAt = new Date().toISOString();

  const outPath = path.join(__dirname, 'migration-report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.log(`Report written to ${outPath}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});