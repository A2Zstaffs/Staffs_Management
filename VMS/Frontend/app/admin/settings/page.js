'use client';

import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <main className="p-4 lg:p-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-secondary-900 text-2xl font-bold">Platform Settings</h2>
            <p className="text-secondary-600">Configure global platform parameters</p>
          </div>
          <Link href="/admin" className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-secondary-700 hover:bg-gray-50 transition-colors">
            ← Back
          </Link>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* General Settings */}
          <div className="bg-white/50 backdrop-blur-md p-6 rounded-xl border border-white/60 shadow-sm">
            <h3 className="text-lg font-bold text-secondary-900 mb-4">Commission Structure</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Recruiter Share (%)</label>
                <input type="number" defaultValue={80} className="w-full p-2 rounded-lg border border-gray-200 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Platform Share (%)</label>
                <input type="number" defaultValue={20} className="w-full p-2 rounded-lg border border-gray-200 bg-white" disabled />
              </div>
            </div>
          </div>

          {/* Probation Settings */}
          <div className="bg-white/50 backdrop-blur-md p-6 rounded-xl border border-white/60 shadow-sm">
            <h3 className="text-lg font-bold text-secondary-900 mb-4">Probation Period</h3>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Duration (Days)</label>
              <select className="w-full p-2 rounded-lg border border-gray-200 bg-white">
                <option>60 Days</option>
                <option>90 Days</option>
              </select>
              <p className="text-xs text-secondary-500 mt-2">Payouts are released only after this period.</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium">
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
