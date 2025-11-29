import React, { useState } from 'react';
import UploadProfileModal from './UploadProfileModal';

const JobCard = ({ job }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {job.company_logo ? (
                                <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold text-gray-400">{job.company_name.charAt(0)}</span>
                            )}
                        </div>
                    </div>

                    {/* Job Details */}
                    <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{job.company_name}</h3>
                                    <span className="px-2 py-0.5 rounded-full border border-blue-500 text-blue-600 text-xs font-medium">
                                        Multiple Positions
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{job.job_title}</h2>
                            </div>
                        </div>

                        {/* Meta Info Row 1 */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                            <span>ID: {job.job_id}</span>
                            <span>•</span>
                            <span>Posted {Math.floor((new Date() - new Date(job.posted_date)) / (1000 * 60 * 60 * 24))} days ago</span>
                            <span>•</span>
                            <span>{job.locations.join(' & ')}</span>
                            <span>•</span>
                            <span>₹ {job.salary_min / 100000} - {job.salary_max / 100000} Lakh</span>
                            <span>•</span>
                            <span>{job.experience_min} - {job.experience_max} Yrs Exp</span>
                            <span>•</span>
                            <span>{job.notice_period} Days NP</span>
                            <span>•</span>
                            <span>{job.num_positions} POS</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                {job.relevant_level} RL
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>

                        {/* Applications Info */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-blue-600 mb-4">
                            <span>Applications Required : {job.applications_required}</span>
                            <span className="text-gray-400">•</span>
                            <span className="flex items-center gap-1">
                                In-process Applications : {job.in_process_applications}
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>

                        {/* Commission & Bonus */}
                        <div className="space-y-2 mb-4">
                            <div className="inline-flex items-center bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-900">
                                Commission @ {job.commission_percent}% → ₹ {job.commission_amount_min / 1000} K - {job.commission_amount_max / 1000} K | Payment Terms: {job.commission_payment_terms}
                                <svg className="w-4 h-4 text-blue-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <br />
                            {job.r1_bonus_amount > 0 && (
                                <div className="inline-flex items-center bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-900">
                                    Rs. {job.r1_bonus_amount} for R1 Interview Cleared | Payment Terms: {job.r1_bonus_payment_terms}
                                    <svg className="w-4 h-4 text-blue-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Statuses */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-900 font-medium">Role Status:</span>
                                <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded text-xs font-semibold">{job.role_status}</span>
                                <span className="text-gray-500">|</span>
                                <span className="text-gray-900">Candidate is Selected (More positions are available)</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-900 font-medium">Sourcing Status:</span>
                                <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">{job.sourcing_status}</span>
                                <span className="text-gray-500">|</span>
                                <span className="text-gray-900">Interviews are going on currently. Profiles will get processed fast.</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Upload Profile
                            </button>
                            <button className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share Job
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <UploadProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                job={job}
            />
        </>
    );
};

export default JobCard;
