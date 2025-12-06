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
            const token = localStorage.getItem('authToken');
            // Re-using dashboard endpoint for now as it contains all data
            // Ideally should be a dedicated endpoint /api/recruiter/submissions
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/recruiter`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();

            if (result.success) {
                const { submittedCandidates, uploadedProfiles } = result.data;

                // Combine and format data
                const combined = [
                    ...submittedCandidates.map(c => ({
                        id: c._id,
                        name: c.candidate.fullName,
                        email: c.candidate.email,
                        jobTitle: c.job.title,
                        company: c.job.postedBy.company,
                        status: c.status,
                        date: c.createdAt,
                        type: 'Application'
                    })),
                    ...uploadedProfiles.map(p => ({
                        id: p._id,
                        name: p.candidate_name,
                        email: p.email,
                        jobTitle: p.job_id?.job_title || 'N/A',
                        company: p.job_id?.company_name || 'N/A',
                        status: p.status,
                        date: p.createdAt,
                        type: 'Uploaded Profile'
                    }))
                ].sort((a, b) => new Date(b.date) - new Date(a.date));

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

    // Specific icons for better visibility
    const statCards = [
        {
            label: 'Total Applications',
            value: stats.total,
            color: 'text-blue-700',
            bg: 'bg-blue-100',
            border: 'border-blue-200',
            gradient: 'from-blue-50 to-white',
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-1'
        },
        {
            label: 'Shortlisted',
            value: stats.shortlisted,
            color: 'text-amber-700',
            bg: 'bg-amber-100',
            border: 'border-amber-200',
            gradient: 'from-amber-50 to-white',
            icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
        },
        {
            label: 'Interviews',
            value: stats.interview,
            color: 'text-purple-700',
            bg: 'bg-purple-100',
            border: 'border-purple-200',
            gradient: 'from-purple-50 to-white',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
        },
        {
            label: 'Hires',
            value: stats.hired,
            color: 'text-emerald-700',
            bg: 'bg-emerald-100',
            border: 'border-emerald-200',
            gradient: 'from-emerald-50 to-white',
            icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
        },
        {
            label: 'Rejected',
            value: stats.rejected,
            color: 'text-red-700',
            bg: 'bg-red-100',
            border: 'border-red-200',
            gradient: 'from-red-50 to-white',
            icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <RecruiterNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Track Applications</h1>
                    <p className="mt-2 text-gray-600">Monitor status of all your submitted candidates in real-time.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
                    {statCards.map((s, idx) => (
                        <div
                            key={idx}
                            className={`relative overflow-hidden bg-gradient-to-br ${s.gradient} border ${s.border} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group`}
                        >
                            <div className="flex flex-col h-full justify-between">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${s.bg} ${s.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">{s.value}</p>
                                    <p className="text-sm font-medium text-gray-500">{s.label}</p>
                                </div>
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
