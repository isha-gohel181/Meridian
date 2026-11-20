import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosConfig';
import toast from 'react-hot-toast';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { AlignLeft, Save, RotateCcw, Upload, Plus, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import {
  DEFAULT_LANDING_STATEMENT,
  LandingStatementConfig,
  StatementCard,
  resolveImgPreview,
} from './landingSectionConfig';

const LandingStatementSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [statement, setStatement] = useState<LandingStatementConfig>(DEFAULT_LANDING_STATEMENT);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/settings/all');
      const settings = res.data?.settings || {};
      if (settings.landingStatement && typeof settings.landingStatement === 'object') {
        const raw = settings.landingStatement as Partial<LandingStatementConfig>;
        setStatement({
          items:
            Array.isArray(raw.items) && raw.items.length > 0
              ? raw.items.map((item, idx) => ({
                  index: item?.index ?? String(idx + 1).padStart(2, '0'),
                  before: item?.before ?? '',
                  accent: item?.accent ?? '',
                  after: item?.after ?? '',
                  image: item?.image ?? DEFAULT_LANDING_STATEMENT.items[idx]?.image ?? '/meridian/statement-01.jpg',
                  imageAlt: item?.imageAlt ?? '',
                }))
              : DEFAULT_LANDING_STATEMENT.items,
        });
      }
    } catch (err) {
      console.error('Failed to load statement settings', err);
      toast.error('Failed to load statement settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put('/settings', { landingStatement: statement });
      toast.success('Statement section updated successfully!');
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
    if (window.confirm('Reset the statement section to default content? Unsaved changes will be lost.')) {
      setStatement(DEFAULT_LANDING_STATEMENT);
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

  const handleItemChange = (index: number, field: keyof StatementCard, val: string) => {
    setStatement((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, items };
    });
  };

  const handleAddItem = () => {
    const nextIndex = String(statement.items.length + 1).padStart(2, '0');
    setStatement((prev) => ({
      items: [
        ...prev.items,
        {
          index: nextIndex,
          before: 'Your headline begins',
          accent: 'here',
          after: '—complete the thought after the accent word.',
          image: '/meridian/statement-01.jpg',
          imageAlt: 'Statement section image',
        },
      ],
    }));
    toast.success('Added new statement card');
  };

  const handleRemoveItem = (index: number) => {
    if (statement.items.length <= 1) {
      toast.error('Must have at least one card.');
      return;
    }
    setStatement((prev) => ({
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading statement settings...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <PageMeta
        title="Statement Cards | Admin Dashboard"
        description="Manage the scroll statement cards on the homepage."
      />
      <PageBreadcrumb pageTitle="Statement Cards" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-white p-5 shadow-sm border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlignLeft className="h-5 w-5 text-amber-500" />
            Statement Cards
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Scroll-stacked cards with index, accent copy, and images ({statement.items.length} cards).
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

      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-600 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
          >
            <Plus className="h-4 w-4" />
            Add Card
          </button>
        </div>

        {statement.items.map((item, idx) => {
          const uploadKey = `statement-${idx}`;
          return (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Card {item.index || String(idx + 1).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-gray-400 hover:text-red-600 transition p-1"
                  title="Remove Card"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-5 md:grid-cols-12">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Index</label>
                  <input
                    type="text"
                    value={item.index}
                    onChange={(e) => handleItemChange(idx, 'index', e.target.value)}
                    placeholder="01"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Before accent</label>
                  <input
                    type="text"
                    value={item.before}
                    onChange={(e) => handleItemChange(idx, 'before', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Accent (gold)</label>
                  <input
                    type="text"
                    value={item.accent}
                    onChange={(e) => handleItemChange(idx, 'accent', e.target.value)}
                    className="w-full rounded-lg border border-amber-300 bg-amber-50/50 px-3 py-2 text-sm font-medium text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-amber-800 dark:bg-amber-900/20 dark:text-white"
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">After accent</label>
                  <input
                    type="text"
                    value={item.after}
                    onChange={(e) => handleItemChange(idx, 'after', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="md:col-span-9">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Image path or URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={item.image}
                      onChange={(e) => handleItemChange(idx, 'image', e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {uploadingKey === uploadKey ? (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, uploadKey, (url) => handleItemChange(idx, 'image', url));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="md:col-span-3 flex items-end justify-center">
                  <div className="relative aspect-[4/3] w-28 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                    {item.image ? (
                      <img
                        src={resolveImgPreview(item.image)}
                        alt={item.imageAlt}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-12">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Image alt text</label>
                  <input
                    type="text"
                    value={item.imageAlt}
                    onChange={(e) => handleItemChange(idx, 'imageAlt', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Statement Section'}
        </button>
      </div>
    </div>
  );
};

export default LandingStatementSettings;