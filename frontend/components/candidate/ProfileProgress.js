'use client';

import {
    User,
    FileText,
    Briefcase,
    GraduationCap,
    Award,
    ChevronRight,
    CheckCircle,
    Circle
} from 'lucide-react';

export default function ProfileProgress({ profileData, completion = 0, onEditSection }) {
    const sections = [
        {
            id: 'basic',
            label: 'Basic Info',
            icon: User,
            isComplete: !!(profileData?.fullName && profileData?.email && profileData?.phone),
            fields: ['Name', 'Email', 'Phone']
        },
        {
            id: 'resume',
            label: 'Resume',
            icon: FileText,
            isComplete: !!profileData?.resume,
            fields: ['Upload resume']
        },
        {
            id: 'experience',
            label: 'Experience',
            icon: Briefcase,
            isComplete: (profileData?.workExperience?.length || 0) > 0,
            fields: ['Work history']
        },
        {
            id: 'education',
            label: 'Education',
            icon: GraduationCap,
            isComplete: (profileData?.education?.length || 0) > 0,
            fields: ['Qualifications']
        },
        {
            id: 'skills',
            label: 'Skills',
            icon: Award,
            isComplete: (profileData?.skills?.length || 0) >= 3,
            fields: ['Add 3+ skills']
        }
    ];

    const completedCount = sections.filter(s => s.isComplete).length;
    const calculatedCompletion = Math.round((completedCount / sections.length) * 100);
    const displayCompletion = completion || calculatedCompletion;

    const getProgressColor = (percent) => {
        if (percent >= 80) return 'text-emerald-500';
        if (percent >= 50) return 'text-amber-500';
        return 'text-blue-500';
    };

    const getProgressGradient = (percent) => {
        if (percent >= 80) return 'from-emerald-500 to-teal-500';
        if (percent >= 50) return 'from-amber-500 to-orange-500';
        return 'from-blue-500 to-indigo-500';
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Header with Progress Circle */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
                <div className="flex items-center gap-5">
                    {/* Circular Progress */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-white/20"
                            />
                            <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeDasharray={`${displayCompletion}, 100`}
                                className={getProgressColor(displayCompletion)}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">{displayCompletion}%</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg">Profile Strength</h3>
                        <p className="text-slate-300 text-sm mt-1">
                            {displayCompletion >= 80
                                ? 'Excellent! Your profile stands out.'
                                : displayCompletion >= 50
                                    ? 'Good progress! Add more details.'
                                    : 'Complete your profile to get noticed.'}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-5">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${getProgressGradient(displayCompletion)} transition-all duration-500 rounded-full`}
                            style={{ width: `${displayCompletion}%` }}
                        />
                    </div>
                    <p className="text-slate-400 text-xs mt-2">
                        {completedCount} of {sections.length} sections completed
                    </p>
                </div>
            </div>

            {/* Section Checklist */}
            <div className="p-4">
                <div className="space-y-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => onEditSection && onEditSection(section.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${section.isComplete
                                ? 'bg-emerald-50 hover:bg-emerald-100'
                                : 'bg-slate-50 hover:bg-blue-50'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${section.isComplete
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-slate-200 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                                }`}>
                                <section.icon className="w-4 h-4" />
                            </div>

                            <div className="flex-1 text-left">
                                <p className={`font-medium text-sm ${section.isComplete ? 'text-emerald-700' : 'text-slate-700'
                                    }`}>
                                    {section.label}
                                </p>
                                <p className="text-xs text-slate-500">{section.fields.join(', ')}</p>
                            </div>

                            {section.isComplete ? (
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
