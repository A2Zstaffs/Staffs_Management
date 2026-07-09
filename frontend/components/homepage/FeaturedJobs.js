'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function FeaturedJobs() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/jobs`);
      const data = await response.json();
      if (data.success) {
        // Get latest 6 active jobs
        const activeJobs = data.data
          .filter(job => job.status === 'active')
          .slice(0, 6);
        setFeaturedJobs(activeJobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-secondary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-500 mb-4">
              Featured Jobs
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Discover the latest opportunities from top companies
            </p>
          </div>
          <LoadingSkeleton type="card" count={6} />
        </div>
      </section>
    );
  }

  if (featuredJobs.length === 0) {
    return null; // Don't show section if no jobs
  }

  return (
    <section className="py-16 bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-500 mb-4">
            Featured Jobs
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Discover the latest opportunities from top companies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg border border-secondary-100 p-6 hover:border-primary-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🏢</div>
                  <div>
                    <h3 className="text-base font-semibold text-primary-500 mb-1">
                      {job.job_title}
                    </h3>
                    <p className="text-sm text-secondary-600">{job.company_name}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-secondary-600">
                  <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.locations?.[0] || 'Remote'}
                </div>
                <div className="flex items-center text-xs text-secondary-600">
                  <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {job.salary_min && job.salary_max
                    ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()} ${job.salary_type === 'per_month' ? '/month' : '/year'}`
                    : 'Salary not disclosed'}
                </div>
                <div className="flex items-center text-xs text-secondary-600">
                  <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.employmentType}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary-500">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <Link href="/contact" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200">
                  Enquire Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/candidate/explore-jobs" className="bg-white hover:bg-secondary-50 text-primary-600 border-2 border-primary-500 px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
            View All Jobs
          </Link>
        </div>
      </div>
    </section>
  );
}


