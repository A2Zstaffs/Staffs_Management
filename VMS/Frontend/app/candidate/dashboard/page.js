'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { authAPI, dashboardAPI } from '@/lib/api';
import {
  Search,
  FileText,
  User,
  Briefcase,
  Bell,
  Filter,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Plus,
  Check,
  Award,
  FolderOpen,
  LogOut
} from 'lucide-react';

// Import new components
import CandidateStats from '@/components/candidate/CandidateStats';
import JobSearchCard from '@/components/candidate/JobSearchCard';
import ApplicationStatus from '@/components/candidate/ApplicationStatus';
import ProfileProgress from '@/components/candidate/ProfileProgress';

export default function CandidateDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('find-jobs');

  // Dashboard data state
  const [summaryData, setSummaryData] = useState({
    appliedJobs: 0,
    shortlisted: 0,
    interviewsScheduled: 0,
    offers: 0
  });
  const [applications, setApplications] = useState([]);
  const [searchJobs, setSearchJobs] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(70);
  const [profileData, setProfileData] = useState(null);

  // Edit Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    fullName: '',
    phone: '',
    skills: [],
    newSkill: '',
    experience: { company: '', position: '', duration: '', description: '' },
    project: { name: '', description: '', technologies: '' }
  });
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    skills: [],
    locations: [],
    experience: ''
  });

  // Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyStep, setApplyStep] = useState(1);

  // Application Profile Details (if profile incomplete)
  const [applicationSkills, setApplicationSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [applicationExperience, setApplicationExperience] = useState({
    company: '',
    position: '',
    duration: '',
    description: ''
  });
  const [applicationProject, setApplicationProject] = useState({
    name: '',
    description: '',
    technologies: ''
  });


  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = typeof window !== 'undefined'
        ? (sessionStorage.getItem('authToken') || localStorage.getItem('authToken'))
        : null;
      const userRole = typeof window !== 'undefined'
        ? (sessionStorage.getItem('userRole') || localStorage.getItem('userRole'))
        : null;

      if (!token) {
        router.push('/login');
        return;
      }

      if (userRole && userRole !== 'candidate') {
        router.push('/dashboard');
        return;
      }

      if ((isAuthenticated && user?.role === 'candidate') || (token && userRole === 'candidate')) {
        await fetchDashboardData();
        await fetchProfile();
        setIsLoading(false);
      } else {
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

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    try {
      const response = await dashboardAPI.getCandidateDashboard();
      if (response.success && response.data) {
        setSummaryData({
          appliedJobs: response.data.appliedJobs || response.data.appliedCount || 0,
          shortlisted: response.data.shortlisted || response.data.shortlistedCount || 0,
          interviewsScheduled: response.data.interviewsScheduled || response.data.interviewsCount || 0,
          offers: response.data.offers || response.data.offersCount || 0
        });

        if (response.data.availableJobs) setSearchJobs(response.data.availableJobs);
        if (response.data.applications) setApplications(response.data.applications);
        if (response.data.profileCompletion !== undefined) {
          setProfileCompletion(response.data.profileCompletion);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Fetch profile
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

  // Check if profile needs completion for application
  // Only show profile completion step if profile has NO skills AND NO experience
  const needsProfileCompletion = () => {
    const hasSkills = (profileData?.skills?.length || 0) > 0;
    const hasExperience = (profileData?.workExperience?.length || 0) > 0;
    // Only ask for profile details if BOTH are missing
    return !hasSkills && !hasExperience;
  };

  const getTotalSteps = () => needsProfileCompletion() ? 3 : 2;

  // Open edit profile modal
  const openEditProfile = () => {
    setEditProfileData({
      fullName: profileData?.fullName || '',
      phone: profileData?.phone || '',
      skills: [...(profileData?.skills || [])],
      newSkill: '',
      experience: profileData?.workExperience?.[0] || { company: '', position: '', duration: '', description: '' },
      project: profileData?.projects?.[0] || { name: '', description: '', technologies: '' }
    });
    setIsEditProfileOpen(true);
  };

  // Add skill in edit profile
  const addEditSkill = () => {
    if (editProfileData.newSkill.trim() && !editProfileData.skills.includes(editProfileData.newSkill.trim())) {
      setEditProfileData({
        ...editProfileData,
        skills: [...editProfileData.skills, editProfileData.newSkill.trim()],
        newSkill: ''
      });
    }
  };

  // Remove skill in edit profile
  const removeEditSkill = (skill) => {
    setEditProfileData({
      ...editProfileData,
      skills: editProfileData.skills.filter(s => s !== skill)
    });
  };

  // Save profile (would call API in real implementation)
  const saveProfile = async () => {
    try {
      // For now, update local state - you can add API call here
      setProfileData({
        ...profileData,
        fullName: editProfileData.fullName,
        phone: editProfileData.phone,
        skills: editProfileData.skills,
        workExperience: editProfileData.experience.company ? [editProfileData.experience] : (profileData?.workExperience || []),
        projects: editProfileData.project.name ? [editProfileData.project] : (profileData?.projects || [])
      });
      setIsEditProfileOpen(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile: ' + error.message);
    }
  };

  // Handle apply
  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setApplyStep(1);
    // Reset application profile fields
    setApplicationSkills([]);
    setSkillInput('');
    setApplicationExperience({ company: '', position: '', duration: '', description: '' });
    setApplicationProject({ name: '', description: '', technologies: '' });
    setResumeFile(null);
    setCoverLetter('');
    setIsApplyModalOpen(true);
  };

  // Add skill to application
  const addSkill = () => {
    if (skillInput.trim() && !applicationSkills.includes(skillInput.trim())) {
      setApplicationSkills([...applicationSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  // Remove skill from application
  const removeSkill = (skillToRemove) => {
    setApplicationSkills(applicationSkills.filter(s => s !== skillToRemove));
  };

  // Submit application
  const submitApplication = async (e) => {
    e.preventDefault();
    if (!resumeFile && !profileData?.resume) {
      alert('Please upload your resume to proceed.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    if (resumeFile) formData.append('resume', resumeFile);
    formData.append('coverLetter', coverLetter);

    // Include profile details if provided
    if (applicationSkills.length > 0) {
      formData.append('skills', JSON.stringify(applicationSkills));
    }
    if (applicationExperience.company) {
      formData.append('experience', JSON.stringify(applicationExperience));
    }
    if (applicationProject.name) {
      formData.append('project', JSON.stringify(applicationProject));
    }

    try {
      const response = await dashboardAPI.applyToJob(selectedJob._id || selectedJob.id, formData);
      if (response.success) {
        alert('Application submitted successfully!');
        setIsApplyModalOpen(false);
        setResumeFile(null);
        setCoverLetter('');
        setApplyStep(1);
        setApplicationSkills([]);
        setApplicationExperience({ company: '', position: '', duration: '', description: '' });
        setApplicationProject({ name: '', description: '', technologies: '' });
        await fetchDashboardData();
      } else {
        alert(response.message || 'Failed to apply');
      }
    } catch (error) {
      alert('Error applying: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Filter jobs
  const filteredJobs = searchJobs.filter(job => {
    const matchesSearch = !searchQuery ||
      (job.job_title || job.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.company || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkills = filters.skills.length === 0 ||
      filters.skills.some(skill => (job.skills || []).includes(skill));

    const matchesLocation = filters.locations.length === 0 ||
      filters.locations.includes(job.locations?.[0] || job.location?.city || 'Remote');

    return matchesSearch && matchesSkills && matchesLocation;
  });

  // Get unique values for filters
  const uniqueSkills = [...new Set(searchJobs.flatMap(job => job.skills || []))].slice(0, 10);
  const uniqueLocations = [...new Set(searchJobs.map(job => job.locations?.[0] || job.location?.city || 'Remote'))];

  // Tab configuration
  const tabs = [
    { id: 'find-jobs', label: 'Find Jobs', icon: Search },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto" />
            <Sparkles className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Top Navigation Bar */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">A2Z<span className="text-blue-600">Staffs</span></span>
            </div>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {(user?.fullName || profileData?.fullName || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">{user?.fullName || profileData?.fullName || 'Candidate'}</p>
                  <p className="text-xs text-slate-500">Candidate</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden flex items-center gap-1 bg-slate-100 p-1 rounded-xl mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, <span className="text-blue-600">{user?.fullName?.split(' ')[0] || 'there'}</span>! 👋
              </h1>
              <p className="text-slate-500 mt-2">
                {activeTab === 'find-jobs' && 'Discover your next career opportunity'}
                {activeTab === 'applications' && 'Track your job applications'}
                {activeTab === 'profile' && 'Manage your professional profile'}
              </p>
            </div>
            {activeTab === 'find-jobs' && (
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-blue-50 px-4 py-2 rounded-lg">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span><strong>{searchJobs.length}</strong> jobs available</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards - Always visible */}
        <div className="mb-8">
          <CandidateStats stats={summaryData} />
        </div>

        {/* Tab Content */}
        {activeTab === 'find-jobs' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-xl shadow-blue-500/20">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search jobs by title, company, or keyword..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 focus:ring-2 focus:ring-white/50 text-slate-800"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all ${showFilters
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {(filters.skills.length > 0 || filters.locations.length > 0) && (
                    <span className="bg-blue-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                      {filters.skills.length + filters.locations.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="mt-4 bg-white rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800">Filter Results</h3>
                    <button
                      onClick={() => setFilters({ skills: [], locations: [], experience: '' })}
                      className="text-sm text-blue-600 font-medium hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skills */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueSkills.map(skill => (
                          <button
                            key={skill}
                            onClick={() => {
                              setFilters(prev => ({
                                ...prev,
                                skills: prev.skills.includes(skill)
                                  ? prev.skills.filter(s => s !== skill)
                                  : [...prev.skills, skill]
                              }));
                            }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filters.skills.includes(skill)
                              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                              : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:border-slate-200'
                              }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Locations */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Location</label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueLocations.map(loc => (
                          <button
                            key={loc}
                            onClick={() => {
                              setFilters(prev => ({
                                ...prev,
                                locations: prev.locations.includes(loc)
                                  ? prev.locations.filter(l => l !== loc)
                                  : [...prev.locations, loc]
                              }));
                            }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filters.locations.includes(loc)
                              ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:border-slate-200'
                              }`}
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Job Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {searchQuery || filters.skills.length || filters.locations.length
                    ? `${filteredJobs.length} jobs found`
                    : 'Recommended for you'}
                </h2>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No jobs found</h3>
                  <p className="text-slate-500 mb-4">Try adjusting your search or filters</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({ skills: [], locations: [], experience: '' });
                    }}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map(job => (
                    <JobSearchCard
                      key={job._id || job.id}
                      job={job}
                      onApply={handleApplyClick}
                      onSave={() => alert('Job saved!')}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Your Applications ({applications.length})
              </h2>
              <ApplicationStatus
                applications={applications}
                onViewDetails={(app) => console.log('View:', app)}
              />
            </div>
            <div>
              <ProfileProgress
                profileData={profileData}
                completion={profileCompletion}
                onEditSection={(section) => setActiveTab('profile')}
              />
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header Card */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
                <div className="px-6 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {(profileData?.fullName || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 pb-2">
                      <h2 className="text-2xl font-bold text-slate-900">
                        {profileData?.fullName || 'Your Name'}
                      </h2>
                      <p className="text-slate-500">{profileData?.email}</p>
                    </div>
                    <button
                      onClick={openEditProfile}
                      className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Skills</h3>
                  <button className="text-sm text-blue-600 font-medium">+ Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(profileData?.skills || []).length > 0 ? (
                    profileData.skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">No skills added yet</p>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Work Experience</h3>
                  <button className="text-sm text-blue-600 font-medium">+ Add</button>
                </div>
                {(profileData?.workExperience || []).length > 0 ? (
                  <div className="space-y-4">
                    {profileData.workExperience.map((exp, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                          <Briefcase className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{exp.position || exp.title}</h4>
                          <p className="text-slate-600 text-sm">{exp.company}</p>
                          <p className="text-slate-400 text-xs mt-1">{exp.duration || `${exp.startDate} - ${exp.endDate || 'Present'}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No work experience added yet</p>
                )}
              </div>
            </div>

            <div>
              <ProfileProgress
                profileData={profileData}
                completion={profileCompletion}
                onEditSection={(section) => console.log('Edit:', section)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Apply Modal - Multi-Step */}
      {isApplyModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Apply to Job</h2>
                  <p className="text-slate-500 mt-1">{selectedJob.job_title || selectedJob.title}</p>
                </div>
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center gap-2 mt-4">
                {[...Array(getTotalSteps())].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${applyStep > i + 1
                      ? 'bg-emerald-500 text-white'
                      : applyStep === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                      }`}>
                      {applyStep > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    {i < getTotalSteps() - 1 && (
                      <div className={`w-8 h-0.5 ${applyStep > i + 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Step 1: Profile Details (Only if profile incomplete) */}
              {applyStep === 1 && needsProfileCompletion() && (
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-amber-800 text-sm font-medium">
                      Complete your profile details to strengthen your application
                    </p>
                  </div>

                  {/* Skills Section */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                      <Award className="w-4 h-4 text-blue-500" />
                      Your Skills
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        placeholder="Add a skill (e.g., JavaScript, React)"
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {applicationSkills.map((skill, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      {applicationSkills.length === 0 && (
                        <span className="text-slate-400 text-sm">No skills added yet</span>
                      )}
                    </div>
                  </div>

                  {/* Experience Section */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                      <Briefcase className="w-4 h-4 text-purple-500" />
                      Experience (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={applicationExperience.company}
                        onChange={(e) => setApplicationExperience({ ...applicationExperience, company: e.target.value })}
                        placeholder="Company name"
                        className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={applicationExperience.position}
                        onChange={(e) => setApplicationExperience({ ...applicationExperience, position: e.target.value })}
                        placeholder="Position / Role"
                        className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={applicationExperience.duration}
                        onChange={(e) => setApplicationExperience({ ...applicationExperience, duration: e.target.value })}
                        placeholder="Duration (e.g., 2 years)"
                        className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={applicationExperience.description}
                        onChange={(e) => setApplicationExperience({ ...applicationExperience, description: e.target.value })}
                        placeholder="Brief description"
                        className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Project Section */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                      <FolderOpen className="w-4 h-4 text-emerald-500" />
                      Project (Optional)
                    </label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={applicationProject.name}
                        onChange={(e) => setApplicationProject({ ...applicationProject, name: e.target.value })}
                        placeholder="Project name"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={applicationProject.description}
                        onChange={(e) => setApplicationProject({ ...applicationProject, description: e.target.value })}
                        placeholder="Brief description of what you built..."
                        rows={2}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <input
                        type="text"
                        value={applicationProject.technologies}
                        onChange={(e) => setApplicationProject({ ...applicationProject, technologies: e.target.value })}
                        placeholder="Technologies used (e.g., React, Node.js, MongoDB)"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setApplyStep(2)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 2 (or Step 1 if profile complete): Resume & Cover Letter */}
              {((applyStep === 1 && !needsProfileCompletion()) || (applyStep === 2 && needsProfileCompletion())) && (
                <div className="space-y-6">
                  {/* Resume Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Resume {profileData?.resume && <span className="text-emerald-600">(Current resume on file)</span>}
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">
                          {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">PDF, DOC up to 5MB</p>
                      </label>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Tell them why you're a great fit for this role..."
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    {needsProfileCompletion() && (
                      <button
                        type="button"
                        onClick={() => setApplyStep(1)}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setApplyStep(needsProfileCompletion() ? 3 : 2)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Review & Submit
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Final Step: Review & Submit */}
              {applyStep === getTotalSteps() && (
                <form onSubmit={submitApplication} className="space-y-6">
                  <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                    <h3 className="font-semibold text-slate-900">Application Summary</h3>

                    {/* Skills Summary */}
                    {(applicationSkills.length > 0 || (profileData?.skills?.length || 0) > 0) && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {[...(profileData?.skills || []), ...applicationSkills].slice(0, 8).map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience Summary */}
                    {(applicationExperience.company || (profileData?.workExperience?.length || 0) > 0) && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Experience</p>
                        <p className="text-sm text-slate-700">
                          {applicationExperience.position || profileData?.workExperience?.[0]?.position || 'N/A'} at {applicationExperience.company || profileData?.workExperience?.[0]?.company || 'N/A'}
                        </p>
                      </div>
                    )}

                    {/* Resume Summary */}
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Resume</p>
                      <p className="text-sm text-slate-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        {resumeFile ? resumeFile.name : profileData?.resume ? 'Using profile resume' : 'No resume uploaded'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setApplyStep(applyStep - 1)}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editProfileData.fullName}
                    onChange={(e) => setEditProfileData({ ...editProfileData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={editProfileData.phone}
                    onChange={(e) => setEditProfileData({ ...editProfileData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                  <Award className="w-4 h-4 text-blue-500" />
                  Skills
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={editProfileData.newSkill}
                    onChange={(e) => setEditProfileData({ ...editProfileData, newSkill: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEditSkill())}
                    placeholder="Add a skill"
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addEditSkill}
                    className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editProfileData.skills.map((skill, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                      {skill}
                      <button type="button" onClick={() => removeEditSkill(skill)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {editProfileData.skills.length === 0 && (
                    <span className="text-slate-400 text-sm">No skills added</span>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  Work Experience
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editProfileData.experience.company}
                    onChange={(e) => setEditProfileData({ ...editProfileData, experience: { ...editProfileData.experience, company: e.target.value } })}
                    placeholder="Company name"
                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={editProfileData.experience.position}
                    onChange={(e) => setEditProfileData({ ...editProfileData, experience: { ...editProfileData.experience, position: e.target.value } })}
                    placeholder="Position / Role"
                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={editProfileData.experience.duration}
                    onChange={(e) => setEditProfileData({ ...editProfileData, experience: { ...editProfileData.experience, duration: e.target.value } })}
                    placeholder="Duration (e.g., 2 years)"
                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={editProfileData.experience.description}
                    onChange={(e) => setEditProfileData({ ...editProfileData, experience: { ...editProfileData.experience, description: e.target.value } })}
                    placeholder="Brief description"
                    className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Project */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                  <FolderOpen className="w-4 h-4 text-emerald-500" />
                  Project
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editProfileData.project.name}
                    onChange={(e) => setEditProfileData({ ...editProfileData, project: { ...editProfileData.project, name: e.target.value } })}
                    placeholder="Project name"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={editProfileData.project.description}
                    onChange={(e) => setEditProfileData({ ...editProfileData, project: { ...editProfileData.project, description: e.target.value } })}
                    placeholder="Brief description"
                    rows={2}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <input
                    type="text"
                    value={editProfileData.project.technologies}
                    onChange={(e) => setEditProfileData({ ...editProfileData, project: { ...editProfileData.project, technologies: e.target.value } })}
                    placeholder="Technologies used"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveProfile}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Check className="w-4 h-4" />
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
