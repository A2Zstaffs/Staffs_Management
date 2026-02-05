'use client';

import { useState, useEffect } from 'react';
import RecruiterNavbar from '@/components/common/RecruiterNavbar';
import { useRouter } from 'next/navigation';

export default function TrackStatusPage() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        shortlisted: 0,
        interview: 0,
        hired: 0,
        rejected: 0
    });

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            // Check sessionStorage first (default), then localStorage (rememberMe)
            const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
            if (!token) {
                console.error('No auth token found');
                setIsLoading(false);
                return;
            }
            // Re-using dashboard endpoint for now as it contains all data
            // Ideally should be a dedicated endpoint /api/recruiter/submissions
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/recruiter`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();

            if (result.success) {
                const { submittedCandidates = [], uploadedProfiles = [] } = result.data || {};

                console.log('Track Status - Data received:', {
                    submittedCandidatesCount: submittedCandidates?.length || 0,
                    uploadedProfilesCount: uploadedProfiles?.length || 0
                });

                // Combine and format data with safety checks
                const combined = [
                    ...(submittedCandidates || [])
                        .filter(c => c && c.candidate && c.job) // Only include valid entries
                        .map(c => ({
                            id: c._id,
                            name: c.candidate?.fullName || 'Unknown',
                            email: c.candidate?.email || 'N/A',
                            jobTitle: c.job?.title || 'N/A',
                            company: c.job?.postedBy?.company || 'N/A',
                            status: c.status,
                            date: c.createdAt,
                            type: 'Application'
                        })),
                    ...(uploadedProfiles || []).map(p => ({
                        id: p._id,
                        name: p.candidate_name || 'Unknown',
                        email: p.email || 'N/A',
                        jobTitle: p.job_id?.job_title || 'N/A',
                        company: p.job_id?.company_name || 'N/A',
                        status: p.status,
                        date: p.createdAt,
                        type: 'Uploaded Profile'
                    }))
                ].sort((a, b) => new Date(b.date) - new Date(a.date));

                console.log('Track Status - Combined entries:', combined.length);
                setSubmissions(combined);

                // Calculate stats
                const newStats = {
                    total: combined.length,
                    shortlisted: combined.filter(s => ['shortlisted', 'interview_scheduled'].includes(s.status?.toLowerCase())).length,
                    interview: combined.filter(s => ['interview_scheduled', 'interviewed'].includes(s.status?.toLowerCase())).length,
                    hired: combined.filter(s => ['hired', 'placed', 'joined', 'selected'].includes(s.status?.toLowerCase())).length,
                    rejected: combined.filter(s => ['rejected'].includes(s.status?.toLowerCase())).length
                };
                setStats(newStats);
            } else {
                console.error('Track Status - API returned error:', result.message);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const s = status?.toLowerCase() || 'pending';
        if (['hired', 'placed', 'joined', 'selected'].includes(s)) return 'bg-green-100 text-green-800';
        if (['rejected'].includes(s)) return 'bg-red-100 text-red-800';
        if (['interview', 'interview_scheduled', 'interviewed'].includes(s)) return 'bg-purple-100 text-purple-800';
        if (['shortlisted'].includes(s)) return 'bg-blue-100 text-blue-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    // Professional stat card configurations with gradient backgrounds and clear icons
    const statCards = [
        {
            label: 'Total Submissions',
            value: stats.total,
            iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
            cardBg: 'bg-white',
            iconColor: 'text-white',
            valueColor: 'text-gray-900',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
            )
        },
        {
            label: 'Shortlisted',
            value: stats.shortlisted,
            iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
            cardBg: 'bg-white',
            iconColor: 'text-white',
            valueColor: 'text-gray-900',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            )
        },
        {
            label: 'Interviews',
            value: stats.interview,
            iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
            cardBg: 'bg-white',
            iconColor: 'text-white',
            valueColor: 'text-gray-900',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
            )
        },
        {
            label: 'Hired',
            value: stats.hired,
            iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
            cardBg: 'bg-white',
            iconColor: 'text-white',
            valueColor: 'text-gray-900',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
            )
        },
        {
            label: 'Rejected',
            value: stats.rejected,
            iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
            cardBg: 'bg-white',
            iconColor: 'text-white',
            valueColor: 'text-gray-900',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <RecruiterNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Track Applications</h1>
                    </div>
                    <p className="mt-2 text-gray-600 ml-11">Monitor status of all your submitted candidates in real-time.</p>
                </div>

                {/* Stats Cards - Professional Design */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
                    {statCards.map((s, idx) => (
                        <div
                            key={idx}
                            className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
                        >
                            {/* Decorative background element */}
                            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gray-50 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                            <div className="relative flex flex-col h-full">
                                {/* Icon */}
                                <div className={`w-12 h-12 ${s.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-lg ${s.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                    {s.icon}
                                </div>

                                {/* Value */}
                                <p className={`text-3xl font-bold ${s.valueColor} mb-1`}>{s.value}</p>

                                {/* Label */}
                                <p className="text-sm font-medium text-gray-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied For</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium animate-pulse">
                                            Loading submissions...
                                        </td>
                                    </tr>
                                ) : submissions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-1" />
                                                </svg>
                                                <p className="text-lg font-medium text-gray-900">No submissions found</p>
                                                <p className="text-sm text-gray-500 mt-1">Start by uploading a candidate profile.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    submissions.map((submission) => (
                                        <tr key={submission.id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                        {submission.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{submission.name}</div>
                                                        <div className="text-sm text-gray-500">{submission.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{submission.jobTitle}</div>
                                                <div className="text-sm text-gray-500">{submission.company}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${submission.type === 'Application' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                                                    {submission.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(submission.date).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full items-center gap-1 ${getStatusColor(submission.status)} shadow-sm`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                                                    {submission.status ? (submission.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')) : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
