'use client';

import { useState, useEffect } from 'react';

// Simple SVG Chart components to avoid external processing or heavy libraries if not present
// This ensures it works "out of the box"

const BarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-40 text-gray-400">No data available</div>;
  }

  const max = Math.max(...data.map(d => d.value), 1); // Ensure max is at least 1 to avoid division by zero

  return (
    <div className="flex items-end space-x-2 h-40">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div
            className="w-full bg-blue-600 rounded-t-sm transition-all duration-500 hover:bg-blue-700 relative group"
            style={{ height: `${max > 0 ? (d.value / max) * 100 : 0}%`, minHeight: d.value > 0 ? '4px' : '0px' }}
          >
            {d.value > 0 && (
              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                {d.value}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 mt-1 font-medium">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function ReportsPage() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    applications: 0,
    hires: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch real data from dashboard API to populate reports
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/dashboard/client`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (result.success) {
        setStats({
          totalJobs: result.data.summary.totalJobs,
          activeJobs: result.data.summary.activeJobs,
          applications: result.data.summary.totalApplications,
          hires: result.data.summary.totalHires,
          conversionRate: result.data.summary.totalApplications > 0
            ? ((result.data.summary.totalHires / result.data.summary.totalApplications) * 100).toFixed(1)
            : 0
        });

        // Set chart data if available, otherwise fallback to defaults
        if (result.data.applicationTrends) {
          setChartData(result.data.applicationTrends);
        }
      }
    } catch (error) {
      console.error('Failed to load report data', error);
    } finally {
      setLoading(false);
    }
  };

  const [chartData, setChartData] = useState([
    { label: 'Jan', value: 0 },
    { label: 'Feb', value: 0 },
    { label: 'Mar', value: 0 },
    { label: 'Apr', value: 0 },
    { label: 'May', value: 0 },
    { label: 'Jun', value: 0 },
  ]);

  if (loading) return <div className="p-10 text-center">Loading reports...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Hiring Reports <span className="text-blue-400">.</span></h1>
          <p className="text-slate-300">Overview of your recruitment performance</p>
        </div>
        <button className="mt-4 md:mt-0 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold text-white transition-all backdrop-blur-sm shadow-sm"
          onClick={() => alert('Download feature coming soon!')}
        >
          Download Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Jobs Posted</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{stats.totalJobs}</span>
            <span className="ml-2 text-sm text-green-600 font-medium">Active: {stats.activeJobs}</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{stats.applications}</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Hired Candidates</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{stats.hires}</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{stats.conversionRate}%</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Trends</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <BarChart data={chartData} />
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">Applications received over the last 6 months</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Distribution</h3>
          <div className="space-y-4">
            {/* Simple visual representation of pipeline */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Applied</span>
                <span>{stats.applications}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Shortlisted</span>
                {/* Assuming rough estimate for demo if specific data not separated in stats object yet */}
                <span>{Math.floor(stats.applications * 0.4)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Interviewed</span>
                <span>{Math.floor(stats.applications * 0.2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Hired</span>
                <span>{stats.hires}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${stats.conversionRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
