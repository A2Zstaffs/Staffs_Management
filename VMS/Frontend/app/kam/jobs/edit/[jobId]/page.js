'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import TextareaField from '@/components/TextareaField';
import Toast from '@/components/Toast';
import { kamAPI } from '@/lib/api';

export default function EditJobPage({ params }) {
    const router = useRouter();
    const { jobId } = params;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
    const [clientId, setClientId] = useState(null);

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
            const response = await kamAPI.getJobById(jobId);
            if (response.success) {
                const job = response.data.job;
                if (job) {
                    setClientId(job.postedBy?._id || job.postedBy); // Store client ID for update

                    // Populate form
                    setValue('company_name', job.company_name);
                    setValue('job_title', job.job_title);
                    setValue('locations', Array.isArray(job.locations) ? job.locations.join(', ') : job.locations);
                    setValue('salary_min', job.salary_min);
                    setValue('salary_max', job.salary_max);
                    setValue('experience_min', job.experience_min);
                    setValue('experience_max', job.experience_max);
                    setValue('description', job.description);
                    setValue('requirements', job.requirements);
                    setValue('skills', job.skills ? job.skills.join(', ') : '');
                    setValue('jobType', job.employmentType);
                    setValue('commission_percent', job.commission_percent);

                    // Status fields (KAM specific)
                    setValue('role_status', job.role_status);

                    if (job.applicationDeadline) {
                        setValue('applicationDeadline', new Date(job.applicationDeadline).toISOString().split('T')[0]);
                    }
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
        if (!clientId) {
            showToast('Client information missing', 'error');
            return;
        }

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
                experience_min: (data.experience_min !== undefined && data.experience_min !== '') ? parseInt(data.experience_min) : null,
                experience_max: (data.experience_max !== undefined && data.experience_max !== '') ? parseInt(data.experience_max) : null,
                commission_percent: (data.commission_percent !== undefined && data.commission_percent !== '') ? parseFloat(data.commission_percent) : null,
            };

            const response = await kamAPI.updateJobForClient(clientId, jobId, jobData);

            if (response.success) {
                showToast('Job updated successfully!', 'success');
                setTimeout(() => {
                    router.push('/kam/jobs');
                }, 1500);
            } else {
                showToast(response.message || 'Failed to update job', 'error');
            }
        } catch (error) {
            console.error('Error updating job:', error);
            showToast(error.message || 'An error occurred. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center p-10 text-gray-600">Loading job details...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
            />

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Client Job</h1>
                <p className="text-gray-600">Update job posting details for your client</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
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
                                    name="jobType"
                                    {...register('jobType', { required: 'Job type is required' })}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
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

                            <div>
                                <label htmlFor="role_status" className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    id="role_status"
                                    name="role_status"
                                    {...register('role_status')}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Closed">Closed</option>
                                    <option value="Paused">Paused</option>
                                </select>
                            </div>
                        </div>

                        <InputField
                            label="Locations (comma separated)"
                            name="locations"
                            register={register}
                            errors={errors}
                            placeholder="e.g., New York, San Francisco"
                            required
                        />
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                            Salary & Experience
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Minimum Salary"
                                name="salary_min"
                                type="number"
                                register={register}
                                errors={errors}
                                required
                            />
                            <InputField
                                label="Maximum Salary"
                                name="salary_max"
                                type="number"
                                register={register}
                                errors={errors}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Minimum Experience (years)"
                                name="experience_min"
                                type="number"
                                register={register}
                                errors={errors}
                                required
                            />
                            <InputField
                                label="Maximum Experience (years)"
                                name="experience_max"
                                type="number"
                                register={register}
                                errors={errors}
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
                            />
                            <InputField
                                label="Application Deadline"
                                name="applicationDeadline"
                                type="date"
                                register={register}
                                errors={errors}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                            Job Description & Requirements
                        </h2>

                        <TextareaField
                            label="Job Description"
                            name="description"
                            register={register}
                            errors={errors}
                            rows={6}
                            required
                        />

                        <TextareaField
                            label="Requirements"
                            name="requirements"
                            register={register}
                            errors={errors}
                            rows={6}
                        />

                        <InputField
                            label="Skills (comma separated)"
                            name="skills"
                            register={register}
                            errors={errors}
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
