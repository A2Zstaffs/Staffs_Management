'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CandidateNavbar from '@/components/candidate/CandidateNavbar';
import { dashboardAPI } from '@/lib/api';

export default function ExploreJobsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  
  // Filter states
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experienceRange, setExperienceRange] = useState([0, 10]);
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      if (userRole && userRole !== 'candidate') {
        if (userRole === 'recruiter') {
          router.push('/dashboard');
        } else {
          router.push('/dashboard');
        }
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
      await fetchJobs();
    };

    checkAuth();
  }, [router]);

  // Fetch jobs from API
  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const response = await dashboardAPI.getCandidateDashboard();
      if (response.success && response.data) {
        // Get jobs from various possible fields
        const jobList = response.data.recommendedJobs || 
                       response.data.availableJobs || 
                       response.data.jobs || 
                       [];
        setJobs(jobList);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Use mock data for development
      setJobs([]);
    } finally {
      setIsLoadingJobs(false);
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
      } else {
        alert('Failed to apply: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to apply: ' + error.message);
    }
  };

  // Filter and sort jobs
  const filteredAndSortedJobs = jobs
    .filter(job => {
      // Search query filter
      if (searchQuery && !job.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !job.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Skills filter
      if (selectedSkills.length > 0) {
        const jobSkills = job.skills || [];
        const hasMatchingSkill = selectedSkills.some(skill => 
          jobSkills.some(js => js.toLowerCase().includes(skill.toLowerCase()))
        );
        if (!hasMatchingSkill) return false;
      }
      
      // City filter
      if (selectedCity && job.location?.city !== selectedCity) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === 'salary-high') {
        return (b.salary?.max || 0) - (a.salary?.max || 0);
      } else if (sortBy === 'salary-low') {
        return (a.salary?.min || 0) - (b.salary?.min || 0);
      }
      return 0;
    });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const commonSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'Angular', 'Vue.js', 'PHP', 'Ruby', 'Go'];
  const commonCities = ['San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Seattle', 'Boston', 'Austin', 'Denver'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Navbar */}
      <CandidateNavbar />
      
      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Jobs</h1>
            <p className="text-gray-600">Find your perfect opportunity from thousands of available positions</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side: Filters */}
            <aside className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-20">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>
                
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Job title, company..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Skills Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {commonSkills.map((skill) => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(skill)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSkills([...selectedSkills, skill]);
                            } else {
                              setSelectedSkills(selectedSkills.filter(s => s !== skill));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience: {experienceRange[0]} - {experienceRange[1]} years
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={experienceRange[1]}
                    onChange={(e) => setExperienceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>

                {/* City Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Cities</option>
                    {commonCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedSkills([]);
                    setExperienceRange([0, 10]);
                    setSelectedCity('');
                    setSearchQuery('');
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </aside>

            {/* Right Side: Job Listings */}
            <div className="lg:w-3/4">
              {/* Sort Dropdown */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredAndSortedJobs.length}</span> jobs
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="salary-high">Salary: High to Low</option>
                    <option value="salary-low">Salary: Low to High</option>
                  </select>
                </div>
              </div>

              {/* Job Cards */}
              {isLoadingJobs ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : filteredAndSortedJobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No jobs found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredAndSortedJobs.map((job) => (
                    <div key={job._id || job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title || 'Job Title'}</h3>
                          <p className="text-blue-600 font-medium">{job.postedBy?.company || job.company || 'Company Name'}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-lg">
                            {(job.postedBy?.company || job.company || 'C').charAt(0)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
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

                      {job.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                      )}

                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className="text-xs text-gray-500">
                          {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently posted'}
                        </span>
                        <button
                          onClick={() => handleApplyJob(job._id || job.id)}
                          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-sm"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

