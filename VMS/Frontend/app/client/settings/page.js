'use client';

import { useState, useEffect } from 'react';

export default function ClientSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      // Using dashboard endpoint which now includes clientProfile
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/dashboard/client`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success && result.data.clientProfile) {
        setProfile(result.data.clientProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center text-red-500">Failed to load profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h1 className="text-xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-sm text-gray-500">Manage your account information</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {profile.company || 'Not set'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {profile.fullName}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {profile.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {profile.phoneNumber || 'Not set'}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {typeof profile.location === 'object' && profile.location !== null
                  ? `${profile.location.city || ''} ${profile.location.state || ''} ${profile.location.country || ''}`.trim() || 'Not set'
                  : profile.location || 'Not set'}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
              disabled
            >
              Edit Details (Contact Support)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


