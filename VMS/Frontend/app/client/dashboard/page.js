'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MoreVertical, MapPin, Briefcase, Calendar, DollarSign, Pause, ChevronDown, ArrowRight, Plus } from 'lucide-react';
import CreateJobModal from '@/components/client/CreateJobModal';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [clientName, setClientName] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);

  useEffect(() => {
    if (user?.fullName) {
      setClientName(user.fullName);
    } else if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setClientName(storedName);
      } else if (user?.email) {
        setClientName(user.email);
      } else {
        setClientName('Client');
      }
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiUrl}/dashboard/client`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobCreated = (newJob) => {
    console.log('Job created successfully:', newJob);
    // Refresh dashboard data
    fetchDashboardData();
  };

  // Get stats from dashboard data
  const stats = {
    activeJobs: dashboardData?.summary?.activeJobs || 0,
    applicationsReceived: dashboardData?.summary?.totalApplications || 0,
    inProcessApplications: dashboardData?.summary?.inProcessApplications || 0,
    totalHires: dashboardData?.summary?.totalHires || 0,
  };

  // Get recent jobs (top 3)
  const recentJobs = dashboardData?.postedJobs?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section with Create Job Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {clientName || 'Client'} 👋
          </h1>
          <p className="text-gray-400">Manage your jobs and track applications</p>
        </div>
        <button
          onClick={() => setShowCreateJobModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Create Job</span>
        </button>
      </div>

      {/* Stats Grid - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Jobs Card */}
        <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1A73FF] to-[#0047CC] rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{stats.activeJobs}</div>
          <div className="text-sm text-gray-300">Active Jobs</div>
        </div>

        {/* Applications Received Card */}
        <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00D9FF] to-[#0099CC] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{stats.applicationsReceived}</div>
          <div className="text-sm text-gray-300">Applications Received</div>
        </div>

        {/* In-Process Applications Card */}
        <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{stats.inProcessApplications}</div>
          <div className="text-sm text-gray-300">In-Process Applications</div>
        </div>

        {/* Total Hires Card */}
        <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{stats.totalHires}</div>
          <div className="text-sm text-gray-300">Total Hires</div>
        </div>
      </div>

      {/* Recent Jobs - Full Width */}
      <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Jobs</h2>
          <button className="text-gray-400 hover:text-white transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 mb-4">Create your first job to start receiving applications</p>
            <button
              onClick={() => setShowCreateJobModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg"
            >
              Create Your First Job
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job._id} className="bg-gray-900/50 rounded-lg p-5 border border-gray-700/30">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1A73FF] to-[#0047CC] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {job.job_title}
                      </h3>
                      <span className="text-sm text-gray-400">{job.job_id}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{job.company_name}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center text-sm text-gray-300">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {job.locations?.join(', ') || 'Not specified'}
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                        {job.experience_min} - {job.experience_max} Years
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                        ₹{job.salary_min}L - {job.salary_max}L
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${job.role_status === 'Active'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : job.role_status === 'Paused'
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                            : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                          }`}>
                          {job.role_status}
                        </span>
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-medium rounded-full border border-teal-500/30">
                          {job.sourcing_status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="text-gray-300">
                        <span className="text-gray-400">Commission: </span>
                        {job.commission_percent}% (₹{(job.commission_amount_min / 1000).toFixed(0)}k - ₹{(job.commission_amount_max / 1000).toFixed(0)}k)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workflow Steps Section */}
      <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-xl p-8 shadow-xl">
        <div className="flex items-center justify-center space-x-6">
          {/* Post Job */}
          <button
            onClick={() => setShowCreateJobModal(true)}
            className="flex flex-col items-center group"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#1A73FF] to-[#0047CC] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 mb-3">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <span className="text-sm font-semibold text-white group-hover:text-[#1A73FF] transition-colors">Post Job</span>
          </button>

          <ArrowRight className="w-8 h-8 text-[#1A73FF] flex-shrink-0" />

          {/* Receive Applications */}
          <button className="flex flex-col items-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1A73FF] to-[#0047CC] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 mb-3">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white group-hover:text-[#1A73FF] transition-colors text-center">Receive Applications</span>
          </button>

          <ArrowRight className="w-8 h-8 text-[#1A73FF] flex-shrink-0" />

          {/* Review CVs */}
          <button className="flex flex-col items-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1A73FF] to-[#0047CC] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 mb-3">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white group-hover:text-[#1A73FF] transition-colors">Review CVs</span>
          </button>

          <ArrowRight className="w-8 h-8 text-[#1A73FF] flex-shrink-0" />

          {/* Interview & Hire */}
          <button className="flex flex-col items-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1A73FF] to-[#0047CC] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 mb-3">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white group-hover:text-[#1A73FF] transition-colors text-center">Interview & Hire</span>
          </button>
        </div>
      </div>

      {/* Create Job Modal */}
      <CreateJobModal
        isOpen={showCreateJobModal}
        onClose={() => setShowCreateJobModal(false)}
        onSuccess={handleJobCreated}
      />
    </div>
  );
}
