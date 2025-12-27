'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, ArrowLeft, Search, MapPin, DollarSign, Calendar, Building2 } from 'lucide-react';
import * as recruiterManagerAPI from '@/lib/recruiterManagerApi';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = jobs.filter(job =>
                job.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredJobs(filtered);
        } else {
            setFilteredJobs(jobs);
        }
    }, [searchTerm, jobs]);

    const fetchJobs = async () => {
        try {
            setIsLoading(true);
            const response = await recruiterManagerAPI.getJobs();
            if (response.success) {
                setJobs(response.data);
                setFilteredJobs(response.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Jobs</h1>
                        <p className="text-gray-600">Browse all active job postings</p>
                    </div>
                    <Link
                        href="/recruiter-manager/dashboard"
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search jobs by title, company, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="mb-8 bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <Briefcase className="w-8 h-8 text-purple-400" />
                        <div>
                            <p className="text-sm text-gray-500">Total Active Jobs</p>
                            <p className="text-3xl font-bold text-gray-900">{filteredJobs.length}</p>
                        </div>
                    </div>
                </div>

                {/* Jobs List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-600">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            Loading jobs...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-400">Error: {error}</div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {searchTerm ? 'No jobs found matching your search' : 'No active jobs available'}
                        </div>
                    ) : (
                        filteredJobs.map((job) => (
                            <div key={job._id} className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:bg-white/15 transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{job.job_title}</h3>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                            {job.company_name && (
                                                <div className="flex items-center gap-1">
                                                    <Building2 className="w-4 h-4" />
                                                    <span>{job.company_name}</span>
                                                </div>
                                            )}
                                            {job.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{job.location}</span>
                                                </div>
                                            )}
                                            {job.salary_range && (
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span>{job.salary_range}</span>
                                                </div>
                                            )}
                                            {job.employment_type && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{job.employment_type}</span>
                                                </div>
                                            )}
                                        </div>

                                        {job.job_description && (
                                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                                {job.job_description}
                                            </p>
                                        )}

                                        {job.skills_required && job.skills_required.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {job.skills_required.slice(0, 5).map((skill, index) => (
                                                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 border border-purple-300 rounded-full text-xs font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {job.skills_required.length > 5 && (
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 border border-gray-300 rounded-full text-xs">
                                                        +{job.skills_required.length - 5} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="ml-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.role_status === 'Active'
                                            ? 'bg-green-100 text-green-700 border border-green-300'
                                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                                            }`}>
                                            {job.role_status || 'Active'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                                    <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                                    {job.postedBy && (
                                        <span>By: {job.postedBy.fullName || job.postedBy.email}</span>
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
