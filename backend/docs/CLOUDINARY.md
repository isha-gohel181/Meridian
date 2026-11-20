# Cloudinary image uploads

## Environment variables

Set on the API server:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_FOLDER` (optional, default `meridian`)
- `SERVE_LEGACY_UPLOADS` — keep `true` until legacy `/uploads` image paths are migrated; non-image files (PDF, video) still use local `/uploads` when enabled.

## Behavior

- New **image** uploads go through the API to Cloudinary; MongoDB stores the `secure_url`.
- PDFs, videos, Excel, and similar files remain on disk under `backend/uploads/`.
- Static marketing assets in `web/public/meridian/` are unchanged (served by the frontend).

## Migration

From `backend/`:

```bash
node scripts/migrateImagesToCloudinary.js          # dry-run
node scripts/migrateImagesToCloudinary.js --apply
```

Only paths referenced in MongoDB (including Settings JSON) are uploaded — not the entire `uploads/` folder.

## Staging test checklist

1. Set `CLOUDINARY_*` and `SERVE_LEGACY_UPLOADS=true` on staging API.
2. Admin: upload landing hero/stats/statement/why-choose → save → confirm web sections render.
3. Course thumbnail create/edit; news cover + EditorJS image; profile picture; banner; testimonial photo.
4. Legacy documents still using `/uploads/…` render while legacy static is enabled.
5. After `node scripts/migrateImagesToCloudinary.js --apply`, migrated records use Cloudinary without local image files.
6. PDF lesson, video lesson, and Excel flows unchanged (local `/uploads/`).
7. Forum/chat: image attachment on CDN; non-image attachment still from API `/uploads/`.
8. When migration is clean, set `SERVE_LEGACY_UPLOADS=false` in production (non-image files still need `/uploads/`).