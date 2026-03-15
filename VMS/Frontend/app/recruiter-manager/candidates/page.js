'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Search, Download, Eye, ChevronRight } from 'lucide-react';
import * as recruiterManagerAPI from '@/lib/recruiterManagerApi';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function CandidatesPage() {
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = profiles.filter(profile =>
                profile.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                profile.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredProfiles(filtered);
        } else {
            setFilteredProfiles(profiles);
        }
    }, [searchTerm, profiles]);

    const fetchProfiles = async () => {
        try {
            setIsLoading(true);
            const response = await recruiterManagerAPI.getProfiles();
            if (response.success) {
                setProfiles(response.data);
                setFilteredProfiles(response.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Available': 'bg-green-100 text-green-700 border border-green-300',
            'Shortlisted': 'bg-blue-100 text-blue-700 border border-blue-300',
            'Interview Scheduled': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
            'Offered': 'bg-purple-100 text-purple-700 border border-purple-300',
            'Hired': 'bg-emerald-100 text-emerald-700 border border-emerald-300',
            'Rejected': 'bg-red-100 text-red-700 border border-red-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border border-gray-300';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidate Profiles</h1>
                        <p className="text-gray-600">Total: {filteredProfiles.length} profiles</p>
                    </div>
                    <Link
                        href="/recruiter-manager/dashboard"
                        className="px-4 py-2 bg-white/10 border border-white/20 text-gray-900 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                {/* Compact Table/List View */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                    {isLoading ? (
                        <table className="w-full"><LoadingSkeleton type="table" count={8} /></table>
                    ) : error ? (
                        <div className="p-8 text-center text-red-400">Error: {error}</div>
                    ) : filteredProfiles.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {searchTerm ? 'No profiles found matching your search' : 'No profiles uploaded yet'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Candidate</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Experience</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Skills</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applied For</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Uploaded</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredProfiles.map((profile) => (
                                        <tr key={profile._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">{profile.candidate_name}</p>
                                                    {profile.current_company && (
                                                        <p className="text-xs text-gray-500">{profile.current_company}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm">
                                                    <p className="text-gray-600">{profile.email}</p>
                                                    {profile.phone && (
                                                        <p className="text-xs text-gray-500">{profile.phone}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-600">
                                                    {profile.total_experience ? `${profile.total_experience} yrs` : '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {profile.skills && profile.skills.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {profile.skills.slice(0, 2).map((skill, index) => (
                                                            <span key={index} className="px-2 py-0.5 bg-purple-100 text-purple-700 border border-purple-300 rounded text-xs font-medium">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {profile.skills.length > 2 && (
                                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-300 rounded text-xs">
                                                                +{profile.skills.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {profile.job_id ? (
                                                    <div className="text-sm">
                                                        <p className="font-medium text-gray-900">{profile.job_id.job_title}</p>
                                                        {profile.job_id.company_name && (
                                                            <p className="text-xs text-gray-500">{profile.job_id.company_name}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500">General Pool</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
                                                    {profile.status || 'Available'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-xs">
                                                    <p className="text-gray-600">{new Date(profile.createdAt).toLocaleDateString()}</p>
                                                    {profile.uploaded_by && (
                                                        <p className="text-gray-500">{profile.uploaded_by.fullName?.split(' ')[0] || 'Recruiter'}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    {profile.resume_url ? (
                                                        <a
                                                            href={profile.resume_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center gap-1"
                                                            title="View CV"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                            View CV
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">No CV</span>
                                                    )}
                                                    <Link
                                                        href={`/recruiter-manager/candidates/${profile._id}`}
                                                        className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs font-medium flex items-center gap-1"
                                                        title="View Details"
                                                    >
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                        Details
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
