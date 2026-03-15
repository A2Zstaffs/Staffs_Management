'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from './components/StatCard';
import AdminCharts from './components/AdminCharts';
import PendingActionsCard from './components/PendingActionsCard';
import RecentActivityFeed from './components/RecentActivityFeed';
import QuickActionsGrid from './components/QuickActionsGrid';
import { adminAPI, notificationAPI } from '@/lib/api';
import { quickActions } from './data/adminData';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // State for all data
  const [stats, setStats] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [pipelineData, setPipelineData] = useState(null);
  const [jobsData, setJobsData] = useState([]);
  const [recruitersData, setRecruitersData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  // Check authentication and admin role
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/admin/login');
      } else if (user?.role !== 'admin') {
        const redirectPath = user?.role === 'client' ? '/client/dashboard' : '/recruiter/home';
        router.push(redirectPath);
      }
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchAllData();
    }
  }, [isAuthenticated, user]);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);

      // Fetch all data in parallel
      const [
        statsRes,
        performanceRes,
        pipelineRes,
        jobsRes,
        recruitersRes,
        clientsRes,
        notificationsRes
      ] = await Promise.allSettled([
        adminAPI.getStats(),
        adminAPI.getPerformance(),
        adminAPI.getPipeline(),
        adminAPI.getJobs(),
        adminAPI.getRecruiters(),
        adminAPI.getClients(),
        notificationAPI.getNotifications()
      ]);

      // Process stats
      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setStats(statsRes.value.data);
      }

      // Process performance data for charts
      if (performanceRes.status === 'fulfilled' && performanceRes.value?.success) {
        // Transform to include jobs count
        const perfData = performanceRes.value.data.map(item => ({
          month: item.name,
          recruiters: item.recruiters,
          clients: item.clients,
          jobs: Math.floor(item.recruiters * 2.5) // Estimated based on recruiter activity
        }));
        setPerformanceData(perfData);
      }

      // Process pipeline data
      if (pipelineRes.status === 'fulfilled' && pipelineRes.value?.success) {
        setPipelineData(pipelineRes.value.data);
      }

      // Process jobs data
      if (jobsRes.status === 'fulfilled' && jobsRes.value?.success) {
        setJobsData(jobsRes.value.data || []);
      }

      // Process recruiters data
      if (recruitersRes.status === 'fulfilled' && recruitersRes.value?.success) {
        setRecruitersData(recruitersRes.value.data || []);
      }

      // Process clients data
      if (clientsRes.status === 'fulfilled' && clientsRes.value?.success) {
        setClientsData(clientsRes.value.data || []);
      }

      // Process notifications for activity feed
      if (notificationsRes.status === 'fulfilled' && notificationsRes.value?.success) {
        const notifs = notificationsRes.value.data || [];
        // Transform to activity format
        const activities = notifs.slice(0, 8).map(n => ({
          _id: n._id,
          message: n.message || n.title,
          createdAt: n.createdAt,
          type: 'default',
          icon: 'Bell'
        }));
        setNotifications(activities);
      }

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  };

  // Compute pending actions from real data
  const pendingJobApprovals = jobsData.filter(j =>
    j.approval_status === 'Pending' || j.role_status === 'Pending'
  ).length;

  const unassignedClients = clientsData.filter(c => !c.assignedKam).length;
  const unassignedRecruiters = recruitersData.filter(r => !r.assignedRM).length;
  const cvsInReview = pipelineData?.internal_review?.length || 0;

  // Calculate job status distribution from real data
  const jobStatusDistribution = [
    { name: 'Active', value: jobsData.filter(j => j.role_status === 'Active').length, color: '#10b981' },
    { name: 'Pending', value: jobsData.filter(j => j.role_status === 'Pending').length, color: '#f59e0b' },
    { name: 'Paused', value: jobsData.filter(j => j.role_status === 'Paused').length, color: '#6b7280' },
    { name: 'Closed', value: jobsData.filter(j => j.role_status === 'Closed').length, color: '#ef4444' }
  ].filter(s => s.value > 0);

  if (authLoading || !isAuthenticated || user?.role !== 'admin') {
    return <LoadingSpinner variant="logo" size="xl" message="Loading admin dashboard..." fullScreen />;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Real-time system overview and key metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Refresh
            </button>
            <span className="text-sm text-gray-500">
              {lastUpdated && `Updated: ${lastUpdated}`}
            </span>
          </div>
        </div>

        {/* Stats Grid - 5 Cards with real data */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Recruiters"
            value={stats?.totalRecruiters || 0}
            isLoading={isLoading}
            icon="Users"
            color="from-blue-500 to-blue-600"
            delay={0}
          />
          <StatCard
            title="Total Clients"
            value={stats?.totalClients || 0}
            isLoading={isLoading}
            icon="Building2"
            color="from-cyan-500 to-cyan-600"
            delay={0.05}
          />
          <StatCard
            title="Active Jobs"
            value={stats?.activeJobs || 0}
            isLoading={isLoading}
            icon="Briefcase"
            color="from-emerald-500 to-emerald-600"
            delay={0.1}
          />
          <StatCard
            title="CV Profiles"
            value={stats?.totalProfiles || 0}
            isLoading={isLoading}
            icon="FileText"
            color="from-purple-500 to-purple-600"
            delay={0.15}
          />
          <StatCard
            title="Pipeline Value"
            value={
              isLoading
                ? "..."
                : new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                  notation: "compact"
                }).format(stats?.pipelineValue || 0)
            }
            isLoading={isLoading}
            icon="IndianRupee"
            color="from-amber-500 to-amber-600"
            delay={0.2}
          />
        </div>

        {/* Charts Section */}
        <AdminCharts
          trendData={performanceData}
          statusData={jobStatusDistribution.length > 0 ? jobStatusDistribution : [{ name: 'No Jobs', value: 1, color: '#e5e7eb' }]}
        />

        {/* Pending Actions + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Actions - Actionable items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
                  <h3 className="font-semibold text-gray-800">Pending Actions</h3>
                </div>
                <span className="text-xs text-gray-500">Items requiring attention</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <PendingActionsCard
                  title="Job Approvals"
                  count={pendingJobApprovals}
                  icon="ClipboardCheck"
                  href="/admin/jobs"
                  color="blue"
                  description="Jobs awaiting approval"
                  isLoading={isLoading}
                  delay={0}
                />
                <PendingActionsCard
                  title="Unassigned Clients"
                  count={unassignedClients}
                  icon="UserX"
                  href="/admin/clients"
                  color="orange"
                  description="Clients without KAM"
                  isLoading={isLoading}
                  delay={0.1}
                />
                <PendingActionsCard
                  title="Unassigned Recruiters"
                  count={unassignedRecruiters}
                  icon="Users"
                  href="/admin/recruiters"
                  color="purple"
                  description="Recruiters without RM"
                  isLoading={isLoading}
                  delay={0.2}
                />
                <PendingActionsCard
                  title="CVs In Review"
                  count={cvsInReview}
                  icon="FileText"
                  href="/admin/pipeline"
                  color="amber"
                  description="Profiles pending review"
                  isLoading={isLoading}
                  delay={0.3}
                />
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="lg:col-span-1">
            <RecentActivityFeed
              activities={notifications}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActionsGrid actions={quickActions} />
      </div>
    </main>
  );
}
