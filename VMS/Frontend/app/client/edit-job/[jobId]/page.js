'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import TextareaField from '@/components/TextareaField';
import Toast from '@/components/Toast';
import { getMyJobs } from '@/lib/clientApi'; // We might need a single job fetch, but for now filtering getMyJobs or adding getJob

export default function EditJobPage({ params }) {
    const router = useRouter();
    const { jobId } = params; // Get jobId from URL params
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const showToast = (message, type = 'success') => {
        setToast({ isVisible: true, message, type });
    };

    const hideToast = () => {
        setToast({ ...toast, isVisible: false });
    };

    useEffect(() => {
        loadJobDetails();
    }, [jobId]);

    const loadJobDetails = async () => {
        try {
            // Ideally fetch specific job: /api/client/jobs/:id
            // For now, reusing getMyJobs and filtering (inefficient but works with current API)
            // OR better: call the specific endpoint if we create one for GET /jobs/:id
            // Assuming user can access their own job via list
            const response = await getMyJobs();
            if (response.success) {
                const job = response.data.find(j => j._id === jobId);
                if (job) {
                    // Populate form
                    setValue('company_name', job.company_name);
                    setValue('job_title', job.job_title);
                    setValue('locations', Array.isArray(job.locations) ? job.locations.join(', ') : job.locations);
                    setValue('salary_min', job.salary_min);
                    setValue('salary_max', job.salary_max);
                    setValue('salary_type', job.salary_type || 'per_annum');
                    setValue('experience_min', job.experience_min);
                    setValue('experience_max', job.experience_max);
                    setValue('description', job.description);
                    setValue('requirements', job.requirements);
                    setValue('skills', job.skills ? job.skills.join(', ') : '');
                    setValue('jobType', job.employmentType);
                    setValue('commission_percent', job.commission_percent);
                    if (job.applicationDeadline) {
                        setValue('applicationDeadline', new Date(job.applicationDeadline).toISOString().split('T')[0]);
                    }

                    // ... populate other fields if available in response
                } else {
                    showToast('Job not found', 'error');
                }
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to load job details', 'error');
        } finally {
            setIsLoading(false);
        }
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
                ...data,
                locations,
                skills,
                salary_min: (data.salary_min !== undefined && data.salary_min !== '') ? parseFloat(data.salary_min) : null,
                salary_max: (data.salary_max !== undefined && data.salary_max !== '') ? parseFloat(data.salary_max) : null,
                salary_type: data.salary_type || 'per_annum',
                experience_min: (data.experience_min !== undefined && data.experience_min !== '') ? parseInt(data.experience_min) : null,
                experience_max: (data.experience_max !== undefined && data.experience_max !== '') ? parseInt(data.experience_max) : null,
                commission_percent: (data.commission_percent !== undefined && data.commission_percent !== '') ? parseFloat(data.commission_percent) : null,
            };

            const token = localStorage.getItem('authToken');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/client/jobs/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(jobData)
            });
            const result = await response.json();

            if (result.success) {
                showToast('Job updated successfully!', 'success');
                setTimeout(() => {
                    router.push('/client/my-jobs');
                }, 1500);
            } else {
                showToast(result.message || 'Failed to update job', 'error');
            }
        } catch (error) {
            console.error('Error updating job:', error);
            showToast('An error occurred. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center p-10 text-white">Loading job details...</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
            />

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Edit Job</h1>
                <p className="text-gray-300">Update your job posting details</p>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-xl p-8 shadow-xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white border-b border-gray-700/50 pb-2">
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Company Name"
                                name="company_name"
                                register={register}
                                errors={errors}
                                placeholder="Enter company name"
                                required
                                darkMode={true}
                            />

                            <InputField
                                label="Job Title"
                                name="job_title"
                                register={register}
                                errors={errors}
                                placeholder="e.g., Senior Software Engineer"
                                required
                                darkMode={true}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="jobType" className="block text-sm font-medium text-[#1A73FF] mb-2">
                                    Job Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="jobType"
                                    name="jobType"
                                    {...register('jobType', { required: 'Job type is required' })}
                                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-[#1A73FF] focus:border-[#1A73FF] text-white"
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
                        </div>

                        <InputField
                            label="Locations (comma separated)"
                            name="locations"
                            register={register}
                            errors={errors}
                            placeholder="e.g., New York, San Francisco"
                            required
                            darkMode={true}
                        />
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white border-b border-gray-700/50 pb-2">
                            Salary & Experience
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField
                                label="Minimum Salary"
                                name="salary_min"
                                type="number"
                                register={register}
                                errors={errors}
                                darkMode={true}
                                required
                            />
                            <InputField
                                label="Maximum Salary"
                                name="salary_max"
                                type="number"
                                register={register}
                                errors={errors}
                                darkMode={true}
                                required
                            />
                            <div>
                                <label htmlFor="salary_type" className="block text-sm font-medium text-[#1A73FF] mb-2">
                                    Salary Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="salary_type"
                                    name="salary_type"
                                    {...register('salary_type', { required: 'Salary type is required' })}
                                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-[#1A73FF] focus:border-[#1A73FF] text-white"
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
                                darkMode={true}
                                required
                            />
                            <InputField
                                label="Maximum Experience (years)"
                                name="experience_max"
                                type="number"
                                register={register}
                                errors={errors}
                                darkMode={true}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Commission (%)"
                                name="commission_percent"
                                type="number"
                                register={register}
                                errors={errors}
                                step="any"
                                required
                                darkMode={true}
                            />
                            <InputField
                                label="Application Deadline"
                                name="applicationDeadline"
                                type="date"
                                register={register}
                                errors={errors}
                                darkMode={true}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white border-b border-gray-700/50 pb-2">
                            Job Description & Requirements
                        </h2>

                        <TextareaField
                            label="Job Description"
                            name="description"
                            register={register}
                            errors={errors}
                            rows={6}
                            required
                            darkMode={true}
                        />

                        <TextareaField
                            label="Requirements"
                            name="requirements"
                            register={register}
                            errors={errors}
                            rows={6}
                            darkMode={true}
                        />

                        <InputField
                            label="Skills (comma separated)"
                            name="skills"
                            register={register}
                            errors={errors}
                            darkMode={true}
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700/50">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-[#1A73FF] hover:bg-[#0047CC] disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
