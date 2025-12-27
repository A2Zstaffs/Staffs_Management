'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { Search, X, ChevronDown } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    activeJobsRange: 'All',
    dateRange: 'All time',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      try {
        const response = await adminAPI.getClients();
        if (response.success && response.data) {
          const formattedData = response.data.map(client => ({
            ...client,
            id: client._id,
            status: client.isActive ? 'active' : 'suspended',
            activeJobs: client.jobCount || 0,
            joinedDate: client.createdAt
          }));
          setClients(formattedData);
          return;
        }
      } catch (apiError) {
        console.warn('API fetch failed, using mock data:', apiError);
      }

      // Mock data fallback
      setClients([
        { id: 1, fullName: 'Tech Corp', email: 'contact@techcorp.com', location: 'New York', activeJobs: 3, status: 'active', joinedDate: '2024-01-15' },
        { id: 2, fullName: 'Innovate Inc', email: 'hr@innovate.com', location: 'San Francisco', activeJobs: 1, status: 'active', joinedDate: '2024-02-20' },
        { id: 3, fullName: 'StartUp Ltd', email: 'hello@startup.io', location: 'Austin', activeJobs: 0, status: 'pending', joinedDate: '2024-03-10' },
      ]);
    } catch (err) {
      setError('Failed to load clients');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get filtered and sorted clients
  const filteredClients = useMemo(() => {
    let result = [...clients];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(client =>
        client.fullName?.toLowerCase().includes(searchLower) ||
        client.email?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'All') {
      result = result.filter(client => client.status === filters.status.toLowerCase());
    }

    // Active jobs range filter
    if (filters.activeJobsRange !== 'All') {
      result = result.filter(client => {
        const jobs = client.activeJobs || 0;
        switch (filters.activeJobsRange) {
          case 'None': return jobs === 0;
          case 'Low': return jobs >= 1 && jobs <= 2;
          case 'Medium': return jobs >= 3 && jobs <= 5;
          case 'High': return jobs >= 6;
          default: return true;
        }
      });
    }

    // Date range filter
    if (filters.dateRange !== 'All time') {
      const now = new Date();
      const days = {
        'Last 7 days': 7,
        'Last 30 days': 30,
        'Last 90 days': 90
      }[filters.dateRange];

      if (days) {
        const cutoffDate = new Date(now.setDate(now.getDate() - days));
        result = result.filter(client => new Date(client.joinedDate) >= cutoffDate);
      }
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'name':
          comparison = (a.fullName || '').localeCompare(b.fullName || '');
          break;
        case 'location':
          const locA = typeof a.location === 'object'
            ? `${a.location?.city || ''} ${a.location?.country || ''}`.trim()
            : (a.location || '');
          const locB = typeof b.location === 'object'
            ? `${b.location?.city || ''} ${b.location?.country || ''}`.trim()
            : (b.location || '');
          comparison = locA.localeCompare(locB);
          break;
        case 'jobs':
          comparison = (a.activeJobs || 0) - (b.activeJobs || 0);
          break;
        case 'date':
          comparison = new Date(a.joinedDate) - new Date(b.joinedDate);
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [clients, filters]);

  const handleVerify = async (id, action) => {
    try {
      let newStatus;
      if (action === 'approve' || action === 'activate') {
        newStatus = 'active';
      } else if (action === 'suspend' || action === 'reject') {
        newStatus = 'suspended';
      }

      if (!newStatus) return;

      const response = await adminAPI.updateUserStatus(id, newStatus);

      if (response.success) {
        setClients(prev => prev.map(c =>
          c.id === id ? { ...c, status: newStatus } : c
        ));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update client status');
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      activeJobsRange: 'All',
      dateRange: 'All time',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = filters.search || filters.status !== 'All' ||
    filters.activeJobsRange !== 'All' || filters.dateRange !== 'All time';

  return (
    <div className="">
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

        {/* Filter Bar */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company name or email..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-11 pr-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-secondary-900 placeholder-gray-400"
            />
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Active', 'Suspended', 'Pending'].map(status => (
              <button
                key={status}
                onClick={() => setFilters(prev => ({ ...prev, status }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.status === status
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-secondary-600 hover:bg-blue-50 border border-gray-200'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Active Jobs Range */}
            <select
              value={filters.activeJobsRange}
              onChange={(e) => setFilters(prev => ({ ...prev, activeJobsRange: e.target.value }))}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Active Jobs</option>
              <option value="None">None (0)</option>
              <option value="Low">Low (1-2)</option>
              <option value="Medium">Medium (3-5)</option>
              <option value="High">High (6+)</option>
            </select>

            {/* Date Range */}
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All time">All Time</option>
              <option value="Last 7 days">Last 7 Days</option>
              <option value="Last 30 days">Last 30 Days</option>
              <option value="Last 90 days">Last 90 Days</option>
            </select>

            {/* Sort By */}
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sortBy, sortOrder }));
              }}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name-asc">Company (A-Z)</option>
              <option value="name-desc">Company (Z-A)</option>
              <option value="location-asc">Location (A-Z)</option>
              <option value="location-desc">Location (Z-A)</option>
              <option value="jobs-desc">Active Jobs (High-Low)</option>
              <option value="jobs-asc">Active Jobs (Low-High)</option>
              <option value="date-desc">Joined (Newest)</option>
              <option value="date-asc">Joined (Oldest)</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-secondary-700 text-sm transition-colors"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}

            {/* Results Count */}
            <div className="ml-auto text-sm text-secondary-600">
              Showing <span className="font-semibold text-secondary-900">{filteredClients.length}</span> of {clients.length} clients
            </div>
          </div>
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
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-secondary-500">
                        {hasActiveFilters ? 'No clients match your filters' : 'No clients found'}
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-white/60 transition-colors">
                        <td className="p-4 text-secondary-900 font-medium">{client.fullName}</td>
                        <td className="p-4 text-secondary-600">{client.email}</td>
                        <td className="p-4 text-secondary-600">
                          {(() => {
                            if (!client.location) return 'N/A';
                            if (typeof client.location === 'object') {
                              const parts = [];
                              if (client.location.city) parts.push(client.location.city);
                              if (client.location.country) parts.push(client.location.country);
                              if (parts.length > 0) return parts.join(', ');
                              if (client.location.address) return client.location.address;
                              return 'Details N/A';
                            }
                            return client.location || 'N/A';
                          })()}
                        </td>
                        <td className="p-4 text-secondary-600 text-center font-mono">{client.activeJobs}</td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full border ${client.status === 'active'
                            ? 'bg-green-500/20 border-green-500/50 text-green-700'
                            : client.status === 'suspended'
                              ? 'bg-red-500/20 border-red-500/50 text-red-700'
                              : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-800'
                            }`}>
                            {(client.status || 'unknown').toUpperCase()}
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
                                onClick={() => handleVerify(client.id, 'suspend')}
                                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 rounded text-xs transition-colors"
                              >
                                Suspend
                              </button>
                            )}
                            {client.status === 'suspended' && (
                              <button
                                onClick={() => handleVerify(client.id, 'activate')}
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
