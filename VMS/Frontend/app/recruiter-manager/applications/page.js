'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowLeft, Search, Filter } from 'lucide-react';
import * as recruiterManagerAPI from '@/lib/recruiterManagerApi';

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        let filtered = applications;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(app =>
                app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.job_id?.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(app => app.status === selectedStatus);
        }

        setFilteredApplications(filtered);
    }, [searchTerm, selectedStatus, applications]);

    const fetchApplications = async () => {
        try {
            setIsLoading(true);
            const response = await recruiterManagerAPI.getApplications();
            if (response.success) {
                setApplications(response.data);
                setFilteredApplications(response.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const statusOptions = [
        { value: 'all', label: 'All Applications' },
        { value: 'Shortlisted', label: 'Shortlisted' },
        { value: 'Interview Scheduled', label: 'Interview Scheduled' },
        { value: 'Offered', label: 'Offered' },
        { value: 'Hired', label: 'Hired' },
        { value: 'Rejected', label: 'Rejected' }
    ];

    const getStatusColor = (status) => {
        const colors = {
            'Shortlisted': 'bg-blue-500/20 text-blue-300',
            'Interview Scheduled': 'bg-yellow-500/20 text-yellow-300',
            'Offered': 'bg-green-500/20 text-green-300',
            'Hired': 'bg-emerald-500/20 text-emerald-300',
            'Rejected': 'bg-red-500/20 text-red-300'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-600';
    };

    const getStatusCount = (status) => {
        if (status === 'all') return applications.length;
        return applications.filter(app => app.status === status).length;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
                        <p className="text-gray-600">Track application status and progress</p>
                    </div>
                    <Link
                        href="/recruiter-manager/dashboard"
                        className="px-4 py-2 bg-white/10 border border-white/20 text-gray-900 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by candidate or job..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value} className="bg-slate-800">
                                    {option.label} ({getStatusCount(option.value)})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Total</p>
                        <p className="text-2xl font-bold text-gray-900">{getStatusCount('all')}</p>
                    </div>
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Shortlisted</p>
                        <p className="text-2xl font-bold text-blue-300">{getStatusCount('Shortlisted')}</p>
                    </div>
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Interviews</p>
                        <p className="text-2xl font-bold text-yellow-300">{getStatusCount('Interview Scheduled')}</p>
                    </div>
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Hired</p>
                        <p className="text-2xl font-bold text-green-300">{getStatusCount('Hired')}</p>
                    </div>
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-600">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            Loading applications...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-400">Error: {error}</div>
                    ) : filteredApplications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {searchTerm || selectedStatus !== 'all'
                                ? 'No applications found matching your filters'
                                : 'No applications yet'}
                        </div>
                    ) : (
                        filteredApplications.map((application) => (
                            <div key={application._id} className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:bg-white/15 transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{application.name}</h3>
                                                <p className="text-sm text-gray-500">{application.email}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                                {application.status}
                                            </span>
                                        </div>

                                        {application.job_id && (
                                            <div className="mb-3 p-3 bg-white/5 rounded-lg">
                                                <p className="text-sm text-gray-500 mb-1">Applied for:</p>
                                                <p className="text-gray-900 font-medium">{application.job_id.job_title}</p>
                                                {application.job_id.company_name && (
                                                    <p className="text-xs text-gray-500">{application.job_id.company_name}</p>
                                                )}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            {application.phone && (
                                                <div>
                                                    <span className="text-gray-500">Phone:</span>
                                                    <span className="text-gray-900 ml-2">{application.phone}</span>
                                                </div>
                                            )}
                                            {application.experience && (
                                                <div>
                                                    <span className="text-gray-500">Experience:</span>
                                                    <span className="text-gray-900 ml-2">{application.experience} years</span>
                                                </div>
                                            )}
                                        </div>

                                        {application.skills && application.skills.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {application.skills.slice(0, 5).map((skill, index) => (
                                                    <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-500">
                                    <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                                    {application.uploaded_by && (
                                        <span>Recruiter: {application.uploaded_by.fullName || application.uploaded_by.email}</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
