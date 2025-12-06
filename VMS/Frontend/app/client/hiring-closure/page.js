'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientLayout from '@/components/client/ClientLayout';
import { getHiringDetails, markAsClosed } from '@/lib/clientApi';

function HiringClosureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get('candidateId');
  const jobId = searchParams.get('jobId');

  const [hiringData, setHiringData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (candidateId && jobId) {
      loadHiringDetails();
    } else {
      // Use dummy data if no params
      setHiringData({
        candidate: {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          experience: '5 years',
          expectedSalary: 120000,
          cvUrl: '/cvs/john-doe.pdf'
        },
        job: {
          id: '1',
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          location: 'New York',
          salaryRange: '$120k - $180k'
        },
        clientCommission: 5000
      });
      setIsLoading(false);
    }
  }, [candidateId, jobId]);

  const loadHiringDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getHiringDetails(candidateId, jobId);
      if (response.success) {
        setHiringData(response.data);
      } else {
        setError('Failed to load hiring details. Please try again.');
      }
    } catch (err) {
      console.error('Error loading hiring details:', err);
      setError(err.message || 'An error occurred while loading hiring details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsClosed = async () => {
    if (!confirm('Are you sure you want to mark this hiring as closed? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await markAsClosed(candidateId, jobId);
      if (response.success) {
        alert('Hiring marked as closed successfully!');
        router.push('/client/my-jobs');
      } else {
        alert(response.message || 'Failed to mark as closed');
      }
    } catch (error) {
      console.error('Error marking as closed:', error);
      alert(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ClientLayout>
        <div className="max-w-4xl mx-auto">
          <div className="p-12 text-center">
            <svg className="animate-spin h-12 w-12 text-primary-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading hiring details...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (error || !hiringData) {
    return (
      <ClientLayout>
        <div className="max-w-4xl mx-auto">
          <div className="p-12 text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error || 'Hiring details not found'}
            </div>
            <button
              onClick={() => router.push('/client/my-jobs')}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            >
              Back to My Jobs
            </button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  const { candidate, job, clientCommission } = hiringData;
  const recruiterCommission = clientCommission * 0.80;
  const a2zCommission = clientCommission * 0.20;

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hiring Closure</h1>
          <p className="text-gray-600">Complete the hiring process and calculate commissions</p>
        </div>

        {/* Candidate Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Candidate Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
              <p className="text-lg font-semibold text-gray-900">{candidate.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <p className="text-lg text-gray-900">{candidate.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Experience</label>
              <p className="text-lg text-gray-900">{candidate.experience}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Expected Salary</label>
              <p className="text-lg text-gray-900">
                {candidate.expectedSalary ? `$${candidate.expectedSalary.toLocaleString()}` : 'Not specified'}
              </p>
            </div>
            {candidate.cvUrl && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">CV</label>
                <a
                  href={candidate.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1A73FF] hover:text-[#0047CC] font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CV
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Job Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Job Title</label>
              <p className="text-lg font-semibold text-gray-900">{job.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Company</label>
              <p className="text-lg text-gray-900">{job.company}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
              <p className="text-lg text-gray-900">{job.location}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Salary Range</label>
              <p className="text-lg text-gray-900">{job.salaryRange}</p>
            </div>
          </div>
        </div>

        {/* Commission Calculation Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Commission Breakdown</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Commission Set by Client</span>
                <span className="text-2xl font-bold text-gray-900">${clientCommission.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Recruiter Earnings (80%)</span>
                  <span className="text-2xl font-bold text-green-700">${recruiterCommission.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">80% of client commission</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">A2Z Staffs Earnings (20%)</span>
                  <span className="text-2xl font-bold text-[#1A73FF]">${a2zCommission.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">20% of client commission</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end space-x-4">
            <button
              onClick={() => router.push('/client/my-jobs')}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleMarkAsClosed}
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#1A73FF] hover:bg-[#0047CC] disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
            >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Mark as Closed'
            )}
          </button>
        </div>
      </div>
    </ClientLayout>
  );
}

export default function HiringClosurePage() {
  return (
    <Suspense fallback={
      <ClientLayout>
        <div className="max-w-4xl mx-auto">
          <div className="p-12 text-center">
            <svg className="animate-spin h-12 w-12 text-primary-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-secondary-600">Loading...</p>
          </div>
        </div>
      </ClientLayout>
    }>
      <HiringClosureContent />
    </Suspense>
  );
}

