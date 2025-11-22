'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { authAPI, dashboardAPI } from '@/lib/api';
import CandidateNavbar from '@/components/candidate/CandidateNavbar';

export default function CandidateDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  
  // Dashboard data state
  const [summaryData, setSummaryData] = useState({
    appliedJobs: 0,
    shortlisted: 0,
    interviewsScheduled: 0,
    offers: 0
  });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(70);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Authentication check and redirect logic
  // Route protection: If user is NOT logged in → redirect to /login
  // If user role !== candidate → redirect to their respective dashboard
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // Check for JWT token in localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
      
      // Route protection: If no token, redirect to login
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Route protection: If role is not candidate, redirect to appropriate dashboard
      // Do NOT break recruiter flow - keep their existing redirect logic
      if (userRole && userRole !== 'candidate') {
        if (userRole === 'recruiter') {
          router.push('/dashboard');
        } else if (userRole === 'client') {
          router.push('/dashboard');
        } else if (userRole === 'consultancy') {
          router.push('/dashboard');
        } else {
          router.push('/dashboard');
        }
        return;
      }
      
      // If authenticated and role is correct, fetch dashboard data
      if (isAuthenticated && user?.role === 'candidate') {
        await fetchDashboardData();
        setIsLoading(false);
      } else if (token && userRole === 'candidate') {
        // Token exists and role is candidate, but auth context not loaded yet
        // Fetch dashboard data anyway since we have valid token
        await fetchDashboardData();
        setIsLoading(false);
      } else {
        // Token exists but something is wrong, wait a bit then check again
        setTimeout(() => {
          if (!isAuthenticated) {
            router.push('/login');
          } else {
            setIsLoading(false);
          }
        }, 1000);
      }
    };

    checkAuth();
  }, [isAuthenticated, user, router]);

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch all candidate dashboard data in a single API call
      const response = await dashboardAPI.getCandidateDashboard();
      
      if (response.success && response.data) {
        // Set summary data
        setSummaryData({
          appliedJobs: response.data.appliedJobs || response.data.appliedCount || 0,
          shortlisted: response.data.shortlisted || response.data.shortlistedCount || 0,
          interviewsScheduled: response.data.interviewsScheduled || response.data.interviewsCount || 0,
          offers: response.data.offers || response.data.offersCount || 0
        });

        // Set recommended jobs (check multiple possible field names)
        if (response.data.recommendedJobs && response.data.recommendedJobs.length > 0) {
          setRecommendedJobs(response.data.recommendedJobs);
        } else if (response.data.availableJobs && response.data.availableJobs.length > 0) {
          setRecommendedJobs(response.data.availableJobs.slice(0, 6));
        } else if (response.data.jobs && response.data.jobs.length > 0) {
          setRecommendedJobs(response.data.jobs.slice(0, 6));
        }

        // Set profile completion percentage
        if (response.data.profileCompletion !== undefined) {
          setProfileCompletion(response.data.profileCompletion);
        } else if (response.data.profileCompletionPercentage !== undefined) {
          setProfileCompletion(response.data.profileCompletionPercentage);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use default values if API fails - dashboard will still render
    } finally {
      setIsLoadingData(false);
    }
  };

  // Handle job application
  const handleApplyJob = async (jobId) => {
    try {
      const response = await dashboardAPI.applyToJob(jobId, {
        coverLetter: 'I am very interested in this position and believe my skills make me a great fit for this role.'
      });
      
      if (response.success) {
        alert('Successfully applied to job!');
        // Refresh summary data
        await fetchDashboardData();
      } else {
        alert('Failed to apply: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to apply: ' + error.message);
    }
  };

  // Handle save job
  const handleSaveJob = async (jobId) => {
    // TODO: Implement save job functionality
    alert('Job saved!');
  };

  // Handle logout from sidebar
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar - Global navigation with user profile on right */}
      <CandidateNavbar />
      
      {/* Main container with sidebar and content */}
      <div className="flex flex-1 pt-16">
        {/* Left Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="font-bold text-gray-800">VMS Recruit</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: 'search-jobs', label: 'Search Jobs', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
            { id: 'applications', label: 'My Applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { id: 'saved-jobs', label: 'Saved Jobs', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            { id: 'interviews', label: 'Interviews', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { id: 'offers', label: 'Offers', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenuItem(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeMenuItem === item.id
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Title Section */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Candidate Dashboard</h1>
        </div>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* SECTION A: Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Applied Jobs Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Applied Jobs</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {isLoadingData ? (
                      <span className="inline-block w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></span>
                    ) : (
                      summaryData.appliedJobs
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Shortlisted Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Shortlisted</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {isLoadingData ? (
                      <span className="inline-block w-8 h-8 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin"></span>
                    ) : (
                      summaryData.shortlisted
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Interviews Scheduled Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Interviews Scheduled</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {isLoadingData ? (
                      <span className="inline-block w-8 h-8 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin"></span>
                    ) : (
                      summaryData.interviewsScheduled
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Offers Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Offers</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {isLoadingData ? (
                      <span className="inline-block w-8 h-8 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin"></span>
                    ) : (
                      summaryData.offers
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: Recommended Jobs */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recommended Jobs for You</h2>
            </div>

            {isLoadingData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : recommendedJobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No recommended jobs found</h3>
                <p className="text-gray-500">We'll show you personalized job recommendations here once they're available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedJobs.map((job) => (
                  <div key={job._id || job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{job.title || 'Job Title'}</h3>
                      <p className="text-blue-600 font-medium">{job.postedBy?.company || job.company || 'Company Name'}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location?.city || 'Location'} {job.location?.country ? `, ${job.location.country}` : ''}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.experienceLevel || job.experience || 'Experience Required'}
                      </div>
                      {job.salary && (
                        <div className="flex items-center text-sm text-green-600 font-semibold">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ${job.salary?.min?.toLocaleString() || '0'} - ${job.salary?.max?.toLocaleString() || '0'} {job.salary?.currency || 'USD'}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleApplyJob(job._id || job.id)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        Apply Now
                      </button>
                      <button
                        onClick={() => handleSaveJob(job._id || job.id)}
                        className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors text-sm"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION C: Profile Completion Widget */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Profile Completion</h3>
                <p className="text-sm text-gray-600">Complete your profile to get better job matches</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">{profileCompletion}%</span>
            </div>
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              Complete Your Profile
            </button>
          </div>
        </main>
      </div>
      </div>
    </div>
  );
}

