'use client';

import { useState, useEffect } from 'react';
import { getClientApplications } from '@/lib/kamApi';

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        clientId: '',
        jobId: ''
    });

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getClientApplications(filters);
            if (response.success) {
                setApplications(response.data || []);
            } else {
                setError('Failed to load applications');
            }
        } catch (err) {
            console.error('Error loading applications:', err);
            setError(err.message || 'An error occurred while loading applications');
        } finally {
            setIsLoading(false);
        }
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
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.class}`}>
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Page Header */}
            <div className="mb-6 bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Client Applications <span className="text-blue-400">.</span>
                </h1>
                <p className="text-slate-300">
                    View all applications submitted for your assigned clients' jobs
                </p>
                {!isLoading && (
                    <div className="mt-4">
                        <span className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-200 rounded-lg font-semibold">
                            {applications.length} {applications.length === 1 ? 'Application' : 'Applications'}
                        </span>
                    </div>
                )}
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-600">Loading applications...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                        <button
                            onClick={loadApplications}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-600">Applications will appear here once candidates apply to your clients' jobs</p>
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
                                        Job Title
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
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Resume
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900">{app.candidateName}</div>
                                            <div className="text-xs text-gray-600">{app.candidateEmail}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700">{app.jobTitle}</div>
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
                                        <td className="px-6 py-4">
                                            {app.resumeUrl ? (
                                                <a
                                                    href={app.resumeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    View
                                                </a>
                                            ) : (
                                                <span className="text-sm text-gray-400">No CV</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
