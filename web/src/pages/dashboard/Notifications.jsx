import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationsRead } from '../../redux/slices/notificationSlice';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useLanguage } from '../../context/LanguageContext';

const BRAND = '#1878C0';

const Notifications = () => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const { items: notifications, total, loading } = useSelector((state) => state.notifications);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchNotifications({ page, limit }));
  }, [dispatch, page]);

  const handleMarkAllRead = () => {
    dispatch(markNotificationsRead()).then(() => {
      dispatch(fetchNotifications({ page, limit }));
    });
  };

  const handleNextPage = () => {
    if (page * limit < total) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />

      <main className="pt-24 px-4 md:px-8 pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#1878C0] transition-colors mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            {t('backToDashboard') || 'Back to Dashboard'}
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                {t('notifications') || 'Notifications'}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Updates from your courses and ExpertQa announcements
              </p>
            </div>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={loading || notifications.length === 0}
              className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-95 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: BRAND }}
            >
              {t('markAllRead') || 'Mark all read'}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            {loading && (
              <div className="p-12 text-center">
                <div
                  className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
                  style={{ borderColor: `${BRAND}33`, borderTopColor: BRAND }}
                />
                <p className="text-slate-500 text-sm">Loading notifications…</p>
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="p-12 text-center flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${BRAND}14`, color: BRAND }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No notifications yet</h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  When you receive updates or alerts, they will show up here.
                </p>
              </div>
            )}

            {!loading && notifications.length > 0 && (
              <ul className="divide-y divide-slate-100">
                {notifications.map((item) => {
                  const isUnread = item.status === 1;
                  const id = item._id || item.id;
                  return (
                    <li
                      key={id}
                      className={`p-5 md:p-6 transition-colors hover:bg-slate-50/80 flex items-start gap-4 ${isUnread ? 'bg-sky-50/40' : ''}`}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: isUnread ? `${BRAND}18` : '#f1f5f9',
                          color: isUnread ? BRAND : '#64748b',
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          {isUnread ? (
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          ) : (
                            <polyline points="20 6 9 17 4 12" />
                          )}
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-3 mb-1">
                          <h2 className={`text-base font-semibold ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                            {item.data?.title || 'Notification'}
                          </h2>
                          {isUnread && (
                            <span
                              className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide text-white"
                              style={{ backgroundColor: BRAND }}
                            >
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-2">
                          {item.data?.description || item.data?.body || ''}
                        </p>
                        <time className="text-xs text-slate-400 font-medium">
                          {new Date(item.created_at || item.createdAt || Date.now()).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </time>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {!loading && total > limit && (
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-sm text-slate-500">
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium disabled:opacity-50 hover:border-[#1878C0]/40 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={page * limit >= total}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium disabled:opacity-50 hover:border-[#1878C0]/40 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
