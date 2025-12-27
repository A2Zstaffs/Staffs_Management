'use client';

import { useState, useEffect, useCallback } from 'react';
import RecruiterNavbar from '@/components/common/RecruiterNavbar';
import { jobsAPI, profileAPI } from '@/lib/api';
import JobCard from '@/components/recruiter/JobCard';
import { useAuth } from '@/contexts/AuthContext';

export default function RecruiterJobsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [submissionsByJob, setSubmissionsByJob] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Filter state
    const [filters, setFilters] = useState({
        search: '',
        skills: [],
        locations: [],
        experienceMin: 0,
        experienceMax: 30,
        salaryMin: 0,
        salaryMax: 100,
        roleStatus: '',
        sourcingStatus: ''
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            // Fetch jobs regardless of user state
            const jobsPromise = jobsAPI.getAllJobs();

            // Only fetch profiles if user is authenticated
            const profilesPromise = user
                ? profileAPI.getProfiles({ uploaded_by: user._id || user.id })
                : Promise.resolve({ success: true, data: [] });

            const [jobsRes, profilesRes] = await Promise.all([jobsPromise, profilesPromise]);

            if (jobsRes.success) {
                setJobs(jobsRes.data);
            } else {
                setError('Failed to fetch jobs');
            }

            // Create map of job -> Set of candidate emails
            if (profilesRes.success && profilesRes.data.length > 0) {
                const submissionsMap = {};
                profilesRes.data.forEach(profile => {
                    const jobId = profile.job_id && typeof profile.job_id === 'object' ? profile.job_id._id : profile.job_id;
                    if (!submissionsMap[jobId]) {
                        submissionsMap[jobId] = new Set();
                    }
                    if (profile.email) {
                        submissionsMap[jobId].add(profile.email.toLowerCase());
                    }
                });
                setSubmissionsByJob(submissionsMap);
            }
        } catch (err) {
            setError('An error occurred while fetching data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleProfileUploaded = (jobId, candidateEmail) => {
        setSubmissionsByJob(prev => ({
            ...prev,
            [jobId]: new Set([...(prev[jobId] || []), candidateEmail.toLowerCase()])
        }));
    };

    // Derive unique filter options from jobs
    const uniqueSkills = [...new Set(jobs.flatMap(job => job.skills || []))];
    const uniqueLocations = [...new Set(jobs.flatMap(job => job.locations || []))];
    const uniqueRoleStatuses = [...new Set(jobs.map(job => job.role_status).filter(Boolean))];
    const uniqueSourcingStatuses = [...new Set(jobs.map(job => job.sourcing_status).filter(Boolean))];

    // Filter jobs based on current filters
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = !filters.search ||
            (job.job_title || '').toLowerCase().includes(filters.search.toLowerCase()) ||
            (job.company_name || '').toLowerCase().includes(filters.search.toLowerCase());

        const matchesSkills = filters.skills.length === 0 ||
            filters.skills.some(skill => (job.skills || []).includes(skill));

        const matchesLocation = filters.locations.length === 0 ||
            filters.locations.some(loc => (job.locations || []).includes(loc));

        const matchesExperience =
            job.experience_min >= filters.experienceMin &&
            job.experience_max <= filters.experienceMax;

        const matchesSalary =
            (job.salary_min / 100000) >= filters.salaryMin &&
            (job.salary_max / 100000) <= filters.salaryMax;

        const matchesRoleStatus = !filters.roleStatus || job.role_status === filters.roleStatus;
        const matchesSourcingStatus = !filters.sourcingStatus || job.sourcing_status === filters.sourcingStatus;

        return matchesSearch && matchesSkills && matchesLocation &&
            matchesExperience && matchesSalary && matchesRoleStatus && matchesSourcingStatus;
    });

    const toggleFilter = (type, value) => {
        setFilters(prev => {
            const current = prev[type];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [type]: updated };
        });
    };

    const clearAllFilters = () => {
        setFilters({
            search: '',
            skills: [],
            locations: [],
            experienceMin: 0,
            experienceMax: 30,
            salaryMin: 0,
            salaryMax: 100,
            roleStatus: '',
            sourcingStatus: ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <RecruiterNavbar />
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 w-full">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
                            <p className="text-gray-500 mt-1">Browse and submit profiles for open positions</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${showFilters ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <span className="hidden sm:inline">Filters</span>
                                {(filters.skills.length > 0 || filters.locations.length > 0 || filters.roleStatus || filters.sourcingStatus) && (
                                    <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {filters.skills.length + filters.locations.length + (filters.roleStatus ? 1 : 0) + (filters.sourcingStatus ? 1 : 0)}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by job title or company name..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Collapsible Filter Panel */}
                {showFilters && (
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6 animate-slideDown">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800 text-lg">Filter Jobs</h3>
                            <button
                                onClick={clearAllFilters}
                                className="text-sm text-blue-600 font-semibold hover:underline"
                            >
                                CLEAR ALL FILTERS
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Skills Filter */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        Skills
                                    </h4>
                                    <button onClick={() => setFilters(prev => ({ ...prev, skills: [] }))} className="text-xs text-blue-500 hover:underline">CLEAR</button>
                                </div>
                                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50">
                                    {uniqueSkills.length > 0 ? uniqueSkills.slice(0, 10).map(skill => (
                                        <label key={skill} className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                                            <input
                                                type="checkbox"
                                                className="rounded text-blue-600 focus:ring-blue-500"
                                                checked={filters.skills.includes(skill)}
                                                onChange={() => toggleFilter('skills', skill)}
                                            />
                                            <span className="text-sm text-gray-700">{skill}</span>
                                        </label>
                                    )) : (
                                        <p className="text-sm text-gray-400 text-center py-2">No skills available</p>
                                    )}
                                </div>
                            </div>

                            {/* Location Filter */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        Locations
                                    </h4>
                                    <button onClick={() => setFilters(prev => ({ ...prev, locations: [] }))} className="text-xs text-blue-500 hover:underline">CLEAR</button>
                                </div>
                                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50">
                                    {uniqueLocations.length > 0 ? uniqueLocations.map(location => (
                                        <label key={location} className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                                            <input
                                                type="checkbox"
                                                className="rounded text-blue-600 focus:ring-blue-500"
                                                checked={filters.locations.includes(location)}
                                                onChange={() => toggleFilter('locations', location)}
                                            />
                                            <span className="text-sm text-gray-700">{location}</span>
                                        </label>
                                    )) : (
                                        <p className="text-sm text-gray-400 text-center py-2">No locations available</p>
                                    )}
                                </div>
                            </div>

                            {/* Job Status Filters */}
                            <div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role Status</label>
                                    <select
                                        value={filters.roleStatus}
                                        onChange={(e) => setFilters(prev => ({ ...prev, roleStatus: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="">All</option>
                                        {uniqueRoleStatuses.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sourcing Status</label>
                                    <select
                                        value={filters.sourcingStatus}
                                        onChange={(e) => setFilters(prev => ({ ...prev, sourcingStatus: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="">All</option>
                                        {uniqueSourcingStatuses.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Summary */}
                        {(filters.skills.length > 0 || filters.locations.length > 0 || filters.roleStatus || filters.sourcingStatus) && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h5 className="text-sm font-semibold text-gray-700 mb-3">Active Filters:</h5>
                                <div className="flex flex-wrap gap-2">
                                    {filters.skills.map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                                            {skill}
                                            <button onClick={() => toggleFilter('skills', skill)} className="hover:bg-blue-200 rounded-full p-0.5">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </span>
                                    ))}
                                    {filters.locations.map(location => (
                                        <span key={location} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                                            {location}
                                            <button onClick={() => toggleFilter('locations', location)} className="hover:bg-green-200 rounded-full p-0.5">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </span>
                                    ))}
                                    {filters.roleStatus && (
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-2">
                                            Role: {filters.roleStatus}
                                            <button onClick={() => setFilters(prev => ({ ...prev, roleStatus: '' }))} className="hover:bg-purple-200 rounded-full p-0.5">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </span>
                                    )}
                                    {filters.sourcingStatus && (
                                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium flex items-center gap-2">
                                            Sourcing: {filters.sourcingStatus}
                                            <button onClick={() => setFilters(prev => ({ ...prev, sourcingStatus: '' }))} className="hover:bg-amber-200 rounded-full p-0.5">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Jobs Count */}
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-bold text-gray-900">{filteredJobs.length}</span> of <span className="font-bold text-gray-900">{jobs.length}</span> jobs
                    </p>
                </div>

                {/* Jobs List */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                        {error}
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium mb-2">No jobs match your filters</p>
                        <p className="text-gray-400 text-sm mb-4">Try adjusting your filters to see more results</p>
                        <button
                            onClick={clearAllFilters}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                user={user}
                                submittedCandidates={submissionsByJob[job._id] || new Set()}
                                onProfileUploaded={(email) => handleProfileUploaded(job._id, email)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
