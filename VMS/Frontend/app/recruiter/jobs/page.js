'use client';

import RecruiterNavbar from '@/components/common/RecruiterNavbar';

export default function RecruiterJobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RecruiterNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Jobs</h1>
        <p className="text-gray-600">Jobs listing will appear here.</p>
      </main>
    </div>
  );
}

