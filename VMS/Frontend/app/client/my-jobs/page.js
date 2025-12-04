'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMyJobs } from '@/lib/clientApi';

export default function MyJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getMyJobs();
      if (response.success) {
        setJobs(response.data || []);
      } else {
        setError('Failed to load jobs. Please try again.');
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError(err.message || 'An error occurred while loading jobs.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatSalary = (min, max) => {
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
    if (min) {
      return `$${min.toLocaleString()}+`;
    }
    if (max) {
      return `Up to $${max.toLocaleString()}`;
    }
    return 'Not specified';
  };

  const formatExperience = (min, max) => {
    if (min && max) {
      return `${min} - ${max} years`;
    }
    if (min) {
      return `${min}+ years`;
    }
    if (max) {
      return `Up to ${max} years`;
    }
    return 'Not specified';
  };

  const formatLocations = (locations) => {
    if (!locations || locations.length === 0) {
      return 'Not specified';
    }
    return Array.isArray(locations) ? locations.join(', ') : locations;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-accent-100 text-accent-800 border-accent-200';
      case 'Inactive':
        return 'bg-secondary-100 text-secondary-800 border-secondary-200';
      case 'Closed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Open':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'In Progress':
        return 'bg-warm-100 text-warm-800 border-warm-200';
      default:
        return 'bg-secondary-100 text-secondary-800 border-secondary-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
              <p className="text-gray-600">Manage and track all your posted job listings</p>
            </div>
            <button
              onClick={() => router.push('/client/post-job')}
              className="px-6 py-3 bg-[#1A73FF] hover:bg-[#0047CC] text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post New Job
            </button>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <svg className="animate-spin h-12 w-12 text-primary-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
              <button
                onClick={loadJobs}
                className="px-6 py-2 bg-[#1A73FF] hover:bg-[#0047CC] text-white font-medium rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-secondary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
              <p className="text-gray-600 mb-6">Get started by posting your first job</p>
              <button
                onClick={() => router.push('/client/post-job')}
                className="px-6 py-3 bg-[#1A73FF] hover:bg-[#0047CC] text-white font-medium rounded-lg transition-colors"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Job ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                      Salary Range
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                      CV Count
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">#{job.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{job.job_title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{job.company_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">{formatLocations(job.locations)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {formatSalary(job.salary_min, job.salary_max)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {formatExperience(job.experience_min, job.experience_max)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {job.cvCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(job.role_status)}`}>
                            {job.role_status || 'N/A'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(job.sourcing_status)}`}>
                            {job.sourcing_status || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              router.push(`/client/received-cvs?jobId=${job.id}`);
                            }}
                            className="text-[#1A73FF] hover:text-[#0047CC] transition-colors"
                            title="View Applicants"
                          >
                            View CVs
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => {
                              // Edit action - placeholder
                              alert(`Edit job: ${job.job_title}`);
                            }}
                            className="text-[#1A73FF] hover:text-[#0047CC] transition-colors"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${job.job_title}"?`)) {
                                // Delete action - placeholder
                                alert(`Delete job: ${job.job_title}`);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            Delete
                          </button>
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
  );
}



