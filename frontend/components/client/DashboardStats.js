'use client';

import {
    Briefcase,
    Users,
    FileBarChart,
    Trophy,
    Clock,
    MessageSquare,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Minus
} from 'lucide-react';

export default function DashboardStats({ stats }) {
    // Helper to calculate trends (mock logic if real trend data isn't available yet)
    const getTrend = (value, baseline) => {
        if (!baseline) return { value: '+0%', up: true };
        const diff = ((value - baseline) / baseline) * 100;
        return {
            value: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`,
            up: diff >= 0
        };
    };

    const primaryStats = [
        {
            label: 'Active Jobs',
            value: stats.activeJobs || 0,
            icon: Briefcase,
            color: 'blue',
            trend: '+5.2%', // These would be calculated from historical data in a real scenario
            trendUp: true,
            desc: 'Currently posted'
        },
        {
            label: 'Total Applications',
            value: stats.applicationsReceived || 0,
            icon: Users,
            color: 'purple',
            trend: '+12.5%',
            trendUp: true,
            desc: 'All time'
        },
        {
            label: 'In Process',
            value: stats.inProcessApplications || 0,
            icon: FileBarChart,
            color: 'amber',
            trend: '-2.1%',
            trendUp: false,
            desc: 'Interview stage'
        },
        {
            label: 'Successful Hires',
            value: stats.totalHires || 0,
            icon: Trophy,
            color: 'emerald',
            trend: '+8.4%',
            trendUp: true,
            desc: 'Candidates placed'
        },
    ];

    const secondaryStats = [
        {
            label: 'Avg Time to Hire',
            value: '18 Days', // Placeholder until backend calculation is added
            icon: Clock,
            color: 'indigo',
            desc: 'Faster than avg'
        },
        {
            label: 'Response Rate',
            value: '92%',
            icon: MessageSquare,
            color: 'pink',
            desc: 'To candidates'
        },
        {
            label: 'Commission Paid',
            value: `₹${(stats.commissionPaid || 0).toLocaleString()}`,
            icon: CreditCard,
            color: 'cyan',
            desc: 'Total value'
        },
        {
            label: 'Top Job',
            value: stats.topJob || 'N/A', // Need to derive this in parent
            icon: TrendingUp,
            color: 'rose',
            desc: 'Most applications'
        },
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-50 text-blue-600 border-blue-100',
            purple: 'bg-purple-50 text-purple-600 border-purple-100',
            amber: 'bg-amber-50 text-amber-600 border-amber-100',
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            pink: 'bg-pink-50 text-pink-600 border-pink-100',
            cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
            rose: 'bg-rose-50 text-rose-600 border-rose-100',
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="space-y-6 mb-8">
            {/* Primary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {primaryStats.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl border border-secondary-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl border ${getColorClasses(item.color)}`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            {item.trend && (
                                <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${item.trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                    {item.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {item.trend}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-secondary-900 tracking-tight">{item.value}</h3>
                            <div className="flex justify-between items-end mt-1">
                                <p className="text-secondary-500 text-sm font-medium">{item.label}</p>
                                <span className="text-xs text-secondary-400 font-normal">{item.desc}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {secondaryStats.map((item, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl border border-secondary-200 p-4 shadow-sm hover:bg-white transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-lg border ${getColorClasses(item.color)}`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-secondary-900">{item.value}</h4>
                                <p className="text-secondary-500 text-xs font-medium uppercase tracking-wider">{item.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
