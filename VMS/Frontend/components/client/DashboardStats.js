'use client';

import { Briefcase, Users, FileBarChart, Trophy } from 'lucide-react';

export default function DashboardStats({ stats }) {
    const statItems = [
        {
            label: 'Active Jobs',
            value: stats.activeJobs,
            icon: Briefcase,
            color: 'blue',
            trend: '+12%',
            trendUp: true,
        },
        {
            label: 'Total Applications',
            value: stats.applicationsReceived,
            icon: Users,
            color: 'purple',
            trend: '+24%',
            trendUp: true,
        },
        {
            label: 'In Interview',
            value: stats.inProcessApplications,
            icon: FileBarChart,
            color: 'amber',
            trend: '-2%',
            trendUp: false,
        },
        {
            label: 'Total Hires',
            value: stats.totalHires,
            icon: Trophy,
            color: 'emerald',
            trend: '+5%',
            trendUp: true,
        },
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-50 text-blue-600',
            purple: 'bg-purple-50 text-purple-600',
            amber: 'bg-amber-50 text-amber-600',
            emerald: 'bg-emerald-50 text-emerald-600',
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statItems.map((item, index) => (
                <div key={index} className="bg-white rounded-xl border border-secondary-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg ${getColorClasses(item.color)}`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        {item.trend && (
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {item.trend}
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-secondary-900">{item.value}</h3>
                        <p className="text-secondary-500 text-sm font-medium">{item.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
