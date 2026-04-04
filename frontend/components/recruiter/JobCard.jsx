import React, { useState } from 'react';
import UploadProfileModal from './UploadProfileModal';
import { profileAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const JobCard = ({ job, user, submittedCandidates = new Set(), onProfileUploaded }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSubmitted, setShowSubmitted] = useState(false);
    const [submittedProfiles, setSubmittedProfiles] = useState([]);
    const [loadingProfiles, setLoadingProfiles] = useState(false);

    const submissionCount = submittedCandidates.size;
    const hasSubmissions = submissionCount > 0;

    const handleViewSubmitted = async () => {
        if (showSubmitted) {
            setShowSubmitted(false);
            return;
        }

        setLoadingProfiles(true);
        setShowSubmitted(true);
        try {
            const response = await profileAPI.getProfiles({
                job_id: job._id,
                uploaded_by: user?._id || user?.id
            });
            if (response.success) {
                setSubmittedProfiles(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch profiles:', error);
        } finally {
            setLoadingProfiles(false);
        }
    };

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 mb-4 relative overflow-hidden">
                {/* Gradient accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                            {job.company_logo ? (
                                <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-blue-600">{job.company_name.charAt(0)}</span>
                            )}
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="flex-grow">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-3 gap-3">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{job.job_title}</h3>
                                    {hasSubmissions && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {submissionCount} Profile{submissionCount > 1 ? 's' : ''} Submitted
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <h4 className="text-lg font-semibold text-gray-700">{job.company_name}</h4>
                                    <span className="px-2.5 py-0.5 rounded-full border-2 border-blue-400 text-blue-600 text-xs font-bold">
                                        {job.num_positions} Position{job.num_positions > 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-start lg:items-end gap-2">
                                <span className="text-xs text-gray-500 font-medium">ID: {job.job_id}</span>
                                <span className="text-xs text-gray-500">{Math.floor((new Date() - new Date(job.posted_date)) / (1000 * 60 * 60 * 24))} days ago</span>
                            </div>
                        </div>

                        {/* Meta Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                <span className="text-gray-600 font-medium">{job.locations?.join(', ')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-600 font-medium">₹{job.salary_min / 100000} - {job.salary_max / 100000}L {job.salary_type === 'per_month' ? '/month' : '/year'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-gray-600 font-medium">{job.experience_min}-{job.experience_max} Yrs</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-600 font-medium">{job.notice_period} Days NP</span>
                            </div>
                        </div>

                        {/* Applications Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-sm mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700">Required:</span>
                                <span className="font-bold text-blue-600">{job.applications_required}</span>
                            </div>
                            <div className="w-px h-4 bg-blue-200"></div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700">In Process:</span>
                                <span className="font-bold text-blue-600">{job.in_process_applications}</span>
                            </div>
                            <div className="w-px h-4 bg-blue-200"></div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-700">Remaining:</span>
                                <span className="font-bold text-orange-600">{Math.max(0, job.applications_required - job.in_process_applications)}</span>
                            </div>
                        </div>

                        {/* Commission & Bonus */}
                        <div className="space-y-2 mb-4">
                            <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-900 shadow-sm">
                                <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                </svg>
                                <span className="font-bold text-green-700">Commission {job.commission_percent}%:</span>
                                <span className="ml-2">₹{job.commission_amount_min / 1000}K - {job.commission_amount_max / 1000}K</span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span className="text-xs text-gray-600">{job.commission_payment_terms}</span>
                            </div>
                            {job.r1_bonus_amount > 0 && (
                                <div className="inline-flex items-center bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-900 shadow-sm">
                                    <svg className="w-4 h-4 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="font-bold text-purple-700">R1 Bonus:</span>
                                    <span className="ml-2">₹{job.r1_bonus_amount}</span>
                                    <span className="mx-2 text-gray-400">•</span>
                                    <span className="text-xs text-gray-600">{job.r1_bonus_payment_terms}</span>
                                </div>
                            )}
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-600">Role:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.role_status === 'Open' ? 'bg-blue-100 text-blue-700' :
                                    job.role_status === 'Closed' ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                    {job.role_status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-600">Sourcing:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.sourcing_status === 'Active' ? 'bg-green-100 text-green-700' :
                                    job.sourcing_status === 'On Hold' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                    {job.sourcing_status}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Upload Profile
                            </button>
                            <button
                                onClick={handleViewSubmitted}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${showSubmitted
                                    ? 'bg-blue-50 border-2 border-blue-300 text-blue-700'
                                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                {showSubmitted ? 'Hide Submitted' : `View Submitted (${submissionCount})`}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Submitted Candidates Section */}
                {showSubmitted && (
                    <div className="mt-6 pt-6 border-t-2 border-gray-100 animate-fadeIn">
                        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            Your Submitted Candidates
                        </h4>
                        {loadingProfiles ? (
                            <LoadingSpinner variant="logo" size="md" message="Loading profiles..." />
                        ) : submittedProfiles.length > 0 ? (
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Candidate Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Applied Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {submittedProfiles.map((profile) => (
                                            <tr key={profile._id} className="hover:bg-blue-50 transition-colors">
                                                <td className="px-4 py-3 font-semibold text-gray-900">{profile.candidate_name}</td>
                                                <td className="px-4 py-3 text-gray-600">{profile.email}</td>
                                                <td className="px-4 py-3 text-gray-600">{new Date(profile.createdAt).toLocaleDateString()}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${profile.status === 'Available' ? 'bg-green-100 text-green-700' :
                                                        profile.status === 'In Process' ? 'bg-blue-100 text-blue-700' :
                                                            profile.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {profile.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <p className="text-sm text-gray-500 italic">You haven't submitted any candidates for this job yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <UploadProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                job={job}
                submittedCandidates={submittedCandidates}
                onSuccess={onProfileUploaded}
            />
        </>
    );
};

export default JobCard;
