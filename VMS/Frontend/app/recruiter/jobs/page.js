'use client';

import { useState, useEffect } from 'react';
import RecruiterNavbar from '@/components/common/RecruiterNavbar';
import { jobsAPI } from '@/lib/api';
import JobCard from '@/components/recruiter/JobCard';

export default function RecruiterJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await jobsAPI.getAllJobs();
                if (response.success) {
                    setJobs(response.data);
                } else {
                    setError('Failed to fetch jobs');
                }
            } catch (err) {
                setError('An error occurred while fetching jobs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

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
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

