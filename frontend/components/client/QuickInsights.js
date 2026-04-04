'use client';

import { Lightbulb, ArrowRight, AlertCircle, Clock } from 'lucide-react';

export default function QuickInsights({ stats, jobs = [] }) {
    // Generate simple insights based on data
    const insights = [];

    // Check for jobs with low applications
    const lowAppJobs = jobs.filter(j => (j.applicationCount || 0) === 0 && j.status === 'Active');
    if (lowAppJobs.length > 0) {
        insights.push({
            id: 'low-apps',
            type: 'warning',
            text: `${lowAppJobs.length} active jobs have 0 applications. Consider boosting them.`,
            action: 'Boost Jobs',
            icon: AlertCircle,
            color: 'amber'
        });
    }

    // Check for pending reviews (mock logic)
    if ((stats.inProcessApplications || 0) > 5) {
        insights.push({
            id: 'pending-reviews',
            type: 'info',
            text: `You have ${stats.inProcessApplications} candidates in interview stage. Don't forget to submit feedback.`,
            action: 'Review Candidates',
            icon: Clock,
            color: 'blue'
        });
    }

    // Default insight if empty
    if (insights.length === 0) {
        insights.push({
            id: 'general-tip',
            type: 'tip',
            text: 'Adding clear salary ranges increases application rate by 40%.',
            action: 'Update Jobs',
            icon: Lightbulb,
            color: 'purple'
        });
    }

    return (
        <div className="bg-gradient-to-br from-primary-900 to-indigo-900 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Lightbulb className="w-5 h-5 text-yellow-300" />
                </div>
                <h3 className="font-bold text-lg">Quick Insights</h3>
            </div>

            <div className="space-y-4">
                {insights.map((insight) => (
                    <div key={insight.id} className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:bg-white/15 transition-colors">
                        <div className="flex gap-3">
                            <insight.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${insight.type === 'warning' ? 'text-amber-400' :
                                    insight.type === 'tip' ? 'text-purple-300' : 'text-blue-300'
                                }`} />
                            <div>
                                <p className="text-sm text-indigo-50 leading-relaxed">{insight.text}</p>
                                <button className="mt-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all text-white/90 hover:text-white">
                                    {insight.action} <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
