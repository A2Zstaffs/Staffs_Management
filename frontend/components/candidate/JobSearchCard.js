'use client';

import {
    MapPin,
    Briefcase,
    Clock,
    Bookmark,
    BookmarkCheck,
    ArrowRight,
    Building2,
    IndianRupee
} from 'lucide-react';

export default function JobSearchCard({ job, onApply, onSave, isSaved = false }) {
    const formatSalary = (min, max) => {
        if (!min && !max) return 'Not disclosed';
        const format = (num) => {
            if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
            if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
            return num;
        };
        if (min && max) return `₹${format(min)} - ₹${format(max)}`;
        if (min) return `₹${format(min)}+`;
        return `Up to ₹${format(max)}`;
    };

    const getCompanyInitials = (name) => {
        if (!name) return 'CO';
        return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-shadow">
                        <span className="text-xl font-bold text-white">
                            {getCompanyInitials(job.company)}
                        </span>
                    </div>
                </div>

                {/* Job Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {job.job_title || job.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Building2 className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600 font-medium">
                                    {job.company || 'Company'}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => onSave && onSave(job)}
                            className={`p-2 rounded-lg transition-all ${isSaved
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                        >
                            {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-4">
                        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {job.locations?.[0] || job.location?.city || 'Remote'}
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            {job.experienceLevel || job.experience || '0-5'} years
                        </span>
                        <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-medium">
                            <IndianRupee className="w-4 h-4" />
                            {formatSalary(job.salary_min, job.salary_max)}
                        </span>
                        {job.createdAt && (
                            <span className="flex items-center gap-1.5 text-slate-400">
                                <Clock className="w-4 h-4" />
                                {new Date(job.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short'
                                })}
                            </span>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(job.skills || []).slice(0, 5).map((skill, i) => (
                            <span
                                key={i}
                                className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg"
                            >
                                {skill}
                            </span>
                        ))}
                        {(job.skills || []).length > 5 && (
                            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg">
                                +{(job.skills || []).length - 5} more
                            </span>
                        )}
                    </div>

                    {/* Description Preview */}
                    {job.description && (
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                            {job.description}
                        </p>
                    )}
                </div>

                {/* Apply Button */}
                <div className="flex-shrink-0 lg:self-center">
                    <button
                        onClick={() => onApply && onApply(job)}
                        className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all group/btn"
                    >
                        Apply Now
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
