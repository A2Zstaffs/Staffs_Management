'use client';

import { useState, useEffect } from 'react';

export default function UploadProfileModal({ isOpen, onClose, job }) {
    const [formData, setFormData] = useState({
        candidate_name: '',
        email: '',
        phone: '',
        location: '',
        total_experience: '',
        current_company: '',
        current_designation: '',
        current_ctc: '',
        expected_ctc: '',
        notice_period: '',
        skills: '',
        notes: '',
        resume: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recruiterName, setRecruiterName] = useState('');

    // Get recruiter name on component mount
    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            setRecruiterName(user.fullName || user.name || 'Unknown Recruiter');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setError('Please upload only PDF, DOC, or DOCX files');
                e.target.value = '';
                return;
            }
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size should not exceed 5MB');
                e.target.value = '';
                return;
            }
            setFormData(prev => ({
                ...prev,
                resume: file
            }));
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Get user data from localStorage
            const userData = localStorage.getItem('userData');
            const user = userData ? JSON.parse(userData) : null;

            if (!user || !user._id) {
                throw new Error('User not authenticated');
            }

            // Prepare profile data
            const profileData = {
                candidate_name: formData.candidate_name,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                total_experience: parseFloat(formData.total_experience),
                current_ctc: parseFloat(formData.current_ctc),
                expected_ctc: parseFloat(formData.expected_ctc),
                notice_period: parseInt(formData.notice_period),
                current_company: formData.current_company,
                current_designation: formData.current_designation,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                notes: formData.notes,
                job_id: job._id,
                uploaded_by: user._id,
                uploaded_by_name: user.fullName || user.name,
                status: 'Available'
            };

            // Import the API
            const { profileAPI } = await import('@/lib/api');
            const response = await profileAPI.uploadProfile(profileData);

            if (response.success) {
                alert('Profile uploaded successfully!');
                onClose();
                // Reset form
                setFormData({
                    candidate_name: '',
                    email: '',
                    phone: '',
                    location: '',
                    total_experience: '',
                    current_company: '',
                    current_designation: '',
                    current_ctc: '',
                    expected_ctc: '',
                    notice_period: '',
                    skills: '',
                    notes: ''
                });
            }
        } catch (err) {
            setError(err.message || 'Failed to upload profile');
            console.error('Upload error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Upload Candidate Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-6 py-4">
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Job:</span> {job.job_title} at {job.company_name}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Candidate Name *
                                </label>
                                <input
                                    type="text"
                                    name="candidate_name"
                                    value={formData.candidate_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Experience (Years) *
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="total_experience"
                                    value={formData.total_experience}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current CTC (Lakhs) *
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="current_ctc"
                                    value={formData.current_ctc}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expected CTC (Lakhs) *
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="expected_ctc"
                                    value={formData.expected_ctc}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Company
                                </label>
                                <input
                                    type="text"
                                    name="current_company"
                                    value={formData.current_company}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Designation
                                </label>
                                <input
                                    type="text"
                                    name="current_designation"
                                    value={formData.current_designation}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notice Period (Days) *
                            </label>
                            <input
                                type="number"
                                name="notice_period"
                                value={formData.notice_period}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Skills (comma-separated)
                            </label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="e.g., React, Node.js, MongoDB"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Resume (PDF, DOC, DOCX - Max 5MB)
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {formData.resume && (
                                <p className="mt-1 text-sm text-green-600">
                                    ✓ {formData.resume.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {recruiterName && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Uploaded by:</span> {recruiterName}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Uploading...' : 'Upload Profile'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
