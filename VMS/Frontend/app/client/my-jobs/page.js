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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';

      // Sourcing Statuses
      case 'Priority':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low':
        return 'bg-gray-100 text-gray-800 border-gray-200';

      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              My Jobs <span className="text-blue-400">.</span>
            </h1>
            <p className="text-lg text-slate-300 font-medium">Manage and monitor all your active recruitment drives</p>
          </div>
          <button
            onClick={() => router.push('/client/post-job')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center gap-2 transform hover:-translate-y-0.5 backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post New Job
          </button>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm">
        {isLoading ? (
          <div className="p-16 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-blue-600 mb-4"></div>
            <p className="text-gray-500 font-medium text-lg">Loading your workspace...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl mb-6 inline-block font-medium">
              {error}
            </div>
            <br />
            <button
              onClick={loadJobs}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 hover:rotate-6 transition-transform">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Your job board is empty. Create your first listing to start attracting top talent.</p>
            <button
              onClick={() => router.push('/client/post-job')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center mx-auto gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Job Role & Location</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Compensation</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-blue-50/30 transition-all duration-200 group border-l-4 border-transparent hover:border-blue-500">
                    <td className="px-6 py-5">
                      <div>
                        <div className="text-lg font-bold text-gray-900 mb-1">{job.job_title}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {formatLocations(job.locations)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-semibold text-gray-900">
                        {formatSalary(job.salary_min, job.salary_max)}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Annual CTC</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-gray-700 text-sm font-medium border border-gray-100">
                        {formatExperience(job.experience_min, job.experience_max)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2 items-start">
                        {/* Status Pill */}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${job.role_status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                          job.role_status === 'Closed' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                          <span className={`relative flex h-2.5 w-2.5`}>
                            {job.role_status === 'Active' && (
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            )}
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${job.role_status === 'Active' ? 'bg-emerald-500' :
                              job.role_status === 'Closed' ? 'bg-red-500' : 'bg-gray-400'
                              }`}></span>
                          </span>
                          {job.role_status || 'Unknown'}
                        </span>

                        {/* Priority Badge */}
                        {job.sourcing_status && (
                          <span className="ml-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                            {job.sourcing_status} Priority
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => router.push(`/client/edit-job/${job.id}`)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all shadow-sm"
                          title="Edit Job"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete "${job.job_title}"?`)) {
                              try {
                                const token = localStorage.getItem('authToken');
                                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/client/jobs/${job.id}`, {
                                  method: 'DELETE',
                                  headers: { 'Authorization': `Bearer ${token}` }
                                });
                                const data = await response.json();
                                if (data.success) { loadJobs(); } else { alert(data.message || 'Failed to delete job'); }
                              } catch (err) { console.error('Delete error:', err); alert('Failed to delete job'); }
                            }
                          }}
                          className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 transition-all shadow-sm"
                          title="Delete Job"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2" />
                          </svg>
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



