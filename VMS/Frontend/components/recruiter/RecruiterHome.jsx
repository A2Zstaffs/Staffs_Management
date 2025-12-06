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

  // Chart Data Preparation
  const pipelineData = [
    { name: 'Applications', value: metrics.totalApplications, fill: '#3B82F6' },
    { name: 'Shortlisted', value: metrics.shortlisted, fill: '#F59E0B' },
    { name: 'Interviews', value: metrics.interviews, fill: '#8B5CF6' },
    { name: 'Hires', value: metrics.hires, fill: '#10B981' },
    { name: 'Rejected', value: metrics.rejected, fill: '#EF4444' },
  ];

  const successRateData = [
    { name: 'Hires', value: metrics.hires },
    { name: 'Remaining', value: Math.max(0, metrics.totalApplications - metrics.hires) },
  ];
  const COLORS = ['#10B981', '#E5E7EB'];

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
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      action: () => router.push('/recruiter/applications')
    },
  ];

  const recommendations = [
    { title: 'Upload shortlisted candidates to increase pipeline speed', tag: 'Tip' },
    { title: 'Review new jobs posted today', tag: 'New' },
    { title: 'Complete your company profile to build trust', tag: 'Profile' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 min-h-[calc(100vh-64px)] space-y-8">

      {/* Hero Welcome */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {displayName}!</h1>
          <p className="text-gray-500 mt-2">Here is an overview of your recruitment performance.</p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Today's Date</p>
          <p className="text-xl font-semibold text-gray-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recruitment Pipeline</h2>
          <div className="h-80 w-full" style={{ minHeight: '320px' }}>
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    cursor={{ fill: '#F3F4F6' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                    <LabelList dataKey="value" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Success Rate Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Success Rate</h2>
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
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center -mt-4">
              <p className="text-3xl font-bold text-gray-900">{metrics.totalApplications > 0 ? ((metrics.hires / metrics.totalApplications) * 100).toFixed(0) : 0}%</p>
              <p className="text-xs text-gray-400 font-medium uppercase">Placement</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-emerald-600">{metrics.hires}</span> candidates hired out of <span className="font-semibold text-gray-900">{metrics.totalApplications}</span> applications.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions & Tips Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {actions.map((a, i) => (
              <div
                key={i}
                onClick={a.action || (() => a.link && window.open(a.link, a.external ? '_blank' : '_self'))}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex items-start gap-4 hover:-translate-y-1"
              >
                <div className={`p-3 rounded-lg text-white ${a.color} shadow-md group-hover:rotate-6 transition-transform`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{a.label}</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-snug">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips / Info Panel */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
            Recruiter Insights
          </h2>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex-1 flex flex-col">
            <h3 className="font-bold text-lg mb-4 border-b border-white/10 pb-2">Optimization Tips</h3>
            <div className="space-y-4 flex-1">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg hover:bg-white/10 transition cursor-default">
                  <span className="bg-blue-500 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm mt-0.5">
                    {rec.tag}
                  </span>
                  <p className="text-sm font-medium opacity-90">{rec.title}</p>
                </div>
              ))}
            </div>
            {/* Mini Footer inside card */}
            <div className="mt-8 text-center border-t border-white/10 pt-4">
              <a href="#" className="text-xs text-blue-300 hover:text-white transition">View Knowledge Base &rarr;</a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
