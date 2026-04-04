'use client';

import {
    Building2,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronRight,
    ExternalLink
} from 'lucide-react';

export default function ApplicationStatus({ applications = [], onViewDetails }) {
    const getStatusConfig = (status) => {
        const configs = {
            applied: {
                color: 'blue',
                icon: Clock,
                label: 'Applied',
                bg: 'bg-blue-50',
                text: 'text-blue-700',
                border: 'border-blue-200'
            },
            shortlisted: {
                color: 'purple',
                icon: CheckCircle2,
                label: 'Shortlisted',
                bg: 'bg-purple-50',
                text: 'text-purple-700',
                border: 'border-purple-200'
            },
            interview_scheduled: {
                color: 'amber',
                icon: Calendar,
                label: 'Interview',
                bg: 'bg-amber-50',
                text: 'text-amber-700',
                border: 'border-amber-200'
            },
            selected: {
                color: 'emerald',
                icon: CheckCircle2,
                label: 'Selected',
                bg: 'bg-emerald-50',
                text: 'text-emerald-700',
                border: 'border-emerald-200'
            },
            hired: {
                color: 'emerald',
                icon: CheckCircle2,
                label: 'Hired',
                bg: 'bg-emerald-50',
                text: 'text-emerald-700',
                border: 'border-emerald-200'
            },
            rejected: {
                color: 'red',
                icon: XCircle,
                label: 'Not Selected',
                bg: 'bg-red-50',
                text: 'text-red-600',
                border: 'border-red-200'
            },
            default: {
                color: 'slate',
                icon: AlertCircle,
                label: 'Under Review',
                bg: 'bg-slate-50',
                text: 'text-slate-600',
                border: 'border-slate-200'
            }
        };
        return configs[status?.toLowerCase()] || configs.default;
    };

    if (applications.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building2 className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No applications yet</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                    Start your job search journey! Browse available positions and apply to your dream job.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {applications.map((app) => {
                const statusConfig = getStatusConfig(app.status);
                const StatusIcon = statusConfig.icon;

                return (
                    <div
                        key={app._id}
                        className={`bg-white rounded-xl border-2 ${statusConfig.border} p-5 hover:shadow-lg transition-all group cursor-pointer`}
                        onClick={() => onViewDetails && onViewDetails(app)}
                    >
                        <div className="flex items-start gap-4">
                            {/* Company Icon */}
                            <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center flex-shrink-0`}>
                                <span className={`text-lg font-bold ${statusConfig.text}`}>
                                    {(app.job?.company || 'CO').substring(0, 2).toUpperCase()}
                                </span>
                            </div>

                            {/* Job Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {app.job?.title || app.job?.job_title || 'Job Position'}
                                        </h4>
                                        <p className="text-slate-600 text-sm font-medium">
                                            {app.job?.company || 'Company'}
                                        </p>
                                    </div>
                                    <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.text}`}>
                                        <StatusIcon className="w-3.5 h-3.5" />
                                        {statusConfig.label}
                                    </span>
                                </div>

                                {/* Timeline */}
                                <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        Applied {new Date(app.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    {app.updatedAt && app.updatedAt !== app.createdAt && (
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            Updated {new Date(app.updatedAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Arrow */}
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
