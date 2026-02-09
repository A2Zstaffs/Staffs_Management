'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, Mail, Phone, Briefcase, MapPin, Calendar, Award, FileText } from 'lucide-react';
import * as recruiterManagerAPI from '@/lib/recruiterManagerApi';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProfileDetailPage() {
    const params = useParams();
    const profileId = params.id;

    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (profileId) {
            fetchProfileDetails();
        }
    }, [profileId]);

    const fetchProfileDetails = async () => {
        try {
            setIsLoading(true);
            // Fetch all profiles and find the specific one
            const response = await recruiterManagerAPI.getProfiles();
            if (response.success) {
                const foundProfile = response.data.find(p => p._id === profileId);
                if (foundProfile) {
                    setProfile(foundProfile);
                } else {
                    setError('Profile not found');
                }
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
                <LoadingSpinner size="lg" message="Loading profile..." />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-xl mb-4">{error || 'Profile not found'}</div>
                    <Link
                        href="/recruiter-manager/candidates"
                        className="px-4 py-2 bg-white/10 border border-white/20 text-gray-900 rounded-lg hover:bg-white/20 transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Candidates
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        const colors = {
            'Available': 'bg-green-500/20 text-green-300 border-green-500/30',
            'Shortlisted': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
            'Interview Scheduled': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
            'Offered': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
            'Hired': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            'Rejected': 'bg-red-500/20 text-red-300 border-red-500/30'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidate Profile</h1>
                        <p className="text-gray-600">Complete candidate information</p>
                    </div>
                    <Link
                        href="/recruiter-manager/candidates"
                        className="px-4 py-2 bg-white/10 border border-white/20 text-gray-900 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Candidates
                    </Link>
                </div>

                {/* Main Profile Card */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                        <div className="flex items-start gap-6 flex-1">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-gray-900 text-3xl font-bold shadow-lg">
                                {profile.name?.charAt(0) || 'C'}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                                <div className="space-y-2">
                                    {profile.email && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <span>{profile.email}</span>
                                        </div>
                                    )}
                                    {profile.phone && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone className="w-4 h-4" />
                                            <span>{profile.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(profile.status)}`}>
                                {profile.status || 'Available'}
                            </span>
                        </div>
                    </div>

                    {profile.resume_link && (
                        <a
                            href={profile.resume_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-gray-900 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <Download className="w-5 h-5" />
                            Download Resume
                        </a>
                    )}
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Professional Details */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-purple-400" />
                            Professional Details
                        </h3>
                        <div className="space-y-4">
                            {profile.experience !== undefined && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Experience</p>
                                    <p className="text-gray-900 font-medium">{profile.experience} years</p>
                                </div>
                            )}
                            {profile.current_company && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Current Company</p>
                                    <p className="text-gray-900 font-medium">{profile.current_company}</p>
                                </div>
                            )}
                            {profile.current_position && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Current Position</p>
                                    <p className="text-gray-900 font-medium">{profile.current_position}</p>
                                </div>
                            )}
                            {profile.expected_salary && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Expected Salary</p>
                                    <p className="text-gray-900 font-medium">{profile.expected_salary}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-green-400" />
                            Additional Information
                        </h3>
                        <div className="space-y-4">
                            {profile.location && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Location</p>
                                    <p className="text-gray-900 font-medium">{profile.location}</p>
                                </div>
                            )}
                            {profile.notice_period && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Notice Period</p>
                                    <p className="text-gray-900 font-medium">{profile.notice_period}</p>
                                </div>
                            )}
                            {profile.uploaded_by && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Uploaded By</p>
                                    <p className="text-gray-900 font-medium">
                                        {profile.uploaded_by.fullName || profile.uploaded_by.email}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Uploaded Date</p>
                                <p className="text-gray-900 font-medium">
                                    {new Date(profile.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                {profile.skills && profile.skills.length > 0 && (
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-yellow-400" />
                            Skills & Expertise
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {profile.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium border border-purple-500/30"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Job Application Info */}
                {profile.job_id && (
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-blue-400" />
                            Applied Position
                        </h3>
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-lg font-semibold text-gray-900 mb-1">
                                {profile.job_id.job_title}
                            </p>
                            {profile.job_id.company_name && (
                                <p className="text-gray-500">{profile.job_id.company_name}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
