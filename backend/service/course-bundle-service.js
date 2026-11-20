// services/course-bundle-service.js
import bundleRepo from '../repository/course-bundle-repository.js';
import { persistUploadFile } from '../utils/mediaStorage.js';

async function applyBundleFiles(data, files) {
  if (!Array.isArray(files)) return data;
  for (const file of files) {
    const key = file.fieldname;
    if (!['thumbnail', 'banner', 'video', 'attachmentFile', 'documentFile'].includes(key)) continue;
    const folder = `bundles/${key}`;
    data[key] = await persistUploadFile(file, { imageFolder: folder, diskSubdir: folder });
  }
  return data;
}

class CourseBundleService {
  async create(data, files) {
    await applyBundleFiles(data, files);
    return await bundleRepo.create(data);
  }

  async getAll(query) {
    try {
      return await bundleRepo.findAll(query);
    } catch (error) {
      console.error('BundleService: Error in getAll:', error);
      throw error;
    }
  }

  async getById(id) {
    return await bundleRepo.findById(id);
  }

  async update(id, data, files) {
    await applyBundleFiles(data, files);
    return await bundleRepo.update(id, data);
  }

  async delete(id) {
    return await bundleRepo.delete(id);
  }
}

export default new CourseBundleService();