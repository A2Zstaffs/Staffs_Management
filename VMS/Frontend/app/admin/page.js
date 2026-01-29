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
  const [stats, setStats] = useState(null);
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

      // Fallback to mock data if API fails
      setStats(mockStats);
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
      <main className="space-y-8 p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of system performance and key metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Recruiters"
            value={stats?.totalRecruiters}
            isLoading={isLoading}
            icon="Users"
            color="from-blue-500 to-blue-600"
            delay={0}
          />
          <StatCard
            title="Total Clients"
            value={stats?.totalClients}
            isLoading={isLoading}
            icon="Building2"
            color="from-cyan-500 to-cyan-600"
            delay={0.1}
          />
          <StatCard
            title="Active Jobs"
            value={stats?.activeJobs}
            isLoading={isLoading}
            icon="Briefcase"
            color="from-emerald-500 to-emerald-600"
            delay={0.2}
          />
          <StatCard
            title="Total Jobs Value"
            // Display Pipeline Value in INR
            value={
              isLoading
                ? "Loading..."
                : new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 1,
                  notation: "compact"
                }).format(stats?.pipelineValue || 0)
            }
            isLoading={isLoading}
            icon="IndianRupee"
            color="from-violet-500 to-violet-600"
            delay={0.3}
          />
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
            Performance Analytics
          </h2>
          <AdminCharts
            barData={recruiterClientPerformance}
            pieData={commissionDistribution}
          />
        </div>

        {/* Admin Flow Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
            System Workflows
          </h2>
          <AdminFlow steps={adminFlowSteps} />
        </div>

        {/* Management Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* KAM Management Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
              KAM Management
            </h2>
            <KAMSection />
          </div>

          {/* Recruiter Manager Management Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
              Recruiter Management
            </h2>
            <RecruiterManagerSection />
          </div>
        </div>
      </main>
    </>
  );
}
