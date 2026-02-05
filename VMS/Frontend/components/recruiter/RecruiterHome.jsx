'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardAPI, notificationAPI } from '@/lib/api';
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
      // Fallback to storage if user object is not fully populated yet
      if (typeof window !== 'undefined') {
        const lsName = sessionStorage.getItem('userName') || localStorage.getItem('userName');
        if (lsName) {
          setDisplayName(lsName);
          return;
        }
        try {
          const userDataStr = sessionStorage.getItem('userData') || localStorage.getItem('userData');
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
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
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
      label: 'My Applications',
      description: 'View all uploaded profiles',
      color: 'bg-amber-600 hover:bg-amber-700',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      action: () => router.push('/recruiter/applications')
    },
    {
      label: 'Upload Profile',
      description: 'Submit a candidate profile',
      color: 'bg-rose-600 hover:bg-rose-700',
      icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
      action: () => router.push('/recruiter/jobs')
    },
    {
      label: 'Help & Support',
      description: 'Get assistance from our team',
      color: 'bg-cyan-600 hover:bg-cyan-700',
      icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
      link: 'mailto:support@azstaffs.com',
      external: true
    },
  ];

  const recommendations = [
    { title: 'Upload shortlisted candidates to increase pipeline speed', tag: 'Tip', color: 'bg-blue-500' },
    { title: 'Review new jobs posted today for best opportunities', tag: 'New', color: 'bg-emerald-500' },
    { title: 'Complete your company profile to build trust', tag: 'Profile', color: 'bg-purple-500' },
    { title: 'Follow up on pending interviews within 24 hours', tag: 'Action', color: 'bg-amber-500' },
    { title: 'Target jobs with commission above ₹50K for higher earnings', tag: 'Strategy', color: 'bg-rose-500' },
  ];

  const [notifications, setNotifications] = useState([]);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationAPI.getNotifications();
        if (response.success && response.data) {
          // Filter only unread notifications
          const unreadNotifications = response.data.filter(n => !n.isRead);
          setNotifications(unreadNotifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const handleDismissNotification = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const currentNotification = notifications[currentNotificationIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Bar - Dynamic from API */}
      {currentNotification && (
        <div className={`fixed top-16 left-0 right-0 z-40 text-white py-2 px-4 ${currentNotification.priority === 'high'
            ? 'bg-gradient-to-r from-red-500 to-rose-600'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600'
          }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm flex-1">
              <svg className="w-4 h-4 text-amber-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>
                <strong>{currentNotification.title}:</strong> {currentNotification.message}
                {currentNotification.link && (
                  <a href={currentNotification.link} className="underline hover:text-blue-200 ml-2">View →</a>
                )}
              </span>
              {notifications.length > 1 && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-2">
                  {currentNotificationIndex + 1}/{notifications.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentNotificationIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentNotificationIndex === 0}
                    className="p-1 hover:bg-white/20 rounded transition disabled:opacity-40"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentNotificationIndex(prev => Math.min(notifications.length - 1, prev + 1))}
                    disabled={currentNotificationIndex === notifications.length - 1}
                    className="p-1 hover:bg-white/20 rounded transition disabled:opacity-40"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              <button
                onClick={() => handleDismissNotification(currentNotification._id)}
                className="p-1 hover:bg-white/20 rounded transition flex-shrink-0 ml-2"
                title="Mark as read"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-6">
        {/* Profile Completion Banner */}
        <ProfileBanner />

        {/* Welcome Header - Compact */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Welcome back, {displayName}!</h1>
              <p className="text-blue-100 text-sm">Track your recruitment performance and manage candidates.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <p className="text-xs text-blue-200 uppercase tracking-wider">Today</p>
                <p className="text-sm font-semibold text-white">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => router.push('/recruiter/jobs')}
                className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition shadow"
              >
                Browse Jobs
              </button>
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

        {/* Quick Actions & Insights - Compact */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {actions.map((a, i) => (
                <div
                  key={i}
                  onClick={a.action || (() => a.link && window.open(a.link, a.external ? '_blank' : '_self'))}
                  className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-lg text-white ${a.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-0.5">{a.label}</h3>
                  <p className="text-xs text-gray-500">{a.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Insights Panel - Compact */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Insights
            </h2>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 text-white shadow-lg">
              {/* Weekly Goal */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-300">Weekly Goal</span>
                  <span className="text-xs font-bold text-emerald-400">{Math.min(100, Math.round((metrics.totalApplications / 10) * 100))}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div
                    className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (metrics.totalApplications / 10) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-white/10 p-2.5 rounded-lg text-center">
                  <p className="text-lg font-bold">{metrics.shortlisted}</p>
                  <p className="text-[10px] text-gray-400">Shortlisted</p>
                </div>
                <div className="bg-white/10 p-2.5 rounded-lg text-center">
                  <p className="text-lg font-bold">{metrics.interviews}</p>
                  <p className="text-[10px] text-gray-400">Interviews</p>
                </div>
              </div>

              {/* Tips - Compact */}
              <div className="space-y-2 mb-4">
                {recommendations.slice(0, 3).map((rec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className={`${rec.color} w-1.5 h-1.5 rounded-full flex-shrink-0`}></span>
                    <p className="text-gray-300 truncate">{rec.title}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push('/recruiter/track-status')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
              >
                View Analytics
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* How It Works - Compact */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How It Works
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Browse Jobs', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', color: 'bg-blue-500' },
              { step: '2', title: 'Upload Profiles', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12', color: 'bg-purple-500' },
              { step: '3', title: 'Track Progress', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'bg-amber-500' },
              { step: '4', title: 'Earn Commission', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-emerald-500' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className={`w-9 h-9 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">STEP {item.step}</p>
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Summary - Compact */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold mb-1">Performance Summary</h2>
              <p className="text-blue-100 text-sm">Keep improving to unlock higher commissions.</p>
            </div>
            <div className="flex items-center gap-3">
              {[
                { label: 'Submissions', value: metrics.totalApplications },
                { label: 'Success Rate', value: metrics.totalApplications > 0 ? `${((metrics.hires / metrics.totalApplications) * 100).toFixed(0)}%` : '0%' },
                { label: 'Pipeline', value: metrics.interviews + metrics.shortlisted }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/15 px-4 py-2 rounded-lg text-center min-w-[80px]">
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-[10px] text-blue-200">{stat.label}</p>
                </div>
              ))}
              <button
                onClick={() => router.push('/recruiter/track-status')}
                className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
              >
                Details →
              </button>
            </div>
          </div>
        </section>

        {/* Footer - Compact */}
        <footer className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm">
              <a href="mailto:support@azstaffs.com" className="text-gray-600 hover:text-blue-600 transition flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Support
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">Recruiter Guide</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">Commission Structure</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">FAQs</a>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} AZ Staffs
              </p>
              <a href="#" className="text-xs text-gray-400 hover:text-blue-600">Privacy</a>
              <a href="#" className="text-xs text-gray-400 hover:text-blue-600">Terms</a>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
