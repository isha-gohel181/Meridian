import { getIO } from './socketEmitter.js';

/** Tell the student's client to refresh course cards / overall progress. */
export function emitCourseProgressRefresh(userId, payload = {}) {
  const io = getIO();
  if (!io || !userId) return;
  io.to(String(userId)).emit('course-progress-updated', {
    refreshEnrollments: true,
    ...payload,
  });
}
