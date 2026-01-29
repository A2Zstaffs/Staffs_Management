'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/lib/api';

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId;

    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showCandidateModal, setShowCandidateModal] = useState(false);

    useEffect(() => {
        if (jobId) {
            loadJobDetails();
            loadApplications();
        }
    }, [jobId]);

    const loadJobDetails = async () => {
        try {
            const response = await apiClient.get(`/kam/jobs/${jobId}`);
            if (response.success) {
                setJob(response.data.job);
            }
        } catch (err) {
            console.error('Error loading job details:', err);
            setError(err.message);
        }
    };

    const loadApplications = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(`/kam/applications?jobId=${jobId}`);
            if (response.success) {
                setApplications(response.data);
            }
        } catch (err) {
            console.error('Error loading applications:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const viewCandidateDetails = (candidate) => {
        setSelectedCandidate(candidate);
        setShowCandidateModal(true);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'applied': { label: 'Applied', class: 'bg-blue-100 text-blue-800 border-blue-200' },
            'submitted': { label: 'Submitted', class: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
            'under_review': { label: 'Under Review', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
            'shortlisted': { label: 'Shortlisted', class: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
            'interview_scheduled': { label: 'Interview Scheduled', class: 'bg-purple-100 text-purple-800 border-purple-200' },
            'interviewed': { label: 'Interviewed', class: 'bg-violet-100 text-violet-800 border-violet-200' },
            'selected': { label: 'Selected', class: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
            'hired': { label: 'Hired', class: 'bg-green-100 text-green-800 border-green-200' },
            'rejected': { label: 'Rejected', class: 'bg-red-100 text-red-800 border-red-200' }
        };

        const config = statusConfig[status?.toLowerCase()] || statusConfig.applied;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.class}`}>
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading && !job) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600">Loading job details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Jobs
            </button>

            {/* Job Header */}
            {job && (
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 mb-6 shadow-lg">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{job.job_title}</h1>
                            <p className="text-slate-300 text-lg mb-4">{job.company_name}</p>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm backdrop-blur-sm">
                                    📍 {Array.isArray(job.locations) ? job.locations.join(', ') : job.locations}
                                </span>
                                <span className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm backdrop-blur-sm">
                                    💰 ₹{job.salary_min?.toLocaleString()} - ₹{job.salary_max?.toLocaleString()} {job.salary_type === 'per_month' ? '/month' : '/year'}
                                </span>
                                <span className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm backdrop-blur-sm">
                                    🎯 {job.experience_min}-{job.experience_max} years
                                </span>
                                <span className={`px-4 py-2 rounded-lg text-sm backdrop-blur-sm ${job.role_status === 'Active'
                                    ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                                    : 'bg-gray-500/20 text-gray-100 border border-gray-400/30'
                                    }`}>
                                    {job.role_status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    {job.description && (
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <h3 className="text-white font-semibold mb-2">Description</h3>
                            <p className="text-slate-300 text-sm">{job.description}</p>
                        </div>
                    )}

                    {/* Job Skills */}
                    {job.skills && job.skills.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-white font-semibold mb-2">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-100 rounded-full text-xs border border-blue-400/30">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Applications Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Candidate Applications</h2>
                            <p className="text-gray-600 mt-1">{applications.length} {applications.length === 1 ? 'application' : 'applications'} received</p>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center">
                        <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-600">Loading applications...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                        <p className="text-gray-600">This job hasn't received any applications yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Candidate
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Recruited By
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Applied Date
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold text-gray-900">{app.candidateName}</div>
                                                <div className="text-sm text-gray-600">{app.candidateEmail}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">{app.recruitedBy}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.type === 'Application'
                                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                : 'bg-green-100 text-green-800 border border-green-200'
                                                }`}>
                                                {app.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(app.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">{formatDate(app.appliedAt)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => viewCandidateDetails(app)}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                                                >
                                                    View Details
                                                </button>
                                                {app.resumeUrl && (
                                                    <a
                                                        href={app.resumeUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors flex items-center"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        CV
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Candidate Details Modal */}
            {showCandidateModal && selectedCandidate && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold">Candidate Details</h3>
                                <button
                                    onClick={() => setShowCandidateModal(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Personal Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Name</p>
                                        <p className="font-semibold text-gray-900">{selectedCandidate.candidateName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Email</p>
                                        <p className="font-semibold text-gray-900">{selectedCandidate.candidateEmail}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Application Type</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedCandidate.type === 'Application'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-green-100 text-green-800'
                                            }`}>
                                            {selectedCandidate.type}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Status</p>
                                        {getStatusBadge(selectedCandidate.status)}
                                    </div>
                                </div>
                            </div>

                            {/* Application Info */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Application Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Applied Date</p>
                                        <p className="font-semibold text-gray-900">{formatDate(selectedCandidate.appliedAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Recruited By</p>
                                        <p className="font-semibold text-gray-900">{selectedCandidate.recruitedBy}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Resume */}
                            {selectedCandidate.resumeUrl && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Resume
                                    </h4>
                                    <a
                                        href={selectedCandidate.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download Resume
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowCandidateModal(false)}
                                className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
