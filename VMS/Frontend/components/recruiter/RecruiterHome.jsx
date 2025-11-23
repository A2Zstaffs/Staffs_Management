'use client';

import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function RecruiterHome() {
  const { user } = useAuth();
  const firstName = useMemo(
    () => user?.fullName?.split(' ')[0] || 'Recruiter',
    [user?.fullName]
  );

  const stats = [
    { label: 'Total Applications', value: 0, color: 'bg-blue-50 text-blue-700', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586' },
    { label: 'Shortlisted', value: 0, color: 'bg-yellow-50 text-yellow-700', icon: 'M9 12l2 2 4-4' },
    { label: 'Interviews', value: 0, color: 'bg-purple-50 text-purple-700', icon: 'M8 7V3m8 4V3m-9 8h10' },
    { label: 'Hires', value: 0, color: 'bg-emerald-50 text-emerald-700', icon: 'M9 12l2 2 4-4m6 2' },
    { label: 'Leads', value: 0, color: 'bg-pink-50 text-pink-700', icon: 'M3 5h18M9 3v4m6-4v4' },
  ];

  const actions = [
    { label: 'Book Onboarding Call', color: 'from-blue-500 to-blue-600' },
    { label: 'View Jobs', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Add Candidate', color: 'from-purple-500 to-purple-600' },
  ];

  const recommendations = [
    { title: 'Upload shortlisted candidates to increase pipeline speed', tag: 'Best Practice' },
    { title: 'Review new jobs posted today', tag: 'New' },
    { title: 'Complete your company profile to build trust', tag: 'Profile' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
      {/* Welcome */}
      <section className="mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hi {firstName}, Welcome!</h1>
          <p className="text-gray-600 mt-2">Here&apos;s a quick snapshot and recommended next actions.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
              </svg>
            </div>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actions.map((a, i) => (
            <button
              key={i}
              className={`w-full bg-gradient-to-r ${a.color} text-white font-semibold py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recommendations</h2>
            <span className="text-sm text-gray-500">Based on your activity</span>
          </div>
          <div className="space-y-4">
            {recommendations.map((r, idx) => (
              <div key={idx} className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{r.title}</p>
                    <span className="text-xs text-gray-500">{r.tag}</span>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}






