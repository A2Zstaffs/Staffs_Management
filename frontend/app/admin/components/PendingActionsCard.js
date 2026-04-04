'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ClipboardCheck, UserX, Users, FileText,
    ArrowRight, AlertCircle
} from 'lucide-react';

const iconMap = {
    ClipboardCheck,
    UserX,
    Users,
    FileText,
    AlertCircle
};

export default function PendingActionsCard({
    title,
    count,
    icon,
    href,
    color = 'blue',
    description,
    isLoading = false,
    delay = 0
}) {
    const Icon = iconMap[icon] || AlertCircle;

    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            hover: 'hover:border-blue-300',
            badge: count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
        },
        orange: {
            bg: 'bg-orange-50',
            text: 'text-orange-600',
            hover: 'hover:border-orange-300',
            badge: count > 0 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
        },
        purple: {
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            hover: 'hover:border-purple-300',
            badge: count > 0 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
        },
        amber: {
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            hover: 'hover:border-amber-300',
            badge: count > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
        }
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
        >
            <Link
                href={href}
                className={`block p-4 bg-white rounded-xl border border-gray-100 
                   ${colors.hover} hover:shadow-md transition-all duration-300 group`}
            >
                <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-lg ${colors.bg}`}>
                        <Icon className={colors.text} size={20} />
                    </div>

                    {isLoading ? (
                        <div className="h-7 w-10 bg-gray-200 rounded-full animate-pulse" />
                    ) : (
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${colors.badge}`}>
                            {count}
                        </span>
                    )}
                </div>

                <div className="mt-3">
                    <h4 className="font-semibold text-gray-800 group-hover:text-gray-900">
                        {title}
                    </h4>
                    {description && (
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                    )}
                </div>

                <div className="mt-3 flex items-center text-xs text-gray-400 group-hover:text-blue-600 transition-colors">
                    <span>View all</span>
                    <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>
        </motion.div>
    );
}
