'use client';

import { useState } from 'react';
import { MoreHorizontal, Eye, Edit, ChevronRight, Search } from 'lucide-react';

export default function JobPerformanceTable({ jobs = [], onEdit, onView, onViewAll }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter jobs based on search
    const filteredJobs = jobs.filter(job =>
        job.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-green-50 text-green-700 border-green-100';
            case 'closed': return 'bg-gray-100 text-gray-600 border-gray-200';
            case 'draft': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'hold': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    return (
        <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-secondary-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-secondary-900 text-lg">Job Performance</h3>
                    <p className="text-secondary-500 text-sm">Overview of your active roles</p>
                </div>
                <div className="relative">
                    <Search className="w-4 h-4 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        className="pl-9 pr-4 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary-50/50 border-b border-secondary-100 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Job Role</th>
                            <th className="px-6 py-4 text-center">Applications</th>
                            <th className="px-6 py-4 text-center">In Process</th>
                            <th className="px-6 py-4 text-center">Hired</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-100">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.slice(0, 5).map((job) => (
                                <tr key={job._id} className="hover:bg-secondary-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">
                                                {job.job_title?.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
                                                    {job.job_title}
                                                </div>
                                                <div className="text-xs text-secondary-500 flex items-center gap-2">
                                                    <span>{job.location}</span>
                                                    <span className="w-1 h-1 rounded-full bg-secondary-300"></span>
                                                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-secondary-100 text-secondary-700 text-xs font-medium">
                                            {job.applicationCount || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-medium text-amber-600">{job.inProcessCount || 0}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-medium text-emerald-600">{job.hiredCount || 0}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.role_status || job.status)} capitalize`}>
                                            {job.role_status || job.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onView && onView(job)}
                                                className="p-1.5 bg-primary-50 hover:bg-primary-100 rounded-lg text-primary-600 hover:text-primary-700 transition-colors border border-primary-100 shadow-sm"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onEdit && onEdit(job)}
                                                className="p-1.5 bg-amber-50 hover:bg-amber-100 rounded-lg text-amber-600 hover:text-amber-700 transition-colors border border-amber-100 shadow-sm"
                                                title="Edit Job"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-secondary-500">
                                    No active jobs found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-secondary-100 bg-secondary-50/50 flex justify-center">
                <button
                    onClick={() => onViewAll && onViewAll()}
                    className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1 transition-colors"
                >
                    View All Jobs <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
