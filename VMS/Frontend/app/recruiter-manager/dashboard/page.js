'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
import * as recruiterManagerAPI from '@/lib/recruiterManagerApi';
import { useAuth } from '@/contexts/AuthContext';
import PerformanceChart from '../components/PerformanceChart';
import ActivityFeed from '../components/ActivityFeed';
import LoadingSpinner from '@/components/LoadingSpinner';

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
};

export default function RecruiterManagerDashboard() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const response = await recruiterManagerAPI.getRecruiterManagerDashboard();
            if (response.success) {
                setDashboardData(response.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner variant="logo" size="xl" message="Loading your dashboard..." fullScreen />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600 text-xl">Error: {error}</div>
            </div>
        );
    }

    const stats = [
        {
            title: 'Assigned Recruiters',
            value: dashboardData?.totalRecruiters || 0,
            icon: Users,
            color: 'bg-blue-500',
            link: '/recruiter-manager/recruiters'
        },
        {
            title: 'Total Profiles',
            value: dashboardData?.totalProfiles || 0,
            icon: FileText,
            color: 'bg-green-500',
            link: '/recruiter-manager/candidates'
        },
        {
            title: 'Active Jobs',
            value: dashboardData?.activeJobs || 0,
            icon: Briefcase,
            color: 'bg-purple-500',
            link: '/recruiter-manager/jobs'
        },
        {
            title: 'Applications',
            value: dashboardData?.totalApplications || 0,
            icon: TrendingUp,
            color: 'bg-orange-500',
            link: '/recruiter-manager/applications'
        }
    ];

    return (
        <>
            {/* Personalized Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-secondary-900 mb-2">
                    {getGreeting()}, {user?.fullName || user?.name || 'Recruiter Manager'}! 👋
                </h1>
                <p className="text-secondary-600 text-lg">
                    Here's your team's performance overview
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Link href={stat.link} key={index}>
                            <div className="bg-white border-2 border-secondary-200 rounded-2xl p-6 hover:shadow-lg hover:border-primary-300 transition-all cursor-pointer">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-3xl font-bold text-secondary-900">{stat.value}</span>
                                </div>
                                <h3 className="text-sm font-medium text-secondary-600">{stat.title}</h3>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Assigned Recruiters List */}
            <div className="bg-white border border-secondary-200 shadow-sm rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-secondary-900">Your Assigned Recruiters</h2>
                    <Link
                        href="/recruiter-manager/recruiters"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        View All
                    </Link>
                </div>

                <div className="space-y-4">
                    {dashboardData?.recruiters && dashboardData.recruiters.length > 0 ? (
                        dashboardData.recruiters.map((recruiter) => (
                            <div key={recruiter._id} className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 hover:bg-secondary-100 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-secondary-900">{recruiter.fullName}</h3>
                                        <p className="text-sm text-secondary-500">{recruiter.email}</p>
                                        <p className="text-xs text-secondary-500 mt-1">
                                            Assigned: {new Date(recruiter.assignedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/recruiter-manager/recruiters/${recruiter._id}`}
                                        className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-secondary-500">
                            No recruiters assigned yet
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link href="/recruiter-manager/jobs">
                    <div className="bg-white border border-secondary-200 shadow-sm rounded-xl p-6 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer">
                        <Briefcase className="w-8 h-8 text-purple-600 mb-3" />
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">View All Jobs</h3>
                        <p className="text-sm text-secondary-500">Access all active job postings</p>
                    </div>
                </Link>

                <Link href="/recruiter-manager/candidates">
                    <div className="bg-white border border-secondary-200 shadow-sm rounded-xl p-6 hover:shadow-lg hover:border-green-300 transition-all cursor-pointer">
                        <FileText className="w-8 h-8 text-green-600 mb-3" />
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">View Profiles</h3>
                        <p className="text-sm text-secondary-500">Review profiles uploaded by your recruiters</p>
                    </div>
                </Link>

                <Link href="/recruiter-manager/applications">
                    <div className="bg-white border border-secondary-200 shadow-sm rounded-xl p-6 hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer">
                        <TrendingUp className="w-8 h-8 text-orange-600 mb-3" />
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">Track Applications</h3>
                        <p className="text-sm text-secondary-500">Monitor application status and performance</p>
                    </div>
                </Link>
            </div>

            {/* Performance & Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Performance Chart */}
                <PerformanceChart recruiters={dashboardData?.recruiters || []} />

                {/* Activity Feed */}
                <ActivityFeed activities={[]} />
            </div>

            {/* Top Performers & Team Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Performers */}
                <div className="lg:col-span-2 bg-white border border-secondary-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">🏆 Top Performers</h3>
                    <div className="space-y-3">
                        {dashboardData?.recruiters
                            ?.sort((a, b) => (b.profileCount || 0) - (a.profileCount || 0))
                            .slice(0, 3)
                            .map((recruiter, index) => (
                                <div key={recruiter._id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={'w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ' + (
                                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                                        )}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-secondary-900">{recruiter.fullName}</p>
                                            <p className="text-xs text-secondary-500">{recruiter.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary-600">{recruiter.profileCount || 0}</p>
                                        <p className="text-xs text-secondary-500">profiles</p>
                                    </div>
                                </div>
                            )) || <p className="text-secondary-500 text-center py-4">No data</p>}
                    </div>
                </div>

                {/* Quick Team Stats */}
                <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">Team Status</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-blue-100 text-sm">Active Recruiters</p>
                            <p className="text-3xl font-bold">{dashboardData?.totalRecruiters || 0}</p>
                        </div>
                        <div>
                            <p className="text-blue-100 text-sm">Total Submissions</p>
                            <p className="text-3xl font-bold">{dashboardData?.totalProfiles || 0}</p>
                        </div>
                        <div className="pt-4 border-t border-white/20">
                            <p className="text-blue-100 text-sm">Avg. per Recruiter</p>
                            <p className="text-2xl font-bold">
                                {dashboardData?.totalRecruiters > 0
                                    ? Math.round(dashboardData.totalProfiles / dashboardData.totalRecruiters)
                                    : 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
