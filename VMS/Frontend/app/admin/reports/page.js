'use client';

import Link from 'next/link';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <main className="p-4 lg:p-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-secondary-900 text-2xl font-bold">Analytics & Reports</h2>
            <p className="text-secondary-600">Performance metrics and downloadable reports</p>
          </div>
          <Link href="/admin" className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-secondary-700 hover:bg-gray-50 transition-colors">
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for future charts */}
          <div className="p-6 bg-white/50 backdrop-blur-md rounded-xl border border-white/60 shadow-sm h-64 flex items-center justify-center text-secondary-400">
            Recruiter Performance Chart
          </div>
          <div className="p-6 bg-white/50 backdrop-blur-md rounded-xl border border-white/60 shadow-sm h-64 flex items-center justify-center text-secondary-400">
            Client Hiring Stats
          </div>
          <div className="p-6 bg-white/50 backdrop-blur-md rounded-xl border border-white/60 shadow-sm h-64 flex items-center justify-center text-secondary-400">
            Revenue Growth
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold text-secondary-900 mb-4">Export Data</h3>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
              Download Monthly Report (PDF)
            </button>
            <button className="px-4 py-2 bg-white text-secondary-700 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              Export CSV (All Data)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
