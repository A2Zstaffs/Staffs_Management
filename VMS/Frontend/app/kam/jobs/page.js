'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClientJobs } from '@/lib/kamApi';

export default function KAMJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        search: ''
    });

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getClientJobs(filters);
            if (response.success) {
                setJobs(response.data || []);
            } else {
                setError('Failed to load jobs');
            }
        } catch (err) {
            console.error('Error loading jobs:', err);
            setError(err.message || 'An error occurred while loading jobs');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = !filters.search ||
            job.job_title?.toLowerCase().includes(filters.search.toLowerCase()) ||
            job.company_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
            job.postedBy?.fullName?.toLowerCase().includes(filters.search.toLowerCase());

        const matchesStatus = !filters.status || job.role_status === filters.status;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const colors = {
            'Active': 'bg-green-100 text-green-800 border-green-300',
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Closed': 'bg-gray-100 text-gray-800 border-gray-300',
            'Paused': 'bg-orange-100 text-orange-800 border-orange-300'
        };
        const colorClass = colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
                {status}
            </span>
        );
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
            <div className="mb-6 bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-2xl shadow-lg">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Client Jobs <span className="text-blue-400">.</span>
                </h1>
                <p className="text-slate-300 text-lg">Track and manage all jobs from your assigned clients</p>
                {!isLoading && (
                    <div className="mt-4">
                        <span className="inline-flex items-center px-4 py-2 bg-blue-500/20 text-blue-200 rounded-lg font-semibold text-sm">
                            📊 {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'}
                        </span>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                placeholder="Search by job title, company, or client name..."
                                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Closed">Closed</option>
                            <option value="Paused">Paused</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Jobs Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-600">Loading jobs...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <div className="bg-red-50 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4">
                            {error}
                        </div>
                        <button
                            onClick={loadJobs}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-600">Try adjusting your filters or check back later</p>
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
                                        Location
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Experience
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Salary Range
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Status
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
                                {filteredJobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 mb-1">{job.job_title}</div>
                                            <div className="text-sm text-gray-600 mb-2">{job.company_name}</div>
                                            {job.skills && job.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {job.skills.slice(0, 3).map((skill, idx) => (
                                                        <span key={idx} className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium whitespace-nowrap">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {job.skills.length > 3 && (
                                                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-xs font-semibold whitespace-nowrap">
                                                            +{job.skills.length - 3} more
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
                                            <div className="text-sm text-gray-700">
                                                {Array.isArray(job.locations) ? job.locations.join(', ') : job.locations || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">
                                                {job.experience_min}-{job.experience_max} years
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatSalary(job.salary_min, job.salary_max)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(job.role_status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">{formatDate(job.posted_date)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => router.push(`/kam/jobs/${job._id}`)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors inline-flex items-center"
                                            >
                                                View Details
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => router.push(`/kam/jobs/edit/${job._id}`)}
                                                className="ml-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors inline-flex items-center"
                                            >
                                                Edit
                                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
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
