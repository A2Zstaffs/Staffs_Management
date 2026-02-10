'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import TextareaField from '@/components/TextareaField';
import Toast from '@/components/Toast';
import { kamAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function KAMPostJobPage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params.id;

    const [client, setClient] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        fetchClientDetails();
    }, [clientId]);

    const fetchClientDetails = async () => {
        try {
            const response = await kamAPI.getClientById(clientId);
            if (response.success) {
                setClient(response.data.client);
            }
        } catch (error) {
            console.error('Failed to fetch client details:', error);
            showToast('Failed to load client details', 'error');
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ isVisible: true, message, type });
    };

    const hideToast = () => {
        setToast({ ...toast, isVisible: false });
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const locations = data.locations
                ? data.locations.split(',').map((loc) => loc.trim()).filter(Boolean)
                : [];

            const skills = data.skills
                ? data.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
                : [];

            const jobData = {
                job_title: data.job_title || '',
                company_name: data.company_name || '',
                locations,
                skills,
                salary_min: data.salary_min ? parseFloat(data.salary_min) : 0,
                salary_max: data.salary_max ? parseFloat(data.salary_max) : 0,
                salary_type: data.salary_type || 'per_annum',
                experience_min: data.experience_min ? parseInt(data.experience_min) : 0,
                experience_max: data.experience_max ? parseInt(data.experience_max) : 0,
                notice_period: data.notice_period ? parseInt(data.notice_period) : 0,
                num_positions: data.num_positions ? parseInt(data.num_positions) : 1,
                applications_required: data.applications_required ? parseInt(data.applications_required) : 1,
                commission_percent: data.commission_percent ? parseFloat(data.commission_percent) : 0,
                commission_amount_min: data.commission_amount_min ? parseFloat(data.commission_amount_min) : 0,
                commission_amount_max: data.commission_amount_max ? parseFloat(data.commission_amount_max) : 0,
                commission_payment_terms: data.commission_payment_terms || '',
                r1_bonus_amount: data.r1_bonus_amount ? parseFloat(data.r1_bonus_amount) : 0,
                r1_bonus_payment_terms: data.r1_bonus_payment_terms || '',
                sourcing_status: data.sourcing_status || 'Priority',
                description: data.description || '',
                requirements: data.requirements || '',
            };

            if (data.in_process_applications) {
                jobData.in_process_applications = parseInt(data.in_process_applications);
            }
            if (data.relevant_level) {
                jobData.relevant_level = parseInt(data.relevant_level);
            }

            const response = await kamAPI.createJobForClient(clientId, jobData);

            if (response.success) {
                showToast(response.message || 'Job posted successfully on behalf of client!', 'success');
                reset();
                setTimeout(() => {
                    router.push(`/kam/clients/${clientId}`);
                }, 1500);
            } else {
                showToast(response.error || 'Failed to post job. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error posting job:', error);
            showToast(error.message || 'An error occurred. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!client) {
        return (
            <LoadingSpinner variant="logo" size="lg" message="Loading client details..." fullScreen />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
            />

            {/* Hero Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <button
                        onClick={() => router.push(`/kam/clients/${clientId}`)}
                        className="mb-4 flex items-center text-white/90 hover:text-white transition-colors group"
                    >
                        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Client Details
                    </button>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-1">Post Job for {client.fullName}</h1>
                            <p className="text-blue-100">Create a new job posting on behalf of this client</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Company Name"
                                    name="company_name"
                                    register={register}
                                    errors={errors}
                                    placeholder={client.company || "Enter company name"}
                                    defaultValue={client.company || ''}
                                    required
                                    readOnly={!!client.company}
                                    className={client.company ? "bg-gray-100 cursor-not-allowed" : ""}
                                />
                                <InputField
                                    label="Job Title"
                                    name="job_title"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., Senior Software Engineer"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="jobType"
                                        {...register('jobType', { required: 'Job type is required' })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="">Select job type</option>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                    {errors.jobType && (
                                        <p className="mt-1 text-sm text-red-600">{errors.jobType.message}</p>
                                    )}
                                </div>
                                <InputField
                                    label="Number of Openings"
                                    name="num_positions"
                                    type="number"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., 5"
                                    required
                                />
                            </div>

                            <InputField
                                label="Locations (comma separated)"
                                name="locations"
                                register={register}
                                errors={errors}
                                placeholder="e.g., New York, San Francisco, Remote"
                                required
                            />
                        </div>
                    </div>

                    {/* Salary & Experience */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-lg font-bold text-gray-900">Salary & Experience</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InputField
                                    label="Minimum Salary (₹)"
                                    name="salary_min"
                                    type="number"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., 100000"
                                    required
                                />
                                <InputField
                                    label="Maximum Salary (₹)"
                                    name="salary_max"
                                    type="number"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., 150000"
                                    required
                                />
                                <div>
                                    <label htmlFor="salary_type" className="block text-sm font-medium text-gray-700 mb-2">
                                        Salary Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="salary_type"
                                        {...register('salary_type', { required: 'Salary type is required' })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="per_annum">Per Annum (Yearly)</option>
                                        <option value="per_month">Per Month</option>
                                    </select>
                                    {errors.salary_type && (
                                        <p className="mt-1 text-sm text-red-600">{errors.salary_type.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Minimum Experience (years)"
                                    name="experience_min"
                                    type="number"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., 3"
                                    required
                                />
                                <InputField
                                    label="Maximum Experience (years)"
                                    name="experience_max"
                                    type="number"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., 7"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h2 className="text-lg font-bold text-gray-900">Job Details</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Notice Period (days)"
                                    name="notice_period"
                                    type="number"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., 30"
                                    required
                                />
                                <InputField
                                    label="Applications Required"
                                    name="applications_required"
                                    type="number"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., 10"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Relevant Level"
                                    name="relevant_level"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., Mid-level, Senior"
                                />
                                <InputField
                                    label="In Process Applications"
                                    name="in_process_applications"
                                    type="number"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., 5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Commission & Bonus */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-lg font-bold text-gray-900">Commission & Bonus</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InputField
                                    label="Commission %"
                                    name="commission_percent"
                                    type="number"
                                    step="0.01"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., 5.5"
                                    required
                                />
                                <InputField
                                    label="Min Commission (₹)"
                                    name="commission_amount_min"
                                    type="number"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., 1000"
                                    required
                                />
                                <InputField
                                    label="Max Commission (₹)"
                                    name="commission_amount_max"
                                    type="number"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., 5000"
                                    required
                                />
                            </div>

                            <InputField
                                label="Commission Payment Terms"
                                name="commission_payment_terms"
                                register={register}
                                errors={errors}
                                placeholder="e.g., On joining, After 3 months"
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="R1 Bonus Amount (₹)"
                                    name="r1_bonus_amount"
                                    type="number"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., 2000"
                                />
                                <InputField
                                    label="R1 Bonus Payment Terms"
                                    name="r1_bonus_payment_terms"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g., On joining, After 6 months"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sourcing Status */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-cyan-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <h2 className="text-lg font-bold text-gray-900">Sourcing Status</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div>
                                <label htmlFor="sourcing_status" className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority Level
                                </label>
                                <select
                                    id="sourcing_status"
                                    {...register('sourcing_status')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="Priority">🔥 Priority</option>
                                    <option value="Normal">⚡ Normal</option>
                                    <option value="Low">💤 Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Description & Requirements */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-rose-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h2 className="text-lg font-bold text-gray-900">Job Description & Requirements</h2>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <TextareaField
                                label="Job Description"
                                name="description"
                                register={register}
                                errors={errors}
                                placeholder="Enter detailed job description..."
                                rows={6}
                                required
                            />

                            <TextareaField
                                label="Requirements"
                                name="requirements"
                                register={register}
                                errors={errors}
                                placeholder="Enter job requirements..."
                                rows={6}
                            />

                            <InputField
                                label="Skills (comma separated)"
                                name="skills"
                                register={register}
                                errors={errors}
                                placeholder="e.g., JavaScript, React, Node.js, Python"
                            />
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end space-x-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <button
                            type="button"
                            onClick={() => router.push(`/kam/clients/${clientId}`)}
                            className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Posting Job...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Post Job for Client
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
