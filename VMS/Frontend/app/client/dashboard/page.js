'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Briefcase, ChevronDown, MoreVertical, MapPin, Calendar, DollarSign, Pause } from 'lucide-react';
import CreateJobModal from '@/components/client/CreateJobModal';
import ProfileBanner from '@/components/common/ProfileBanner';
import DashboardStats from '@/components/client/DashboardStats';
import ApplicationsChart from '@/components/client/ApplicationsChart';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [clientName, setClientName] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);

  useEffect(() => {
    if (user?.fullName) {
      setClientName(user.fullName);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userName', user.fullName);
      }
    } else if (user?.email) {
      setClientName(user.email);
    } else if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setClientName(storedName);
      } else {
        setClientName('Client');
      }
    } else {
      setClientName('Client');
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
    fetchDashboardData();
  };

  const stats = {
    activeJobs: dashboardData?.summary?.activeJobs || 0,
    applicationsReceived: dashboardData?.summary?.totalApplications || 0,
    inProcessApplications: dashboardData?.summary?.inProcessApplications || 0,
    totalHires: dashboardData?.summary?.totalHires || 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="-mx-8 -my-6 p-6 min-h-screen bg-secondary-50 space-y-6 text-secondary-900 font-sans flex flex-col">
      {/* Profile Completion Banner */}
      <ProfileBanner />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Welcome back, {clientName || 'Client'}
          </h1>
          <p className="text-secondary-500 text-sm">Here's what's happening with your recruitment today.</p>
        </div>
        <button
          onClick={() => setShowCreateJobModal(true)}
          className="flex items-center justify-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/20"
        >
          <Plus className="w-5 h-5" />
          Post New Job
        </button>
      </div>

      {/* Stats Overview */}
      <DashboardStats stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1">

        {/* Left Column: Applications Chart */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6 shadow-sm min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold text-secondary-900 text-lg">Application Trends</h3>
              <p className="text-sm text-secondary-500">Applications received over time</p>
            </div>
            <select className="bg-secondary-50 border border-secondary-200 text-sm rounded-lg px-3 py-1.5 focus:ring-primary-500 focus:border-primary-500 text-secondary-700">
              <option>Last 6 Months</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 w-full h-full min-h-[300px]">
            {/* Pass application trends data from backend */}
            <ApplicationsChart data={dashboardData?.applicationTrends || []} />
          </div>
        </div>

        {/* Right Column: Recent Jobs */}
        <div className="bg-white rounded-xl border border-secondary-200 shadow-sm flex flex-col min-h-[400px]">
          <div className="p-6 border-b border-secondary-100 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-secondary-900 text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-500" />
                Recent Job Postings
              </h3>
              <p className="text-sm text-secondary-500">Manage your latest roles</p>
            </div>
            <button className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors">
              View All Jobs
            </button>
          </div>

          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {dashboardData?.postedJobs?.slice(0, 3).map((job) => (
              <div key={job._id} className="bg-secondary-50 rounded-lg p-5 border border-secondary-200 transition-all hover:shadow-md hover:border-primary-200 group">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg border border-secondary-200 flex items-center justify-center flex-shrink-0 text-primary-600 font-bold shadow-sm">
                      {job.job_title?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">{job.job_title}</h4>
                      <p className="text-sm text-secondary-500">{job.company_name || 'Company'}</p>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-secondary-600">
                        <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" />{job.location}</span>
                        <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" />{new Date(job.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center"><DollarSign className="w-3.5 h-3.5 mr-1" />{job.salary_range}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100 capitalize">
                      {job.status || 'Active'}
                    </span>
                    <button className="text-secondary-400 hover:text-primary-600 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )) || (
                <div className="h-full flex flex-col items-center justify-center text-center text-secondary-500">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="w-8 h-8 text-secondary-400" />
                  </div>
                  <p className="font-medium">No active jobs found</p>
                  <button
                    onClick={() => setShowCreateJobModal(true)}
                    className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Post your first job &rarr;
                  </button>
                </div>
              )}
          </div>
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
