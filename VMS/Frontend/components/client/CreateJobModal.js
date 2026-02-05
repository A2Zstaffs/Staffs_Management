'use client';

import { useState, useEffect } from 'react';
import { X, Briefcase, MapPin, DollarSign, Users, Calendar } from 'lucide-react';
import { authAPI } from '@/lib/api';

export default function CreateJobModal({ isOpen, onClose, onSuccess, jobToEdit = null }) {
    const initialFormState = {
        job_title: '',
        locations: [''],
        salary_min: '',
        salary_max: '',
        salary_type: 'per_annum',
        experience_min: '',
        experience_max: '',
        notice_period: '',
        num_positions: 1,
        applications_required: '',
        commission_percent: '',
        commission_amount_min: '',
        commission_amount_max: '',
        commission_payment_terms: '',
        r1_bonus_amount: 0,
        r1_bonus_payment_terms: '',
        sourcing_status: 'Priority',
        description: '',
        requirements: '',
        skills: ['']
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (jobToEdit) {
                // Populate form for editing
                setFormData({
                    job_title: jobToEdit.job_title || '',
                    locations: Array.isArray(jobToEdit.locations) && jobToEdit.locations.length > 0 ? jobToEdit.locations : (jobToEdit.location ? [jobToEdit.location] : ['']),
                    salary_min: jobToEdit.salary_min || '',
                    salary_max: jobToEdit.salary_max || '',
                    salary_type: jobToEdit.salary_type || 'per_annum',
                    experience_min: jobToEdit.experience_min || '',
                    experience_max: jobToEdit.experience_max || '',
                    notice_period: jobToEdit.notice_period || '',
                    num_positions: jobToEdit.num_positions || 1,
                    applications_required: jobToEdit.applications_required || '',
                    commission_percent: jobToEdit.commission_percent || '',
                    commission_amount_min: jobToEdit.commission_amount_min || '',
                    commission_amount_max: jobToEdit.commission_amount_max || '',
                    commission_payment_terms: jobToEdit.commission_payment_terms || '',
                    r1_bonus_amount: jobToEdit.r1_bonus_amount || 0,
                    r1_bonus_payment_terms: jobToEdit.r1_bonus_payment_terms || '',
                    sourcing_status: jobToEdit.sourcing_status || 'Priority',
                    description: jobToEdit.description || '',
                    requirements: jobToEdit.requirements || '',
                    skills: Array.isArray(jobToEdit.skills) && jobToEdit.skills.length > 0 ? jobToEdit.skills : ['']
                });
            } else {
                // Reset for creation
                setFormData(initialFormState);
            }
            setError('');
        }
    }, [isOpen, jobToEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLocationChange = (index, value) => {
        const newLocations = [...formData.locations];
        newLocations[index] = value;
        setFormData(prev => ({ ...prev, locations: newLocations }));
    };

    const addLocation = () => {
        setFormData(prev => ({
            ...prev,
            locations: [...prev.locations, '']
        }));
    };

    const removeLocation = (index) => {
        if (formData.locations.length > 1) {
            const newLocations = formData.locations.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, locations: newLocations }));
        }
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...formData.skills];
        newSkills[index] = value;
        setFormData(prev => ({ ...prev, skills: newSkills }));
    };

    const addSkill = () => {
        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, '']
        }));
    };

    const removeSkill = (index) => {
        if (formData.skills.length > 1) {
            const newSkills = formData.skills.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, skills: newSkills }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Filter out empty locations and skills
            const cleanedData = {
                ...formData,
                locations: formData.locations.filter(loc => loc.trim()),
                skills: formData.skills.filter(skill => skill.trim()),
                // Convert string numbers to actual numbers
                salary_min: Number(formData.salary_min),
                salary_max: Number(formData.salary_max),
                experience_min: Number(formData.experience_min),
                experience_max: Number(formData.experience_max),
                notice_period: Number(formData.notice_period),
                num_positions: Number(formData.num_positions),
                applications_required: Number(formData.applications_required),
                commission_percent: Number(formData.commission_percent),
                commission_amount_min: Number(formData.commission_amount_min),
                commission_amount_max: Number(formData.commission_amount_max),
                r1_bonus_amount: Number(formData.r1_bonus_amount) || 0
            };

            const token = authAPI.getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

            const url = jobToEdit
                ? `${apiUrl}/client/jobs/${jobToEdit._id}`
                : `${apiUrl}/client/jobs/create`;

            const method = jobToEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cleanedData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Failed to ${jobToEdit ? 'update' : 'create'} job`);
            }

            // Success!
            if (onSuccess) {
                onSuccess(data.data);
            }
            onClose();
        } catch (err) {
            console.error('Error saving job:', err);
            setError(err.message || 'Failed to save job. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full my-8 border border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{jobToEdit ? 'Edit Job' : 'Create New Job'}</h2>
                            <p className="text-sm text-gray-400">{jobToEdit ? 'Update existing job details' : 'Fill in the details to post a new job'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                            <Briefcase className="w-5 h-5 mr-2 text-blue-400" />
                            Basic Information
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
                            <input
                                type="text"
                                name="job_title"
                                value={formData.job_title}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Senior Software Engineer"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Number of Positions *</label>
                                <input
                                    type="number"
                                    name="num_positions"
                                    value={formData.num_positions}
                                    onChange={handleInputChange}
                                    min="1"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Applications Required *</label>
                                <input
                                    type="number"
                                    name="applications_required"
                                    value={formData.applications_required}
                                    onChange={handleInputChange}
                                    min="1"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Locations */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                                Locations *
                            </h3>
                            <button
                                type="button"
                                onClick={addLocation}
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                + Add Location
                            </button>
                        </div>
                        {formData.locations.map((location, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => handleLocationChange(index, e.target.value)}
                                    required
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Chennai, Bangalore"
                                />
                                {formData.locations.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLocation(index)}
                                        className="text-red-400 hover:text-red-300 p-2"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Salary Range */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                            <DollarSign className="w-5 h-5 mr-2 text-blue-400" />
                            Salary Range (Lakhs) *
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Minimum</label>
                                <input
                                    type="number"
                                    name="salary_min"
                                    value={formData.salary_min}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.1"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 10"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Maximum</label>
                                <input
                                    type="number"
                                    name="salary_max"
                                    value={formData.salary_max}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.1"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 15"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Salary Type *</label>
                                <select
                                    name="salary_type"
                                    value={formData.salary_type}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="per_annum">Per Annum (Yearly)</option>
                                    <option value="per_month">Per Month</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Experience & Notice Period */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                            <Users className="w-5 h-5 mr-2 text-blue-400" />
                            Experience & Availability
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Min Experience (Years) *</label>
                                <input
                                    type="number"
                                    name="experience_min"
                                    value={formData.experience_min}
                                    onChange={handleInputChange}
                                    min="0"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Max Experience (Years) *</label>
                                <input
                                    type="number"
                                    name="experience_max"
                                    value={formData.experience_max}
                                    onChange={handleInputChange}
                                    min="0"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Notice Period (Days) *</label>
                                <input
                                    type="number"
                                    name="notice_period"
                                    value={formData.notice_period}
                                    onChange={handleInputChange}
                                    min="0"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Commission */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                            <DollarSign className="w-5 h-5 mr-2 text-blue-400" />
                            Commission Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Commission % *</label>
                                <input
                                    type="number"
                                    name="commission_percent"
                                    value={formData.commission_percent}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Min Amount (₹) *</label>
                                <input
                                    type="number"
                                    name="commission_amount_min"
                                    value={formData.commission_amount_min}
                                    onChange={handleInputChange}
                                    min="0"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Max Amount (₹) *</label>
                                <input
                                    type="number"
                                    name="commission_amount_max"
                                    value={formData.commission_amount_max}
                                    onChange={handleInputChange}
                                    min="0"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Payment Terms *</label>
                            <input
                                type="text"
                                name="commission_payment_terms"
                                value={formData.commission_payment_terms}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Upon candidate joining + 90 days probation"
                            />
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Required Skills</h3>
                            <button
                                type="button"
                                onClick={addSkill}
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                + Add Skill
                            </button>
                        </div>
                        {formData.skills.map((skill, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={skill}
                                    onChange={(e) => handleSkillChange(index, e.target.value)}
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., React, Node.js"
                                />
                                {formData.skills.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(index)}
                                        className="text-red-400 hover:text-red-300 p-2"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Description & Requirements */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Requirements</label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="List the must-have qualifications, certifications, or specific requirements..."
                            />
                        </div>
                    </div>

                    {/* Sourcing Priority */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Sourcing Priority</label>
                        <select
                            name="sourcing_status"
                            value={formData.sourcing_status}
                            onChange={handleInputChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Priority">Priority</option>
                            <option value="Normal">Normal</option>
                            <option value="Low">Low</option>
                        </select>
                        <p className="mt-2 text-sm text-gray-400">Note: All new jobs require admin approval before becoming active</p>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>{jobToEdit ? 'Updating...' : 'Creating...'}</span>
                                </>
                            ) : (
                                <>
                                    <Briefcase className="w-5 h-5" />
                                    <span>{jobToEdit ? 'Update Job' : 'Create Job'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
