'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    UserPlus, Briefcase, FileText, Building2,
    CheckCircle, IndianRupee, Award, Activity,
    Bell, Clock
} from 'lucide-react';

const iconMap = {
    UserPlus,
    Briefcase,
    FileText,
    Building2,
    CheckCircle,
    IndianRupee,
    Award,
    Activity,
    Bell
};

const typeColors = {
    recruiter_signup: 'bg-blue-100 text-blue-600',
    job_posted: 'bg-emerald-100 text-emerald-600',
    candidate_applied: 'bg-purple-100 text-purple-600',
    client_signup: 'bg-cyan-100 text-cyan-600',
    placement: 'bg-green-100 text-green-600',
    payout: 'bg-amber-100 text-amber-600',
    job_filled: 'bg-pink-100 text-pink-600',
    default: 'bg-gray-100 text-gray-600'
};

// Format relative time
const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
};

export default function RecentActivityFeed({ activities = [], isLoading = false }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Recent Activity</h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>Live</span>
                </div>
            </div>

            <div className="divide-y divide-gray-50 max-h-[380px] overflow-y-auto">
                {isLoading ? (
                    // Loading skeleton
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 animate-pulse">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-200" />
                                <div className="flex-1">
                                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                                    <div className="h-3 w-1/4 bg-gray-100 rounded mt-2" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : activities.length === 0 ? (
                    <div className="p-8 text-center">
                        <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No recent activity</p>
                    </div>
                ) : (
                    activities.map((activity, index) => {
                        const Icon = iconMap[activity.icon] || Bell;
                        const colorClass = typeColors[activity.type] || typeColors.default;
                        const time = activity.time || formatTime(activity.createdAt);

                        return (
                            <motion.div
                                key={activity._id || activity.id || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${colorClass}`}>
                                        <Icon size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 leading-snug">
                                            {activity.message || activity.title}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{time}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                <Link
                    href="/admin/notifications"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    View All Activity
                </Link>
            </div>
        </div>
    );
}
