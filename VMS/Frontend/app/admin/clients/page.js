'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      // Try to fetch from API with fallback
      try {
        const response = await adminAPI.getClients();
        if (response.success && response.data) {
          setClients(response.data);
          return;
        }
      } catch (apiError) {
        console.warn('API fetch failed, using mock data:', apiError);
      }

      // Mock data fallback
      setClients([
        { id: 1, fullName: 'Tech Corp', email: 'contact@techcorp.com', location: 'New York', activeJobs: 3, status: 'active' },
        { id: 2, fullName: 'Innovate Inc', email: 'hr@innovate.com', location: 'San Francisco', activeJobs: 1, status: 'active' },
        { id: 3, fullName: 'StartUp Ltd', email: 'hello@startup.io', location: 'Austin', activeJobs: 0, status: 'pending' },
      ]);
    } catch (err) {
      setError('Failed to load clients');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (id, action) => {
    // Implement verification logic
    console.log(`${action} client:`, id);

    // Optimistic update
    setClients(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: action === 'approve' ? 'active' : 'suspended' };
      }
      return c;
    }));
  };

  return (
    <div className="min-h-screen bg-transparent">
      <main className="p-4 lg:p-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-secondary-900 text-2xl font-bold">Clients Management</h2>
            <p className="text-secondary-600">View and manage all registered clients</p>
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
            <div className="p-8 text-center text-secondary-600">Loading clients...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white/50">
                    <th className="p-4 text-secondary-600 font-semibold text-sm">Company Name</th>
                    <th className="p-4 text-secondary-600 font-semibold text-sm">Email</th>
                    <th className="p-4 text-secondary-600 font-semibold text-sm">Location</th>
                    <th className="p-4 text-secondary-600 font-semibold text-sm text-center">Active Jobs</th>
                    <th className="p-4 text-secondary-600 font-semibold text-sm">Status</th>
                    <th className="p-4 text-secondary-600 font-semibold text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-secondary-500">No clients found</td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client.id} className="hover:bg-white/60 transition-colors">
                        <td className="p-4 text-secondary-900 font-medium">{client.fullName}</td>
                        <td className="p-4 text-secondary-600">{client.email}</td>
                        <td className="p-4 text-secondary-600">{client.location}</td>
                        <td className="p-4 text-secondary-600 text-center font-mono">{client.activeJobs}</td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full border ${client.status === 'active'
                            ? 'bg-green-500/20 border-green-500/50 text-green-300'
                            : client.status === 'suspended'
                              ? 'bg-red-500/20 border-red-500/50 text-red-300'
                              : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                            }`}>
                            {client.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            {client.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleVerify(client.id, 'approve')}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs transition-colors shadow-sm"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleVerify(client.id, 'reject')}
                                  className="px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded text-xs transition-colors shadow-sm"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {client.status === 'active' && (
                              <button
                                onClick={() => handleVerify(client.id, 'reject')}
                                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 rounded text-xs transition-colors"
                              >
                                Suspend
                              </button>
                            )}
                            {client.status === 'suspended' && (
                              <button
                                onClick={() => handleVerify(client.id, 'approve')}
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
