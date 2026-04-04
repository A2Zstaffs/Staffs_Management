'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, User, FileText, Briefcase, Mail, Phone, Building2 } from 'lucide-react';
import * as recruiterManagerAPI from '@/lib/recruiterManagerApi';

export default function RecruiterDetailPage() {
    const params = useParams();
    const recruiterId = params.id;

    const [recruiter, setRecruiter] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (recruiterId) {
            fetchRecruiterDetails();
        }
    }, [recruiterId]);

    const fetchRecruiterDetails = async () => {
        try {
            setIsLoading(true);
            const response = await recruiterManagerAPI.getRecruiterById(recruiterId);
            if (response.success) {
                setRecruiter(response.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
                <div className="text-gray-900 text-xl">Loading recruiter details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-xl mb-4">Error: {error}</div>
                    <Link
                        href="/recruiter-manager/recruiters"
                        className="px-4 py-2 bg-white/10 border border-white/20 text-gray-900 rounded-lg hover:bg-white/20 transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Recruiters
                    </Link>
                </div>
            </div>
        );
    }

    if (!recruiter) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-500 text-xl mb-4">Recruiter not found</div>
                    <Link
                        href="/recruiter-manager/recruiters"
                        className="px-4 py-2 bg-white/10 border border-white/20 text-gray-900 rounded-lg hover:bg-white/20 transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Recruiters
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruiter Details</h1>
                        <p className="text-gray-600">View recruiter information and performance</p>
                    </div>
                    <Link
                        href="/recruiter-manager/recruiters"
                        className="px-4 py-2 bg-white/10 border border-white/20 text-gray-900 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Recruiters
                    </Link>
                </div>

                {/* Recruiter Profile Card */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 mb-6">
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 text-3xl font-bold">
                            {recruiter.fullName?.charAt(0) || 'R'}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{recruiter.fullName}</h2>
                            <div className="space-y-2">
                                {recruiter.email && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail className="w-4 h-4" />
                                        <span>{recruiter.email}</span>
                                    </div>
                                )}
                                {recruiter.phoneNumber && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        <span>{recruiter.phoneNumber}</span>
                                    </div>
                                )}
                                {recruiter.company && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Building2 className="w-4 h-4" />
                                        <span>{recruiter.company}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                                Active
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-300" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Profiles Uploaded</p>
                                <p className="text-3xl font-bold text-gray-900">{recruiter.profileCount || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-green-300" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Applications</p>
                                <p className="text-3xl font-bold text-gray-900">{recruiter.applicationCount || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500 mb-1">Role</p>
                            <p className="text-gray-900 font-medium capitalize">{recruiter.role || 'Recruiter'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Status</p>
                            <p className="text-gray-900 font-medium">
                                {recruiter.isActive ? (
                                    <span className="text-green-300">Active</span>
                                ) : (
                                    <span className="text-red-300">Inactive</span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Joined Date</p>
                            <p className="text-gray-900 font-medium">
                                {new Date(recruiter.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Last Updated</p>
                            <p className="text-gray-900 font-medium">
                                {new Date(recruiter.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
