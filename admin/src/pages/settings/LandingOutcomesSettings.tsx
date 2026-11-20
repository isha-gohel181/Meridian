import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosConfig';
import toast from 'react-hot-toast';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { BarChart3, Save, RotateCcw, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import {
  DEFAULT_LANDING_STATS,
  LANDING_STATS_TONE_OPTIONS,
  LandingStatsConfig,
  LandingStatsMetric,
  LandingStatsTone,
  resolveImgPreview,
} from './landingSectionConfig';

const METRIC_INDICES = [0, 1, 2, 3] as const;

const LandingOutcomesSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [stats, setStats] = useState<LandingStatsConfig>(DEFAULT_LANDING_STATS);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/settings/all');
      const settings = res.data?.settings || {};
      if (settings.landingStats && typeof settings.landingStats === 'object') {
        const raw = settings.landingStats as Partial<LandingStatsConfig>;
        const metrics =
          Array.isArray(raw.metrics) && raw.metrics.length === 4
            ? raw.metrics.map((m, i) => ({
                value: m?.value ?? DEFAULT_LANDING_STATS.metrics[i].value,
                label: m?.label ?? DEFAULT_LANDING_STATS.metrics[i].label,
                tone: (m?.tone as LandingStatsTone) ?? DEFAULT_LANDING_STATS.metrics[i].tone,
              }))
            : DEFAULT_LANDING_STATS.metrics;
        setStats({
          title: raw.title || DEFAULT_LANDING_STATS.title,
          subtitle: raw.subtitle || DEFAULT_LANDING_STATS.subtitle,
          image: raw.image || DEFAULT_LANDING_STATS.image,
          imageAlt: raw.imageAlt || DEFAULT_LANDING_STATS.imageAlt,
          metrics,
        });
      }
    } catch (err) {
      console.error('Failed to load outcomes settings', err);
      toast.error('Failed to load outcomes settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put('/settings', { landingStats: stats });
      toast.success('Outcomes section updated successfully!');
    } catch (err: unknown) {
      console.error('Save settings error', err);
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset the outcomes section to default content? Unsaved changes will be lost.')) {
      setStats(DEFAULT_LANDING_STATS);
      toast.success('Reset to default template.');
    }
  };

  const handleFileUpload = async (file: File, key: string, onDone: (url: string) => void) => {
    if (!file) return;
    setUploadingKey(key);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axiosInstance.post('/settings/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.url) {
        onDone(res.data.url);
        toast.success('Image uploaded! Click "Save Changes" to publish your update.');
      }
    } catch (err: unknown) {
      console.error('Image upload failed', err);
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || 'Failed to upload image');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleMetricChange = (index: number, field: keyof LandingStatsMetric, val: string) => {
    setStats((prev) => {
      const metrics = [...prev.metrics];
      metrics[index] = { ...metrics[index], [field]: val };
      return { ...prev, metrics };
    });
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading outcomes settings...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <PageMeta
        title="Outcomes & Stats | Admin Dashboard"
        description="Manage the Outcomes families can feel stats section on the homepage."
      />
      <PageBreadcrumb pageTitle="Outcomes & Stats" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-white p-5 shadow-sm border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-amber-500" />
            Outcomes & Stats
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Section title, supporting image, and four metric cards shown on the landing page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Section Header</h2>
          <div className="grid gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={stats.title}
                onChange={(e) => setStats({ ...stats, title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                Subtitle
              </label>
              <textarea
                rows={2}
                value={stats.subtitle}
                onChange={(e) => setStats({ ...stats, subtitle: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Feature Image</h2>
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
              {stats.image ? (
                <img
                  src={resolveImgPreview(stats.image)}
                  alt={stats.imageAlt}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Image URL or path
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={stats.image}
                    onChange={(e) => setStats({ ...stats, image: e.target.value })}
                    placeholder="/meridian/stats_community.jpg"
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {uploadingKey === 'statsImage' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, 'statsImage', (url) => setStats((prev) => ({ ...prev, image: url })));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Image alt text
                </label>
                <input
                  type="text"
                  value={stats.imageAlt}
                  onChange={(e) => setStats({ ...stats, imageAlt: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Metric Cards (2×2 grid)</h2>
          <div className="space-y-5">
            {METRIC_INDICES.map((i) => (
              <div
                key={i}
                className="grid gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0 dark:border-gray-800 md:grid-cols-12 md:items-end"
              >
                <p className="text-sm font-semibold text-gray-500 md:col-span-12">Card {i + 1}</p>
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Value</label>
                  <input
                    type="text"
                    value={stats.metrics[i].value}
                    onChange={(e) => handleMetricChange(i, 'value', e.target.value)}
                    placeholder="2,500+"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Label</label>
                  <input
                    type="text"
                    value={stats.metrics[i].label}
                    onChange={(e) => handleMetricChange(i, 'label', e.target.value)}
                    placeholder="Active learners"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Card color</label>
                  <select
                    value={stats.metrics[i].tone}
                    onChange={(e) => handleMetricChange(i, 'tone', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    {LANDING_STATS_TONE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Outcomes Section'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingOutcomesSettings;