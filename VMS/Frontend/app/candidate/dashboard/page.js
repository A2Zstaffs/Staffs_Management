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
  const [activeMenuItem, setActiveMenuItem] = useState('search-jobs');

  // Dashboard data state
  const [summaryData, setSummaryData] = useState({
    appliedJobs: 0,
    shortlisted: 0,
    interviewsScheduled: 0,
    offers: 0
  });
  const [applications, setApplications] = useState([]);
  const [searchJobs, setSearchJobs] = useState([]); // Jobs for search view
  const [profileCompletion, setProfileCompletion] = useState(70);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        // Set jobs for search view
        if (response.data.availableJobs) {
          setSearchJobs(response.data.availableJobs);
        }

        // Set applications
        if (response.data.applications) {
          setApplications(response.data.applications);
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

  // Handle apply click (open modal)
  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setApplyStep(1); // Reset to profile check step
    setIsApplyModalOpen(true);
  };

  // Submit Application
  const submitApplication = async (e) => {
    e.preventDefault();

    // Check if resume is available (either new upload or existing profile)
    if (!resumeFile && !profileData?.resume) {
      alert('Please upload your resume to proceed.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }
    formData.append('coverLetter', coverLetter);

    try {
      const response = await dashboardAPI.applyToJob(selectedJob._id || selectedJob.id, formData);
      if (response.success) {
        alert('Application submitted successfully!');
        setIsApplyModalOpen(false);
        setResumeFile(null);
        setCoverLetter('');
        setApplyStep(1); // Reset step
        await fetchDashboardData(); // Refresh data
      } else {
        alert(response.message || 'Failed to apply');
      }
    } catch (error) {
      alert('Error applying: ' + error.message);
    } finally {
      setIsSubmitting(false);
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

  // Profile Data State
  const [profileData, setProfileData] = useState(null);

  // Modal State
  const [activeModal, setActiveModal] = useState(null); // 'experience', 'education', 'skills', 'portfolio'
  const [editingItem, setEditingItem] = useState(null); // Item being edited
  const [modalFormData, setModalFormData] = useState({}); // Form data for modal

  // Apply Flow State
  const [applyStep, setApplyStep] = useState(1); // 1: Profile Check, 2: Resume/Cover Letter

  // Fetch Full Profile Data on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authAPI.getMe();
        if (res.success) {
          setProfileData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []); // Run once on mount to ensure we have data for Apply flow

  // Handle Profile Update (Generic)
  const handleUpdateProfile = async (updatedFields) => {
    try {
      const res = await authAPI.updateProfile(updatedFields);
      if (res.success) {
        setProfileData(prev => ({ ...prev, ...updatedFields }));
        setActiveModal(null);
        setModalFormData({});
        setEditingItem(null);
        // Update completion percentage if returned
        // ...
      }
    } catch (error) {
      alert('Failed to update profile: ' + error.message);
    }
  };

  // Handle Resume Upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await dashboardAPI.uploadResume(formData);
      if (res.success) {
        alert('Resume uploaded!');
        // Refresh profile
        const profileRes = await authAPI.getMe();
        if (profileRes.success) setProfileData(profileRes.data);
      }
    } catch (error) {
      alert('Failed to upload resume: ' + error.message);
    }
  };

  // Modal Handlers
  const openModal = (type, item = null) => {
    setActiveModal(type);
    setEditingItem(item);
    setModalFormData(item || {});
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingItem(null);
    setModalFormData({});
  };

  // Generic Save Handler for Lists (Experience, Education, Portfolio)
  const saveListItem = async (listName) => {
    const currentList = profileData[listName] || [];
    let newList;

    // 1. Update structure for Local State
    if (editingItem) {
      newList = currentList.map(i => (i._id === editingItem._id || i.id === editingItem.id) ? { ...i, ...modalFormData } : i);
    } else {
      // Use a truly unique temp ID for React keys
      newList = [...currentList, { ...modalFormData, _id: 'TEMP_' + Date.now() }];
    }

    // 2. Prepare Payload for API (Clean Data)
    // Strip temp IDs and fix empty strings
    const apiList = newList.map(item => {
      const cleanItem = { ...item };

      // Remove Temp IDs
      if (cleanItem._id && typeof cleanItem._id === 'string' && cleanItem._id.startsWith('TEMP_')) {
        delete cleanItem._id;
      }

      // Fix Dates for Work Experience
      if (listName === 'workExperience') {
        if (!cleanItem.endDate) delete cleanItem.endDate; // Remove key if empty
        if (!cleanItem.startDate) delete cleanItem.startDate;
      }

      return cleanItem;
    });

    await handleUpdateProfile({ [listName]: apiList });
  };

  // Specific Handlers
  const saveExperience = () => saveListItem('workExperience');
  const saveEducation = () => saveListItem('education');
  const savePortfolio = () => saveListItem('portfolio');

  const saveSkills = async () => {
    // modalFormData.skills should be array of strings
    await handleUpdateProfile({ skills: modalFormData.skills });
  };

  const savePreferences = async () => {
    await handleUpdateProfile({ preferences: modalFormData });
  }


  // Filter State
  const [filters, setFilters] = useState({
    skills: [],
    locations: [],
    experience: [0, 20],
    searchQuery: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Derived state for unique filter options
  const uniqueSkills = [...new Set(searchJobs.flatMap(job => job.skills || []))].slice(0, 8);
  const uniqueLocations = [...new Set(searchJobs.map(job => job.locations?.[0] || job.location?.city || 'Remote'))];

  // Filtered Jobs Logic
  const filteredJobs = searchJobs.filter(job => {
    const matchesSearch = !filters.searchQuery ||
      (job.job_title || job.title || '').toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      (job.company || '').toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesSkills = filters.skills.length === 0 ||
      filters.skills.some(skill => (job.skills || []).includes(skill));

    const matchesLocation = filters.locations.length === 0 ||
      filters.locations.includes(job.locations?.[0] || job.location?.city || 'Remote');

    // Simple experience check (assuming job.experienceLevel or similar exists, otherwise skip)
    // For now passing all if no precise exp field

    return matchesSearch && matchesSkills && matchesLocation;
  });

  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  // State to manage Profile Active Section
  const [activeProfileSection, setActiveProfileSection] = useState('overview');

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <CandidateNavbar />

      {/* Main Layout */}
      <div className="flex flex-1 pt-16">

        {/* Sidebar Navigation */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-10 hidden md:flex`}>
          <nav className="flex-1 p-4 space-y-2 mt-4">
            {[
              { id: 'search-jobs', label: 'Find Jobs', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
              { id: 'dashboard', label: 'My Applications', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenuItem(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeMenuItem === item.id
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className={`flex-1 flex flex-col ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-300`}>

          {/* Status Header for Summary (Visible on all tabs or just dashboard) */}
          <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-16 z-20">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {activeMenuItem === 'search-jobs' ? 'Browse Jobs' :
                  activeMenuItem === 'dashboard' ? 'My Applications' : 'My Profile'}
              </h1>
            </div>
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <span className="block font-bold text-blue-600 text-lg">{summaryData.appliedJobs}</span>
                <span className="text-gray-500">Applied</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-green-600 text-lg">{summaryData.shortlisted}</span>
                <span className="text-gray-500">Shortlisted</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-orange-600 text-lg">{summaryData.interviewsScheduled}</span>
                <span className="text-gray-500">Interviews</span>
              </div>
            </div>
          </div>

          <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">

            {/* SEARCH JOBS VIEW - Improved with Collapsible Filters */}
            {activeMenuItem === 'search-jobs' && (
              <div className="space-y-6">
                {/* Top Search Bar with Filter Toggle */}
                <div className="bg-blue-600 p-4 rounded-xl shadow-lg flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Type here to search jobs..."
                    className="flex-1 bg-white rounded-lg px-4 py-3 text-gray-800 focus:outline-none"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  />
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${showFilters ? 'bg-white text-blue-600' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="hidden sm:inline">Filters</span>
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </button>
                </div>

                {/* Collapsible Filter Panel */}
                {showFilters && (
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 animate-slideDown">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-800 text-lg">Filter Jobs</h3>
                      <button
                        onClick={() => setFilters({ skills: [], locations: [], experience: [0, 20], searchQuery: filters.searchQuery })}
                        className="text-sm text-blue-600 font-semibold hover:underline"
                      >
                        CLEAR ALL FILTERS
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Skills Filter */}
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            Skills
                          </h4>
                          <button onClick={() => setFilters(prev => ({ ...prev, skills: [] }))} className="text-xs text-blue-500 hover:underline">CLEAR</button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50">
                          {uniqueSkills.length > 0 ? uniqueSkills.map(skill => (
                            <label key={skill} className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                              <input
                                type="checkbox"
                                className="rounded text-blue-600 focus:ring-blue-500"
                                checked={filters.skills.includes(skill)}
                                onChange={() => toggleFilter('skills', skill)}
                              />
                              <span className="text-sm text-gray-700">{skill}</span>
                            </label>
                          )) : (
                            <p className="text-sm text-gray-400 text-center py-2">No skills available</p>
                          )}
                        </div>
                      </div>

                      {/* Location Filter */}
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Preferred Cities
                          </h4>
                          <button onClick={() => setFilters(prev => ({ ...prev, locations: [] }))} className="text-xs text-blue-500 hover:underline">CLEAR</button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50">
                          {uniqueLocations.length > 0 ? uniqueLocations.map(city => (
                            <label key={city} className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                              <input
                                type="checkbox"
                                className="rounded text-blue-600 focus:ring-blue-500"
                                checked={filters.locations.includes(city)}
                                onChange={() => toggleFilter('locations', city)}
                              />
                              <span className="text-sm text-gray-700">{city}</span>
                            </label>
                          )) : (
                            <p className="text-sm text-gray-400 text-center py-2">No locations available</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Active Filters Summary */}
                    {(filters.skills.length > 0 || filters.locations.length > 0) && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h5 className="text-sm font-semibold text-gray-700 mb-3">Active Filters:</h5>
                        <div className="flex flex-wrap gap-2">
                          {filters.skills.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                              {skill}
                              <button onClick={() => toggleFilter('skills', skill)} className="hover:bg-blue-200 rounded-full p-0.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </span>
                          ))}
                          {filters.locations.map(city => (
                            <span key={city} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                              {city}
                              <button onClick={() => toggleFilter('locations', city)} className="hover:bg-green-200 rounded-full p-0.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Job List */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-800 text-xl">Checkout open job opportunities!</h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500">
                        Showing <span className="font-bold text-gray-800">{filteredJobs.length}</span> jobs
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">
                        Sorted By: <span className="font-semibold text-gray-800">Recommended</span>
                      </span>
                    </div>
                  </div>

                  {filteredJobs.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
                      <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-gray-500 text-lg font-medium mb-2">No jobs match your filters</p>
                      <p className="text-gray-400 text-sm mb-4">Try adjusting your filters to see more results</p>
                      <button
                        onClick={() => setFilters({ skills: [], locations: [], experience: [0, 20], searchQuery: '' })}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  ) : (
                    filteredJobs.map(job => (
                      <div key={job._id || job.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-start md:items-center gap-4 flex-1 w-full md:w-auto">
                          <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            {/* Placeholder Logo */}
                            <span className="text-xl font-bold text-blue-600">{(job.company || 'Co').substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{job.job_title || job.title}</h3>
                            <p className="text-gray-600 font-medium mb-2">{job.company || 'Tech Company'}</p>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                {job.experienceLevel || '0-5'} years
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                {job.locations?.[0] || job.location?.city || 'Remote'}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(job.skills || []).slice(0, 4).map((skill, i) => (
                                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">
                                  {skill}
                                </span>
                              ))}
                              {(job.skills || []).length > 4 && (
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-medium">
                                  +{(job.skills || []).length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                          <button
                            onClick={() => handleApplyClick(job)}
                            className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            Apply Now
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* MY APPLICATIONS VIEW */}
            {activeMenuItem === 'dashboard' && (
              <div className="space-y-6">
                {applications.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <h3 className="text-xl font-medium text-gray-900">No applications yet</h3>
                    <p className="text-gray-500 mt-2">Head over to Find Jobs to start applying!</p>
                    <button onClick={() => setActiveMenuItem('search-jobs')} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Find Jobs</button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {applications.map((app) => {
                      const isRejected = app.status === 'rejected';
                      const isSelected = app.status === 'selected' || app.status === 'hired';
                      const displayStatus = isRejected ? 'Rejected' : (isSelected ? 'Selected' : 'In Progress');
                      const statusColor = isRejected ? 'bg-red-100 text-red-700' : (isSelected ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700');

                      return (
                        <div key={app._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{app.job?.title || app.job?.job_title}</h3>
                            <p className="text-gray-600">{app.job?.company || 'Company'}</p>
                            <p className="text-xs text-gray-400 mt-1">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColor}`}>
                              {displayStatus}
                            </span>
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE VIEW (FUNCTIONAL) */}
            {activeMenuItem === 'profile' && profileData && (
              <div className="max-w-4xl mx-auto space-y-8">

                {/* CV / LinkedIn */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">CV Attachment & LinkedIn</h2>
                      <p className="text-gray-500 mt-1">Manage your resume and social presence.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Resume Upload */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative">
                      {profileData.resume ? (
                        <div className="space-y-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{profileData.resume.originalName || 'Resume.pdf'}</p>
                            <p className="text-xs text-gray-500">Uploaded {new Date(profileData.resume.uploadDate).toLocaleDateString()}</p>
                          </div>
                          <a href={profileData.resume.path} target="_blank" className="text-blue-600 text-sm hover:underline">View File</a>
                        </div>
                      ) : (
                        <div className="space-y-2 pointer-events-none">
                          <svg className="w-10 h-10 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                          <p className="text-sm text-gray-500">Upload new Resume</p>
                        </div>
                      )}
                      <input type="file" onChange={handleResumeUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.doc,.docx" />
                    </div>

                    {/* LinkedIn Link */}
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-700">LinkedIn Profile URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="https://linkedin.com/in/username"
                          defaultValue={profileData.linkedinProfile || ''}
                          onBlur={(e) => handleUpdateProfile({ linkedinProfile: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Portfolio */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Portfolio</h2>
                      <p className="text-gray-500 mt-1">Showcase your best work.</p>
                    </div>
                    <button onClick={() => openModal('portfolio')} className="text-blue-600 font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(profileData.portfolio || []).length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No portfolio items added yet.</p>
                    ) : (
                      (profileData.portfolio || []).map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-bold text-gray-800">{item.title}</h4>
                            <a href={item.link} target="_blank" className="text-blue-500 text-sm hover:underline">{item.link}</a>
                            {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Work Experience */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Work Experience</h2>
                    </div>
                    <button onClick={() => openModal('experience')} className="text-blue-600 font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                      + Add Experience
                    </button>
                  </div>
                  <div className="space-y-6">
                    {(profileData.workExperience || []).length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No experience added.</p>
                    ) : (
                      profileData.workExperience.map((exp, i) => (
                        <div key={i} className="border-l-2 border-blue-500 pl-4 py-1">
                          <h4 className="font-bold text-lg text-gray-800">{exp.role}</h4>
                          <p className="text-gray-800 font-medium">{exp.company}</p>
                          <p className="text-sm text-gray-500 mb-2">
                            {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600 text-sm">{exp.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Education */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Education</h2>
                    </div>
                    <button onClick={() => openModal('education')} className="text-blue-600 font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                      + Add Education
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(profileData.education || []).length === 0 ? (
                      <p className="text-gray-400 text-center py-4">It looks empty here.</p>
                    ) : (
                      profileData.education.map((edu, i) => (
                        <div key={i} className="flex justify-between items-start border-b border-gray-100 last:border-0 pb-4">
                          <div>
                            <h4 className="font-bold text-gray-800">{edu.institution}</h4>
                            <p className="text-gray-600">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</p>
                            <p className="text-sm text-gray-500">Graduated: {edu.graduationYear}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Skills</h2>
                      <p className="text-gray-500 mt-1">Add skills (comma separated).</p>
                    </div>
                    <button onClick={() => { setModalFormData({ skills: profileData.skills || [] }); setActiveModal('skills'); }} className="text-blue-600 font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                      Edit Skills
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(profileData.skills || []).map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Preferences & Expectations</h2>
                      <p className="text-gray-500 mt-1">Tell us about your expectations and preferences.</p>
                    </div>
                    <button onClick={() => openModal('preferences', profileData.preferences)} className="text-blue-600 font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors text-sm">
                      Edit
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-500">Expected Salary</p>
                        <p className="font-medium text-gray-800">{profileData.preferences?.expectedSalary?.min} - {profileData.preferences?.expectedSalary?.max} {profileData.preferences?.expectedSalary?.currency}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500">Notice Period</p>
                        <p className="font-medium text-gray-800">{profileData.preferences?.noticePeriod || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* MODALS */}
            {activeModal === 'experience' && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
                  <h3 className="text-xl font-bold mb-4">Add Experience</h3>
                  <div className="space-y-4">
                    <input className="w-full border p-2 rounded" placeholder="Job Title" value={modalFormData.role || ''} onChange={e => setModalFormData({ ...modalFormData, role: e.target.value })} />
                    <input className="w-full border p-2 rounded" placeholder="Company" value={modalFormData.company || ''} onChange={e => setModalFormData({ ...modalFormData, company: e.target.value })} />
                    <div className="flex gap-4">
                      <input type="date" className="w-1/2 border p-2 rounded" value={modalFormData.startDate || ''} onChange={e => setModalFormData({ ...modalFormData, startDate: e.target.value })} />
                      <input type="date" className="w-1/2 border p-2 rounded" value={modalFormData.endDate || ''} onChange={e => setModalFormData({ ...modalFormData, endDate: e.target.value })} />
                    </div>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={modalFormData.isCurrent || false} onChange={e => setModalFormData({ ...modalFormData, isCurrent: e.target.checked })} /> I currently work here</label>
                    <textarea className="w-full border p-2 rounded" placeholder="Description" rows={3} value={modalFormData.description || ''} onChange={e => setModalFormData({ ...modalFormData, description: e.target.value })} />
                    <div className="flex justify-end gap-3 pt-4">
                      <button onClick={closeModal} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                      <button onClick={saveExperience} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'education' && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
                  <h3 className="text-xl font-bold mb-4">Add Education</h3>
                  <div className="space-y-4">
                    <input className="w-full border p-2 rounded" placeholder="Institution / University" value={modalFormData.institution || ''} onChange={e => setModalFormData({ ...modalFormData, institution: e.target.value })} />
                    <input className="w-full border p-2 rounded" placeholder="Degree" value={modalFormData.degree || ''} onChange={e => setModalFormData({ ...modalFormData, degree: e.target.value })} />
                    <input className="w-full border p-2 rounded" placeholder="Field of Study" value={modalFormData.fieldOfStudy || ''} onChange={e => setModalFormData({ ...modalFormData, fieldOfStudy: e.target.value })} />
                    <input className="w-full border p-2 rounded" placeholder="Graduation Year" value={modalFormData.graduationYear || ''} onChange={e => setModalFormData({ ...modalFormData, graduationYear: e.target.value })} />
                    <div className="flex justify-end gap-3 pt-4">
                      <button onClick={closeModal} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                      <button onClick={saveEducation} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'portfolio' && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
                  <h3 className="text-xl font-bold mb-4">Add Portfolio Item</h3>
                  <div className="space-y-4">
                    <input className="w-full border p-2 rounded" placeholder="Project Title" value={modalFormData.title || ''} onChange={e => setModalFormData({ ...modalFormData, title: e.target.value })} />
                    <input className="w-full border p-2 rounded" placeholder="Link URL" value={modalFormData.link || ''} onChange={e => setModalFormData({ ...modalFormData, link: e.target.value })} />
                    <textarea className="w-full border p-2 rounded" placeholder="Description" rows={3} value={modalFormData.description || ''} onChange={e => setModalFormData({ ...modalFormData, description: e.target.value })} />
                    <div className="flex justify-end gap-3 pt-4">
                      <button onClick={closeModal} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                      <button onClick={savePortfolio} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'skills' && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
                  <h3 className="text-xl font-bold mb-4">Manage Skills</h3>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">Enter skills separated by commas.</p>
                    <textarea
                      className="w-full border p-2 rounded"
                      rows={4}
                      defaultValue={(modalFormData.skills || []).join(', ')}
                      onChange={e => setModalFormData({ ...modalFormData, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    />
                    <div className="flex justify-end gap-3 pt-4">
                      <button onClick={closeModal} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                      <button onClick={saveSkills} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'preferences' && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
                  <h3 className="text-xl font-bold mb-4">Edit Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Expected Salary (USD)</label>
                      <div className="flex gap-4">
                        <input
                          type="number"
                          className="w-1/2 border p-2 rounded"
                          placeholder="Min"
                          value={modalFormData.expectedSalary?.min || ''}
                          onChange={e => setModalFormData({ ...modalFormData, expectedSalary: { ...modalFormData.expectedSalary, min: e.target.value } })}
                        />
                        <input
                          type="number"
                          className="w-1/2 border p-2 rounded"
                          placeholder="Max"
                          value={modalFormData.expectedSalary?.max || ''}
                          onChange={e => setModalFormData({ ...modalFormData, expectedSalary: { ...modalFormData.expectedSalary, max: e.target.value } })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Notice Period</label>
                      <select
                        className="w-full border p-2 rounded"
                        value={modalFormData.noticePeriod || ''}
                        onChange={e => setModalFormData({ ...modalFormData, noticePeriod: e.target.value })}
                      >
                        <option value="">Select Notice Period</option>
                        <option value="Immediate">Immediate</option>
                        <option value="15 Days">15 Days</option>
                        <option value="30 Days">30 Days</option>
                        <option value="60 Days">60 Days</option>
                        <option value="90+ Days">90+ Days</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <button onClick={closeModal} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                      <button onClick={savePreferences} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">
                {applyStep === 1 ? 'Complete Your Profile' : `Apply for ${selectedJob?.job_title || 'Job'}`}
              </h3>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {applyStep === 1 ? (
                <div className="space-y-6">
                  <p className="text-gray-600">To ensure the best match, please complete the following sections before applying.</p>

                  {/* Checklist */}
                  <div className="space-y-4">
                    {/* Experience Check */}
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                      <div className="flex items-center gap-3">
                        {(profileData?.workExperience?.length > 0) ? (
                          <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                        ) : (
                          <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">Work Experience</p>
                          <p className="text-xs text-gray-500">{(profileData?.workExperience?.length || 0)} items added</p>
                        </div>
                      </div>
                      <button onClick={() => openModal('experience')} className="text-sm text-blue-600 font-semibold hover:underline">
                        {profileData?.workExperience?.length > 0 ? 'Edit' : 'Add'}
                      </button>
                    </div>

                    {/* Education Check */}
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                      <div className="flex items-center gap-3">
                        {(profileData?.education?.length > 0) ? (
                          <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                        ) : (
                          <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">Education</p>
                          <p className="text-xs text-gray-500">{(profileData?.education?.length || 0)} items added</p>
                        </div>
                      </div>
                      <button onClick={() => openModal('education')} className="text-sm text-blue-600 font-semibold hover:underline">
                        {profileData?.education?.length > 0 ? 'Edit' : 'Add'}
                      </button>
                    </div>

                    {/* Skills Check */}
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                      <div className="flex items-center gap-3">
                        {(profileData?.skills?.length > 0) ? (
                          <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                        ) : (
                          <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">Skills</p>
                          <p className="text-xs text-gray-500">{(profileData?.skills?.length || 0)} skills added</p>
                        </div>
                      </div>
                      <button onClick={() => { setModalFormData({ skills: profileData?.skills || [] }); setActiveModal('skills'); }} className="text-sm text-blue-600 font-semibold hover:underline">
                        {profileData?.skills?.length > 0 ? 'Edit' : 'Add'}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setApplyStep(2)}
                    disabled={!profileData?.workExperience?.length || !profileData?.education?.length || !profileData?.skills?.length}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                  >
                    Next Step
                  </button>
                </div>
              ) : (
                <form onSubmit={submitApplication} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                    {profileData?.resume && (
                      <div className="mb-2 text-sm text-green-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Current Resume: {profileData.resume.originalName}
                      </div>
                    )}
                    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    <p className="text-xs text-gray-400 mt-1">Upload to replace existing resume (Optional if already uploaded)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                    <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={4} className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Explain why you're a good fit..." />
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setApplyStep(1)} className="px-6 py-3 border border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50">Back</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">{isSubmitting ? 'Sending...' : 'Submit Application'}</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

