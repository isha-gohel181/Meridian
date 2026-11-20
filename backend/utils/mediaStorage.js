import fs from 'fs';
import path from 'path';
import {
  destroyByStoredUrl,
  isCloudinaryUrl,
  isImageFile,
  uploadFromMulterFile,
} from '../services/cloudinaryService.js';

export {
  isImageFile,
  isCloudinaryUrl,
  destroyByStoredUrl,
} from '../services/cloudinaryService.js';

/** Store https Cloudinary URLs as-is; leave legacy paths until migration. */
export function normalizeImageUrlForDb(url) {
  if (!url) return url;
  if (isCloudinaryUrl(url)) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const normalized = url.replace(/\\/g, '/');
  if (normalized.includes('uploads/')) {
    const idx = normalized.indexOf('uploads/');
    return '/' + normalized.substring(idx);
  }
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

export async function persistImageFile(file, folder) {
  const { secureUrl, publicId } = await uploadFromMulterFile(file, folder);
  return { url: secureUrl, publicId };
}

export function persistNonImageFile(file, subdir = '') {
  const uploadsRoot = path.join(process.cwd(), 'uploads');
  const destDir = subdir ? path.join(uploadsRoot, subdir) : uploadsRoot;
  fs.mkdirSync(destDir, { recursive: true });
  const safeName = `${Date.now()}-${(file.originalname || 'file').replace(/[\/\\]/g, '_')}`;
  const fullPath = path.join(destDir, safeName);
  fs.writeFileSync(fullPath, file.buffer);
  const rel = path.relative(uploadsRoot, fullPath).replace(/\\/g, '/');
  return `/uploads/${rel}`;
}

/** Multer memory file: image → Cloudinary secure URL, else → local /uploads path */
export async function persistUploadFile(file, { imageFolder = 'misc', diskSubdir = '' } = {}) {
  if (!file) return null;
  if (isImageFile(file)) {
    const { url } = await persistImageFile(file, imageFolder);
    return url;
  }
  return persistNonImageFile(file, diskSubdir);
}

export async function replaceStoredImage(oldUrl, newUrl) {
  if (oldUrl && newUrl && oldUrl !== newUrl && isCloudinaryUrl(oldUrl)) {
    await destroyByStoredUrl(oldUrl);
  }
}

/** Normalize disk path or relative path to public URL fragment for DB */
export function diskPathToUploadUrl(filePath) {
  if (!filePath) return null;
  if (isCloudinaryUrl(filePath)) return filePath;
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;
  const normalized = filePath.replace(/\\/g, '/');
  const uploadsIndex = normalized.indexOf('uploads/');
  if (uploadsIndex !== -1) {
    return '/' + normalized.substring(uploadsIndex);
  }
  if (normalized.startsWith('/uploads/')) return normalized;
  const base = path.basename(normalized);
  return `/uploads/${base}`;
}

export async function singleUploadUrl(file, folder = 'misc') {
  if (!file) return undefined;
  return persistUploadFile(file, { imageFolder: folder, diskSubdir: folder });
}

export async function fieldUploadUrl(files, field, folder = 'misc') {
  const file = files?.[field]?.[0];
  if (!file) return undefined;
  return singleUploadUrl(file, folder);
}

export async function attachmentFromMulterFile(file, imageFolder = 'attachments', diskSubdir = 'attachments') {
  const url = await persistUploadFile(file, { imageFolder, diskSubdir });
  return {
    name: file.originalname,
    url,
    type: file.mimetype,
  };
}

export async function buildChatFileEntry(file) {
  const stored = await persistUploadFile(file, { imageFolder: 'chat', diskSubdir: 'chat' });
  const url = stored.startsWith('http') ? stored : stored.startsWith('/') ? stored : `/${stored}`;
  const originalName = file.originalname || 'file';
  const ext = (originalName || '').toLowerCase().split('.').pop();
  let determinedType = 'other';
  if (file.mimetype?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
    determinedType = 'image';
  } else if (file.mimetype === 'application/pdf' || ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) {
    determinedType = 'document';
  } else if (file.mimetype?.startsWith('audio/') || ['mp3', 'wav', 'm4a', 'ogg', 'aac', 'webm', 'amr'].includes(ext)) {
    determinedType = 'voice';
  }
  return { url, name: originalName, type: determinedType, size: file.size };
}

export async function mapChatFiles(files) {
  if (!files?.length) return [];
  const out = [];
  for (const f of files) {
    out.push(await buildChatFileEntry(f));
  }
  return out;
}

export async function forumAttachmentMeta(file) {
  const url = await persistUploadFile(file, { imageFolder: 'forum', diskSubdir: 'forum' });
  return {
    type: url,
    originalName: file.originalname,
    fileType: file.mimetype,
  };
}

export async function mapMulterAttachments(files, imageFolder = 'attachments') {
  if (!files?.length) return [];
  const results = [];
  for (const file of files) {
    results.push(await attachmentFromMulterFile(file, imageFolder, imageFolder));
  }
  return results;
}

export async function persistMulterFields(files, fieldFolders) {
  const out = {};
  if (!files) return out;
  const entries = Array.isArray(files)
    ? files
    : Object.entries(files).flatMap(([name, arr]) =>
        (Array.isArray(arr) ? arr : [arr]).map((f) => ({ ...f, fieldname: name }))
      );

  for (const file of entries) {
    const folder = fieldFolders[file.fieldname] || fieldFolders['*'] || 'misc';
    out[file.fieldname] = await persistUploadFile(file, {
      imageFolder: folder,
      diskSubdir: folder.split('/').pop() || '',
    });
  }
  return out;
}