'use client';

import {
    FileText,
    CheckCircle,
    Calendar,
    Award,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react';

export default function CandidateStats({ stats }) {
    const primaryStats = [
        {
            label: 'Applied Jobs',
            value: stats?.appliedJobs || 0,
            icon: FileText,
            gradient: 'from-blue-500 to-indigo-600',
            iconBg: 'bg-blue-400/30',
            trend: '+2 this week',
            trendUp: true
        },
        {
            label: 'Shortlisted',
            value: stats?.shortlisted || 0,
            icon: CheckCircle,
            gradient: 'from-emerald-500 to-teal-600',
            iconBg: 'bg-emerald-400/30',
            trend: 'Great progress!',
            trendUp: true
        },
        {
            label: 'Interviews',
            value: stats?.interviewsScheduled || 0,
            icon: Calendar,
            gradient: 'from-violet-500 to-purple-600',
            iconBg: 'bg-violet-400/30',
            trend: 'Scheduled',
            trendUp: true
        },
        {
            label: 'Offers',
            value: stats?.offers || 0,
            icon: Award,
            gradient: 'from-amber-500 to-orange-600',
            iconBg: 'bg-amber-400/30',
            trend: 'Keep going!',
            trendUp: true
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {primaryStats.map((item, index) => (
                <div
                    key={index}
                    className={`relative overflow-hidden bg-gradient-to-br ${item.gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group`}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/20" />
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${item.iconBg} backdrop-blur-sm`}>
                                <item.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-white/80 bg-white/10 px-2 py-1 rounded-full">
                                {item.trendUp && <ArrowUpRight className="w-3 h-3" />}
                                <span>{item.trend}</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-4xl font-bold tracking-tight group-hover:scale-105 transition-transform origin-left">
                                {item.value}
                            </h3>
                            <p className="text-white/80 text-sm font-medium">{item.label}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
