'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPendingJobs, approveJob, rejectJob } from '@/lib/kamApi';

export default function PendingJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(''); // 'approve' or 'reject'
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadPendingJobs();
    }, []);

    const loadPendingJobs = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getPendingJobs();
            if (response.success) {
                setJobs(response.data || []);
            } else {
                setError('Failed to load pending jobs');
            }
        } catch (err) {
            console.error('Error loading pending jobs:', err);
            setError(err.message || 'An error occurred while loading jobs');
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (job, action) => {
        setSelectedJob(job);
        setModalAction(action);
        setNotes('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedJob(null);
        setModalAction('');
        setNotes('');
    };

    const handleSubmit = async () => {
        if (!selectedJob) return;

        setIsSubmitting(true);
        try {
            const response = modalAction === 'approve'
                ? await approveJob(selectedJob._id, notes)
                : await rejectJob(selectedJob._id, notes);

            if (response.success) {
                closeModal();
                loadPendingJobs();
            } else {
                alert(response.message || 'Action failed');
            }
        } catch (err) {
            console.error('Error:', err);
            alert(err.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Not specified';
        return `₹${min?.toLocaleString() || '0'} - ₹${max?.toLocaleString() || '0'}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Page Header */}
            <div className="mb-6 bg-gradient-to-r from-orange-600 to-red-600 p-8 rounded-2xl shadow-lg">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Pending Job Approvals <span className="text-yellow-300">⏳</span>
                </h1>
                <p className="text-orange-100 text-lg">Review and approve jobs posted by your assigned clients</p>
                {!isLoading && (
                    <div className="mt-4">
                        <span className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-lg font-semibold backdrop-blur-sm">
                            {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Awaiting Approval
                        </span>
                    </div>
                )}
            </div>

            {/* Jobs List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <svg className="animate-spin h-12 w-12 text-orange-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-600">Loading pending jobs...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <div className="bg-red-50 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4">
                            {error}
                        </div>
                        <button
                            onClick={loadPendingJobs}
                            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
                        <p className="text-gray-600">No jobs pending approval at the moment</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Job Details
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Client
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Salary
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Experience
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Posted Date
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {jobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 mb-1">{job.job_title}</div>
                                            <div className="text-sm text-gray-600 mb-2">{job.company_name}</div>
                                            {job.skills && job.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {job.skills.slice(0, 2).map((skill, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-block px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-medium"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {job.skills.length > 2 && (
                                                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                            +{job.skills.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
                                                    {job.postedBy?.fullName?.charAt(0) || 'C'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {job.postedBy?.fullName || 'Unknown'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {job.postedBy?.company || job.postedBy?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatSalary(job.salary_min, job.salary_max)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">
                                                {job.experience_min}-{job.experience_max} years
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">{formatDate(job.posted_date)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openModal(job, 'approve')}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors inline-flex items-center"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => openModal(job, 'reject')}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors inline-flex items-center"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && selectedJob && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className={`sticky top-0 ${modalAction === 'approve' ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-red-600 to-red-700'} p-6 text-white`}>
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold">
                                    {modalAction === 'approve' ? '✓ Approve Job' : '✗ Reject Job'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Job Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-2">{selectedJob.job_title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{selectedJob.company_name}</p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">Salary:</span>{' '}
                                        <span className="font-medium">{formatSalary(selectedJob.salary_min, selectedJob.salary_max)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Experience:</span>{' '}
                                        <span className="font-medium">{selectedJob.experience_min}-{selectedJob.experience_max} years</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes {modalAction === 'reject' && <span className="text-red-500">*</span>}
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder={modalAction === 'approve' ? 'Add any notes (optional)' : 'Please provide a reason for rejection'}
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                />
                            </div>

                            {/* Warning for Reject */}
                            {modalAction === 'reject' && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-semibold text-red-900">Warning</p>
                                            <p className="text-sm text-red-700 mt-1">
                                                Rejecting this job will close it and the client will be notified.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || (modalAction === 'reject' && !notes.trim())}
                                className={`px-6 py-3 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${modalAction === 'approve'
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </div>
                                ) : (
                                    <>
                                        {modalAction === 'approve' ? 'Approve Job' : 'Reject Job'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
