import { useEffect, useState } from 'react';
import { profileAPI } from '@/lib/api';

export default function CandidateModal({ isOpen, onClose, candidateId }) {
    const [candidate, setCandidate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && candidateId) {
            fetchCandidateDetails();
        } else {
            setCandidate(null); // Reset when closed
        }
    }, [isOpen, candidateId]);

    const fetchCandidateDetails = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Try to fetch from API
            try {
                const response = await profileAPI.getProfileById(candidateId);
                if (response.success) {
                    setCandidate(response.data);
                    return;
                }
            } catch (err) {
                console.warn('Failed to fetch candidate details:', err);
                setError('Failed to load candidate details');
            }

            // If API fails or returns no data (and we want to show something during dev), 
            // you might want mock data here, but for now let's show error
            // setError('Could not load candidate details');

        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching details');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">Candidate Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                            <p>Loading details...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="text-red-500 mb-2">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <p className="text-gray-900 font-medium">{error}</p>
                        </div>
                    ) : candidate ? (
                        <div className="space-y-8">
                            {/* Basic Info */}
                            <div className="flex items-start gap-6">
                                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold border-4 border-white shadow-lg">
                                    {candidate.candidate_name?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{candidate.candidate_name}</h3>
                                    <p className="text-blue-600 font-medium mb-2">{candidate.current_designation || 'No Designation'}</p>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {candidate.email}
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {candidate.contact_no}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-xl border border-gray-100">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Experience</label>
                                    <p className="text-gray-900 font-medium">{candidate.total_experience || 'N/A'} Years</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Current CTC</label>
                                    <p className="text-gray-900 font-medium">{candidate.current_ctc || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Expected CTC</label>
                                    <p className="text-gray-900 font-medium">{candidate.expected_ctc || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Notice Period</label>
                                    <p className="text-gray-900 font-medium">{candidate.notice_period || 'N/A'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Current Location</label>
                                    <p className="text-gray-900 font-medium">{candidate.current_location || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Skills */}
                            {candidate.primary_skills && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                                        Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {candidate.primary_skills.split(',').map((skill, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-100 font-medium">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Resume */}
                            {candidate.resume_link && (
                                <div className="pt-4 border-t border-gray-100">
                                    <a
                                        href={candidate.resume_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full p-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium group"
                                    >
                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        View Resume
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            Candidate not found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 
