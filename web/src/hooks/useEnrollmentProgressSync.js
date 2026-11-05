import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketService from '../services/socketService';
import { fetchMyEnrollments } from '../redux/slices/enrollmentSlice';
import { fetchDashboardData } from '../redux/slices/dashboardSlice';

/**
 * Keeps My Courses / dashboard progress in sync when the server saves real video progress.
 */
export default function useEnrollmentProgressSync() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    if (!user) return;

    const token =
      localStorage.getItem('edrilla_token') ||
      localStorage.getItem('token') ||
      null;
    if (!token) return;

    let onCourseProgress;

    socketService
      .connect(token)
      .then(() => {
        onCourseProgress = () => {
          dispatch(fetchMyEnrollments());
          dispatch(fetchDashboardData());
        };
        socketService.on('course-progress-updated', onCourseProgress);
      })
      .catch(() => {});

    return () => {
      if (onCourseProgress) {
        socketService.off('course-progress-updated', onCourseProgress);
      }
    };
  }, [dispatch, user]);
}
