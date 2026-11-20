import * as bannerService from '../services/bannerService.js';
import { fieldUploadUrl, replaceStoredImage } from '../utils/mediaStorage.js';

async function applyBannerFiles(data, files, existing) {
  const next = { ...data };
  if (files?.image?.[0]) {
    const url = await fieldUploadUrl(files, 'image', 'banners');
    if (existing?.image) await replaceStoredImage(existing.image, url);
    next.image = url;
  }
  if (files?.mobileImage?.[0]) {
    const url = await fieldUploadUrl(files, 'mobileImage', 'banners');
    if (existing?.mobileImage) await replaceStoredImage(existing.mobileImage, url);
    next.mobileImage = url;
  }
  return next;
}

export const createBanner = async (req, res) => {
  try {
    const data = await applyBannerFiles(req.body, req.files, null);
    const banner = await bannerService.createBanner(data);
    res.status(201).json({
      success: true,
      message: '✅ Banner created successfully',
      data: { banner },
      err: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
      data: {},
      err: { message: err.message }
    });
  }
};

export const getBanners = async (req, res) => {
  try {
    const filter = { ...req.query };
    if (filter.isActive !== undefined) {
      filter.isActive = filter.isActive === 'true' || filter.isActive === true;
    }
    const banners = await bannerService.getBanners(filter);
    res.json({
      success: true,
      message: '✅ Banners retrieved successfully',
      data: { banners },
      err: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: {},
      err: { message: err.message }
    });
  }
};

export const getBanner = async (req, res) => {
  try {
    const banner = await bannerService.getBanner(req.params.id);
    if (!banner) return res.status(404).json({
      success: false,
      message: 'Banner not found',
      data: {},
      err: { message: 'Banner not found' }
    });
    res.json({
      success: true,
      message: '✅ Banner retrieved successfully',
      data: { banner },
      err: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: {},
      err: { message: err.message }
    });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const existing = await bannerService.getBanner(req.params.id);
    const data = await applyBannerFiles(req.body, req.files, existing);
    const banner = await bannerService.updateBanner(req.params.id, data);
    if (!banner) return res.status(404).json({
      success: false,
      message: 'Banner not found',
      data: {},
      err: { message: 'Banner not found' }
    });
    res.json({
      success: true,
      message: '✅ Banner updated successfully',
      data: { banner },
      err: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
      data: {},
      err: { message: err.message }
    });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await bannerService.deleteBanner(req.params.id);
    if (!banner) return res.status(404).json({
      success: false,
      message: 'Banner not found',
      data: {},
      err: { message: 'Banner not found' }
    });
    res.json({
      success: true,
      message: '✅ Banner deleted',
      data: { banner },
      err: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: {},
      err: { message: err.message }
    });
  }
};