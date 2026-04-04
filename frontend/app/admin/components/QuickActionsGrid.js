'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Users, UserCheck, Briefcase, GitPullRequest,
    Wallet, BarChart3, ArrowRight
} from 'lucide-react';

const iconMap = {
    Users,
    UserCheck,
    Briefcase,
    GitPullRequest,
    Wallet,
    BarChart3
};

export default function QuickActionsGrid({ actions = [] }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                <h3 className="font-semibold text-gray-800">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {actions.map((action, index) => {
                    const Icon = iconMap[action.icon] || Briefcase;

                    return (
                        <motion.div
                            key={action.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Link
                                href={action.href}
                                className="group block p-4 rounded-xl border border-gray-100 
                         hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 
                         transition-all duration-300"
                            >
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} 
                              flex items-center justify-center mb-3 
                              group-hover:scale-110 transition-transform`}>
                                    <Icon className="text-white" size={20} />
                                </div>
                                <h4 className="font-medium text-gray-800 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                                    {action.title}
                                </h4>
                                <p className="text-xs text-gray-500 line-clamp-2">{action.description}</p>
                                <div className="mt-2 flex items-center text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span>Open</span>
                                    <ArrowRight size={12} className="ml-1" />
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
