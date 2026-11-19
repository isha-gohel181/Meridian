import express from 'express';
import { getSettings, getAllSettings, updateSettings, uploadSettingImage } from '../controllers/settingController.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';
import { isAdmin } from '../middlewares/isAdmin.js';
import { upload } from '../middlewares/upload-middleware.js';

const router = express.Router();

// SECURITY: POST /settings and GET /settings are intentionally PUBLIC — the
// student checkout frontend and mobile app read public settings (gstRate,
// RAZORPAY_KEY_ID) at checkout time without authentication.
// The controller is responsible for restricting which keys are returned
// (only PUBLIC_SETTING_KEYS are exposed; secrets like RAZORPAY_KEY_SECRET
// should never appear in that allowlist).

// POST /settings - Get settings by keys (public keys only)
router.post('/', getSettings);

// GET /settings - Get all public settings
router.get('/', getAllSettings);

// GET /settings/all - Full, unfiltered settings dump (Admin only)
// Secrets like RAZORPAY_KEY_SECRET are only reachable via this route.
router.get(
    '/all',
    accessTokenAutoRefresh,
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    getAllSettings
);

// PUT /settings - Update settings (Admin only)
router.put(
    '/',
    accessTokenAutoRefresh,
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    updateSettings
);

// POST /settings/upload - Upload landing or setting image (Admin only)
router.post(
    '/upload',
    accessTokenAutoRefresh,
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    upload.single('image'),
    uploadSettingImage
);

export default router;