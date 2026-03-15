'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { Search, X, Download, FileText, MapPin, Briefcase, Calendar, CheckSquare, Square, User, Building2, ChevronDown, ChevronRight, Users } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PipelinePage() {
    const [cvs, setCvs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grouped'
    const [expandedJobs, setExpandedJobs] = useState(new Set());

    // Filter state
    const [filters, setFilters] = useState({
        search: '',
        status: 'All',
        client: 'All',
        job: 'All',
        recruiter: 'All',
        experienceRange: 'All',
        location: 'All',
        dateRange: 'All time',
        sortBy: 'date',
        sortOrder: 'desc'
    });

    // Bulk selection
    const [selectedCvs, setSelectedCvs] = useState(new Set());

    // Unique values for filters
    const [uniqueClients, setUniqueClients] = useState([]);
    const [uniqueJobs, setUniqueJobs] = useState([]);
    const [uniqueRecruiters, setUniqueRecruiters] = useState([]);
    const [uniqueLocations, setUniqueLocations] = useState([]);

    useEffect(() => {
        fetchCvs();
    }, []);

    const fetchCvs = async () => {
        try {
            setIsLoading(true);
            const response = await adminAPI.getProfiles();

            if (response.success && response.data) {
                const formattedCvs = response.data.map(profile => ({
                    id: profile._id,
                    candidateName: profile.candidate_name || 'Unknown',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    currentDesignation: profile.current_designation || 'N/A',
                    experience: profile.total_experience || 0,
                    location: profile.location || '',
                    skills: profile.skills || [],
                    status: capitalize(profile.status || 'applied'),
                    // Job Details
                    jobId: profile.job_id?._id || null,
                    jobTitle: profile.job_id?.job_title || 'Unassigned',
                    companyName: profile.job_id?.company_name || 'N/A',
                    // Client Details
                    clientId: profile.job_id?.postedBy?._id || null,
                    clientName: profile.job_id?.postedBy?.fullName || 'N/A',
                    clientCompany: profile.job_id?.postedBy?.company || profile.job_id?.company_name || '',
                    // Recruiter Details
                    recruiterId: profile.uploaded_by?._id || null,
                    recruiterName: profile.uploaded_by_name || profile.uploaded_by?.fullName || 'Unknown',
                    recruiterEmail: profile.uploaded_by?.email || '',
                    // Dates
                    uploadDate: profile.createdAt,
                    lastUpdated: profile.updatedAt,
                    resumeUrl: profile.resume_url || '',
                    // Additional info
                    currentCtc: profile.current_ctc,
                    expectedCtc: profile.expected_ctc,
                    noticePeriod: profile.notice_period
                }));

                setCvs(formattedCvs);

                // Extract unique values for filters
                const clients = [...new Set(formattedCvs
                    .map(cv => cv.clientName)
                    .filter(c => c && c !== 'N/A')
                )].sort();
                setUniqueClients(clients);

                const jobs = [...new Set(formattedCvs
                    .map(cv => cv.jobTitle)
                    .filter(j => j && j !== 'Unassigned')
                )].sort();
                setUniqueJobs(jobs);

                const recruiters = [...new Set(formattedCvs
                    .map(cv => cv.recruiterName)
                    .filter(r => r && r !== 'Unknown')
                )].sort();
                setUniqueRecruiters(recruiters);

                const locations = [...new Set(formattedCvs
                    .map(cv => cv.location)
                    .filter(l => l && l.trim())
                )].sort();
                setUniqueLocations(locations);
            }
        } catch (err) {
            console.error('Failed to load CVs:', err);
            setError('Failed to load CV data');
        } finally {
            setIsLoading(false);
        }
    };

    const capitalize = (s) => {
        if (!s) return '';
        return s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    // Filtered and sorted CVs
    const filteredCvs = useMemo(() => {
        let result = [...cvs];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(cv =>
                cv.candidateName?.toLowerCase().includes(searchLower) ||
                cv.email?.toLowerCase().includes(searchLower) ||
                cv.phone?.includes(searchLower) ||
                cv.currentDesignation?.toLowerCase().includes(searchLower) ||
                cv.jobTitle?.toLowerCase().includes(searchLower) ||
                cv.clientName?.toLowerCase().includes(searchLower) ||
                cv.recruiterName?.toLowerCase().includes(searchLower) ||
                cv.skills?.some(skill => skill.toLowerCase().includes(searchLower))
            );
        }

        // Status filter
        if (filters.status !== 'All') {
            result = result.filter(cv => cv.status === filters.status);
        }

        // Client filter
        if (filters.client !== 'All') {
            result = result.filter(cv => cv.clientName === filters.client);
        }

        // Job filter
        if (filters.job !== 'All') {
            result = result.filter(cv => cv.jobTitle === filters.job);
        }

        // Recruiter filter
        if (filters.recruiter !== 'All') {
            result = result.filter(cv => cv.recruiterName === filters.recruiter);
        }

        // Location filter
        if (filters.location !== 'All') {
            result = result.filter(cv => cv.location === filters.location);
        }

        // Experience range filter
        if (filters.experienceRange !== 'All') {
            result = result.filter(cv => {
                const exp = cv.experience || 0;
                switch (filters.experienceRange) {
                    case 'Fresher': return exp <= 2;
                    case 'Junior': return exp > 2 && exp <= 5;
                    case 'Mid': return exp > 5 && exp <= 10;
                    case 'Senior': return exp > 10;
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
                result = result.filter(cv => new Date(cv.uploadDate) >= cutoffDate);
            }
        }

        // Sorting
        result.sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
                case 'name':
                    comparison = (a.candidateName || '').localeCompare(b.candidateName || '');
                    break;
                case 'experience':
                    comparison = (a.experience || 0) - (b.experience || 0);
                    break;
                case 'status':
                    comparison = (a.status || '').localeCompare(b.status || '');
                    break;
                case 'job':
                    comparison = (a.jobTitle || '').localeCompare(b.jobTitle || '');
                    break;
                case 'recruiter':
                    comparison = (a.recruiterName || '').localeCompare(b.recruiterName || '');
                    break;
                case 'date':
                    comparison = new Date(a.uploadDate) - new Date(b.uploadDate);
                    break;
            }

            return filters.sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [cvs, filters]);

    // Group CVs by Job
    const groupedByJob = useMemo(() => {
        const groups = {};
        filteredCvs.forEach(cv => {
            const jobKey = cv.jobId || 'unassigned';
            if (!groups[jobKey]) {
                groups[jobKey] = {
                    jobId: cv.jobId,
                    jobTitle: cv.jobTitle,
                    clientName: cv.clientName,
                    clientCompany: cv.clientCompany,
                    cvs: []
                };
            }
            groups[jobKey].cvs.push(cv);
        });
        return Object.values(groups).sort((a, b) => b.cvs.length - a.cvs.length);
    }, [filteredCvs]);

    // Toggle job expansion
    const toggleJobExpansion = (jobId) => {
        const newExpanded = new Set(expandedJobs);
        if (newExpanded.has(jobId)) {
            newExpanded.delete(jobId);
        } else {
            newExpanded.add(jobId);
        }
        setExpandedJobs(newExpanded);
    };

    // Expand all jobs
    const expandAllJobs = () => {
        setExpandedJobs(new Set(groupedByJob.map(g => g.jobId || 'unassigned')));
    };

    // Collapse all jobs
    const collapseAllJobs = () => {
        setExpandedJobs(new Set());
    };

    // Bulk selection handlers
    const toggleSelectAll = () => {
        if (selectedCvs.size === filteredCvs.length) {
            setSelectedCvs(new Set());
        } else {
            setSelectedCvs(new Set(filteredCvs.map(cv => cv.id)));
        }
    };

    const toggleSelectCv = (id) => {
        const newSelected = new Set(selectedCvs);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedCvs(newSelected);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            status: 'All',
            client: 'All',
            job: 'All',
            recruiter: 'All',
            experienceRange: 'All',
            location: 'All',
            dateRange: 'All time',
            sortBy: 'date',
            sortOrder: 'desc'
        });
    };

    const hasActiveFilters = filters.search || filters.status !== 'All' || filters.client !== 'All' ||
        filters.job !== 'All' || filters.recruiter !== 'All' ||
        filters.experienceRange !== 'All' || filters.location !== 'All' || filters.dateRange !== 'All time';

    // Status options for pipeline
    const allStatuses = [
        'All', 'Applied', 'Under Review', 'Shortlisted', 'Sent To Client',
        'Interview', 'Selected', 'Rejected', 'On Hold'
    ];

    // Get status badge color
    const getStatusColor = (status) => {
        const colors = {
            'Applied': 'bg-blue-100 text-blue-700 border-blue-200',
            'Under Review': 'bg-purple-100 text-purple-700 border-purple-200',
            'Shortlisted': 'bg-cyan-100 text-cyan-700 border-cyan-200',
            'Sent To Client': 'bg-indigo-100 text-indigo-700 border-indigo-200',
            'Interview': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'Selected': 'bg-green-100 text-green-700 border-green-200',
            'Rejected': 'bg-red-100 text-red-700 border-red-200',
            'On Hold': 'bg-gray-100 text-gray-700 border-gray-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    // Statistics
    const stats = useMemo(() => {
        const total = filteredCvs.length;
        const uniqueJobsCount = new Set(filteredCvs.map(cv => cv.jobId).filter(Boolean)).size;
        const uniqueRecruitersCount = new Set(filteredCvs.map(cv => cv.recruiterId).filter(Boolean)).size;
        const statusCounts = {};
        allStatuses.slice(1).forEach(status => {
            statusCounts[status] = filteredCvs.filter(cv => cv.status === status).length;
        });

        return { total, uniqueJobsCount, uniqueRecruitersCount, statusCounts };
    }, [filteredCvs]);

    return (
        <div className="">
            <main className="p-4 lg:p-8">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-secondary-900 text-2xl font-bold">CV Pipeline</h2>
                        <p className="text-secondary-600">Track CVs by job and recruiter - manage candidate submissions</p>
                    </div>
                    <Link href="/admin" className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-secondary-700 hover:bg-gray-50 transition-colors">
                        ← Back
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.total}</div>
                                <div className="text-sm text-blue-100">Total CVs</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.uniqueJobsCount}</div>
                                <div className="text-sm text-emerald-100">Active Jobs</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.uniqueRecruitersCount}</div>
                                <div className="text-sm text-purple-100">Recruiters</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <CheckSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.statusCounts['Selected'] || 0}</div>
                                <div className="text-sm text-amber-100">Selected</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="mb-6 space-y-4">
                    {/* Search Bar + View Toggle */}
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by candidate, job, client, or recruiter..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full pl-11 pr-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-secondary-900 placeholder-gray-400"
                            />
                        </div>
                        <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-secondary-600 hover:bg-gray-50'}`}
                            >
                                Table View
                            </button>
                            <button
                                onClick={() => setViewMode('grouped')}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'grouped' ? 'bg-blue-600 text-white' : 'text-secondary-600 hover:bg-gray-50'}`}
                            >
                                Group by Job
                            </button>
                        </div>
                    </div>

                    {/* Status Pills */}
                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                        {allStatuses.map(status => (
                            <button
                                key={status}
                                onClick={() => setFilters(prev => ({ ...prev, status }))}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filters.status === status
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-secondary-600 hover:bg-blue-50 border border-gray-200'
                                    }`}
                            >
                                {status}
                                {status !== 'All' && (
                                    <span className="ml-2 text-xs opacity-75">
                                        ({stats.statusCounts[status] || 0})
                                    </span>
                                )}
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

                        {/* Job Filter */}
                        {uniqueJobs.length > 0 && (
                            <select
                                value={filters.job}
                                onChange={(e) => setFilters(prev => ({ ...prev, job: e.target.value }))}
                                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All Jobs</option>
                                {uniqueJobs.map(job => (
                                    <option key={job} value={job}>{job}</option>
                                ))}
                            </select>
                        )}

                        {/* Recruiter Filter */}
                        {uniqueRecruiters.length > 0 && (
                            <select
                                value={filters.recruiter}
                                onChange={(e) => setFilters(prev => ({ ...prev, recruiter: e.target.value }))}
                                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All Recruiters</option>
                                {uniqueRecruiters.map(recruiter => (
                                    <option key={recruiter} value={recruiter}>{recruiter}</option>
                                ))}
                            </select>
                        )}

                        {/* Location Filter */}
                        {uniqueLocations.length > 0 && (
                            <select
                                value={filters.location}
                                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All Locations</option>
                                {uniqueLocations.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        )}

                        {/* Experience Range */}
                        <select
                            value={filters.experienceRange}
                            onChange={(e) => setFilters(prev => ({ ...prev, experienceRange: e.target.value }))}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="All">All Experience</option>
                            <option value="Fresher">Fresher (0-2 yrs)</option>
                            <option value="Junior">Junior (2-5 yrs)</option>
                            <option value="Mid">Mid (5-10 yrs)</option>
                            <option value="Senior">Senior (10+ yrs)</option>
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
                            Showing <span className="font-semibold text-secondary-900">{filteredCvs.length}</span> of {cvs.length} CVs
                        </div>
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedCvs.size > 0 && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-secondary-900">
                                {selectedCvs.size} CV{selectedCvs.size > 1 ? 's' : ''} selected
                            </span>
                            <button
                                onClick={() => setSelectedCvs(new Set())}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Clear Selection
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-secondary-700 hover:bg-gray-50">
                                Change Status
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-secondary-700 hover:bg-gray-50">
                                Export Selected
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                    {isLoading ? (
                        <LoadingSpinner variant="logo" size="lg" message="Loading CVs..." />
                    ) : error ? (
                        <div className="p-8 text-center text-red-600">{error}</div>
                    ) : filteredCvs.length === 0 ? (
                        <div className="p-8 text-center text-secondary-500">
                            {hasActiveFilters ? 'No CVs match your filters' : 'No CVs found'}
                        </div>
                    ) : viewMode === 'table' ? (
                        /* Table View */
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left">
                                            <button onClick={toggleSelectAll} className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                {selectedCvs.size === filteredCvs.length && filteredCvs.length > 0 ? (
                                                    <CheckSquare className="w-4 h-4 text-blue-600" />
                                                ) : (
                                                    <Square className="w-4 h-4" />
                                                )}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Candidate
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                <Briefcase className="w-3 h-3" />
                                                Job Applied To
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                <Building2 className="w-3 h-3" />
                                                Client
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                Uploaded By
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Experience
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Submitted
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredCvs.map((cv) => (
                                        <tr key={cv.id} className={`hover:bg-gray-50 transition-colors ${selectedCvs.has(cv.id) ? 'bg-blue-50' : ''}`}>
                                            <td className="px-4 py-3">
                                                <button onClick={() => toggleSelectCv(cv.id)}>
                                                    {selectedCvs.has(cv.id) ? (
                                                        <CheckSquare className="w-4 h-4 text-blue-600" />
                                                    ) : (
                                                        <Square className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <div className="font-medium text-secondary-900">{cv.candidateName}</div>
                                                    <div className="text-xs text-secondary-500">{cv.currentDesignation}</div>
                                                    <div className="text-xs text-secondary-400">{cv.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="max-w-[200px]">
                                                    <div className="font-medium text-secondary-900 truncate">{cv.jobTitle}</div>
                                                    <div className="text-xs text-secondary-500 truncate">{cv.companyName}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="max-w-[150px]">
                                                    <div className="font-medium text-secondary-900 truncate">{cv.clientName}</div>
                                                    {cv.clientCompany && cv.clientCompany !== cv.clientName && (
                                                        <div className="text-xs text-secondary-500 truncate">{cv.clientCompany}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                                                        <User className="w-3.5 h-3.5 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-secondary-900 text-sm">{cv.recruiterName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(cv.status)}`}>
                                                    {cv.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-secondary-900">{cv.experience} yrs</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-secondary-600">
                                                    {new Date(cv.uploadDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    {cv.resumeUrl && (
                                                        <a
                                                            href={cv.resumeUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                                                        >
                                                            View CV
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* Grouped by Job View */
                        <div className="p-4">
                            <div className="flex justify-end gap-2 mb-4">
                                <button
                                    onClick={expandAllJobs}
                                    className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                >
                                    Expand All
                                </button>
                                <button
                                    onClick={collapseAllJobs}
                                    className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                >
                                    Collapse All
                                </button>
                            </div>

                            <div className="space-y-4">
                                {groupedByJob.map((group) => {
                                    const jobKey = group.jobId || 'unassigned';
                                    const isExpanded = expandedJobs.has(jobKey);

                                    return (
                                        <div key={jobKey} className="border border-gray-200 rounded-xl overflow-hidden">
                                            {/* Job Header */}
                                            <button
                                                onClick={() => toggleJobExpansion(jobKey)}
                                                className="w-full px-4 py-4 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between hover:from-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {isExpanded ? (
                                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                                    ) : (
                                                        <ChevronRight className="w-5 h-5 text-gray-500" />
                                                    )}
                                                    <div className="text-left">
                                                        <div className="flex items-center gap-2">
                                                            <Briefcase className="w-4 h-4 text-blue-600" />
                                                            <span className="font-semibold text-secondary-900">{group.jobTitle}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-1 text-sm text-secondary-500">
                                                            <span className="flex items-center gap-1">
                                                                <Building2 className="w-3 h-3" />
                                                                Client: {group.clientName}
                                                            </span>
                                                            {group.clientCompany && (
                                                                <span>• {group.clientCompany}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                                                        {group.cvs.length} CV{group.cvs.length > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </button>

                                            {/* CVs under this job */}
                                            {isExpanded && (
                                                <div className="border-t border-gray-200">
                                                    <table className="w-full">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Candidate</th>
                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                                                                    <span className="flex items-center gap-1">
                                                                        <User className="w-3 h-3" />
                                                                        Recruiter
                                                                    </span>
                                                                </th>
                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Experience</th>
                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Submitted</th>
                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {group.cvs.map((cv) => (
                                                                <tr key={cv.id} className="hover:bg-gray-50">
                                                                    <td className="px-4 py-3">
                                                                        <div>
                                                                            <div className="font-medium text-secondary-900">{cv.candidateName}</div>
                                                                            <div className="text-xs text-secondary-500">{cv.currentDesignation}</div>
                                                                            <div className="text-xs text-secondary-400">{cv.email}</div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                                                                <User className="w-3 h-3 text-purple-600" />
                                                                            </div>
                                                                            <span className="font-medium text-secondary-900 text-sm">{cv.recruiterName}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-secondary-700">{cv.experience} yrs</td>
                                                                    <td className="px-4 py-3 text-sm text-secondary-700">{cv.location || 'N/A'}</td>
                                                                    <td className="px-4 py-3">
                                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(cv.status)}`}>
                                                                            {cv.status}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-secondary-600">
                                                                        {new Date(cv.uploadDate).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {cv.resumeUrl && (
                                                                            <a
                                                                                href={cv.resumeUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                                                            >
                                                                                View CV
                                                                            </a>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
