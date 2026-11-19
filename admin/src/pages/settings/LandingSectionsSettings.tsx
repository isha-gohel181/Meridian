import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosConfig';
import toast from 'react-hot-toast';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import {
  Sparkles,
  Layers,
  Save,
  RotateCcw,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

export interface HeroConfig {
  title: string;
  subline: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  badgeText: string;
  bgImage: string;
}

export interface WhyChooseItem {
  number: string;
  title: string;
  description: string;
  image: string;
}

export interface WhyChooseConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: WhyChooseItem[];
}

const DEFAULT_HERO: HeroConfig = {
  title: 'Empowering Minds. Inspiring Excellence.',
  subline: 'Comprehensive learning programs designed to build strong foundations, deep clarity, and lasting habits.',
  primaryCtaText: 'Browse Programs',
  primaryCtaLink: '/courses',
  secondaryCtaText: 'Talk to an Advisor',
  secondaryCtaLink: 'https://wa.me/919999999999',
  badgeText: 'MERIDIAN GROUP OF EDUCATION',
  bgImage: '/meridian/hero_bg_1.png',
};

const DEFAULT_WHY_CHOOSE: WhyChooseConfig = {
  eyebrow: 'WHY MERIDIAN',
  title: 'A structured, calm path to real academic mastery.',
  subtitle: 'We replaced frantic cramming with predictable routines, expert mentorship, and measured confidence.',
  items: [
    {
      number: '01',
      title: 'Predictable weekly rhythm',
      description: 'Topic goals, guided problem-solving, and scheduled checkpoints so students never guess what comes next.',
      image: '/meridian/diary/cohort.jpg',
    },
    {
      number: '02',
      title: 'Faculty who teach the "why"',
      description: 'Mentors who break complex questions down into first principles, giving learners tools that outlast the exam.',
      image: '/meridian/diary/workshop.jpg',
    },
    {
      number: '03',
      title: 'Signal over noise',
      description: 'Curated problems, targeted homework, and focused revision sheets instead of overwhelming question banks.',
      image: '/meridian/statement-01.jpg',
    },
    {
      number: '04',
      title: 'Peer cohort momentum',
      description: 'Small groups where serious learners compare solutions, share notes, and keep each other accountable.',
      image: '/meridian/statement-02.jpg',
    },
    {
      number: '05',
      title: 'Transparent parent updates',
      description: 'Objective data on attendance, quiz trends, and concept gaps—so support starts before confidence slips.',
      image: '/meridian/stats_community.jpg',
    },
  ],
};

const resolveImgPreview = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = (import.meta.env.VITE_IMAGE_URL || import.meta.env.VITE_BASE_URL || '').replace(/\/+$/, '');
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    const clean = url.startsWith('/') ? url : `/${url}`;
    return `${base}${clean}`;
  }
  return url;
};

const LandingSectionsSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'whyChoose'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const [hero, setHero] = useState<HeroConfig>(DEFAULT_HERO);
  const [whyChoose, setWhyChoose] = useState<WhyChooseConfig>(DEFAULT_WHY_CHOOSE);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/settings/all');
      const settings = res.data?.settings || {};

      if (settings.landingHero && typeof settings.landingHero === 'object') {
        setHero({ ...DEFAULT_HERO, ...settings.landingHero });
      }
      if (settings.landingWhyChoose && typeof settings.landingWhyChoose === 'object') {
        const fetchedWhy = settings.landingWhyChoose;
        setWhyChoose({
          eyebrow: fetchedWhy.eyebrow || DEFAULT_WHY_CHOOSE.eyebrow,
          title: fetchedWhy.title || DEFAULT_WHY_CHOOSE.title,
          subtitle: fetchedWhy.subtitle || DEFAULT_WHY_CHOOSE.subtitle,
          items: Array.isArray(fetchedWhy.items) && fetchedWhy.items.length > 0
            ? fetchedWhy.items
            : DEFAULT_WHY_CHOOSE.items,
        });
      }
    } catch (err) {
      console.error('Failed to load landing settings', err);
      toast.error('Failed to load landing settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put('/settings', {
        landingHero: hero,
        landingWhyChoose: whyChoose,
      });
      toast.success('Landing page settings updated successfully!');
    } catch (err: any) {
      console.error('Save settings error', err);
      toast.error(err?.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset this section to default content? Unsaved changes will be lost.')) {
      if (activeTab === 'hero') {
        setHero(DEFAULT_HERO);
      } else {
        setWhyChoose(DEFAULT_WHY_CHOOSE);
      }
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
    } catch (err: any) {
      console.error('Image upload failed', err);
      toast.error(err?.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingKey(null);
    }
  };

  // Why choose items helpers
  const handleItemChange = (index: number, field: keyof WhyChooseItem, val: string) => {
    setWhyChoose((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, items: updated };
    });
  };

  const handleAddItem = () => {
    const nextNum = String(whyChoose.items.length + 1).padStart(2, '0');
    setWhyChoose((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          number: nextNum,
          title: 'New Key Advantage',
          description: 'Detailed explanation of why this benefit gives students a meaningful edge.',
          image: '/meridian/diary/cohort.jpg',
        },
      ],
    }));
    toast.success('Added new advantage card');
  };

  const handleRemoveItem = (index: number) => {
    if (whyChoose.items.length <= 1) {
      toast.error('Must have at least one card.');
      return;
    }
    setWhyChoose((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading landing settings...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <PageMeta
        title="Landing Page Settings | Admin Dashboard"
        description="Manage the Hero section and Why Choose Meridian section on the main website."
      />
      <PageBreadcrumb pageTitle="Landing Page Settings" />

      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-white p-5 shadow-sm border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Landing Page Section Editor
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Customize the dynamic headlines, descriptions, actions, and media for your homepage.
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

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-semibold transition ${
            activeTab === 'hero'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Hero Portal Section
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('whyChoose')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-semibold transition ${
            activeTab === 'whyChoose'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <Layers className="h-4 w-4" />
          Why Choose Meridian ({whyChoose.items.length} cards)
        </button>
      </div>

      {/* TAB 1: HERO SECTION */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Headlines & Messaging
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={hero.title}
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                  placeholder="e.g. Empowering Minds. Inspiring Excellence."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Tip: Use a period (e.g. &ldquo;. &rdquo;) to create a clean two-line split on desktop.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Subheading / Description
                </label>
                <textarea
                  rows={3}
                  value={hero.subline}
                  onChange={(e) => setHero({ ...hero, subline: e.target.value })}
                  placeholder="Detailed description of the institution and programs..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Call-to-Action Buttons
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Primary Button Label
                </label>
                <input
                  type="text"
                  value={hero.primaryCtaText}
                  onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })}
                  placeholder="e.g. Browse Programs"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Primary Button Link
                </label>
                <input
                  type="text"
                  value={hero.primaryCtaLink}
                  onChange={(e) => setHero({ ...hero, primaryCtaLink: e.target.value })}
                  placeholder="e.g. /courses"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Secondary Button Label
                </label>
                <input
                  type="text"
                  value={hero.secondaryCtaText}
                  onChange={(e) => setHero({ ...hero, secondaryCtaText: e.target.value })}
                  placeholder="e.g. Talk to an Advisor"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Secondary Button Link (WhatsApp or URL)
                </label>
                <input
                  type="text"
                  value={hero.secondaryCtaLink}
                  onChange={(e) => setHero({ ...hero, secondaryCtaLink: e.target.value })}
                  placeholder="e.g. https://wa.me/919999999999"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Background Image */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Hero Background Photo
            </h2>

            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                {hero.bgImage ? (
                  <img
                    src={resolveImgPreview(hero.bgImage)}
                    alt="Hero Background Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Upload Background Image or Enter URL
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={hero.bgImage}
                    onChange={(e) => setHero({ ...hero, bgImage: e.target.value })}
                    placeholder="/meridian/hero_bg_1.png or https://..."
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />

                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {uploadingKey === 'heroBg' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, 'heroBg', (url) => setHero((prev) => ({ ...prev, bgImage: url })));
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended size: 1920x1080px (PNG, JPG, or WebP). Default is <code className="text-xs">/meridian/hero_bg_1.png</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Save Hero */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Hero Section'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: WHY CHOOSE MERIDIAN */}
      {activeTab === 'whyChoose' && (
        <div className="space-y-6">
          {/* Section Header */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Section Header & Description
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={whyChoose.eyebrow}
                  onChange={(e) => setWhyChoose({ ...whyChoose, eyebrow: e.target.value })}
                  placeholder="e.g. WHY MERIDIAN"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={whyChoose.title}
                  onChange={(e) => setWhyChoose({ ...whyChoose, title: e.target.value })}
                  placeholder="e.g. A structured, calm path to real academic mastery."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Subtitle Description
                </label>
                <textarea
                  rows={2}
                  value={whyChoose.subtitle}
                  onChange={(e) => setWhyChoose({ ...whyChoose, subtitle: e.target.value })}
                  placeholder="Descriptive overview of philosophy..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Advantage Cards ({whyChoose.items.length})
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Each card appears as an interactive row with an accompanying preview photo on hover/focus.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-600 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
              >
                <Plus className="h-4 w-4" />
                Add Card
              </button>
            </div>

            <div className="space-y-4">
              {whyChoose.items.map((item, idx) => {
                const uploadKey = `card-${idx}`;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          {item.number || String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {item.title || `Advantage ${idx + 1}`}
                        </span>
                      </div>

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
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                          Card No.
                        </label>
                        <input
                          type="text"
                          value={item.number}
                          onChange={(e) => handleItemChange(idx, 'number', e.target.value)}
                          placeholder="01"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>

                      <div className="md:col-span-5">
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                          Card Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                          placeholder="e.g. Predictable weekly rhythm"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>

                      <div className="md:col-span-5">
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                          Card Photo (Path or Upload)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.image}
                            onChange={(e) => handleItemChange(idx, 'image', e.target.value)}
                            placeholder="/meridian/... or https://..."
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

                      <div className="md:col-span-9">
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                          Card Description
                        </label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Brief description of this benefit..."
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>

                      <div className="md:col-span-3 flex items-center justify-center">
                        <div className="relative aspect-[4/3] w-28 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
                          {item.image ? (
                            <img
                              src={resolveImgPreview(item.image)}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Save Why Choose */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Why Choose Section'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingSectionsSettings;
