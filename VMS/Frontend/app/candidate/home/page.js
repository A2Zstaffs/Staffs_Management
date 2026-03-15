'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CandidateNavbar from '@/components/candidate/CandidateNavbar';
import { authAPI, dashboardAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CandidateHomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authentication check and redirect logic
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      // Check for JWT token in localStorage
      const token = typeof window !== 'undefined' ? (sessionStorage.getItem('authToken') || localStorage.getItem('authToken')) : null;
      const userRole = typeof window !== 'undefined' ? (sessionStorage.getItem('userRole') || localStorage.getItem('userRole')) : null;

      // If no token, redirect to login
      if (!token) {
        router.push('/login');
        return;
      }

      // If role is not candidate, redirect to appropriate dashboard
      if (userRole && userRole !== 'candidate') {
        if (userRole === 'recruiter') {
          router.push('/dashboard');
        } else {
          router.push('/dashboard');
        }
        return;
      }

      if (userRole === 'candidate') {
        router.push('/candidate/dashboard');
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Loading state
  if (isLoading) {
    return (
      <LoadingSpinner variant="logo" size="lg" message="Loading..." fullScreen />
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Navbar */}
      <CandidateNavbar />

      {/* Main Content with padding for fixed navbar */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Find Your Dream Job
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Discover thousands of opportunities from top companies. Your next career move starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/candidate/explore-jobs"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
                >
                  Explore Jobs
                </a>
                <button
                  onClick={() => {
                    // Check if user is authenticated before redirecting
                    const token = typeof window !== 'undefined' ? (sessionStorage.getItem('authToken') || localStorage.getItem('authToken')) : null;
                    if (token) {
                      router.push('/candidate/dashboard');
                    } else {
                      router.push('/login');
                    }
                  }}
                  className="bg-white hover:bg-gray-50 text-blue-500 border-2 border-blue-500 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
                >
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Job Categories Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Technology', icon: '💻', count: '1,234' },
                { name: 'Finance', icon: '💰', count: '856' },
                { name: 'Healthcare', icon: '🏥', count: '642' },
                { name: 'Education', icon: '📚', count: '423' },
                { name: 'Marketing', icon: '📢', count: '789' },
                { name: 'Engineering', icon: '⚙️', count: '1,567' },
                { name: 'Sales', icon: '📊', count: '654' },
                { name: 'Design', icon: '🎨', count: '432' },
              ].map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} jobs</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-2">10,000+</div>
                <div className="text-gray-600">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-2">5,000+</div>
                <div className="text-gray-600">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-2">50,000+</div>
                <div className="text-gray-600">Candidates</div>
              </div>
            </div>
          </div>
        </section>


      </main>
    </div>
  );
}

