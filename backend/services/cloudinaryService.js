import path from 'path';
import { cloudinary, requireCloudinary, CLOUDINARY_ROOT_FOLDER } from '../config/cloudinary.js';

export const IMAGE_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/jfif',
]);

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.jfif']);

export function isImageMime(mimetype) {
  return Boolean(mimetype && IMAGE_MIME.has(mimetype));
}

export function isImageFile(file) {
  if (!file) return false;
  if (isImageMime(file.mimetype)) return true;
  const ext = path.extname(file.originalname || '').toLowerCase();
  return IMAGE_EXT.has(ext);
}

function buildFolder(folder) {
  const segment = (folder || 'misc').replace(/^\/+|\/+$/g, '');
  return `${CLOUDINARY_ROOT_FOLDER}/${segment}`;
}

export function isCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('res.cloudinary.com');
}

export function parsePublicIdFromUrl(url) {
  if (!isCloudinaryUrl(url)) return null;
  try {
    const u = new URL(url);
    const afterUpload = u.pathname.split('/upload/')[1];
    if (!afterUpload) return null;
    const parts = afterUpload.split('/');
    let start = 0;
    if (parts[0]?.startsWith('v') && /^\d+$/.test(parts[0].slice(1))) start = 1;
    const rest = parts.slice(start).join('/');
    return rest.replace(/\.[a-zA-Z0-9]+$/, '');
  } catch {
    return null;
  }
}

export async function uploadImageBuffer(buffer, { folder = 'misc', originalName = 'image' } = {}) {
  requireCloudinary();
  const uploadFolder = buildFolder(folder);
  const baseName = path
    .basename(originalName, path.extname(originalName))
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 80);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: uploadFolder,
        public_id: `${Date.now()}-${baseName}`,
        resource_type: 'image',
        overwrite: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error) reject(error);
        else {
          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
          });
        }
      }
    );
    stream.end(buffer);
  });
}

export async function uploadFromMulterFile(file, folder = 'misc') {
  if (!file?.buffer) {
    const err = new Error('Invalid upload file buffer');
    err.statusCode = 400;
    throw err;
  }
  if (!isImageFile(file)) {
    const err = new Error('Only image files are allowed for Cloudinary upload');
    err.statusCode = 400;
    throw err;
  }
  return uploadImageBuffer(file.buffer, { folder, originalName: file.originalname });
}

export async function destroyByPublicId(publicId) {
  if (!publicId) return;
  if (!cloudinary.config().cloud_name) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (err) {
    if (err?.http_code !== 404) console.warn('[cloudinary] destroy failed:', publicId, err.message);
  }
}

export async function destroyByStoredUrl(url) {
  const publicId = parsePublicIdFromUrl(url);
  if (publicId) await destroyByPublicId(publicId);
}