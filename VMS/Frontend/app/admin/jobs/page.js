'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import {
    Search, X, Briefcase, MapPin, DollarSign, Clock,
    Users, TrendingUp, CheckCircle, AlertCircle,
    Building2, Calendar, Filter, MoreHorizontal,
    ArrowUpRight, ShieldCheck, IndianRupee
} from 'lucide-react';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('cards'); // 'cards' or 'list'

    // Filter state
    const [filters, setFilters] = useState({
        search: '',
        status: 'All',
        priority: 'All',
        approval: 'All',
        client: 'All',
        sortBy: 'urgency', // custom sort logic
    });

    const [uniqueClients, setUniqueClients] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setIsLoading(true);
            const response = await adminAPI.getJobs();
            if (response.success && response.data) {
                const formattedJobs = response.data.map(job => ({
                    id: job._id,
                    // Core Info
                    title: job.job_title || job.job_role || 'Untitled Job',
                    company: job.company_name || 'Unknown Company',
                    logo: job.company_logo || '',
                    locations: job.locations || [],
                    clientName: job.postedBy?.fullName || 'Unknown Client',
                    clientCompany: job.postedBy?.company || 'N/A',

                    // Stats
                    salaryMin: job.salary_min || 0,
                    salaryMax: job.salary_max || 0,
                    experienceMin: job.experience_min || 0,
                    experienceMax: job.experience_max || 0,
                    positions: job.num_positions || 1,
                    applicants: job.applicationsCount || 0,
                    inProcess: job.in_process_applications || 0,

                    // Money
                    commission: job.commission_percent || 0,
                    maxCommission: job.commission_amount_max || 0,

                    // Status & Priority
                    status: job.role_status || 'Pending',
                    priority: job.sourcing_status || 'Normal',

                    // Approval
                    approvalStatus: job.approval_status || 'Pending',
                    approvedBy: job.approved_by_kam?.fullName || null,

                    // Meta
                    postedDate: job.posted_date || job.createdAt,
                    skills: job.skills || []
                }));

                setJobs(formattedJobs);

                const clients = [...new Set(formattedJobs.map(j => j.clientCompany))].filter(Boolean).sort();
                setUniqueClients(clients);
            }
        } catch (err) {
            console.error('Failed to load jobs:', err);
            setError('Failed to load jobs');
        } finally {
            setIsLoading(false);
        }
    };

    const stats = useMemo(() => {
        return {
            total: jobs.length,
            active: jobs.filter(j => j.status === 'Active').length,
            positions: jobs.reduce((sum, j) => sum + (j.positions || 0), 0),
            value: jobs.filter(j => j.status === 'Active').reduce((sum, j) => sum + (j.maxCommission * j.positions), 0)
        };
    }, [jobs]);

    const filteredJobs = useMemo(() => {
        let result = [...jobs];

        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(j =>
                j.title.toLowerCase().includes(q) ||
                j.company.toLowerCase().includes(q) ||
                j.clientName.toLowerCase().includes(q)
            );
        }

        if (filters.status !== 'All') result = result.filter(j => j.status === filters.status);
        if (filters.priority !== 'All') result = result.filter(j => j.priority === filters.priority);
        if (filters.approval !== 'All') result = result.filter(j => j.approvalStatus === filters.approval);
        if (filters.client !== 'All') result = result.filter(j => j.clientCompany === filters.client);

        // Sort Logic
        result.sort((a, b) => {
            if (filters.sortBy === 'urgency') {
                // Priority first, then high commission, then date
                if (a.priority === 'Priority' && b.priority !== 'Priority') return -1;
                if (a.priority !== 'Priority' && b.priority === 'Priority') return 1;
                return b.maxCommission - a.maxCommission;
            }
            if (filters.sortBy === 'date') return new Date(b.postedDate) - new Date(a.postedDate);
            if (filters.sortBy === 'applicants') return b.applicants - a.applicants;
            return 0;
        });

        return result;
    }, [jobs, filters]);

    const formatMoney = (amount) => {
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
        return `₹${amount}`;
    };

    const getPriorityColor = (p) => {
        if (p === 'Priority') return 'bg-orange-100 text-orange-700 border-orange-200';
        if (p === 'Low') return 'bg-gray-100 text-gray-600 border-gray-200';
        return 'bg-blue-50 text-blue-600 border-blue-100';
    };

    const handleJobAction = async (id, action) => {
        try {
            let payload = {};
            if (action === 'approve') {
                payload = { approval_status: 'Approved' };
            } else if (action === 'pause') {
                payload = { status: 'Paused' };
            } else if (action === 'close') {
                payload = { status: 'Closed' };
            } else if (action === 'activate') {
                payload = { status: 'Active' };
            }

            const response = await adminAPI.updateJobStatus(id, payload);

            if (response.success) {
                setJobs(prev => prev.map(j => {
                    if (j.id !== id) return j;
                    // Optimistic update
                    let update = {};
                    if (action === 'approve') {
                        update = {
                            approvalStatus: 'Approved',
                            approvedBy: 'You',
                            status: 'Active'
                        }
                    } else if (action === 'pause') update = { status: 'Paused' };
                    else if (action === 'close') update = { status: 'Closed' };
                    else if (action === 'activate') update = { status: 'Active' };

                    return { ...j, ...update };
                }));
            }
        } catch (err) {
            console.error('Job action failed:', err);
            alert('Failed to update job status');
        }
    };

    return (
        <div className="">
            <main className="p-4 lg:p-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary-900">Job Board Monitor</h1>
                        <p className="text-secondary-500 mt-1">Live tracking of all active requisitions and sourcing health</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-secondary-600 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                            <span>Back</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Ticker */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-secondary-900">{stats.active}</div>
                            <div className="text-sm text-secondary-500">Active Jobs</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-secondary-900">{stats.positions}</div>
                            <div className="text-sm text-secondary-500">Open Vacancies</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <IndianRupee className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-secondary-900">{formatMoney(stats.value)}</div>
                            <div className="text-sm text-secondary-500">Total Pipeline Value</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-secondary-900">{stats.total}</div>
                            <div className="text-sm text-secondary-500">Total Posted</div>
                        </div>
                    </div>
                </div>

                {/* Control Bar */}
                <div className="sticky top-4 z-10 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-4 mb-8 shadow-lg shadow-blue-900/5">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">

                        {/* Search & Main Filter */}
                        <div className="flex flex-1 gap-2">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search jobs, companies, or clients..."
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={filters.search}
                                    onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                />
                            </div>

                            <select
                                value={filters.client}
                                onChange={e => setFilters(prev => ({ ...prev, client: e.target.value }))}
                                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none"
                            >
                                <option value="All">All Clients</option>
                                {uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* View Toggles & Key Filters */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                            {['All', 'Active', 'Pending', 'Closed'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilters(prev => ({ ...prev, status }))}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${filters.status === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                            <div className="w-px h-6 bg-gray-200 mx-2"></div>
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, priority: filters.priority === 'All' ? 'Priority' : 'All' }))}
                                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors border ${filters.priority === 'Priority'
                                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <AlertCircle className="w-3 h-3" />
                                High Priority
                            </button>
                        </div>
                    </div>
                </div>

                {/* Job Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full py-20 text-center text-secondary-500">Loading live inventory...</div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-secondary-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            No jobs found matching your criteria
                        </div>
                    ) : (
                        filteredJobs.map(job => (
                            <div key={job.id} className="group relative bg-white rounded-xl border border-gray-200 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col">

                                {/* Priority Stripe */}
                                {job.priority === 'Priority' && (
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-t-xl" />
                                )}

                                <div className="p-5 flex-1">

                                    {/* Top Row: Company & Status */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl font-bold text-gray-400">
                                                {job.logo ? <img src={job.logo} alt="" className="w-full h-full object-cover rounded-lg" /> : job.company.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-secondary-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                                <div className="flex items-center gap-1.5 text-xs text-secondary-500">
                                                    <Building2 className="w-3 h-3" />
                                                    {job.company}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${getPriorityColor(job.priority)}`}>
                                                {job.priority}
                                            </span>
                                            <span className="text-[10px] text-gray-400">{new Date(job.postedDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Vitals Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-xs font-medium text-secondary-700 truncate">
                                                {job.locations.join(', ') || 'Remote'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-xs font-medium text-secondary-700">
                                                {formatMoney(job.salaryMin)} - {formatMoney(job.salaryMax)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-xs font-medium text-secondary-700">
                                                {job.experienceMin}-{job.experienceMax} Yrs
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-xs font-medium text-secondary-700">
                                                {job.positions} Vacancies
                                            </span>
                                        </div>
                                    </div>

                                    {/* Approvals & Client */}
                                    <div className="flex items-center justify-between text-xs mb-4">
                                        <div className="flex items-center gap-1.5 text-secondary-600" title={`Client: ${job.clientCompany}`}>
                                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                                            <span className="font-medium">{job.clientName}</span>
                                        </div>

                                        {job.approvalStatus === 'Approved' ? (
                                            <div className="flex items-center gap-1 text-green-600">
                                                <CheckCircle className="w-3 h-3" />
                                                <span>Approved by {job.approvedBy?.split(' ')[0]}</span>
                                            </div>
                                        ) : (
                                            <span className="text-orange-600 font-medium">Pending Approval</span>
                                        )}
                                    </div>

                                    {/* Commission Highlight */}
                                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-2 rounded-lg flex justify-between items-center mb-1">
                                        <span className="text-xs font-medium text-emerald-800">Potential Commission</span>
                                        <span className="text-sm font-bold text-emerald-700">{formatMoney(job.maxCommission)}</span>
                                    </div>

                                </div>

                                {/* Footer Actions */}
                                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-secondary-500">Applicants:</span>
                                        <div className="flex items-center">
                                            <span className="text-sm font-bold text-blue-600">{job.applicants}</span>
                                            <div className="w-16 h-1.5 bg-gray-200 rounded-full ml-2 overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((job.applicants / (job.positions * 5)) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Approval Button */}
                                        {job.approvalStatus !== 'Approved' && (
                                            <button
                                                onClick={() => handleJobAction(job.id, 'approve')}
                                                className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors"
                                            >
                                                Approve
                                            </button>
                                        )}

                                        {/* Status Actions */}
                                        {job.status === 'Active' && job.approvalStatus === 'Approved' && (
                                            <button
                                                onClick={() => handleJobAction(job.id, 'pause')}
                                                className="px-2.5 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border border-yellow-200 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                Pause
                                            </button>
                                        )}


                                        {(job.status === 'Active' || job.status === 'Paused') && (
                                            <button
                                                onClick={() => handleJobAction(job.id, 'close')}
                                                className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                Stop
                                            </button>
                                        )}

                                        {(job.status === 'Paused' || job.status === 'Closed') && (
                                            <button
                                                onClick={() => handleJobAction(job.id, 'activate')}
                                                className="px-2.5 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-200 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                Activate
                                            </button>
                                        )}
                                    </div>
                                </div>

                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
