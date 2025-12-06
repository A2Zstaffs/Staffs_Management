'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import TextareaField from '@/components/TextareaField';
import Toast from '@/components/Toast';
import { createJob } from '@/lib/clientApi';

export default function PostJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Convert comma-separated strings to arrays
      const locations = data.locations
        ? data.locations.split(',').map((loc) => loc.trim()).filter(Boolean)
        : [];
      
      const skills = data.skills
        ? data.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
        : [];

      // Prepare job data
      const jobData = {
        ...data,
        locations,
        skills,
        salary_min: data.salary_min ? parseFloat(data.salary_min) : null,
        salary_max: data.salary_max ? parseFloat(data.salary_max) : null,
        experience_min: data.experience_min ? parseInt(data.experience_min) : null,
        experience_max: data.experience_max ? parseInt(data.experience_max) : null,
        num_positions: data.num_positions ? parseInt(data.num_positions) : null,
        applications_required: data.applications_required ? parseInt(data.applications_required) : null,
        in_process_applications: data.in_process_applications ? parseInt(data.in_process_applications) : null,
        commission_amount: data.commission_amount ? parseFloat(data.commission_amount) : null,
        commission_percent: data.commission_percent ? parseFloat(data.commission_percent) : null,
        commission_amount_min: data.commission_amount_min ? parseFloat(data.commission_amount_min) : null,
        commission_amount_max: data.commission_amount_max ? parseFloat(data.commission_amount_max) : null,
        r1_bonus_amount: data.r1_bonus_amount ? parseFloat(data.r1_bonus_amount) : null,
      };

      const response = await createJob(jobData);

      if (response.success) {
        showToast(response.message || 'Job posted successfully!', 'success');
        reset();
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/client/my-jobs');
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

  return (
    <div className="max-w-5xl mx-auto">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Post a New Job</h1>
        <p className="text-gray-300">Fill out the form below to create a new job posting</p>
      </div>

      {/* Job Posting Form */}
      <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-xl p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
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

                <InputField
                  label="Number of Openings"
                  name="num_positions"
                  type="number"
                  register={register}
                  errors={errors}
                  placeholder="e.g., 5"
                  required
                  darkMode={true}
                />
              </div>

              <InputField
                label="Locations (comma separated)"
                name="locations"
                register={register}
                errors={errors}
                placeholder="e.g., New York, San Francisco, Remote"
                required
                darkMode={true}
              />
            </div>

            {/* Salary Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-gray-700/50 pb-2">
                Salary & Experience
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Minimum Salary"
                  name="salary_min"
                  type="number"
                  register={register}
                  errors={errors}
                  placeholder="e.g., 100000"
                  darkMode={true}
                />
                
                <InputField
                  label="Maximum Salary"
                  name="salary_max"
                  type="number"
                  register={register}
                  errors={errors}
                  placeholder="e.g., 150000"
                  darkMode={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Minimum Experience (years)"
                  name="experience_min"
                  type="number"
                  register={register}
                  errors={errors}
                  placeholder="e.g., 3"
                  darkMode={true}
                />
                
                <InputField
                  label="Maximum Experience (years)"
                  name="experience_max"
                  type="number"
                  register={register}
                  errors={errors}
                  placeholder="e.g., 7"
                  darkMode={true}
                />
              </div>
            </div>

            {/* Job Details Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-gray-700/50 pb-2">
                Job Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Notice Period"
                  name="notice_period"
                  register={register}
                  errors={errors}
                  placeholder="e.g., 30 days, 15 days"
                  darkMode={true}
                />
                
                <InputField
                  label="Number of Positions"
                  name="num_positions"
                  type="number"
                  register={register}
                  errors={errors}
                  placeholder="e.g., 5"
                  darkMode={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Relevant Level"
                  name="relevant_level"
                  register={register}
                  errors={errors}
                  placeholder="e.g., Mid-level, Senior"
                  darkMode={true}
                />
                
                <InputField
                  label="Applications Required"
                  name="applications_required"
                  type="number"
                  register={register}
                  errors={errors}
                  placeholder="e.g., 10"
                  darkMode={true}
                />
              </div>

              <InputField
                label="In Process Applications"
                name="in_process_applications"
                type="number"
                register={register}
                errors={errors}
                placeholder="e.g., 5"
                darkMode={true}
              />
            </div>

            {/* Commission & Bonus Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-gray-700/50 pb-2">
                Commission & Bonus
              </h2>
              
              <InputField
                label="Commission Amount for Recruiters"
                name="commission_amount"
                type="number"
                register={register}
                errors={errors}
                placeholder="e.g., 5000"
                required
                darkMode={true}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                  label="Commission Percentage"
                  name="commission_percent"
                  type="number"
                  step="0.01"
                  register={register}
                  errors={errors}
                  placeholder="e.g., 5.5"
                  darkMode={true}
                />
                
                <InputField
                  label="Min Commission Amount"
                  name="commission_amount_min"
                  type="number"
                  register={register}
                  errors={errors}
                  placeholder="e.g., 1000"
                  darkMode={true}
                />
                
                <InputField
                  label="Max Commission Amount"
                  name="commission_amount_max"
                  type="number"
                  register={register}
                  errors={errors}
                  placeholder="e.g., 5000"
                  darkMode={true}
                />
              </div>

              <InputField
                label="Commission Payment Terms"
                name="commission_payment_terms"
                register={register}
                errors={errors}
                placeholder="e.g., On joining, After 3 months"
                darkMode={true}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="R1 Bonus Amount"
                  name="r1_bonus_amount"
                  type="number"
                  register={register}
                  errors={errors}
                  placeholder="e.g., 2000"
                  darkMode={true}
                />
                
                <InputField
                  label="R1 Bonus Payment Terms"
                  name="r1_bonus_payment_terms"
                  register={register}
                  errors={errors}
                  placeholder="e.g., On joining, After 6 months"
                  darkMode={true}
                />
              </div>
            </div>

            {/* Status Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-gray-700/50 pb-2">
                Status
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="role_status" className="block text-sm font-medium text-[#1A73FF] mb-2">
                    Role Status
                  </label>
                  <select
                    id="role_status"
                    name="role_status"
                    {...register('role_status')}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-[#1A73FF] focus:border-[#1A73FF] text-white"
                  >
                    <option value="">Select status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="sourcing_status" className="block text-sm font-medium text-[#1A73FF] mb-2">
                    Sourcing Status
                  </label>
                  <select
                    id="sourcing_status"
                    name="sourcing_status"
                    {...register('sourcing_status')}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-[#1A73FF] focus:border-[#1A73FF] text-white"
                  >
                    <option value="">Select status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description & Requirements Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-gray-700/50 pb-2">
                Job Description & Requirements
              </h2>
              
              <TextareaField
                label="Job Description"
                name="description"
                register={register}
                errors={errors}
                placeholder="Enter detailed job description..."
                rows={6}
                required
                darkMode={true}
              />

              <TextareaField
                label="Requirements"
                name="requirements"
                register={register}
                errors={errors}
                placeholder="Enter job requirements..."
                rows={6}
                darkMode={true}
              />

              <InputField
                label="Skills (comma separated)"
                name="skills"
                register={register}
                errors={errors}
                placeholder="e.g., JavaScript, React, Node.js, Python"
                darkMode={true}
              />
            </div>

            {/* Form Actions */}
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
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting Job...
                  </>
                ) : (
                  'Post Job'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}



