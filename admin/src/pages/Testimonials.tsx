import { getImageBase } from "../utils/apiBase";
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchTestimonials, addTestimonial, resetTestimonialState, deleteTestimonial, updateTestimonial } from '../store/slices/testimonial';
import { Star, Plus, X, MessageCircle, User, Briefcase, Loader2, AlertCircle, CheckCircle, Search, Trash2, Edit, Image as ImageIcon, Save, RotateCcw } from 'lucide-react';
import axiosInstance from '../services/axiosConfig';
import toast from 'react-hot-toast';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import {
  DEFAULT_LANDING_TESTIMONIALS,
  LandingTestimonialsConfig,
} from './settings/landingSectionConfig';

interface TestimonialData {
    _id?: string;
    name: string;
    role: string;
    company?: string;
    message: string;
    rating: number;
    image?: string;
    status?: string;
    showOnLanding?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

const emptyFormData: TestimonialData = {
    name: '',
    role: '',
    company: '',
    message: '',
    rating: 5,
    showOnLanding: true,
};

// Confirmation Dialog Component
const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// Success/Error Popup Component
const Popup = ({
    isVisible,
    onClose,
    message,
    type = "success",
}: {
    isVisible: boolean;
    onClose: () => void;
    message: string;
    type?: "success" | "error";
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-[200]">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
                <div className="text-center">
                    <div
                        className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${type === "success" ? "bg-green-100" : "bg-red-100"
                            }`}
                    >
                        {type === "success" ? (
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        ) : (
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        )}
                    </div>
                    <h3
                        className={`text-xl font-semibold mb-2 ${type === "success" ? "text-green-800" : "text-red-800"
                            }`}
                    >
                        {type === "success" ? "Success!" : "Error!"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                    <button
                        onClick={onClose}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${type === "success"
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const TestimonialsPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string | null }>({
        show: false,
        id: null
    });

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editId, setEditId] = useState<string | null>(null);

    const [popup, setPopup] = useState({
        isVisible: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });

    const [formData, setFormData] = useState<TestimonialData>({ ...emptyFormData });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [landingCopy, setLandingCopy] = useState<LandingTestimonialsConfig>(DEFAULT_LANDING_TESTIMONIALS);
    const [savingLandingCopy, setSavingLandingCopy] = useState(false);
    const [landingCopyLoaded, setLandingCopyLoaded] = useState(false);

    const resetForm = () => {
        setFormData({ ...emptyFormData });
        setImageFile(null);
        setImagePreview(null);
        setEditId(null);
        setIsEditMode(false);
    };

    const BASE_URL = getImageBase();
    const getMediaUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        // Trim trailing slash from BASE_URL and leading slash from path to avoid issues
        const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
        const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
        return `${baseUrl}/${normalizedPath}`;
    };

    // Fetch all testimonials
    const fetchTestimonialsData = useCallback(async (status: string = 'all') => {
        const token = localStorage.getItem('token') || '';
        setLoading(true);
        try {
            const result = await dispatch(
                fetchTestimonials({
                    token,
                    status: status !== 'all' ? status : undefined,
                })
            ).unwrap();
            setTestimonials(result);
            setLoading(false);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to fetch testimonials';
            setError(errorMsg);
            setLoading(false);
        }
    }, [dispatch]);

    const fetchLandingSectionCopy = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/settings/all');
            const settings = res.data?.settings || {};
            if (settings.landingTestimonials && typeof settings.landingTestimonials === 'object') {
                const raw = settings.landingTestimonials as Partial<LandingTestimonialsConfig>;
                setLandingCopy({
                    eyebrow: raw.eyebrow ?? DEFAULT_LANDING_TESTIMONIALS.eyebrow,
                    title: raw.title ?? DEFAULT_LANDING_TESTIMONIALS.title,
                    subtitle: raw.subtitle ?? DEFAULT_LANDING_TESTIMONIALS.subtitle,
                });
            }
        } catch (err) {
            console.error('Failed to load landing testimonial headings', err);
        } finally {
            setLandingCopyLoaded(true);
        }
    }, []);

    const handleSaveLandingCopy = async () => {
        setSavingLandingCopy(true);
        try {
            await axiosInstance.put('/settings', { landingTestimonials: landingCopy });
            toast.success('Landing page section headings saved!');
        } catch (err: unknown) {
            const message =
                err && typeof err === 'object' && 'response' in err
                    ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                    : undefined;
            toast.error(message || 'Failed to save section headings');
        } finally {
            setSavingLandingCopy(false);
        }
    };

    const handleResetLandingCopy = () => {
        if (window.confirm('Reset home page headings to defaults?')) {
            setLandingCopy(DEFAULT_LANDING_TESTIMONIALS);
            toast.success('Headings reset (click Save to publish).');
        }
    };

    useEffect(() => {
        fetchTestimonialsData();
        fetchLandingSectionCopy();

        return () => {
            dispatch(resetTestimonialState());
        };
    }, [fetchTestimonialsData, fetchLandingSectionCopy, dispatch]);

    // Filter testimonials based on search term and status
    const filteredTestimonials = testimonials.filter(testimonial => {
        const matchesSearch =
            testimonial.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            testimonial.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            testimonial.message?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || testimonial.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files?.[0]) {
            const file = files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRatingChange = (newRating: number) => {
        setFormData({
            ...formData,
            rating: newRating,
        });
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        fetchTestimonialsData(status);
    };

    const handleEditClick = (testimonial: TestimonialData) => {
        if (!testimonial._id) return;

        setFormData({
            name: testimonial.name,
            role: testimonial.role,
            company: testimonial.company || '',
            message: testimonial.message,
            rating: testimonial.rating,
            status: testimonial.status,
            showOnLanding: testimonial.showOnLanding !== false,
            image: testimonial.image,
        });

        setImagePreview(testimonial.image ? getMediaUrl(testimonial.image) : null);
        setImageFile(null);

        setEditId(testimonial._id);
        setIsEditMode(true);
        setShowAddForm(true);
    };

    // No need for a separate handleUpdate function as we're handling it in the handleSubmit

    // Handle delete testimonial
    const handleDelete = async (id: string) => {
        if (!id) return;

        const token = localStorage.getItem('token') || '';
        setLoading(true);

        try {
            await dispatch(
                deleteTestimonial({
                    testimonialId: id,
                    token
                })
            ).unwrap();

            // Refresh testimonials list
            await fetchTestimonialsData(statusFilter);

            // Close delete confirmation
            setDeleteConfirm({ show: false, id: null });

            // Show success message
            setPopup({
                isVisible: true,
                message: 'Testimonial deleted successfully!',
                type: 'success'
            });
        } catch (err) {
            console.error('Failed to delete testimonial:', err);

            setPopup({
                isVisible: true,
                message: err instanceof Error ? err.message : 'Failed to delete testimonial',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setPopup({
            isVisible: false,
            message: '',
            type: 'success'
        });

        const hasPhoto = Boolean(imageFile || formData.image);
        if (!hasPhoto) {
            setPopup({
                isVisible: true,
                message: 'Please upload a photo — it appears in the home page gallery.',
                type: 'error',
            });
            return;
        }

        const token = localStorage.getItem('token') || '';
        setLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('role', formData.role);
        formDataToSend.append('message', formData.message);
        formDataToSend.append('rating', String(formData.rating));
        if (formData.company) formDataToSend.append('company', formData.company);
        formDataToSend.append('showOnLanding', String(formData.showOnLanding !== false));
        if (imageFile) formDataToSend.append('image', imageFile);

        // If in edit mode, call handleUpdate instead
        if (isEditMode && editId) {
            if (formData.status) formDataToSend.append('status', formData.status);
            try {
                await dispatch(
                    updateTestimonial({
                        testimonialId: editId,
                        data: formDataToSend,
                        token
                    })
                ).unwrap();

                // Refresh testimonials list
                await fetchTestimonialsData(statusFilter);

                resetForm();
                setShowAddForm(false);

                // Show success message
                setPopup({
                    isVisible: true,
                    message: 'Testimonial updated successfully!',
                    type: 'success'
                });
            } catch (err) {
                console.error('Failed to update testimonial:', err);

                setPopup({
                    isVisible: true,
                    message: err instanceof Error ? err.message : 'Failed to update testimonial',
                    type: 'error'
                });
            } finally {
                setLoading(false);
            }
            return;
        }

        // Add new testimonial
        try {
            await dispatch(
                addTestimonial({
                    testimonial: formDataToSend,
                    token,
                })
            ).unwrap();

            // Refresh testimonials list
            await fetchTestimonialsData(statusFilter);

            resetForm();
            setShowAddForm(false);

            // Show success message
            setPopup({
                isVisible: true,
                message: 'Testimonial added successfully!',
                type: 'success'
            });

        } catch (err) {
            console.error('Failed to add testimonial:', err);

            setPopup({
                isVisible: true,
                message: err instanceof Error ? err.message : 'Failed to add testimonial',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange?: (rating: number) => void }) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <button
                    key={i}
                    type="button"
                    onClick={() => onRatingChange && onRatingChange(i)}
                    className={`${i <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                        } focus:outline-none`}
                >
                    <Star className="w-5 h-5 fill-current" />
                </button>
            );
        }
        return <div className="flex space-x-1">{stars}</div>;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <PageMeta title="Landing — Testimonials" />
            <PageBreadcrumb pageTitle="Testimonials" />

            {/* Landing page section headings */}
            {landingCopyLoaded && (
                <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-500">
                        Home page voices section
                    </h2>
                    <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                        Headings shown above the testimonial carousel on the public landing page.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Eyebrow</label>
                            <input
                                value={landingCopy.eyebrow}
                                onChange={(e) => setLandingCopy((p) => ({ ...p, eyebrow: e.target.value }))}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Title</label>
                            <input
                                value={landingCopy.title}
                                onChange={(e) => setLandingCopy((p) => ({ ...p, title: e.target.value }))}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Subtitle</label>
                            <textarea
                                rows={2}
                                value={landingCopy.subtitle}
                                onChange={(e) => setLandingCopy((p) => ({ ...p, subtitle: e.target.value }))}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleResetLandingCopy}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold uppercase text-gray-700 dark:border-gray-600 dark:text-gray-200"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset headings
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveLandingCopy}
                            disabled={savingLandingCopy}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold uppercase text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {savingLandingCopy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save headings
                        </button>
                    </div>
                </section>
            )}

            {/* Success/Error Popup */}
            <Popup
                isVisible={popup.isVisible}
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup({ ...popup, isVisible: false })}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm.show}
                onClose={() => setDeleteConfirm({ show: false, id: null })}
                onConfirm={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
                title="Delete Testimonial"
                message="Are you sure you want to delete this testimonial? This action cannot be undone."
            />

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Testimonials list
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xl">
                        Add, approve, and choose which quotes appear on the home page carousel (&quot;Show on landing page&quot;).
                    </p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowAddForm(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Testimonial
                </button>
            </div>

            {/* Filters & Search */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Search testimonials..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        className={`px-3 py-2 text-sm rounded-md ${statusFilter === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                        onClick={() => handleStatusFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`px-3 py-2 text-sm rounded-md ${statusFilter === 'pending'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                        onClick={() => handleStatusFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`px-3 py-2 text-sm rounded-md ${statusFilter === 'approved'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                        onClick={() => handleStatusFilter('approved')}
                    >
                        Approved
                    </button>
                    <button
                        className={`px-3 py-2 text-sm rounded-md ${statusFilter === 'rejected'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                        onClick={() => handleStatusFilter('rejected')}
                    >
                        Rejected
                    </button>
                </div>
            </div>



            {/* Error message */}
            {error && (
                <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
                    {error}
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            )}

            {/* Empty state */}
            {!loading && filteredTestimonials.length === 0 && (
                <div className="p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                    <p className="text-gray-600 dark:text-gray-400">
                        {searchTerm ? 'No testimonials match your search.' : 'No testimonials found.'}
                    </p>
                </div>
            )}

            {/* Testimonials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTestimonials.map((testimonial) => (
                    <div
                        key={testimonial._id || `testimonial-${Math.random().toString(36).substr(2, 9)}`}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <StarRating rating={testimonial.rating || 0} />
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${testimonial.status === 'approved'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                    : testimonial.status === 'rejected'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                    }`}>
                                    {testimonial.status || 'Pending'}
                                </span>
                                {testimonial.status === 'approved' && testimonial.showOnLanding !== false ? (
                                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200">
                                        On home
                                    </span>
                                ) : null}
                                <div className="flex space-x-1">
                                    {/* Edit button will be implemented later */}
                                    <button
                                        onClick={() => handleEditClick(testimonial)}
                                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        title="Edit testimonial"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    {testimonial._id && (
                                        <button
                                            onClick={() => setDeleteConfirm({ show: true, id: testimonial._id || null })}
                                            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                            title="Delete testimonial"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.message}"</p>

                        {testimonial.image && (
                            <div className="mb-4">
                                <img
                                    src={getMediaUrl(testimonial.image)}
                                    alt={testimonial.name}
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                />
                            </div>
                        )}

                        <div className="flex items-center">
                            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2 mr-3">
                                {testimonial.image ? (
                                    <img
                                        src={getMediaUrl(testimonial.image)}
                                        alt={testimonial.name}
                                        className="w-5 h-5 rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{testimonial.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                    <Briefcase className="w-3 h-3 mr-1" />
                                    {testimonial.role}
                                </p>
                            </div>
                        </div>
                        {testimonial.createdAt && (
                            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                Added on: {new Date(testimonial.createdAt).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Testimonial Modal */}
            {showAddForm && (
                <div
                    className="fixed inset-0 bg-white/50 backdrop-blur-md flex items-center justify-center z-50 p-4 pt-20"
                    onClick={() => {
                        setShowAddForm(false);
                        resetForm();
                    }}
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {isEditMode ? 'Edit Testimonial' : 'Add Testimonial'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    resetForm();
                                }}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Photo
                                </label>
                                <div className="relative group overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors aspect-[4/3] max-h-48">
                                    {imagePreview ? (
                                        <div className="relative w-full h-full min-h-[12rem]">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    if (!isEditMode || !formData.image) {
                                                        setImagePreview(null);
                                                    } else {
                                                        setImagePreview(getMediaUrl(formData.image));
                                                    }
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition-opacity"
                                                title="Remove new upload"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full h-full min-h-[12rem] cursor-pointer">
                                            <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600 dark:text-gray-300">Upload photo</span>
                                            <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        </label>
                                    )}
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Shown in the home page photo gallery.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Full name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="e.g. Student, Parent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Location (optional)
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company || ''}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="e.g. Bengaluru — appears as Role · Location on the site"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Their quote for the home page"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Rating
                                </label>
                                <StarRating rating={formData.rating} onRatingChange={handleRatingChange} />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="showOnLanding"
                                    checked={formData.showOnLanding !== false}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Show on website home page
                                </span>
                            </label>

                            {isEditMode && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Publication status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status || 'pending'}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            {isEditMode ? (
                                                <>
                                                    <Edit className="w-4 h-4" />
                                                    Update Testimonial
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4" />
                                                    Add Testimonial
                                                </>
                                            )}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestimonialsPage;
