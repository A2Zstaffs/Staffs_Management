'use client';

import { useState, useEffect, useCallback } from 'react';
import RecruiterNavbar from '@/components/common/RecruiterNavbar';
import { jobsAPI, profileAPI } from '@/lib/api';
import JobCard from '@/components/recruiter/JobCard';
import { useAuth } from '@/contexts/AuthContext';

export default function RecruiterJobsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [submittedJobIds, setSubmittedJobIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            if (profilesRes.success && profilesRes.data.length > 0) {
                const ids = new Set(profilesRes.data.map(p =>
                    // Handle populated job_id object or direct ID string
                    p.job_id && typeof p.job_id === 'object' ? p.job_id._id : p.job_id
                ));
                setSubmittedJobIds(ids);
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

    const handleProfileUploaded = (jobId) => {
        setSubmittedJobIds(prev => new Set(prev).add(jobId));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <RecruiterNavbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                        {error}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        No jobs found.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                user={user}
                                hasSubmission={submittedJobIds.has(job._id)}
                                onProfileUploaded={() => handleProfileUploaded(job._id)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

