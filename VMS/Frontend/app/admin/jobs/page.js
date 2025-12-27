'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { jobsMock } from '../data/adminData';
import { Search, X } from 'lucide-react';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter state
    const [filters, setFilters] = useState({
        search: '',
        status: 'All',
        client: 'All',
        salaryRange: 'All',
        experienceRange: 'All',
        applicantsCount: 'All',
        dateRange: 'All time',
        sortBy: 'date',
        sortOrder: 'desc'
    });

    // Unique clients for dropdown
    const [uniqueClients, setUniqueClients] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setIsLoading(true);
            try {
                const response = await adminAPI.getJobs();
                if (response.success && response.data) {
                    const formattedJobs = response.data.map(job => ({
                        id: job._id,
                        title: job.job_title || job.job_role || 'Untitled Job',
                        company: job.company_name || 'Unknown Company',
                        clientName: job.postedBy?.fullName || job.client_id?.fullName || 'Unknown Client',
                        clientCompany: job.postedBy?.company || job.client_id?.company || 'N/A',
                        applicants: job.applicationsCount || job.applicant_count || 0,
                        status: capitalize(job.role_status || 'pending'),
                        salaryMax: job.salary_max || 0,
                        experienceMax: job.experience_max || 0,
                        postedDate: job.posted_date || job.createdAt,
                        locations: job.locations || []
                    }));
                    setJobs(formattedJobs);

                    // Extract unique clients
                    const clients = [...new Set(formattedJobs
                        .map(j => j.clientName)
                        .filter(name => name && name !== 'Unknown Client')
                    )].sort();
                    setUniqueClients(clients);

                    return;
                }
            } catch (apiError) {
                console.warn('API fetch failed, using mock data:', apiError);
            }

            // Fallback to mock data
            setJobs(jobsMock);
        } catch (err) {
            console.error('Failed to load jobs:', err);
            setError('Failed to load jobs');
        } finally {
            setIsLoading(false);
        }
    };

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    // Filtered and sorted jobs
    const filteredJobs = useMemo(() => {
        let result = [...jobs];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(job =>
                job.title?.toLowerCase().includes(searchLower) ||
                job.company?.toLowerCase().includes(searchLower) ||
                job.clientName?.toLowerCase().includes(searchLower)
            );
        }

        // Status filter
        if (filters.status !== 'All') {
            result = result.filter(job => job.status === filters.status);
        }

        // Client filter
        if (filters.client !== 'All') {
            result = result.filter(job => job.clientName === filters.client);
        }

        // Salary range filter
        if (filters.salaryRange !== 'All') {
            result = result.filter(job => {
                const salary = job.salaryMax || 0;
                switch (filters.salaryRange) {
                    case 'Entry': return salary < 500000;
                    case 'Mid': return salary >= 500000 && salary < 1000000;
                    case 'Senior': return salary >= 1000000 && salary < 2000000;
                    case 'Leadership': return salary >= 2000000;
                    default: return true;
                }
            });
        }

        // Experience range filter
        if (filters.experienceRange !== 'All') {
            result = result.filter(job => {
                const exp = job.experienceMax || 0;
                switch (filters.experienceRange) {
                    case 'Fresher': return exp <= 2;
                    case 'Mid': return exp > 2 && exp <= 5;
                    case 'Senior': return exp > 5 && exp <= 10;
                    case 'Expert': return exp > 10;
                    default: return true;
                }
            });
        }

        // Applicants count filter
        if (filters.applicantsCount !== 'All') {
            result = result.filter(job => {
                const count = job.applicants || 0;
                switch (filters.applicantsCount) {
                    case 'None': return count === 0;
                    case 'Low': return count >= 1 && count <= 5;
                    case 'Medium': return count >= 6 && count <= 15;
                    case 'High': return count >= 16;
                    default: return true;
                }
            });
        }

        // Date range filter
        if (filters.dateRange !== 'All time') {
            const now = new Date();
            const days = {
                'Last 7 days': 7,
                'Last 30 days': 30,
                'Last 90 days': 90
            }[filters.dateRange];

            if (days) {
                const cutoffDate = new Date(now.setDate(now.getDate() - days));
                result = result.filter(job => new Date(job.postedDate) >= cutoffDate);
            }
        }

        // Sorting
        result.sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
                case 'title':
                    comparison = (a.title || '').localeCompare(b.title || '');
                    break;
                case 'company':
                    comparison = (a.company || '').localeCompare(b.company || '');
                    break;
                case 'client':
                    comparison = (a.clientName || '').localeCompare(b.clientName || '');
                    break;
                case 'applicants':
                    comparison = (a.applicants || 0) - (b.applicants || 0);
                    break;
                case 'salary':
                    comparison = (a.salaryMax || 0) - (b.salaryMax || 0);
                    break;
                case 'date':
                    comparison = new Date(a.postedDate) - new Date(b.postedDate);
                    break;
            }

            return filters.sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [jobs, filters]);

    const toggleStatus = async (id, currentStatus) => {
        try {
            let newStatus;
            if (currentStatus === 'Pending') newStatus = 'Active';
            else if (currentStatus === 'Active') newStatus = 'Paused';
            else newStatus = 'Active';

            const response = await adminAPI.updateJobStatus(id, newStatus);

            if (response.success) {
                setJobs(prev => prev.map(job =>
                    job.id === id ? { ...job, status: capitalize(newStatus) } : job
                ));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            status: 'All',
            client: 'All',
            salaryRange: 'All',
            experienceRange: 'All',
            applicantsCount: 'All',
            dateRange: 'All time',
            sortBy: 'date',
            sortOrder: 'desc'
        });
    };

    const hasActiveFilters = filters.search || filters.status !== 'All' || filters.client !== 'All' ||
        filters.salaryRange !== 'All' || filters.experienceRange !== 'All' ||
        filters.applicantsCount !== 'All' || filters.dateRange !== 'All time';

    return (
        <div className="">
            <main className="p-4 lg:p-8">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-secondary-900 text-2xl font-bold">Jobs Management</h2>
                        <p className="text-secondary-600">Review and manage job postings</p>
                    </div>
                    <Link href="/admin" className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-secondary-700 hover:bg-gray-50 transition-colors">
                        ← Back
                    </Link>
                </div>

                {/* Filter Bar */}
                <div className="mb-6 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by job title, company, or client..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-secondary-900 placeholder-gray-400"
                        />
                    </div>

                    {/* Status Pills */}
                    <div className="flex flex-wrap gap-2">
                        {['All', 'Active', 'Pending', 'Paused', 'Closed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilters(prev => ({ ...prev, status }))}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.status === status
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white text-secondary-600 hover:bg-blue-50 border border-gray-200'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Additional Filters */}
                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Client Filter */}
                        {uniqueClients.length > 0 && (
                            <select
                                value={filters.client}
                                onChange={(e) => setFilters(prev => ({ ...prev, client: e.target.value }))}
                                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All Clients</option>
                                {uniqueClients.map(client => (
                                    <option key={client} value={client}>{client}</option>
                                ))}
                            </select>
                        )}

                        {/* Salary Range */}
                        <select
                            value={filters.salaryRange}
                            onChange={(e) => setFilters(prev => ({ ...prev, salaryRange: e.target.value }))}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All">All Salaries</option>
                            <option value="Entry">Entry (&lt; 5 LPA)</option>
                            <option value="Mid">Mid (5-10 LPA)</option>
                            <option value="Senior">Senior (10-20 LPA)</option>
                            <option value="Leadership">Leadership (20+ LPA)</option>
                        </select>

                        {/* Experience Range */}
                        <select
                            value={filters.experienceRange}
                            onChange={(e) => setFilters(prev => ({ ...prev, experienceRange: e.target.value }))}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All">All Experience</option>
                            <option value="Fresher">Fresher (0-2 yrs)</option>
                            <option value="Mid">Mid (2-5 yrs)</option>
                            <option value="Senior">Senior (5-10 yrs)</option>
                            <option value="Expert">Expert (10+ yrs)</option>
                        </select>

                        {/* Applicants Count */}
                        <select
                            value={filters.applicantsCount}
                            onChange={(e) => setFilters(prev => ({ ...prev, applicantsCount: e.target.value }))}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All">All Applicants</option>
                            <option value="None">None (0)</option>
                            <option value="Low">Low (1-5)</option>
                            <option value="Medium">Medium (6-15)</option>
                            <option value="High">High (16+)</option>
                        </select>

                        {/* Date Range */}
                        <select
                            value={filters.dateRange}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All time">All Time</option>
                            <option value="Last 7 days">Last 7 Days</option>
                            <option value="Last 30 days">Last 30 Days</option>
                            <option value="Last 90 days">Last 90 Days</option>
                        </select>

                        {/* Sort By */}
                        <select
                            value={`${filters.sortBy}-${filters.sortOrder}`}
                            onChange={(e) => {
                                const [sortBy, sortOrder] = e.target.value.split('-');
                                setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                            }}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="title-asc">Job Title (A-Z)</option>
                            <option value="title-desc">Job Title (Z-A)</option>
                            <option value="company-asc">Company (A-Z)</option>
                            <option value="company-desc">Company (Z-A)</option>
                            <option value="client-asc">Client (A-Z)</option>
                            <option value="client-desc">Client (Z-A)</option>
                            <option value="applicants-desc">Applicants (High-Low)</option>
                            <option value="applicants-asc">Applicants (Low-High)</option>
                            <option value="salary-desc">Salary (High-Low)</option>
                            <option value="salary-asc">Salary (Low-High)</option>
                            <option value="date-desc">Posted (Newest)</option>
                            <option value="date-asc">Posted (Oldest)</option>
                        </select>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-secondary-700 text-sm transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Clear Filters
                            </button>
                        )}

                        {/* Results Count */}
                        <div className="ml-auto text-sm text-secondary-600">
                            Showing <span className="font-semibold text-secondary-900">{filteredJobs.length}</span> of {jobs.length} jobs
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white/50 backdrop-blur-md border border-white/60 shadow-xl shadow-blue-900/5 overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center text-secondary-600">Loading jobs...</div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-600">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-white/50">
                                        <th className="p-4 text-secondary-600 font-semibold text-sm">Job Title</th>
                                        <th className="p-4 text-secondary-600 font-semibold text-sm">Company</th>
                                        <th className="p-4 text-secondary-600 font-semibold text-sm">Posted By</th>
                                        <th className="p-4 text-secondary-600 font-semibold text-sm text-center">Applicants</th>
                                        <th className="p-4 text-secondary-600 font-semibold text-sm">Status</th>
                                        <th className="p-4 text-secondary-600 font-semibold text-sm text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredJobs.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-secondary-500">
                                                {hasActiveFilters ? 'No jobs match your filters' : 'No jobs found'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredJobs.map((job) => (
                                            <tr key={job.id} className="hover:bg-white/60 transition-colors">
                                                <td className="p-4 text-secondary-900 font-medium">{job.title}</td>
                                                <td className="p-4 text-secondary-600">{job.company}</td>
                                                <td className="p-4 text-secondary-600">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-secondary-900">{job.clientName}</span>
                                                        <span className="text-xs text-secondary-500">{job.clientCompany}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-secondary-600 text-center font-mono">{job.applicants}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full border ${job.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                                                            job.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                                job.status === 'Paused' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                                    'bg-gray-100 text-gray-700 border-gray-200'
                                                        }`}>
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => toggleStatus(job.id, job.status)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        {job.status === 'Active' ? 'Pause' :
                                                            job.status === 'Pending' ? 'Approve' : 'Activate'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
