'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';

export default function RecruiterDashboard() {
  const router = useRouter();
  const { user } = useAuth() || {};
  const { dashboardData, isLoading, error } = useDashboard() || {};

  const [activeStep, setActiveStep] = useState(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // Safe accessor helpers
  const safeArray = (arr) => (Array.isArray(arr) ? arr : []);
  const safeNumber = (v) => (typeof v === 'number' && !Number.isNaN(v) ? v : 0);

  // Normalize dashboardData shape with defaults
  const jobsPosted = safeArray(dashboardData?.jobsPosted);
  const submittedCandidates = safeArray(dashboardData?.submittedCandidates);
  const earnings = dashboardData?.earnings || { total: 0, pending: 0, released: 0 };

  // Calculate stats (defensive)
  const stats = {
    totalJobs: jobsPosted.length,
    activeJobs: jobsPosted.filter((job) => job?.status === 'active').length,
    totalCandidates: submittedCandidates.length,
    pendingReview: submittedCandidates.filter((c) => c?.status === 'submitted').length,
    interviewed: submittedCandidates.filter((c) => c?.status === 'interview').length,
    hired: submittedCandidates.filter((c) => c?.status === 'hired').length,
    totalEarnings: safeNumber(earnings.total),
    pendingEarnings: safeNumber(earnings.pending),
    releasedEarnings: safeNumber(earnings.released),
  };

  // Journey Steps (uses stats safely)
  const journeySteps = [
    {
      id: 1,
      title: 'Sign Up / Login',
      subtitle: 'Account Created',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      status: 'completed',
      description: 'Welcome! You have successfully registered and gained access to the recruiter dashboard.',
      action: null,
    },
    {
      id: 2,
      title: 'Onboarding Call',
      subtitle: 'Platform Overview',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      status: user?.onboardingCompleted ? 'completed' : 'pending',
      description: 'Schedule a call with A2Z Staffs to learn about platform features, commission rules (80/20 split), and earnings process.',
      action: 'Schedule Call',
    },
    {
      id: 3,
      title: 'Browse Jobs',
      subtitle: 'Find Opportunities',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      status: stats.activeJobs > 0 ? 'active' : 'available',
      description: 'Explore available job openings with detailed JDs, offered commission rates, and client/consultancy information.',
      action: 'View Jobs',
      count: stats.activeJobs,
    },
    {
      id: 4,
      title: 'Submit Candidates',
      subtitle: 'Upload & Track',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      status: stats.totalCandidates > 0 ? 'active' : 'available',
      description: 'Upload candidate CVs → A2Z internal review → Client review → Interview → Offer → Candidate joins.',
      action: 'Submit CV',
      count: stats.totalCandidates,
    },
    {
      id: 5,
      title: 'Earnings & Commission',
      subtitle: '80/20 Split',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-yellow-500 to-yellow-600',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      status: stats.totalEarnings > 0 ? 'active' : 'pending',
      description: 'Earn 80% commission on successful placements. Commission released after candidate completes probation period (60-90 days).',
      action: 'View Earnings',
      amount: stats.pendingEarnings,
    },
    {
      id: 6,
      title: 'Completion',
      subtitle: 'Payout Released',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      status: stats.hired > 0 ? 'completed' : 'pending',
      description: 'Candidate successfully hired and probation completed. Your commission payout is released with detailed report.',
      action: 'View Reports',
      count: stats.hired,
    },
  ];

  // Action dispatcher for step buttons
  const handleStepAction = (step) => {
    if (!step || !step.action) return;

    switch (step.id) {
      case 2: // Onboarding
        setShowOnboardingModal(true);
        break;
      case 3: // View Jobs
        router.push('/recruiter/jobs'); // adjust route to your jobs page
        break;
      case 4: // Submit CV
        router.push('/recruiter/submit-candidate'); // adjust route
        break;
      case 5: // View Earnings
        router.push('/recruiter/earnings'); // adjust route
        break;
      case 6: // View Reports
        router.push('/recruiter/reports'); // adjust route
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-700">{String(error)}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100">
      {/* Hero Header */}
      <div className="bg-white border-b border-secondary-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary-900 mb-2">
              Welcome back, {user?.fullName?.split(' ')[0] || 'Recruiter'}! 👋
            </h1>
            <p className="text-lg text-secondary-600">{user?.company || 'Your Company'} • Track your recruitment journey</p>
          </div>
        </div>
      </div>

      {/* Journey Flow Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-3">Your Recruitment Journey</h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Follow these steps to successfully place candidates and earn commissions. Each stage brings you closer to your goals.
          </p>
        </div>

        <div className="relative">
          {/* Horizontal Connection Line for wide screens */}
          <div
            className="hidden lg:block absolute top-24 left-0 right-0 h-1"
            style={{ width: 'calc(100% - 8rem)', left: '4rem', background: 'linear-gradient(90deg,#bfdbfe,#e9d5ff,#bbf7d0,#fed7aa,#fef3c7,#d1fae5)' }}
          />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 relative">
            {journeySteps.map((step, index) => (
              <div key={step.id} className="relative">
                <div
                  onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                  className={`bg-white rounded-2xl shadow-lg border-2 ${step.borderColor} p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    activeStep === step.id ? 'ring-4 ring-primary-300 scale-105' : ''
                  }`}
                >
                  {/* Status Badge */}
                  <div className="absolute -top-3 -right-3">
                    {step.status === 'completed' && (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {step.status === 'active' && (
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    )}
                    {step.status === 'pending' && (
                      <div className="w-8 h-8 bg-secondary-300 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Icon box */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto shadow-lg`}>
                    {step.icon}
                  </div>

                  {/* Step Number */}
                  <div className="text-center mb-3">
                    <span className="inline-block px-3 py-1 bg-secondary-100 text-secondary-600 rounded-full text-xs font-semibold">
                      Step {step.id}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-secondary-900 text-center mb-1">{step.title}</h3>
                  <p className={`text-sm ${step.textColor} text-center font-medium mb-3`}>{step.subtitle}</p>

                  {/* Count/Amount */}
                  {(step.count !== undefined || step.amount !== undefined) && (
                    <div className={`${step.bgLight} rounded-lg py-2 px-3 text-center mb-3`}>
                      <p className={`text-2xl font-bold ${step.textColor}`}>
                        {step.amount !== undefined ? `$${safeNumber(step.amount).toLocaleString()}` : step.count}
                      </p>
                      <p className="text-xs text-secondary-500">{step.amount !== undefined ? 'Pending' : 'Total'}</p>
                    </div>
                  )}

                  {/* Action Button */}
                  {step.action && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStepAction(step);
                      }}
                      className={`w-full bg-gradient-to-r ${step.color} text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 text-sm`}
                    >
                      {step.action}
                    </button>
                  )}

                  {/* Expanded Description */}
                  {activeStep === step.id && (
                    <div className="mt-4 pt-4 border-t border-secondary-200">
                      <p className="text-sm text-secondary-600 leading-relaxed">{step.description}</p>
                    </div>
                  )}
                </div>

                {/* Arrow - Hidden on small screens */}
                {index < journeySteps.length - 1 && (
                  <div className="hidden xl:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <svg className="w-6 h-6 text-secondary-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-secondary-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Active Jobs</p>
                <p className="text-3xl font-bold text-secondary-900 mt-1">{stats.activeJobs}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-secondary-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Candidates Submitted</p>
                <p className="text-3xl font-bold text-secondary-900 mt-1">{stats.totalCandidates}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-secondary-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Successfully Hired</p>
                <p className="text-3xl font-bold text-secondary-900 mt-1">{stats.hired}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-secondary-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Pending Earnings</p>
                <p className="text-3xl font-bold text-secondary-900 mt-1">${safeNumber(stats.pendingEarnings).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Your Commission Structure</h3>
                <p className="text-blue-100 mt-1">Transparent and rewarding partnership</p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <p className="text-4xl font-bold">80%</p>
                <p className="text-blue-100 text-sm">Your Share</p>
              </div>
              <div className="text-4xl font-light text-blue-200">|</div>
              <div className="text-center">
                <p className="text-4xl font-bold">20%</p>
                <p className="text-blue-100 text-sm">A2Z Share</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white border-opacity-20">
            <p className="text-blue-50">
              💡 <strong>Note:</strong> Commission is released after the candidate successfully completes their probation period (60-90 days). 
              All earnings are tracked in real-time on your dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboardingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
            <button
              onClick={() => setShowOnboardingModal(false)}
              className="absolute top-4 right-4 text-secondary-400 hover:text-secondary-600 transition-colors"
              aria-label="Close onboarding modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-2">Schedule Onboarding Call</h2>
              <p className="text-secondary-600">Connect with our A2Z Staffs team to get started on the right foot</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-secondary-900">Platform Overview</h4>
                  <p className="text-sm text-secondary-600">Learn how to navigate the dashboard and use all features effectively</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-secondary-900">Commission Rules</h4>
                  <p className="text-sm text-secondary-600">Understand the 80/20 split and payment timelines</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-secondary-900">Earnings Process</h4>
                  <p className="text-sm text-secondary-600">Learn how and when you'll receive your commission payouts</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-secondary-900">Best Practices</h4>
                  <p className="text-sm text-secondary-600">Get tips on finding the right candidates and maximizing your earnings</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowOnboardingModal(false)}
                className="flex-1 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  // Placeholder: integrate calendar scheduling here
                  alert('Calendar integration coming soon!');
                  setShowOnboardingModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Schedule Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
