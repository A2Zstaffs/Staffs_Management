'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { Search, X, Building2, User, MapPin, Briefcase, Mail, Phone, Calendar, Users, ChevronDown, ChevronRight, Shield } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [expandedClient, setExpandedClient] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    kamFilter: 'All',
    industryFilter: 'All',
    activeJobsRange: 'All',
    dateRange: 'All time',
    sortBy: 'company',
    sortOrder: 'asc'
  });

  // Unique values for filters
  const [uniqueKams, setUniqueKams] = useState([]);
  const [uniqueIndustries, setUniqueIndustries] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getClients();
      if (response.success && response.data) {
        const formattedData = response.data.map(client => ({
          id: client._id,
          // Company Details
          companyName: client.company || 'Company Not Set',
          // Contact Person Details
          contactName: client.fullName || 'N/A',
          email: client.email || '',
          phone: client.phoneNumber || '',
          // Location
          location: client.location,
          locationDisplay: formatLocation(client.location),
          // Business Details
          industry: client.businessDetails?.industry || 'N/A',
          businessType: client.businessDetails?.type || 'N/A',
          businessSize: client.businessDetails?.size || 'N/A',
          // Status
          status: client.isActive ? 'active' : (client.isVerified === false ? 'pending' : 'suspended'),
          isVerified: client.isVerified,
          // Stats
          activeJobs: client.jobCount || 0,
          // Assigned KAM
          assignedKam: client.assignedKam || null,
          // Dates
          joinedDate: client.createdAt,
          lastUpdated: client.updatedAt
        }));
        setClients(formattedData);

        // Extract unique KAMs
        const kams = [...new Set(formattedData
          .map(c => c.assignedKam?.fullName)
          .filter(k => k)
        )].sort();
        setUniqueKams(kams);

        // Extract unique industries
        const industries = [...new Set(formattedData
          .map(c => c.industry)
          .filter(i => i && i !== 'N/A')
        )].sort();
        setUniqueIndustries(industries);
      }
    } catch (err) {
      console.error('Failed to load clients:', err);
      setError('Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  const formatLocation = (location) => {
    if (!location) return 'N/A';
    if (typeof location === 'string') return location;
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.country) parts.push(location.country);
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  };

  // Get filtered and sorted clients
  const filteredClients = useMemo(() => {
    let result = [...clients];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(client =>
        client.companyName?.toLowerCase().includes(searchLower) ||
        client.contactName?.toLowerCase().includes(searchLower) ||
        client.email?.toLowerCase().includes(searchLower) ||
        client.assignedKam?.fullName?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'All') {
      result = result.filter(client => client.status === filters.status.toLowerCase());
    }

    // KAM filter
    if (filters.kamFilter !== 'All') {
      if (filters.kamFilter === 'Unassigned') {
        result = result.filter(client => !client.assignedKam);
      } else {
        result = result.filter(client => client.assignedKam?.fullName === filters.kamFilter);
      }
    }

    // Industry filter
    if (filters.industryFilter !== 'All') {
      result = result.filter(client => client.industry === filters.industryFilter);
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
        case 'company':
          comparison = (a.companyName || '').localeCompare(b.companyName || '');
          break;
        case 'contact':
          comparison = (a.contactName || '').localeCompare(b.contactName || '');
          break;
        case 'kam':
          const kamA = a.assignedKam?.fullName || 'zzz';
          const kamB = b.assignedKam?.fullName || 'zzz';
          comparison = kamA.localeCompare(kamB);
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
      kamFilter: 'All',
      industryFilter: 'All',
      activeJobsRange: 'All',
      dateRange: 'All time',
      sortBy: 'company',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = filters.search || filters.status !== 'All' ||
    filters.kamFilter !== 'All' || filters.industryFilter !== 'All' ||
    filters.activeJobsRange !== 'All' || filters.dateRange !== 'All time';

  // Statistics
  const stats = useMemo(() => {
    const total = filteredClients.length;
    const activeCount = filteredClients.filter(c => c.status === 'active').length;
    const pendingCount = filteredClients.filter(c => c.status === 'pending').length;
    const suspendedCount = filteredClients.filter(c => c.status === 'suspended').length;
    const withKam = filteredClients.filter(c => c.assignedKam).length;
    const totalJobs = filteredClients.reduce((sum, c) => sum + (c.activeJobs || 0), 0);

    return { total, activeCount, pendingCount, suspendedCount, withKam, totalJobs };
  }, [filteredClients]);

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
            <h2 className="text-secondary-900 text-2xl font-bold">Clients Management</h2>
            <p className="text-secondary-600">View and manage all registered clients with company details and KAM assignments</p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-secondary-700 transition-colors border border-gray-200 shadow-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-blue-100">Total Clients</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.activeCount}</div>
                <div className="text-sm text-green-100">Active</div>
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
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.withKam}</div>
                <div className="text-sm text-purple-100">With KAM</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalJobs}</div>
                <div className="text-sm text-indigo-100">Total Jobs</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <X className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.suspendedCount}</div>
                <div className="text-sm text-red-100">Suspended</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 space-y-4">
          {/* Search Bar + View Toggle */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company name, contact name, email, or KAM..."
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

          {/* Status Pills */}
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
                {status === 'Active' && <span className="ml-2 text-xs opacity-75">({stats.activeCount})</span>}
                {status === 'Pending' && <span className="ml-2 text-xs opacity-75">({stats.pendingCount})</span>}
                {status === 'Suspended' && <span className="ml-2 text-xs opacity-75">({stats.suspendedCount})</span>}
              </button>
            ))}
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* KAM Filter */}
            <select
              value={filters.kamFilter}
              onChange={(e) => setFilters(prev => ({ ...prev, kamFilter: e.target.value }))}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All KAMs</option>
              <option value="Unassigned">Unassigned</option>
              {uniqueKams.map(kam => (
                <option key={kam} value={kam}>{kam}</option>
              ))}
            </select>

            {/* Industry Filter */}
            {uniqueIndustries.length > 0 && (
              <select
                value={filters.industryFilter}
                onChange={(e) => setFilters(prev => ({ ...prev, industryFilter: e.target.value }))}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-secondary-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Industries</option>
                {uniqueIndustries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            )}

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
              <option value="company-asc">Company (A-Z)</option>
              <option value="company-desc">Company (Z-A)</option>
              <option value="contact-asc">Contact (A-Z)</option>
              <option value="kam-asc">KAM (A-Z)</option>
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

        <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <LoadingSkeleton type="table" count={8} />
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : filteredClients.length === 0 ? (
            <div className="p-8 text-center text-secondary-500">
              {hasActiveFilters ? 'No clients match your filters' : 'No clients found'}
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        Company
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Contact Person
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Assigned KAM
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Location
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        Jobs
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-semibold text-secondary-900">{client.companyName}</div>
                          {client.industry !== 'N/A' && (
                            <div className="text-xs text-secondary-500">{client.industry}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-secondary-900">{client.contactName}</div>
                          <div className="text-xs text-secondary-500">{client.email}</div>
                          {client.phone && (
                            <div className="text-xs text-secondary-400">{client.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {client.assignedKam ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
                              <Users className="w-3.5 h-3.5 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium text-secondary-900 text-sm">{client.assignedKam.fullName}</div>
                              <div className="text-xs text-secondary-500">{client.assignedKam.email}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            Not Assigned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-secondary-700">{client.locationDisplay}</div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${client.activeJobs > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                          {client.activeJobs}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(client.status)}`}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-secondary-600">
                          {new Date(client.joinedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {client.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleVerify(client.id, 'approve')}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleVerify(client.id, 'reject')}
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {client.status === 'active' && (
                            <button
                              onClick={() => handleVerify(client.id, 'suspend')}
                              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 rounded-lg text-xs transition-colors"
                            >
                              Suspend
                            </button>
                          )}
                          {client.status === 'suspended' && (
                            <button
                              onClick={() => handleVerify(client.id, 'activate')}
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
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-secondary-900">{client.companyName}</h3>
                        {client.industry !== 'N/A' && (
                          <p className="text-xs text-secondary-500">{client.industry}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(client.status)}`}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </div>

                  {/* Contact Person */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-xs font-semibold text-gray-600 uppercase">Contact Person</span>
                    </div>
                    <div className="font-medium text-secondary-900">{client.contactName}</div>
                    <div className="text-xs text-secondary-500">{client.email}</div>
                    {client.phone && (
                      <div className="text-xs text-secondary-400">{client.phone}</div>
                    )}
                  </div>

                  {/* Assigned KAM */}
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-semibold text-purple-600 uppercase">Assigned KAM</span>
                    </div>
                    {client.assignedKam ? (
                      <>
                        <div className="font-medium text-secondary-900">{client.assignedKam.fullName}</div>
                        <div className="text-xs text-secondary-500">{client.assignedKam.email}</div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500 italic">Not assigned</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-secondary-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{client.locationDisplay}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span>{client.activeJobs} active job{client.activeJobs !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Joined {new Date(client.joinedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    {client.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleVerify(client.id, 'approve')}
                          className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerify(client.id, 'reject')}
                          className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {client.status === 'active' && (
                      <button
                        onClick={() => handleVerify(client.id, 'suspend')}
                        className="flex-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        Suspend
                      </button>
                    )}
                    {client.status === 'suspended' && (
                      <button
                        onClick={() => handleVerify(client.id, 'activate')}
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
