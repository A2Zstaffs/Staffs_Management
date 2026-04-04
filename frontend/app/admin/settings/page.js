'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SettingsPage() {
  return (
    <div className="">
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

          {/* Create New Admin */}
          <div className="bg-white/50 backdrop-blur-md p-6 rounded-xl border border-white/60 shadow-sm">
            <h3 className="text-lg font-bold text-secondary-900 mb-4">Create New Admin</h3>
            <div className="space-y-4">
              <CreateAdminForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CreateAdminForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await import('@/lib/api').then(mod => mod.adminAPI.createAdmin(formData));
      if (response.success) {
        setMessage({ type: 'success', text: 'New admin created successfully!' });
        setFormData({ fullName: '', email: '', password: '' });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to create admin' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error creating admin' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message.text && (
        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">Full Name</label>
        <input
          type="text"
          required
          value={formData.fullName}
          onChange={e => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full p-2 rounded-lg border border-gray-200 bg-white"
          placeholder="Admin Name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 rounded-lg border border-gray-200 bg-white"
          placeholder="admin@company.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-1">Password</label>
        <input
          type="password"
          required
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-2 rounded-lg border border-gray-200 bg-white"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-secondary-900 text-white rounded-lg hover:bg-secondary-800 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Creating...' : 'Create Admin Account'}
      </button>
    </form>
  );
}
