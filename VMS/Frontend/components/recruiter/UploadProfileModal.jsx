'use client';

import { useState, useEffect } from 'react';

export default function UploadProfileModal({ isOpen, onClose, job, submittedCandidates = new Set(), onSuccess }) {
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
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [duplicateWarning, setDuplicateWarning] = useState('');
    const [recruiterName, setRecruiterName] = useState('');

    // Get recruiter name on component mount
    useEffect(() => {
        // Check sessionStorage first (default), then localStorage (rememberMe)
        const userData = sessionStorage.getItem('userData') || localStorage.getItem('userData');
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

        // Check for duplicate email
        if (name === 'email' && value) {
            checkDuplicateEmail(value);
        }
    };

    const checkDuplicateEmail = (email) => {
        const normalizedEmail = email.toLowerCase().trim();
        if (submittedCandidates.has(normalizedEmail)) {
            setIsDuplicate(true);
            setDuplicateWarning('⚠️ This candidate has already been submitted for this job');
        } else {
            setIsDuplicate(false);
            setDuplicateWarning('');
        }
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

        // Prevent duplicate submission
        if (isDuplicate) {
            alert('❌ Profile Already Submitted\n\nThis candidate has already been submitted for this job. You cannot submit duplicate profiles for the same candidate.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Get user data from sessionStorage first (default), then localStorage (rememberMe)
            const userData = sessionStorage.getItem('userData') || localStorage.getItem('userData');
            const user = userData ? JSON.parse(userData) : null;

            if (!user || !user._id) {
                throw new Error('User not authenticated. Please log in again.');
            }

            // Create FormData object
            const formDataToSend = new FormData();
            formDataToSend.append('candidate_name', formData.candidate_name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('total_experience', formData.total_experience);
            formDataToSend.append('current_ctc', formData.current_ctc);
            formDataToSend.append('expected_ctc', formData.expected_ctc);
            formDataToSend.append('notice_period', formData.notice_period);
            formDataToSend.append('current_company', formData.current_company || '');
            formDataToSend.append('current_designation', formData.current_designation || '');
            formDataToSend.append('notes', formData.notes || '');
            formDataToSend.append('job_id', job._id);
            formDataToSend.append('uploaded_by', user._id);
            formDataToSend.append('uploaded_by_name', user.fullName || user.name);
            formDataToSend.append('status', 'Available');

            // Handle skills array
            const skillsList = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            skillsList.forEach(skill => {
                formDataToSend.append('skills', skill);
            });

            // Handle file
            if (formData.resume) {
                formDataToSend.append('resume', formData.resume);
            }

            // Import the API
            const { profileAPI } = await import('@/lib/api');
            const response = await profileAPI.uploadProfile(formDataToSend);

            if (response.success) {
                alert('✅ Profile uploaded successfully!');
                if (onSuccess) onSuccess(formData.email);
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
                    notes: '',
                    resume: null
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
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${isDuplicate
                                        ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                        : 'border-gray-300 focus:ring-blue-500'
                                        }`}
                                />
                                {duplicateWarning && (
                                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-sm text-red-700 font-semibold">{duplicateWarning}</p>
                                    </div>
                                )}
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
