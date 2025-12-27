'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CandidateNavbar from '@/components/candidate/CandidateNavbar';
import Header from '@/components/common/Header';
import { dashboardAPI, jobsAPI } from '@/lib/api';

export default function ExploreJobsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Apply Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authentication check and data fetch
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const isAuth = !!token;
      setIsAuthenticated(isAuth);

      await fetchJobs(isAuth);
    };
    checkAuthAndFetch();
  }, []);

  const fetchJobs = async (isAuth) => {
    try {
      setIsLoading(true);
      let jobList = [];

      if (isAuth) {
        // Authenticated: Get relevant jobs (matched)
        const response = await dashboardAPI.getCandidateDashboard();
        if (response.success && response.data) {
          jobList = response.data.availableJobs || [];
        }
      } else {
        // Public: Get all active jobs
        const response = await jobsAPI.getAllJobs();
        if (response.success && response.data) {
          jobList = response.data || [];
        }
      }

      setJobs(jobList);
      setFilteredJobs(jobList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyClick = (job) => {
    if (!isAuthenticated) {
      // Redirect guest to login
      router.push('/login');
      return;
    }
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert('Please upload your resume');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('coverLetter', coverLetter);

    try {
      const response = await dashboardAPI.applyToJob(selectedJob._id, formData);
      if (response.success) {
        alert('Application submitted successfully!');
        setIsApplyModalOpen(false);
        setResumeFile(null);
        setCoverLetter('');
        // Refresh jobs? Or just mark as applied locally if we tracked it
      } else {
        alert(response.message || 'Failed to apply');
      }
    } catch (error) {
      alert('Error applying: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
        <div className="absolute right-0 top-0 -z-10 h-[310px] w-[310px] rounded-full bg-purple-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        {isAuthenticated ? <CandidateNavbar /> : <Header />}

        <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Curated Opportunities
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Exclusive roles from top clients, tailored for your skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">No jobs found</h3>
                  <p className="text-slate-500">We couldn't find any jobs matching your criteria at the moment.</p>
                </div>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job._id} className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1" title={job.job_title || job.title}>
                          {job.job_title || job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium text-xs">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {job.locations?.[0] || 'Remote'}
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500 text-xs">Full-time</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Package</p>
                        <p className="text-blue-600 font-bold text-lg">
                          {job.salary_min && job.salary_max
                            ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                            : 'Competitive Salary'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Required Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {(job.skills || []).slice(0, 4).map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-slate-200 text-slate-600 shadow-sm">
                              {skill}
                            </span>
                          ))}
                          {(job.skills?.length > 4) && (
                            <span className="px-2 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-500">
                              +{job.skills.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyClick(job)}
                      className="w-full py-3 px-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-slate-900/10 hover:shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isAuthenticated ? 'Apply Now' : 'Login to Apply'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Apply Modal - Only for authenticated users */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Apply for Position</h3>
                <p className="text-sm text-slate-500">{selectedJob?.job_title || selectedJob?.title}</p>
              </div>
              <button onClick={() => setIsApplyModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={submitApplication} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Resume (PDF/DOC)</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-xl file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        cursor-pointer border border-slate-200 rounded-xl bg-slate-50/50"
                    required
                  />
                </div>
                {resumeFile && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 inline-block">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {resumeFile.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Letter (Optional)</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none shadow-sm"
                  placeholder="Tell us why you're a great fit..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Submitting...
                    </span>
                  ) : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
