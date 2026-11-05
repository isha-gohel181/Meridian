import mongoose from 'mongoose';
import LessonProgress from '../models/LessonProgress.js';
import QuizSubmission from '../models/QuizSubmission.js';
import AssignmentSubmission from '../models/assignmentSubmission.js';
import Course from '../models/Course.js';
import {
  computeWeightedCourseProgress,
  lessonProgressMapFromRows,
  addSubmissionLessonId,
} from '../utils/courseOverallProgress.js';

/**
 * Returns Map<courseIdStr, overallProgress 0-100> using partial lesson progress.
 */
export async function getOverallProgressByCourseId(userId, courseIds = []) {
  const result = new Map();
  if (!courseIds.length) return result;

  const userObjectId = new mongoose.Types.ObjectId(String(userId));
  const courseObjectIds = courseIds.map((id) => new mongoose.Types.ObjectId(String(id)));

  const [courses, lessonProgressRows, quizRows, assignmentRows] = await Promise.all([
    Course.find({ _id: { $in: courseObjectIds } })
      .select('modules')
      .populate({ path: 'modules', select: 'lessons', populate: { path: 'lessons', select: 'type' } })
      .lean(),
    LessonProgress.find({ userId: userObjectId, courseId: { $in: courseObjectIds } })
      .select('courseId lessonId progressPercentage completionPercentage completed')
      .lean(),
    QuizSubmission.find({
      user: userObjectId,
      courseId: { $in: courseObjectIds },
      is_completed: true,
      passed: true,
    })
      .select('courseId lessonId quiz')
      .lean(),
    AssignmentSubmission.find({
      submittedBy: userObjectId,
      courseId: { $in: courseObjectIds },
      is_complete: true,
      status: 'graded',
    })
      .select('courseId lessonId assignmentId')
      .lean(),
  ]);

  const passedQuizzesByCourse = new Map();
  for (const q of quizRows) {
    const cid = q.courseId?.toString();
    if (!cid) continue;
    if (!passedQuizzesByCourse.has(cid)) passedQuizzesByCourse.set(cid, new Set());
    addSubmissionLessonId(passedQuizzesByCourse.get(cid), q);
  }

  const gradedAssignmentsByCourse = new Map();
  for (const a of assignmentRows) {
    const cid = a.courseId?.toString();
    if (!cid) continue;
    if (!gradedAssignmentsByCourse.has(cid)) gradedAssignmentsByCourse.set(cid, new Set());
    addSubmissionLessonId(gradedAssignmentsByCourse.get(cid), a);
  }

  for (const course of courses) {
    const cidStr = course._id.toString();
    const progress = computeWeightedCourseProgress(course, {
      lessonProgressByLessonId: lessonProgressMapFromRows(lessonProgressRows, cidStr),
      passedQuizLessonIds: passedQuizzesByCourse.get(cidStr) || new Set(),
      gradedAssignmentLessonIds: gradedAssignmentsByCourse.get(cidStr) || new Set(),
    });
    result.set(cidStr, progress);
  }

  for (const id of courseIds) {
    const key = id.toString();
    if (!result.has(key)) result.set(key, 0);
  }

  return result;
}
