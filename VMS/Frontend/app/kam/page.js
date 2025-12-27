'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getKAMDashboard, getPendingJobs, approveJob, rejectJob } from '@/lib/kamApi';

export default function KAMDashboard() {
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState(null);
    const [pendingJobs, setPendingJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadDashboard();
        loadPendingJobs();
    }, []);

    const loadDashboard = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getKAMDashboard();
            if (response.success) {
                setDashboardData(response.data);
            } else {
                setError('Failed to load dashboard data');
            }
        } catch (err) {
            console.error('Error loading dashboard:', err);
            setError(err.message || 'An error occurred while loading dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    const loadPendingJobs = async () => {
        try {
            const response = await getPendingJobs();
            if (response.success) {
                setPendingJobs(response.data || []);
            }
        } catch (err) {
            console.error('Error loading pending jobs:', err);
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
                loadDashboard(); // Refresh stats
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    const stats = dashboardData?.stats || {};

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Welcome Back <span className="text-blue-600">!</span>
                </h1>
                <p className="text-gray-600 text-lg">Here's your account activity overview</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {/* Assigned Clients Card */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-blue-100 text-sm font-medium mb-1">Assigned Clients</p>
                        <p className="text-4xl font-bold">{stats.assignedClients || 0}</p>
                    </div>
                </div>

                {/* Active Jobs Card */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-green-100 text-sm font-medium mb-1">Active Jobs</p>
                        <p className="text-4xl font-bold">{stats.activeJobs || 0}</p>
                    </div>
                </div>

                {/* Total CVs Card */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-purple-100 text-sm font-medium mb-1">Total Applications</p>
                        <p className="text-4xl font-bold">{stats.totalCVs || 0}</p>
                    </div>
                </div>

                {/* Shortlisted CVs Card */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-orange-100 text-sm font-medium mb-1">Shortlisted</p>
                        <p className="text-4xl font-bold">{stats.shortlistedCVs || 0}</p>
                    </div>
                </div>

                {/* Pending Approvals Card */}
                <div
                    onClick={() => router.push('/kam/pending-jobs')}
                    className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-red-100 text-sm font-medium mb-1">Pending Approvals</p>
                        <p className="text-4xl font-bold">{stats.pendingJobApprovals || 0}</p>
                        <p className="text-red-100 text-xs mt-2">Click to view all →</p>
                    </div>
                </div>
            </div>

            {/* Pending Job Approvals Section */}
            {pendingJobs.length > 0 && (
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-t-2xl">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    Pending Job Approvals ⏳
                                </h2>
                                <p className="text-orange-100">Review and approve jobs posted by your assigned clients</p>
                            </div>
                            <button
                                onClick={() => router.push('/kam/pending-jobs')}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors backdrop-blur-sm"
                            >
                                View All →
                            </button>
                        </div>
                        <div className="mt-3">
                            <span className="inline-flex items-center px-3 py-1 bg-white/20 text-white rounded-lg text-sm font-semibold backdrop-blur-sm">
                                {pendingJobs.length} {pendingJobs.length === 1 ? 'Job' : 'Jobs'} Awaiting Approval
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-b-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="divide-y divide-gray-200">
                            {pendingJobs.map((job) => (
                                <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                    {job.postedBy?.fullName?.charAt(0) || 'C'}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{job.job_title}</h3>
                                                    <p className="text-sm text-gray-600 mb-3">{job.company_name}</p>
                                                    <div className="flex flex-wrap gap-3 text-sm mb-3">
                                                        <span className="inline-flex items-center text-gray-700">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            {job.postedBy?.fullName || 'Unknown'}
                                                        </span>
                                                        <span className="inline-flex items-center text-gray-700">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {formatSalary(job.salary_min, job.salary_max)}
                                                        </span>
                                                        <span className="inline-flex items-center text-gray-700">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                            {job.experience_min}-{job.experience_max} years
                                                        </span>
                                                    </div>
                                                    {job.skills && job.skills.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {job.skills.slice(0, 4).map((skill, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                            {job.skills.length > 4 && (
                                                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                                                                    +{job.skills.length - 4} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => openModal(job, 'approve')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => openModal(job, 'reject')}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => router.push('/kam/clients')}
                        className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
                    >
                        <div className="flex items-center mb-3">
                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-500 transition-colors">
                                <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="ml-3 text-lg font-semibold text-gray-900">View Clients</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Manage your assigned clients and their details</p>
                    </button>

                    <button
                        onClick={() => router.push('/kam/jobs')}
                        className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all text-left group"
                    >
                        <div className="flex items-center mb-3">
                            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-500 transition-colors">
                                <svg className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="ml-3 text-lg font-semibold text-gray-900">Browse Jobs</h3>
                        </div>
                        <p className="text-gray-600 text-sm">View all jobs posted by your clients</p>
                    </button>

                    <button
                        onClick={() => router.push('/kam/applications')}
                        className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all text-left group"
                    >
                        <div className="flex items-center mb-3">
                            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-500 transition-colors">
                                <svg className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="ml-3 text-lg font-semibold text-gray-900">View Applications</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Review all candidate applications</p>
                    </button>
                </div>
            </div>

            {/* Recent Clients */}
            {dashboardData?.recentClients && dashboardData.recentClients.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Clients</h2>
                    <div className="space-y-3">
                        {dashboardData.recentClients.map((client) => (
                            <div
                                key={client._id}
                                onClick={() => router.push(`/kam/clients/${client._id}`)}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {client.fullName?.charAt(0) || 'C'}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-gray-900">{client.fullName || 'Unknown Client'}</h3>
                                        <p className="text-sm text-gray-600">{client.company || client.email}</p>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Approval Modal */}
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
