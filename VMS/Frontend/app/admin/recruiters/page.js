'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Search, X } from 'lucide-react';

export default function RecruitersPage() {
  const [recruiters, setRecruiters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    placementsRange: 'All',
    dateRange: 'All time',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      setIsLoading(true);
      try {
        const response = await adminAPI.getRecruiters();
        if (response.success && response.data) {
          const formattedData = response.data.map(user => ({
            ...user,
            id: user._id,
            status: user.isActive ? 'active' : 'suspended',
            joinedDate: user.createdAt,
            placements: user.profileCount || 0
          }));
          setRecruiters(formattedData);
          return;
        }
      } catch (apiError) {
        console.warn('API fetch failed, using mock data:', apiError);
      }

      // Mock data fallback
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

  // Get filtered and sorted recruiters
  const filteredRecruiters = useMemo(() => {
    let result = [...recruiters];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(recruiter =>
        recruiter.fullName?.toLowerCase().includes(searchLower) ||
        recruiter.email?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'All') {
      result = result.filter(recruiter => recruiter.status === filters.status.toLowerCase());
    }

    // Placements range filter
    if (filters.placementsRange !== 'All') {
      result = result.filter(recruiter => {
        const placements = recruiter.placements || 0;
        switch (filters.placementsRange) {
          case 'None': return placements === 0;
          case 'Beginner': return placements >= 1 && placements <= 5;
          case 'Intermediate': return placements >= 6 && placements <= 15;
          case 'Expert': return placements >= 16;
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
        result = result.filter(recruiter => new Date(recruiter.joinedDate) >= cutoffDate);
      }
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'name':
          comparison = (a.fullName || '').localeCompare(b.fullName || '');
          break;
        case 'placements':
          comparison = (a.placements || 0) - (b.placements || 0);
          break;
        case 'date':
          comparison = new Date(a.joinedDate) - new Date(b.joinedDate);
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [recruiters, filters]);

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
        setRecruiters(prev => prev.map(r =>
          r.id === id ? { ...r, status: newStatus } : r
        ));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update recruiter status');
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      placementsRange: 'All',
      dateRange: 'All time',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = filters.search || filters.status !== 'All' ||
    filters.placementsRange !== 'All' || filters.dateRange !== 'All time';

  return (
    <div className="">
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

        {/* Filter Bar */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
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
            {/* Placements Range */}
            <select
              value={filters.placementsRange}
              onChange={(e) => setFilters(prev => ({ ...prev, placementsRange: e.target.value }))}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Placements</option>
              <option value="None">No Placements (0)</option>
              <option value="Beginner">Beginner (1-5)</option>
              <option value="Intermediate">Intermediate (6-15)</option>
              <option value="Expert">Expert (16+)</option>
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
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="placements-desc">Placements (High-Low)</option>
              <option value="placements-asc">Placements (Low-High)</option>
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
              Showing <span className="font-semibold text-secondary-900">{filteredRecruiters.length}</span> of {recruiters.length} recruiters
            </div>
          </div>
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
                  {filteredRecruiters.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-secondary-500">
                        {hasActiveFilters ? 'No recruiters match your filters' : 'No recruiters found'}
                      </td>
                    </tr>
                  ) : (
                    filteredRecruiters.map((recruiter) => (
                      <tr key={recruiter.id} className="hover:bg-white/60 transition-colors">
                        <td className="p-4 text-secondary-900 font-medium">{recruiter.fullName}</td>
                        <td className="p-4 text-secondary-600">{recruiter.email}</td>
                        <td className="p-4 text-secondary-600">{new Date(recruiter.joinedDate).toLocaleDateString()}</td>
                        <td className="p-4 text-secondary-600 text-center font-mono">{recruiter.placements}</td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full border ${recruiter.status === 'active'
                              ? 'bg-green-500/20 border-green-500/50 text-green-700'
                              : recruiter.status === 'suspended'
                                ? 'bg-red-500/20 border-red-500/50 text-red-700'
                                : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-800'
                            }`}>
                            {(recruiter.status || 'unknown').toUpperCase()}
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
                                onClick={() => handleVerify(recruiter.id, 'suspend')}
                                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 rounded text-xs transition-colors"
                              >
                                Suspend
                              </button>
                            )}
                            {recruiter.status === 'suspended' && (
                              <button
                                onClick={() => handleVerify(recruiter.id, 'activate')}
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
