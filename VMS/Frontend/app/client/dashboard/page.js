'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Briefcase, FileText, CheckCircle, Clock } from 'lucide-react';
import CreateJobModal from '@/components/client/CreateJobModal';
import ProfileBanner from '@/components/common/ProfileBanner';
import DashboardStats from '@/components/client/DashboardStats';
import ApplicationsChart from '@/components/client/ApplicationsChart';
import JobPerformanceTable from '@/components/client/JobPerformanceTable';
import ActivityFeed from '@/components/client/ActivityFeed';
import QuickInsights from '@/components/client/QuickInsights';
import { notificationAPI, authAPI } from '@/lib/api';

export default function ClientDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [clientName, setClientName] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.fullName) {
      setClientName(user.fullName);
    } else if (user?.email) {
      setClientName(user.email);
    } else {
      setClientName('Client');
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications();
      if (response.success && response.data) {
        const unreadNotifications = response.data.filter(n => !n.isRead);
        setNotifications(unreadNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleDismissNotification = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const currentNotification = notifications[currentNotificationIndex];

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = authAPI.getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

      const response = await fetch(`${apiUrl}/dashboard/client`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = 'Failed to fetch dashboard data';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError({
        status: error.status || 'Unknown',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowCreateJobModal(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowCreateJobModal(true);
  };

  const handleModalClose = () => {
    setShowCreateJobModal(false);
    setEditingJob(null);
  };

  const handleJobSaved = () => {
    fetchDashboardData();
  };

  const handleViewJob = (job) => {
    // Navigate to job details page
    router.push(`/client/my-jobs?jobId=${job._id}`);
  };

  const handleViewAllJobs = () => {
    // Navigate to all jobs page
    router.push('/client/my-jobs');
  };

  const handleViewHistory = () => {
    // Navigate to reports/activity history page
    router.push('/client/reports');
  };

  const timeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + (interval === 1 ? " year ago" : " years ago");

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + (interval === 1 ? " month ago" : " months ago");

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + (interval === 1 ? " hour ago" : " hours ago");

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + (interval === 1 ? " minute ago" : " minutes ago");

    return "Just now";
  };

  // Derive recent activities from real data
  const getRecentActivities = () => {
    if (!dashboardData) return [];

    const activities = [];

    // 1. New Jobs Posted
    if (dashboardData.postedJobs) {
      dashboardData.postedJobs.forEach(job => {
        const location = job.location || 'Remote';
        const title = job.job_title || 'Untitled Role';
        activities.push({
          id: `job-${job._id}`,
          type: 'job',
          title: 'New Job Posted',
          desc: `${title} (${location})`,
          timestamp: new Date(job.createdAt),
          time: timeAgo(new Date(job.createdAt)),
          icon: Briefcase, // Note: passing Component reference, not string
          color: 'purple'
        });
      });
    }

    // 2. New Applications (from profiles array)
    if (dashboardData.profiles) {
      dashboardData.profiles.forEach(profile => {
        const jobTitle = profile.job_id?.job_title || profile.job?.title || 'a job';
        activities.push({
          id: `app-${profile._id}`,
          type: 'application',
          title: 'New Candidate',
          desc: `Submitted for ${jobTitle}`,
          timestamp: new Date(profile.createdAt),
          time: timeAgo(new Date(profile.createdAt)),
          icon: FileText,
          color: 'blue'
        });
      });
    }

    // 3. Status Changes (simulated via status checks)
    if (dashboardData.profiles) {
      dashboardData.profiles.forEach(profile => {
        const jobTitle = profile.job_id?.job_title || 'role';
        const cName = profile.uploaded_by?.fullName || 'Candidate';
        const date = new Date(profile.updatedAt || profile.createdAt);

        if (['shortlisted', 'interview_scheduled'].includes(profile.status?.toLowerCase())) {
          activities.push({
            id: `status-${profile._id}`,
            type: 'interview',
            title: 'Interview Stage',
            desc: `${cName} moved to ${profile.status}`,
            timestamp: date,
            time: timeAgo(date),
            icon: Clock,
            color: 'amber'
          });
        }
        if (['placed', 'hired', 'selected'].includes(profile.status?.toLowerCase())) {
          activities.push({
            id: `hire-${profile._id}`,
            type: 'hire',
            title: 'Candidate Hired!',
            desc: `Placement for ${jobTitle}`,
            timestamp: date,
            time: timeAgo(date),
            icon: CheckCircle,
            color: 'emerald'
          });
        }
      });
    }

    // Sort by timestamp desc and take top 10
    return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  };

  const getExtendedStats = () => {
    if (!dashboardData) return {};

    let topJob = 'N/A';
    let maxApps = 0;
    if (dashboardData.postedJobs) {
      const appsPerJob = {};
      [...(dashboardData.profiles || []), ...(dashboardData.applications || [])].forEach(app => {
        const jId = app.job_id?._id || app.job?._id || app.job_id || app.job;
        if (jId) {
          appsPerJob[jId] = (appsPerJob[jId] || 0) + 1;
        }
      });

      let topJobId = null;
      Object.entries(appsPerJob).forEach(([jId, count]) => {
        if (count > maxApps) {
          maxApps = count;
          topJobId = jId;
        }
      });

      if (topJobId) {
        const jobBox = dashboardData.postedJobs.find(j => j._id === topJobId);
        if (jobBox) topJob = jobBox.job_title;
      }
    }

    const enrichedJobs = dashboardData.postedJobs?.map(job => {
      const jobApps = [...(dashboardData.profiles || []), ...(dashboardData.applications || [])].filter(app => {
        const jId = app.job_id?._id || app.job?._id || app.job_id || app.job;
        return jId === job._id;
      });

      const inProcess = jobApps.filter(a => ['shortlisted', 'interview_scheduled', 'interviewed', 'In Process'].includes(a.status));
      const hired = jobApps.filter(a => ['Placed', 'hired', 'selected', 'joined'].includes(a.status));

      return {
        ...job,
        applicationCount: jobApps.length,
        inProcessCount: inProcess.length,
        hiredCount: hired.length
      };
    }) || [];

    return {
      activeJobs: dashboardData.summary?.activeJobs || 0,
      applicationsReceived: dashboardData.summary?.totalApplications || 0,
      inProcessApplications: dashboardData.summary?.inProcessApplications || 0,
      totalHires: dashboardData.summary?.totalHires || 0,
      commissionPaid: dashboardData.commissionPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
      topJob,
      enrichedJobs
    };
  };

  const extendedStats = getExtendedStats();
  const recentActivities = getRecentActivities();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-primary-600 mb-4 animate-spin">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-slate-500 font-medium">Loading your command center...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">Failed to Load Dashboard</h3>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <button
            onClick={fetchDashboardData}
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="-mx-8 -my-6 p-6 min-h-screen bg-secondary-50 font-sans flex flex-col">
      {currentNotification && (
        <div className={`-mx-6 -mt-6 mb-6 p-3 text-white shadow-md ${currentNotification.priority === 'high'
          ? 'bg-gradient-to-r from-red-500 to-rose-600'
          : 'bg-gradient-to-r from-blue-600 to-indigo-600'
          }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm flex-1">
              <span className="bg-white/20 p-1 rounded-full"><Plus className="w-3 h-3 rotate-45" /></span>
              <span className="font-medium">{currentNotification.title}: {currentNotification.message}</span>
            </div>
            <button onClick={() => handleDismissNotification(currentNotification._id)} className="opacity-80 hover:opacity-100">Dismiss</button>
          </div>
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">
            Welcome back, {clientName}
          </h1>
          <p className="text-secondary-500 mt-2 text-lg">
            Here's what's happening with your recruitment pipeline today.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCreateJob}
            className="flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </button>
        </div>
      </div>

      <div className="mb-8">
        <ProfileBanner />
      </div>

      <DashboardStats stats={extendedStats} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">

        {/* Left Column (8 cols) - Use flex-col to fill height */}
        <div className="xl:col-span-8 flex flex-col gap-6">

          <div className="bg-white rounded-xl border border-secondary-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-secondary-900 text-lg">Application Trends</h3>
                <p className="text-sm text-secondary-500">Candidate interest over time</p>
              </div>
              <select className="bg-secondary-50 border border-secondary-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-primary-500 text-secondary-700 font-medium">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-[350px]">
              <ApplicationsChart data={dashboardData?.applicationTrends || []} />
            </div>
          </div>

          {/* Job Performance Table - Flex grow to fill remaining space if needed */}
          <div className="flex-1 min-h-[400px]">
            <JobPerformanceTable
              jobs={extendedStats.enrichedJobs}
              onEdit={handleEditJob}
              onView={handleViewJob}
              onViewAll={handleViewAllJobs}
            />
          </div>
        </div>

        {/* Right Column (4 cols) - Flex col */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <QuickInsights stats={extendedStats} jobs={extendedStats.enrichedJobs} />

          {/* Activity Feed - Flex grow to fill space */}
          <div className="flex-1 min-h-[400px]">
            <ActivityFeed activities={recentActivities} onViewHistory={handleViewHistory} />
          </div>
        </div>
      </div>

      <CreateJobModal
        isOpen={showCreateJobModal}
        onClose={handleModalClose}
        onSuccess={handleJobSaved}
        jobToEdit={editingJob}
      />
    </div>
  );
}
