'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { Search, X, Download, FileText, MapPin, Briefcase, Calendar, CheckSquare, Square } from 'lucide-react';

export default function PipelinePage() {
    const [cvs, setCvs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter state
    const [filters, setFilters] = useState({
        search: '',
        status: 'All',
        client: 'All',
        experienceRange: 'All',
        location: 'All',
        dateRange: 'All time',
        sortBy: 'date',
        sortOrder: 'desc'
    });

    // Bulk selection
    const [selectedCvs, setSelectedCvs] = useState(new Set());
    const [showBulkActions, setShowBulkActions] = useState(false);

    // Unique values for filters
    const [uniqueClients, setUniqueClients] = useState([]);
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
                    assignedJob: profile.job_id?.job_title || 'Unassigned',
                    assignedClient: profile.job_id?.postedBy?.fullName || 'N/A',
                    assignedClientCompany: profile.job_id?.postedBy?.company || '',
                    uploadDate: profile.createdAt,
                    lastUpdated: profile.updatedAt,
                    resumeUrl: profile.resume_url || '',
                    uploadedBy: profile.uploaded_by_name || profile.uploaded_by?.fullName || 'Unknown'
                }));

                setCvs(formattedCvs);

                // Extract unique clients and locations
                const clients = [...new Set(formattedCvs
                    .map(cv => cv.assignedClient)
                    .filter(c => c && c !== 'N/A')
                )].sort();
                setUniqueClients(clients);

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
                cv.skills?.some(skill => skill.toLowerCase().includes(searchLower))
            );
        }

        // Status filter
        if (filters.status !== 'All') {
            result = result.filter(cv => cv.status === filters.status);
        }

        // Client filter
        if (filters.client !== 'All') {
            result = result.filter(cv => cv.assignedClient === filters.client);
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
                case 'date':
                    comparison = new Date(a.uploadDate) - new Date(b.uploadDate);
                    break;
            }

            return filters.sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [cvs, filters]);

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
            experienceRange: 'All',
            location: 'All',
            dateRange: 'All time',
            sortBy: 'date',
            sortOrder: 'desc'
        });
    };

    const hasActiveFilters = filters.search || filters.status !== 'All' || filters.client !== 'All' ||
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
        const statusCounts = {};
        allStatuses.slice(1).forEach(status => {
            statusCounts[status] = filteredCvs.filter(cv => cv.status === status).length;
        });

        return { total, statusCounts };
    }, [filteredCvs]);

    return (
        <div className="">
            <main className="p-4 lg:p-8">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-secondary-900 text-2xl font-bold">CV Pipeline</h2>
                        <p className="text-secondary-600">Manage and track candidate resumes through the hiring process</p>
                    </div>
                    <Link href="/admin" className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-secondary-700 hover:bg-gray-50 transition-colors">
                        ← Back
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
                    <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                        <div className="text-xs text-secondary-500 mb-1">Total CVs</div>
                        <div className="text-xl font-bold text-secondary-900">{stats.total}</div>
                    </div>
                    {Object.entries(stats.statusCounts).slice(0, 7).map(([status, count]) => (
                        <div key={status} className="bg-white/70 rounded-lg p-3 border border-gray-200">
                            <div className="text-xs text-secondary-500 mb-1 truncate">{status}</div>
                            <div className="text-xl font-bold text-secondary-900">{count}</div>
                        </div>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="mb-6 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, designation, or skills..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-secondary-900 placeholder-gray-400"
                        />
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

                        {/* Sort By */}
                        <select
                            value={`${filters.sortBy}-${filters.sortOrder}`}
                            onChange={(e) => {
                                const [sortBy, sortOrder] = e.target.value.split('-');
                                setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                            }}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="experience-desc">Experience (High-Low)</option>
                            <option value="experience-asc">Experience (Low-High)</option>
                            <option value="status-asc">Status (A-Z)</option>
                            <option value="date-desc">Uploaded (Newest)</option>
                            <option value="date-asc">Uploaded (Oldest)</option>
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
                                Assign to Job
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-red-600 hover:bg-red-50">
                                Delete Selected
                            </button>
                        </div>
                    </div>
                )}

                {/* CV Grid */}
                <div className="rounded-xl bg-white/50 backdrop-blur-md border border-white/60 shadow-xl shadow-blue-900/5 overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center text-secondary-600">Loading CVs...</div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-600">{error}</div>
                    ) : (
                        <div className="p-6">
                            {/* Select All */}
                            <div className="mb-4 flex items-center gap-2 pb-4 border-b border-gray-200">
                                <button
                                    onClick={toggleSelectAll}
                                    className="flex items-center gap-2 text-sm text-secondary-700 hover:text-secondary-900"
                                >
                                    {selectedCvs.size === filteredCvs.length && filteredCvs.length > 0 ? (
                                        <CheckSquare className="w-5 h-5 text-blue-600" />
                                    ) : (
                                        <Square className="w-5 h-5" />
                                    )}
                                    Select All
                                </button>
                            </div>

                            {/* CV Cards */}
                            {filteredCvs.length === 0 ? (
                                <div className="p-8 text-center text-secondary-500">
                                    {hasActiveFilters ? 'No CVs match your filters' : 'No CVs found'}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredCvs.map((cv) => (
                                        <div
                                            key={cv.id}
                                            className={`bg-white rounded-lg p-4 border-2 transition-all hover:shadow-md ${selectedCvs.has(cv.id) ? 'border-blue-500 shadow-md' : 'border-gray-200'
                                                }`}
                                        >
                                            {/* Selection Checkbox */}
                                            <div className="flex items-start justify-between mb-3">
                                                <button
                                                    onClick={() => toggleSelectCv(cv.id)}
                                                    className="mr-2"
                                                >
                                                    {selectedCvs.has(cv.id) ? (
                                                        <CheckSquare className="w-5 h-5 text-blue-600" />
                                                    ) : (
                                                        <Square className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </button>
                                                <span className={`ml-auto px-2 py-1 text-xs rounded-full border ${getStatusColor(cv.status)}`}>
                                                    {cv.status}
                                                </span>
                                            </div>

                                            {/* Candidate Info */}
                                            <h3 className="font-bold text-secondary-900 mb-1 truncate">{cv.candidateName}</h3>
                                            <p className="text-sm text-secondary-600 mb-3 truncate">{cv.currentDesignation}</p>

                                            {/* Details */}
                                            <div className="space-y-2 text-xs text-secondary-500 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-3 h-3" />
                                                    <span>{cv.experience} years exp</span>
                                                </div>
                                                {cv.location && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="truncate">{cv.location}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{new Date(cv.uploadDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            {/* Skills */}
                                            {cv.skills && cv.skills.length > 0 && (
                                                <div className="mb-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {cv.skills.slice(0, 3).map((skill, idx) => (
                                                            <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {cv.skills.length > 3 && (
                                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                                                +{cv.skills.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Assignment */}
                                            {cv.assignedClient !== 'N/A' && (
                                                <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-xs">
                                                    <div className="font-medium text-green-900">Assigned to</div>
                                                    <div className="text-green-700 truncate">{cv.assignedClient}</div>
                                                    <div className="text-green-600 text-[10px] truncate">{cv.assignedJob}</div>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-3 border-t border-gray-200">
                                                {cv.resumeUrl && (
                                                    <a
                                                        href={cv.resumeUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                                    >
                                                        <FileText className="w-3 h-3" />
                                                        View CV
                                                    </a>
                                                )}
                                                <button className="flex-1 px-3 py-1.5 bg-gray-100 text-secondary-700 text-xs rounded hover:bg-gray-200">
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
