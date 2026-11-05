import LessonRepository from '../repository/LessonRepository.js';

export default class LessonService {
  constructor() {
    this.lessonRepository = new LessonRepository();
  }

  async createLesson(data) {
    try {
      // Desktop + mobile by default; admin can mark phone-only in drip settings
      if (typeof data.ismobileOnly === 'undefined') {
        data.ismobileOnly = false;
      }
      const createdLesson = await this.lessonRepository.create(data);
      if (!createdLesson) {
        throw new Error('Lesson creation failed');
      }
      if (createdLesson.moduleId) {
        const CourseModule = (await import('../models/Module.js')).default;
        await CourseModule.findByIdAndUpdate(
          createdLesson.moduleId,
          { $push: { lessons: createdLesson._id } },
          { new: true }
        );
      }
      return createdLesson;
    } catch (error) {
      console.error('LessonService: Error in createLesson:', error);
      throw error;
    }
}


  async getAllLessons(query) {
    try {
      return await this.lessonRepository.findAll(query);
    } catch (error) {
      console.error('Error in getAllLessons:', error);
      throw error;
    }
  }

  async getLessonById(id) {
    try {
      return await this.lessonRepository.findById(id);
    } catch (error) {
      console.error('Error in getLessonById:', error);
      throw error;
    }
  }

  async updateLesson(id, data) {
    try {
      return await this.lessonRepository.update(id, data);
    } catch (error) {
      console.error('Error in updateLesson:', error);
      throw error;
    }
  }

  async deleteLesson(id) {
    try {
      return await this.lessonRepository.delete(id);
    } catch (error) {
      console.error('Error in deleteLesson:', error);
      throw error;
    }
  }
}
