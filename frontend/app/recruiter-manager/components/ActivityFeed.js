'use client';

import { FileText, UserPlus, TrendingUp, Clock } from 'lucide-react';

export default function ActivityFeed({ activities = [] }) {
    const getActivityIcon = (type) => {
        switch (type) {
            case 'profile_submitted':
                return <FileText className="w-4 h-4 text-blue-600" />;
            case 'recruiter_joined':
                return <UserPlus className="w-4 h-4 text-green-600" />;
            case 'status_change':
                return <TrendingUp className="w-4 h-4 text-orange-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    const formatTime = (date) => {
        const now = new Date();
        const activityDate = new Date(date);
        const diff = Math.floor((now - activityDate) / 1000 / 60); // minutes

        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return activityDate.toLocaleDateString();
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

            {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">No recent activity</p>
            ) : (
                <div className="space-y-4">
                    {activities.slice(0, 5).map((activity, index) => (
                        <div key={activity._id || index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className="p-2 bg-gray-50 rounded-lg">
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 font-medium">{activity.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatTime(activity.createdAt)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
