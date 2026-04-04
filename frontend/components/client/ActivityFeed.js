'use client';

import {
    MoreHorizontal,
    Activity // Fallback icon
} from 'lucide-react';

export default function ActivityFeed({ activities = [], onViewHistory }) {
    // Helper to get color classes
    const getIconStyle = (color) => {
        const styles = {
            blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-50' },
            amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-50' },
            emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-50' },
            purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-50' },
            pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-50' },
            gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-50' },
        };
        return styles[color] || styles.blue;
    };

    if (activities.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-secondary-200 shadow-sm flex flex-col h-full items-center justify-center p-8 text-center">
                <div className="w-12 h-12 bg-secondary-50 rounded-full flex items-center justify-center mb-3">
                    <Activity className="w-6 h-6 text-secondary-400" />
                </div>
                <h3 className="text-secondary-900 font-medium">No recent activity</h3>
                <p className="text-secondary-500 text-sm mt-1">Updates will appear here</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-secondary-200 shadow-sm flex flex-col h-full">
            <div className="p-6 border-b border-secondary-100 flex justify-between items-center bg-white rounded-t-xl z-10">
                <h3 className="font-bold text-secondary-900 text-lg">Recent Activity</h3>
                <button className="text-secondary-400 hover:text-secondary-600 p-1 hover:bg-secondary-50 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-secondary-200 scrollbar-track-transparent">
                {/* Timeline Container */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-secondary-100"></div>

                    <div className="space-y-6">
                        {activities.map((activity, index) => {
                            const style = getIconStyle(activity.color || 'blue');
                            const Icon = activity.icon || Activity;

                            return (
                                <div key={activity.id || index} className="relative pl-12 group">
                                    {/* Timeline Dot */}
                                    <div className={`absolute left-0 top-0.5 w-10 h-10 rounded-full border-[3px] border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-105 ${style.bg} ${style.text}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col gap-0.5 pt-0.5">
                                        <h4 className="text-sm font-semibold text-secondary-900 leading-tight">
                                            {activity.title || 'Untitled Event'}
                                        </h4>
                                        <p className="text-sm text-secondary-600 leading-relaxed font-medium">
                                            {activity.desc}
                                        </p>
                                        <span className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mt-1.5 flex items-center gap-1">
                                            {activity.time}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-secondary-100 bg-secondary-50/50 text-center rounded-b-xl">
                <button
                    onClick={() => onViewHistory && onViewHistory()}
                    className="text-xs font-bold text-secondary-500 hover:text-primary-600 transition-colors uppercase tracking-widest py-1"
                >
                    View Full History
                </button>
            </div>
        </div>
    );
}
