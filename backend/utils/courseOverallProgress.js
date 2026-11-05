/**
 * Course progress = average completion % across all lessons in the course.
 * Video/text/reading use LessonProgress.progressPercentage (partial watch counts).
 * Quiz / assignment count as 100% only when passed/graded.
 */

export function iterateCourseLessons(course) {
  const lessons = [];
  if (!course?.modules) return lessons;
  for (const mod of course.modules) {
    if (!mod?.lessons) continue;
    for (const lesson of mod.lessons) {
      if (lesson?._id) lessons.push(lesson);
    }
  }
  return lessons;
}

export function countCourseContentItems(course) {
  return iterateCourseLessons(course).length;
}

/**
 * @param {object} course - course doc with populated modules.lessons
 * @param {Map<string, number>} lessonProgressByLessonId - lessonId -> 0..100
 * @param {Set<string>} passedQuizLessonIds
 * @param {Set<string>} gradedAssignmentLessonIds
 */
export function computeWeightedCourseProgress(
  course,
  {
    lessonProgressByLessonId = new Map(),
    passedQuizLessonIds = new Set(),
    gradedAssignmentLessonIds = new Set(),
  } = {}
) {
  const lessons = iterateCourseLessons(course);
  if (lessons.length === 0) return 0;

  let sum = 0;
  for (const lesson of lessons) {
    const lid = lesson._id.toString();
    const type = String(lesson.type || '').toLowerCase();

    if (type === 'quiz') {
      sum += passedQuizLessonIds.has(lid) ? 100 : 0;
    } else if (type === 'assignment') {
      sum += gradedAssignmentLessonIds.has(lid) ? 100 : 0;
    } else {
      const raw = lessonProgressByLessonId.get(lid);
      const pct = Math.min(100, Math.max(0, Number(raw) || 0));
      sum += pct;
    }
  }

  const overall = sum / lessons.length;
  return Math.round(overall * 100) / 100;
}

/** Build lessonId -> max progress % map for one course from LessonProgress rows */
export function lessonProgressMapFromRows(rows, courseIdStr) {
  const map = new Map();
  for (const lp of rows) {
    const cid = lp.courseId?.toString?.() || String(lp.courseId || '');
    if (cid !== courseIdStr) continue;
    const lid = lp.lessonId?.toString?.() || String(lp.lessonId || '');
    if (!lid) continue;
    const pct = Math.max(
      Number(lp.progressPercentage) || 0,
      Number(lp.completionPercentage) || 0,
      lp.completed ? 100 : 0
    );
    map.set(lid, Math.max(map.get(lid) || 0, pct));
  }
  return map;
}

export function addSubmissionLessonId(set, doc) {
  const id =
    doc?.lessonId?.toString?.() ||
    doc?.quiz?.toString?.() ||
    doc?.assignmentId?.toString?.() ||
    doc?._id?.toString?.();
  if (id) set.add(id);
}
