'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { candidatesMock } from '../data/adminData';
import CandidateModal from './CandidateModal';
import { Search, X, AlertTriangle } from 'lucide-react';

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Enhanced filter state
    const [filters, setFilters] = useState({
        search: '',
        status: 'All',
        location: 'All',
        experienceRange: 'All',
        dateRange: 'All time',
        recruiter: 'All',
        sortBy: 'date',
        sortOrder: 'desc'
    });

    // Modal state
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Delete confirmation modal state
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        candidateId: null,
        candidateName: ''
    });

    // Track unique locations and recruiters for filter
    const [uniqueLocations, setUniqueLocations] = useState([]);
    const [uniqueRecruiters, setUniqueRecruiters] = useState([]);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            setIsLoading(true);
            try {
                const response = await adminAPI.getProfiles();
                if (response.success && response.data) {
                    const formattedCandidates = response.data.map(profile => ({
                        id: profile._id,
                        name: profile.candidate_name || 'Unknown Candidate',
                        email: profile.email || '',
                        role: profile.current_designation || 'N/A',
                        location: profile.location || '',
                        experience: profile.total_experience || 0,
                        skills: profile.skills || [],
                        date: profile.createdAt,
                        status: capitalize(profile.status || 'Applied'),
                        recruiter: profile.uploaded_by?.name || profile.uploaded_by?.fullName || 'Unknown'
                    }));
                    setCandidates(formattedCandidates);

                    // Extract unique locations
                    const locations = [...new Set(formattedCandidates
                        .map(c => c.location)
                        .filter(loc => loc && loc.trim())
                    )].sort();
                    setUniqueLocations(locations);

                    // Extract unique recruiters
                    const recruiters = [...new Set(formattedCandidates
                        .map(c => c.recruiter)
                        .filter(rec => rec && rec.trim() && rec !== 'Unknown')
                    )].sort();
                    setUniqueRecruiters(recruiters);

                    return;
                }
            } catch (apiError) {
                console.warn('API fetch failed, using mock data:', apiError);
            }

            // Fallback to mock data
            setCandidates(candidatesMock);
        } catch (err) {
            console.error('Failed to load candidates:', err);
            setError('Failed to load candidates');
        } finally {
            setIsLoading(false);
        }
    };

    const capitalize = (s) => s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    // Get filtered and sorted candidates
    const filteredCandidates = useMemo(() => {
        let result = [...candidates];

        // Search filter (name, email, or role)
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(candidate =>
                candidate.name?.toLowerCase().includes(searchLower) ||
                candidate.email?.toLowerCase().includes(searchLower) ||
                candidate.role?.toLowerCase().includes(searchLower)
            );
        }

        // Status filter
        if (filters.status !== 'All') {
            result = result.filter(c => c.status === filters.status);
        }

        // Location filter
        if (filters.location !== 'All') {
            result = result.filter(c => c.location === filters.location);
        }

        // Experience range filter
        if (filters.experienceRange !== 'All') {
            result = result.filter(c => {
                const exp = c.experience || 0;
                switch (filters.experienceRange) {
                    case 'Fresher': return exp >= 0 && exp <= 1;
                    case 'Junior': return exp > 1 && exp <= 3;
                    case 'Mid-level': return exp > 3 && exp <= 6;
                    case 'Senior': return exp > 6 && exp <= 10;
                    case 'Expert': return exp > 10;
                    default: return true;
                }
            });
        }

        // Recruiter filter
        if (filters.recruiter !== 'All') {
            result = result.filter(c => c.recruiter === filters.recruiter);
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
                result = result.filter(candidate => new Date(candidate.date) >= cutoffDate);
            }
        }

        // Sorting
        result.sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
                case 'name':
                    comparison = (a.name || '').localeCompare(b.name || '');
                    break;
                case 'role':
                    comparison = (a.role || '').localeCompare(b.role || '');
                    break;
                case 'recruiter':
                    comparison = (a.recruiter || '').localeCompare(b.recruiter || '');
                    break;
                case 'date':
                    comparison = new Date(a.date) - new Date(b.date);
                    break;
            }

            return filters.sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [candidates, filters]);

    const handleAction = (id, action) => {
        if (action === 'view') {
            setSelectedCandidateId(id);
            setIsModalOpen(true);
        } else if (action === 'delete') {
            const candidate = candidates.find(c => c.id === id);
            setDeleteConfirmation({
                isOpen: true,
                candidateId: id,
                candidateName: candidate?.name || 'this candidate'
            });
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await adminAPI.deleteProfile(deleteConfirmation.candidateId);
            setCandidates(prev => prev.filter(c => c.id !== deleteConfirmation.candidateId));
            setDeleteConfirmation({ isOpen: false, candidateId: null, candidateName: '' });
        } catch (error) {
            console.error('Failed to delete candidate:', error);
            alert('Failed to delete candidate. Please try again.');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmation({ isOpen: false, candidateId: null, candidateName: '' });
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            status: 'All',
            location: 'All',
            experienceRange: 'All',
            dateRange: 'All time',
            recruiter: 'All',
            sortBy: 'date',
            sortOrder: 'desc'
        });
    };

    const hasActiveFilters = filters.search || filters.status !== 'All' || filters.location !== 'All' ||
        filters.experienceRange !== 'All' || filters.dateRange !== 'All time' || filters.recruiter !== 'All';

    // Get unique statuses from candidates for status pills
    const allStatuses = ['All', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected', 'Under Review', 'In Process', 'Placed'];

    return (
        <div className="">
            <main className="p-4 lg:p-8">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-secondary-900 text-2xl font-bold">Candidates Management</h2>
                        <p className="text-secondary-600">Track and manage candidate applications</p>
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
                            placeholder="Search by name, email, or role..."
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
                            <option value="Fresher">Fresher (0-1 yrs)</option>
                            <option value="Junior">Junior (1-3 yrs)</option>
                            <option value="Mid-level">Mid-level (3-6 yrs)</option>
                            <option value="Senior">Senior (6-10 yrs)</option>
                            <option value="Expert">Expert (10+ yrs)</option>
                        </select>

                        {/* Recruiter Filter */}
                        {uniqueRecruiters.length > 0 && (
                            <select
                                value={filters.recruiter}
                                onChange={(e) => setFilters(prev => ({ ...prev, recruiter: e.target.value }))}
                                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All">All Recruiters</option>
                                {uniqueRecruiters.map(rec => (
                                    <option key={rec} value={rec}>{rec}</option>
                                ))}
                            </select>
                        )}

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
                            <option value="role-asc">Role (A-Z)</option>
                            <option value="role-desc">Role (Z-A)</option>
                            <option value="recruiter-asc">Recruiter (A-Z)</option>
                            <option value="recruiter-desc">Recruiter (Z-A)</option>
                            <option value="date-desc">Applied (Newest)</option>
                            <option value="date-asc">Applied (Oldest)</option>
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
                            Showing <span className="font-semibold text-secondary-900">{filteredCandidates.length}</span> of {candidates.length} candidates
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white/50 backdrop-blur-md border border-white/60 shadow-xl shadow-blue-900/5 overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center text-secondary-600">Loading candidates...</div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-600">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-white/50">
                                        <th className="p-4 text-secondary-600 font-semibold text-sm">Name</th>
                                        <th className="p-4 text-secondary-600 font-semibold text-sm">Role</th>
                                        <th className="p-4 text-secondary-600 font-semibold text-sm">Recruiter</th>
                                        <th className="p-4 text-secondary-600 font-semibold text-sm">Applied Date</th>
                                        <th className="p-4 text-secondary-600 font-semibold text-sm">Status</th>
                                        <th className="p-4 text-secondary-600 font-semibold text-sm text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredCandidates.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-secondary-500">
                                                {hasActiveFilters ? 'No candidates match your filters' : 'No candidates found'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCandidates.map((candidate) => (
                                            <tr key={candidate.id} className="hover:bg-white/60 transition-colors">
                                                <td className="p-4 text-secondary-900 font-medium">{candidate.name}</td>
                                                <td className="p-4 text-secondary-600">{candidate.role}</td>
                                                <td className="p-4 text-secondary-600">{candidate.recruiter}</td>
                                                <td className="p-4 text-secondary-600">{new Date(candidate.date).toLocaleDateString()}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full border ${candidate.status === 'Selected' || candidate.status === 'Placed'
                                                        ? 'bg-green-100 text-green-700 border-green-200'
                                                        : candidate.status === 'Rejected'
                                                            ? 'bg-red-100 text-red-700 border-red-200'
                                                            : 'bg-blue-100 text-blue-700 border-blue-200'
                                                        }`}>
                                                        {candidate.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleAction(candidate.id, 'view')} className="text-secondary-400 hover:text-blue-600 mr-3">View</button>
                                                    <button onClick={() => handleAction(candidate.id, 'delete')} className="text-secondary-400 hover:text-red-600">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <CandidateModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    candidateId={selectedCandidateId}
                />

                {/* Delete Confirmation Modal */}
                {deleteConfirmation.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                                        Delete Candidate
                                    </h3>
                                    <p className="text-secondary-600 mb-6">
                                        Are you sure you want to delete <span className="font-semibold text-secondary-900">{deleteConfirmation.candidateName}</span>? This action cannot be undone.
                                    </p>
                                    <div className="flex gap-3 justify-end">
                                        <button
                                            onClick={handleDeleteCancel}
                                            className="px-4 py-2 rounded-lg border border-gray-200 text-secondary-700 hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDeleteConfirm}
                                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main >
        </div >
    );
}
