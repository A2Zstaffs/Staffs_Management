'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, ArrowLeft, Search } from 'lucide-react';
import * as recruiterManagerAPI from '@/lib/recruiterManagerApi';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function RecruitersPage() {
    const [recruiters, setRecruiters] = useState([]);
    const [filteredRecruiters, setFilteredRecruiters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecruiters();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = recruiters.filter(r =>
                r.recruiter.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.recruiter.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredRecruiters(filtered);
        } else {
            setFilteredRecruiters(recruiters);
        }
    }, [searchTerm, recruiters]);

    const fetchRecruiters = async () => {
        try {
            setIsLoading(true);
            const response = await recruiterManagerAPI.getAssignedRecruiters();
            if (response.success) {
                setRecruiters(response.data);
                setFilteredRecruiters(response.data);
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assigned Recruiters</h1>
                        <p className="text-gray-600">Manage and monitor your recruiter team</p>
                    </div>
                    <Link
                        href="/recruiter-manager/dashboard"
                        className="px-4 py-2 bg-white/10 border border-white/20 text-gray-900 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
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
                            placeholder="Search recruiters by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                        <Users className="w-8 h-8 text-blue-400 mb-3" />
                        <p className="text-sm text-gray-500 mb-1">Total Recruiters</p>
                        <p className="text-3xl font-bold text-gray-900">{filteredRecruiters.length}</p>
                    </div>
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                        <Users className="w-8 h-8 text-green-400 mb-3" />
                        <p className="text-sm text-gray-500 mb-1">Total Profiles</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {filteredRecruiters.reduce((sum, r) => sum + (r.recruiter.profileCount || 0), 0)}
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                        <Users className="w-8 h-8 text-purple-400 mb-3" />
                        <p className="text-sm text-gray-500 mb-1">Total Applications</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {filteredRecruiters.reduce((sum, r) => sum + (r.recruiter.applicationCount || 0), 0)}
                        </p>
                    </div>
                </div>

                {/* Recruiters List */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                    {isLoading ? (
                        <div className="p-8">
                            <LoadingSpinner size="md" message="Loading recruiters..." />
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-400">Error: {error}</div>
                    ) : filteredRecruiters.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {searchTerm ? 'No recruiters found matching your search' : 'No recruiters assigned yet'}
                        </div>
                    ) : (
                        <div className="divide-y divide-white/10">
                            {filteredRecruiters.map((assignment) => (
                                <div key={assignment._id} className="p-6 hover:bg-white/5 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {assignment.recruiter.fullName}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-2">{assignment.recruiter.email}</p>
                                            {assignment.recruiter.company && (
                                                <p className="text-sm text-gray-500 mb-2">
                                                    Company: {assignment.recruiter.company}
                                                </p>
                                            )}
                                            <div className="flex gap-4 text-sm mt-3">
                                                <span className="text-gray-500">
                                                    <span className="font-semibold text-blue-400">
                                                        {assignment.recruiter.profileCount || 0}
                                                    </span> Profiles
                                                </span>
                                                <span className="text-gray-500">
                                                    <span className="font-semibold text-green-400">
                                                        {assignment.recruiter.applicationCount || 0}
                                                    </span> Applications
                                                </span>
                                                <span className="text-gray-500">
                                                    Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/recruiter-manager/recruiters/${assignment.recruiter._id}`}
                                                className="px-4 py-2 bg-blue-600 text-gray-900 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
