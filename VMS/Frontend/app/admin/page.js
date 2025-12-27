'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from './components/StatCard';
import AdminCharts from './components/AdminCharts';
import AdminFlow from './components/AdminFlow';
import KAMSection from './components/KAMSection';
import RecruiterManagerSection from './components/RecruiterManagerSection';
import { adminAPI } from '@/lib/api';
import {
  adminStats as mockStats,
  recruiterClientPerformance,
  commissionDistribution,
  adminFlowSteps
} from './data/adminData';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState(mockStats);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication and admin role
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        // Not logged in - redirect to admin login
        router.push('/admin/login');
      } else if (user?.role !== 'admin') {
        // Logged in but not admin - redirect to appropriate dashboard
        const redirectPath = user?.role === 'client' ? '/client/dashboard' : '/recruiter/home';
        router.push(redirectPath);
      }
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchStats();
    }
  }, [isAuthenticated, user]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      // Try to fetch from API
      // If API fails (404/500), we'll fall back to mock data
      try {
        const response = await adminAPI.getStats();
        if (response.success && response.data) {
          setStats(response.data);
          return;
        }
      } catch (apiError) {
        console.warn('API fetch failed, using mock data:', apiError);
      }

      // Keep using mock data if API fails (which is the default state set in useState)
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <main className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Recruiters"
            value={stats.totalRecruiters}
            icon="Users"
            color="from-blue-500 to-blue-600"
            delay={0}
          />
          <StatCard
            title="Total Clients"
            value={stats.totalClients}
            icon="Building2"
            color="from-cyan-500 to-cyan-600"
            delay={0.1}
          />
          <StatCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon="Briefcase"
            color="from-indigo-500 to-indigo-600"
            delay={0.2}
          />
          <StatCard
            title="Monthly Revenue"
            value={typeof stats.monthlyRevenue === 'number' ? `$${stats.monthlyRevenue.toLocaleString('en-US')}` : stats.monthlyRevenue}
            icon="DollarSign"
            color="from-green-500 to-green-600"
            delay={0.3}
          />
        </div>

        {/* Charts Section */}
        <div>
          <AdminCharts
            barData={recruiterClientPerformance}
            pieData={commissionDistribution}
          />
        </div>

        {/* Admin Flow Section */}
        <div>
          <AdminFlow steps={adminFlowSteps} />
        </div>

        {/* KAM Management Section */}
        <div>
          <KAMSection />
        </div>

        {/* Recruiter Manager Management Section */}
        <div>
          <RecruiterManagerSection />
        </div>
      </main>
    </>
  );
}
