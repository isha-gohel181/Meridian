import multer from 'multer';
import path from 'path';
import { IMAGE_MIME } from '../services/cloudinaryService.js';

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.jfif']);

const fileFilter = (req, file, cb) => {
  if (file.mimetype && IMAGE_MIME.has(file.mimetype)) {
    cb(null, true);
    return;
  }
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (IMAGE_EXT.has(ext)) {
    cb(null, true);
    return;
  }
  cb(new Error('Unsupported file type. Only images are allowed.'), false);
};

const imageUploadMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

export default imageUploadMemory;
export const imageUploadMemory50mb = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});