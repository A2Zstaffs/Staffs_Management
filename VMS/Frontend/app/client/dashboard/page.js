'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { MoreVertical, MapPin, Briefcase, Calendar, DollarSign, Pause, ChevronDown, ArrowRight } from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [clientName, setClientName] = useState('');

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

  // Mock data for stats
  const stats = {
    activeJobs: 4,
    applicationsReceived: 33,
    inProcessApplications: 2,
    totalHires: 5,
  };

  // Mock data for applications chart
  const applicationsData = [
    { name: 'Active', value: 20, color: '#1A73FF' },
    { name: 'In-Process', value: 8, color: '#00D9FF' },
    { name: 'Closed', value: 5, color: '#64748b' },
  ];

  // Mock data for recent job
  const recentJob = {
    id: '6715',
    title: 'Manager - Business Development',
    industry: '(B2B Saas, ERP, Manufacturing)',
    location: 'Chennai +1 other',
    experience: '5 - 7 Years',
    daysOpen: '60 Days',
    salaryRange: '₹11 L – 15 L',
    status: 'Active',
    priority: 'Priority',
    commission: '3% (₹34,000 - 45,000)',
    bonus: '₹250',
  };

  // Custom label for donut chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, {clientName || 'Client'} 👋
        </h1>
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

      {/* Middle Section - Recent Jobs and Applications Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs Card */}
        <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Jobs</h2>
            <button className="text-gray-400 hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-lg p-5 border border-gray-700/30">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1A73FF] to-[#0047CC] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {recentJob.title} {recentJob.id}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{recentJob.industry}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-sm text-gray-300">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {recentJob.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                      {recentJob.experience}
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {recentJob.daysOpen}
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      {recentJob.salaryRange}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
                        {recentJob.status}
                      </span>
                      <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-medium rounded-full border border-teal-500/30">
                        {recentJob.priority}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="text-gray-300">
                      <span className="text-gray-400">Commission: </span>
                      {recentJob.commission}
                    </div>
                    <div className="text-gray-300">
                      <span className="text-gray-400">Bonus: </span>
                      {recentJob.bonus}
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-600/50">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Chart Card */}
        <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Applications</h2>
            <button className="text-gray-400 hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applicationsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {applicationsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-4">
            {applicationsData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-300">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow Steps Section */}
      <div className="bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-xl p-8 shadow-xl">
        <div className="flex items-center justify-center space-x-6">
          {/* Post Job */}
          <button className="flex flex-col items-center group">
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
    </div>
  );
}
