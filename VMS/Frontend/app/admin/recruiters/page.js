'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function RecruitersPage() {
  const [recruiters, setRecruiters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      setIsLoading(true);
      // Try to fetch from API
      // If API fails (404/500), we'll fall back to mock data for demonstration
      try {
        const response = await adminAPI.getRecruiters();
        if (response.success && response.data) {
          setRecruiters(response.data);
          return;
        }
      } catch (apiError) {
        console.warn('API fetch failed, using mock data:', apiError);
      }

      // Mock data fallback (keep existing mock data)
      setRecruiters([
        { id: 1, fullName: 'John Doe', email: 'john@recruiter.com', status: 'active', joinedDate: '2024-01-15', placements: 12 },
        { id: 2, fullName: 'Sarah Smith', email: 'sarah@recruiter.com', status: 'pending', joinedDate: '2024-02-20', placements: 0 },
        { id: 3, fullName: 'Mike Johnson', email: 'mike@recruiter.com', status: 'active', joinedDate: '2024-03-10', placements: 5 },
      ]);
    } catch (err) {
      setError('Failed to load recruiters');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (id, action) => {
    // Implement verification logic
    console.log(`${action} recruiter:`, id);

    // Optimistic update
    setRecruiters(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, status: action === 'approve' ? 'active' : 'suspended' };
      }
      return r;
    }));
  };

  return (
    <div className="min-h-screen bg-transparent">
      <main className="p-4 lg:p-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-secondary-900 text-2xl font-bold mb-4">Recruiters Management</h2>
            <p className="text-secondary-600 mb-6">Manage all recruiters on the platform</p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-secondary-700 transition-colors border border-gray-200 shadow-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="rounded-xl bg-white/50 backdrop-blur-md border border-white/60 shadow-xl shadow-blue-900/5 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-secondary-600">Loading recruiters...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white/50">
                    <th className="p-4 text-secondary-600 font-semibold text-sm">Name</th>
                    <th className="p-4 text-secondary-600 font-semibold text-sm">Email</th>
                    <th className="p-4 text-secondary-600 font-semibold text-sm">Joined Date</th>
                    <th className="p-4 text-secondary-600 font-semibold text-sm text-center">Placements</th>
                    <th className="p-4 text-secondary-600 font-semibold text-sm">Status</th>
                    <th className="p-4 text-secondary-600 font-semibold text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recruiters.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-secondary-500">No recruiters found</td>
                    </tr>
                  ) : (
                    recruiters.map((recruiter) => (
                      <tr key={recruiter.id} className="hover:bg-white/60 transition-colors">
                        <td className="p-4 text-secondary-900 font-medium">{recruiter.fullName}</td>
                        <td className="p-4 text-secondary-600">{recruiter.email}</td>
                        <td className="p-4 text-secondary-600">{new Date(recruiter.joinedDate).toLocaleDateString()}</td>
                        <td className="p-4 text-secondary-600 text-center font-mono">{recruiter.placements}</td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full border ${recruiter.status === 'active'
                            ? 'bg-green-500/20 border-green-500/50 text-green-300'
                            : recruiter.status === 'suspended'
                              ? 'bg-red-500/20 border-red-500/50 text-red-300'
                              : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                            }`}>
                            {recruiter.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            {recruiter.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleVerify(recruiter.id, 'approve')}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs transition-colors shadow-sm"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleVerify(recruiter.id, 'reject')}
                                  className="px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded text-xs transition-colors shadow-sm"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {recruiter.status === 'active' && (
                              <button
                                onClick={() => handleVerify(recruiter.id, 'reject')}
                                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 rounded text-xs transition-colors"
                              >
                                Suspend
                              </button>
                            )}
                            {recruiter.status === 'suspended' && (
                              <button
                                onClick={() => handleVerify(recruiter.id, 'approve')}
                                className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-600 border border-green-200 rounded text-xs transition-colors"
                              >
                                Activate
                              </button>
                            )}
                            <button className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
