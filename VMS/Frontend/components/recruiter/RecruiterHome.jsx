'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardAPI } from '@/lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList
} from 'recharts';
import ProfileBanner from '@/components/common/ProfileBanner';

export default function RecruiterHome() {
  const { user } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const resolveName = () => {
      if (user?.fullName) {
        setDisplayName(user.fullName);
        return;
      }
      if (user?.name) {
        setDisplayName(user.name);
        return;
      }
      // Fallback to localStorage if user object is not fully populated yet
      if (typeof window !== 'undefined') {
        const lsName = localStorage.getItem('userName');
        if (lsName) {
          setDisplayName(lsName);
          return;
        }
        try {
          const userDataStr = localStorage.getItem('userData');
          if (userDataStr) {
            const ud = JSON.parse(userDataStr);
            if (ud.fullName) {
              setDisplayName(ud.fullName);
              return;
            }
          }
        } catch (e) {
          console.error('Error parsing userData:', e);
        }
      }

      if (user?.email) {
        setDisplayName(user.email.split('@')[0]);
      } else {
        setDisplayName('Recruiter');
      }
    };

    resolveName();
  }, [user]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [metrics, setMetrics] = useState({
    totalApplications: 0,
    shortlisted: 0,
    interviews: 0,
    hires: 0,
    rejected: 0,
    leads: 0,
    conversionRate: 0
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      // If no token, maybe auth context is still loading or user not logged in
      if (!token && !user) return;

      console.log('Fetching dashboard data...');
      const dashboardRes = await dashboardAPI.getRecruiterDashboard();
      console.log('RecruiterHome Dashboard Response:', dashboardRes);

      if (dashboardRes.success && dashboardRes.data?.performanceMetrics) {
        console.log('Setting metrics to:', dashboardRes.data.performanceMetrics);
        setMetrics(dashboardRes.data.performanceMetrics);
      } else {
        console.warn('Dashboard response missing performanceMetrics:', dashboardRes);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();

    const handleFocus = () => {
      fetchDashboardData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchDashboardData]);

  // Chart Data Preparation with Blue Theme
  const pipelineData = [
    { name: 'Applications', value: metrics.totalApplications, fill: '#3B82F6' }, // blue-600
    { name: 'Shortlisted', value: metrics.shortlisted, fill: '#8B5CF6' },        // purple-600
    { name: 'Interviews', value: metrics.interviews, fill: '#F59E0B' },          // amber-600
    { name: 'Hires', value: metrics.hires, fill: '#10B981' },                    // emerald-600
    { name: 'Rejected', value: metrics.rejected, fill: '#EF4444' },              // red-600
  ];

  const successRateData = [
    { name: 'Hires', value: metrics.hires },
    { name: 'Remaining', value: Math.max(0, metrics.totalApplications - metrics.hires) },
  ];
  const COLORS = ['#10B981', '#E5E7EB']; // emerald-600, gray-200

  const statCards = [
    {
      label: 'Total Applications',
      value: metrics.totalApplications,
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: '+12%'
    },
    {
      label: 'Shortlisted',
      value: metrics.shortlisted,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      trend: '+8%'
    },
    {
      label: 'Interviews Scheduled',
      value: metrics.interviews,
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
      trend: '+5%'
    },
    {
      label: 'Successfully Hired',
      value: metrics.hires,
      icon: 'M5 13l4 4L19 7',
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      trend: '+3%'
    },
  ];

  const actions = [
    {
      label: 'Book Onboarding Call',
      description: 'Schedule a call with our team',
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      link: 'https://calendly.com/azstaffs4/30min',
      external: true
    },
    {
      label: 'View Jobs',
      description: 'Browse available positions',
      color: 'bg-emerald-600 hover:bg-emerald-700',
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      action: () => router.push('/recruiter/jobs')
    },
    {
      label: 'Track Status',
      description: 'Check candidate progress',
      color: 'bg-purple-600 hover:bg-purple-700',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      action: () => router.push('/recruiter/track-status')
    },
    {
      label: 'Total Applications',
      description: 'View all uploaded profiles',
      color: 'bg-amber-600 hover:bg-amber-700',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      action: () => router.push('/recruiter/applications')
    },
  ];

  const recommendations = [
    { title: 'Upload shortlisted candidates to increase pipeline speed', tag: 'Tip', color: 'bg-blue-500' },
    { title: 'Review new jobs posted today', tag: 'New', color: 'bg-emerald-500' },
    { title: 'Complete your company profile to build trust', tag: 'Profile', color: 'bg-purple-500' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 bg-gray-50 space-y-8">
      {/* Profile Completion Banner */}
      <ProfileBanner />

      {/* Hero Welcome Section with Gradient */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-8 shadow-xl border border-blue-500/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Welcome back, {displayName}!</h1>
            </div>
            <p className="text-blue-100 text-lg">Track your recruitment performance and manage candidates efficiently.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
            <p className="text-sm font-medium text-blue-200 uppercase tracking-wider mb-1">Today's Date</p>
            <p className="text-lg font-semibold text-white">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.label}</h3>
            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Analytics Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Recruitment Pipeline</h2>
          </div>
          <div className="h-80 w-full" style={{ minHeight: '320px' }}>
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#fff',
                      padding: '12px'
                    }}
                    cursor={{ fill: '#F3F4F6' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={50}>
                    <LabelList dataKey="value" position="top" style={{ fill: '#374151', fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Success Rate Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Success Rate</h2>
          </div>
          <div className="flex-1 min-h-[250px] relative flex items-center justify-center" style={{ minHeight: '250px' }}>
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={successRateData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {successRateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center -mt-4">
              <p className="text-3xl font-bold text-gray-900">{metrics.totalApplications > 0 ? ((metrics.hires / metrics.totalApplications) * 100).toFixed(0) : 0}%</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Placement</p>
            </div>
          </div>
          <div className="mt-4 text-center bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-emerald-600">{metrics.hires}</span> hired out of <span className="font-bold text-gray-900">{metrics.totalApplications}</span> applications
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions & Tips Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {actions.map((a, i) => (
              <div
                key={i}
                onClick={a.action || (() => a.link && window.open(a.link, a.external ? '_blank' : '_self'))}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl text-white ${a.color} shadow-lg group-hover:scale-110 transition-transform`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg mb-1">{a.label}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{a.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips / Info Panel */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-amber-500 rounded-full"></div>
            Recruiter Insights
          </h2>
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-6 text-white shadow-xl flex-1 flex flex-col">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Optimization Tips
            </h3>
            <div className="space-y-3 flex-1">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/5 backdrop-blur-sm p-4 rounded-xl hover:bg-white/10 transition cursor-default border border-white/10">
                  <span className={`${rec.color} text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm mt-0.5`}>
                    {rec.tag}
                  </span>
                  <p className="text-sm font-medium text-gray-100 leading-relaxed">{rec.title}</p>
                </div>
              ))}
            </div>
            {/* Mini Footer inside card */}
            <div className="mt-6 text-center border-t border-white/10 pt-4">
              <a href="#" className="text-sm text-blue-300 hover:text-white transition font-medium inline-flex items-center gap-2">
                View Knowledge Base
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
