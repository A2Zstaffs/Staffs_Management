'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { Search, X, User, Users, Briefcase, Calendar, Building2, MapPin, ChevronDown, Award } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function RecruitersPage() {
  const [recruiters, setRecruiters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    rmFilter: 'All',
    placementsRange: 'All',
    dateRange: 'All time',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Unique values for filters
  const [uniqueRMs, setUniqueRMs] = useState([]);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getRecruiters();
      if (response.success && response.data) {
        const formattedData = response.data.map(recruiter => ({
          id: recruiter._id,
          fullName: recruiter.fullName,
          email: recruiter.email,
          phone: recruiter.phoneNumber || 'N/A',
          company: recruiter.company || 'Independent',
          location: formatLocation(recruiter.location),
          // Stats
          placements: recruiter.profileCount || 0, // Using profileCount as proxy for placements/submissions for now
          // Assigned Recruiter Manager
          assignedRM: recruiter.assignedRM || null,
          // Status
          status: recruiter.isActive ? 'active' : (recruiter.isVerified === false ? 'pending' : 'suspended'),
          joinedDate: recruiter.createdAt
        }));
        setRecruiters(formattedData);

        // Extract unique Recruiter Managers
        const rms = [...new Set(formattedData
          .map(r => r.assignedRM?.fullName)
          .filter(rm => rm)
        )].sort();
        setUniqueRMs(rms);
      }
    } catch (err) {
      console.error('Failed to load recruiters:', err);
      setError('Failed to load recruiters');
    } finally {
      setIsLoading(false);
    }
  };

  const formatLocation = (location) => {
    if (!location) return 'N/A';
    if (typeof location === 'string') return location;
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.country) parts.push(location.country);
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  };

  // Get filtered and sorted recruiters
  const filteredRecruiters = useMemo(() => {
    let result = [...recruiters];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(recruiter =>
        recruiter.fullName?.toLowerCase().includes(searchLower) ||
        recruiter.email?.toLowerCase().includes(searchLower) ||
        recruiter.company?.toLowerCase().includes(searchLower) ||
        recruiter.assignedRM?.fullName?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'All') {
      result = result.filter(recruiter => recruiter.status === filters.status.toLowerCase());
    }

    // RM filter
    if (filters.rmFilter !== 'All') {
      if (filters.rmFilter === 'Unassigned') {
        result = result.filter(recruiter => !recruiter.assignedRM);
      } else {
        result = result.filter(recruiter => recruiter.assignedRM?.fullName === filters.rmFilter);
      }
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
        case 'company':
          comparison = (a.company || '').localeCompare(b.company || '');
          break;
        case 'rm':
          const rmA = a.assignedRM?.fullName || 'zzz';
          const rmB = b.assignedRM?.fullName || 'zzz';
          comparison = rmA.localeCompare(rmB);
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
      rmFilter: 'All',
      placementsRange: 'All',
      dateRange: 'All time',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = filters.search || filters.status !== 'All' ||
    filters.rmFilter !== 'All' || filters.placementsRange !== 'All' ||
    filters.dateRange !== 'All time';

  // Statistics
  const stats = useMemo(() => {
    const total = filteredRecruiters.length;
    const activeCount = filteredRecruiters.filter(r => r.status === 'active').length;
    const pendingCount = filteredRecruiters.filter(r => r.status === 'pending').length;
    const withRM = filteredRecruiters.filter(r => r.assignedRM).length;
    const totalSubmissions = filteredRecruiters.reduce((sum, r) => sum + (r.placements || 0), 0);

    return { total, activeCount, pendingCount, withRM, totalSubmissions };
  }, [filteredRecruiters]);

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-700 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'suspended': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="">
      <main className="p-4 lg:p-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-secondary-900 text-2xl font-bold">Recruiters Management</h2>
            <p className="text-secondary-600">Monitor and manage recruitment partners and their managers</p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-secondary-700 transition-colors border border-gray-200 shadow-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-blue-100">Total Recruiters</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.activeCount}</div>
                <div className="text-sm text-green-100">Active</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.withRM}</div>
                <div className="text-sm text-indigo-100">With Manager</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                <div className="text-sm text-purple-100">Submissions</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.pendingCount}</div>
                <div className="text-sm text-yellow-100">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, company, or manager..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-secondary-900 placeholder-gray-400"
              />
            </div>
            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-secondary-600 hover:bg-gray-50'}`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-secondary-600 hover:bg-gray-50'}`}
              >
                Card View
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['All', 'Active', 'Pending', 'Suspended'].map(status => (
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

          <div className="flex flex-wrap gap-3 items-center">
            {/* RM Filter */}
            <select
              value={filters.rmFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, rmFilter: e.target.value }))}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Managers</option>
              <option value="Unassigned">Unassigned</option>
              {uniqueRMs.map(rm => (
                <option key={rm} value={rm}>{rm}</option>
              ))}
            </select>

            {/* Placements Range */}
            <select
              value={filters.placementsRange}
              onChange={(e) => setFilters(prev => ({ ...prev, placementsRange: e.target.value }))}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Submissions</option>
              <option value="None">None (0)</option>
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
              <option value="placements-desc">Submissions (High-Low)</option>
              <option value="rm-asc">Manager (A-Z)</option>
              <option value="date-desc">Joined (Newest)</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-secondary-700 text-sm transition-colors"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}

            <div className="ml-auto text-sm text-secondary-600">
              Showing <span className="font-semibold text-secondary-900">{filteredRecruiters.length}</span> of {recruiters.length} recruiters
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <LoadingSkeleton type="table" count={8} />
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : filteredRecruiters.length === 0 ? (
            <div className="p-8 text-center text-secondary-500">
              {hasActiveFilters ? 'No recruiters match your filters' : 'No recruiters found'}
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Recruiter Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Assigned Manager (RM)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Submissions
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRecruiters.map((recruiter) => (
                    <tr key={recruiter.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {recruiter.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-secondary-900">{recruiter.fullName}</div>
                            <div className="text-xs text-secondary-500">{recruiter.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-secondary-900">{recruiter.company}</div>
                        <div className="text-xs text-secondary-500">{recruiter.location}</div>
                      </td>
                      <td className="px-4 py-4">
                        {recruiter.assignedRM ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User className="w-3 h-3 text-indigo-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-secondary-900">{recruiter.assignedRM.fullName}</div>
                              <div className="text-xs text-secondary-500">{recruiter.assignedRM.email}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${recruiter.placements > 0 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                          {recruiter.placements}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(recruiter.status)}`}>
                          {recruiter.status.charAt(0).toUpperCase() + recruiter.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-secondary-600">
                          {new Date(recruiter.joinedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {recruiter.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleVerify(recruiter.id, 'approve')}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleVerify(recruiter.id, 'reject')}
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {recruiter.status === 'active' && (
                            <button
                              onClick={() => handleVerify(recruiter.id, 'suspend')}
                              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 rounded-lg text-xs transition-colors"
                            >
                              Suspend
                            </button>
                          )}
                          {recruiter.status === 'suspended' && (
                            <button
                              onClick={() => handleVerify(recruiter.id, 'activate')}
                              className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-600 border border-green-200 rounded-lg text-xs transition-colors"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Card View */
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecruiters.map((recruiter) => (
                <div
                  key={recruiter.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {recruiter.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-secondary-900">{recruiter.fullName}</h3>
                        <p className="text-xs text-secondary-500">{recruiter.company}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(recruiter.status)}`}>
                      {recruiter.status.charAt(0).toUpperCase() + recruiter.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-secondary-600">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span>{recruiter.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-secondary-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{recruiter.location}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase">Assigned RM</span>
                      {recruiter.assignedRM ? (
                        <div className="flex items-center gap-1 text-indigo-600">
                          <User className="w-3 h-3" />
                          <span className="text-xs font-medium">{recruiter.assignedRM.fullName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Unassigned</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase">Total Submissions</span>
                      <span className="text-sm font-bold text-secondary-900">{recruiter.placements}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    {recruiter.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleVerify(recruiter.id, 'approve')}
                          className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerify(recruiter.id, 'reject')}
                          className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {recruiter.status === 'active' && (
                      <button
                        onClick={() => handleVerify(recruiter.id, 'suspend')}
                        className="flex-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        Suspend
                      </button>
                    )}
                    {recruiter.status === 'suspended' && (
                      <button
                        onClick={() => handleVerify(recruiter.id, 'activate')}
                        className="flex-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-600 border border-green-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
