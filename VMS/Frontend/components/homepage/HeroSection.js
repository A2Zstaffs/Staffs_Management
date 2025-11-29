'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin } from 'lucide-react';

export default function HeroSection() {
  const [searchData, setSearchData] = useState({
    jobTitle: '',
    location: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchData);
    // Implement search functionality
  };

  return (
<<<<<<< Updated upstream
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-sky-50">
      {/* Soft background image layer (optional) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url(/image/homepage.png)",
          backgroundSize: "cover",
          backgroundPosition: "center"
=======
    <section className="relative min-h-screen overflow-hidden isolate">
      {/* Modern Subtle Background - Mesh Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white" />
      
      {/* Subtle Radial Gradient Overlay */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%)',
>>>>>>> Stashed changes
        }}
      />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-sky-200/40 blur-3xl" />

<<<<<<< Updated upstream
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 pb-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              <span className="block">Find Your Dream Job.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Hire the Best Talent.
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600">
              Join thousands of job seekers and recruiters on <span className="font-semibold text-blue-700">VMS Recruit</span> — the platform that connects talent with opportunity.
            </p>
          </div>

          <form onSubmit={handleSearch} className="mt-8 sm:mt-10 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 bg-white/90 border border-gray-200 shadow-md rounded-2xl p-3 sm:p-3.5">
              <input
                type="text"
                placeholder="Job title or keyword"
                value={searchData.jobTitle}
                onChange={(e) => setSearchData({ ...searchData, jobTitle: e.target.value })}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <input
                type="text"
                placeholder="Location"
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-colors"
=======
      {/* Content */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-16">
          {/* Typography Section */}
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              <span className="block">
                Find Your Dream Job.
              </span>
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                Hire the Best Talent.
              </span>
            </h1>
            <p className="mt-6 sm:mt-8 text-lg sm:text-xl lg:text-2xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
              Join thousands of job seekers and recruiters on <span className="font-semibold text-blue-700">A2Z STAFFS</span> — the platform that connects talent with opportunity.
            </p>
          </div>

          {/* Floating Search Bar - Centerpiece */}
          <form onSubmit={handleSearch} className="mt-10 sm:mt-12 lg:mt-16 max-w-4xl mx-auto">
            <div 
              className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl p-2 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:shadow-[0_25px_30px_-5px_rgba(0,0,0,0.12),0_10px_10px_-5px_rgba(0,0,0,0.06)]"
            >
              {/* Job Title Input with Icon */}
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  value={searchData.jobTitle}
                  onChange={(e) => setSearchData({ ...searchData, jobTitle: e.target.value })}
                  className="w-full rounded-xl border-0 pl-12 pr-4 py-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 transition-all duration-200 focus:bg-white"
                />
              </div>

              {/* Location Input with Icon */}
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  value={searchData.location}
                  onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                  className="w-full rounded-xl border-0 pl-12 pr-4 py-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 transition-all duration-200 focus:bg-white"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
>>>>>>> Stashed changes
              >
                Search
              </button>
            </div>
          </form>

<<<<<<< Updated upstream
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center items-stretch">
            {/* Job Seekers - Lissnify style box */}
            <div className="group cursor-pointer h-full">
              <div className="relative w-full max-w-[400px] md:h-[320px] flex flex-col items-center text-center p-10 rounded-[30px] border border-white/40 bg-gradient-to-b from-blue-50 to-blue-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out will-change-transform group-hover:scale-[1.03] group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-blue-600 shadow-sm">
=======
          {/* Floating Cards Section */}
          <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Job Seeker Card */}
            <Link href="/candidate/explore-jobs" className="group">
              <div 
                className="relative w-full h-full flex flex-col items-center text-center p-10 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-blue-500/50 group-hover:shadow-lg"
              >
                {/* Icon with Background Circle */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110">
>>>>>>> Stashed changes
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
<<<<<<< Updated upstream
                <h3 className="mt-5 text-[28px] md:text-[32px] font-bold text-gray-800">For Job Seekers</h3>
                <p className="mt-3 text-[16px] md:text-[18px] leading-relaxed text-gray-600">
                  Connect with top companies, explore opportunities, and find a job you'll love.
                </p>
                <div className="mt-5">
                  <Link href="/candidate/explore-jobs" className="text-blue-600 font-semibold hover:underline">
                    Browse Jobs →
                  </Link>
=======
                <h3 className="mt-6 text-2xl sm:text-3xl font-bold text-slate-900">For Job Seekers</h3>
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
                  Connect with top companies, explore opportunities, and find a job you'll love.
                </p>
                <div className="mt-6">
                  <span className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-200 inline-flex items-center">
                    Browse Jobs
                    <svg className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
>>>>>>> Stashed changes
                </div>
              </div>
            </Link>

<<<<<<< Updated upstream
            {/* Recruiters - Lissnify style box */}
            <div className="group cursor-pointer h-full">
              <div className="relative w-full max-w-[400px] md:h-[320px] flex flex-col items-center text-center p-10 rounded-[30px] border border-white/40 bg-gradient-to-b from-blue-50 to-blue-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out will-change-transform group-hover:scale-[1.03] group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-indigo-600 shadow-sm">
=======
            {/* Recruiter Card */}
            <Link href="/signup/recruiter" className="group">
              <div 
                className="relative w-full h-full flex flex-col items-center text-center p-10 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-blue-500/50 group-hover:shadow-lg"
              >
                {/* Icon with Background Circle */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110">
>>>>>>> Stashed changes
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
<<<<<<< Updated upstream
                <h3 className="mt-5 text-[28px] md:text-[32px] font-bold text-gray-800">For Recruiters</h3>
                <p className="mt-3 text-[16px] md:text-[18px] leading-relaxed text-gray-600">
                  Access a diverse talent pool and find the perfect candidate to grow your team.
                </p>
                <div className="mt-5">
                  <Link href="/signup/recruiter" className="text-blue-600 font-semibold hover:underline">
                    Post a Job →
                  </Link>
=======
                <h3 className="mt-6 text-2xl sm:text-3xl font-bold text-slate-900">For Recruiters</h3>
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
                  Access a diverse talent pool and find the perfect candidate to grow your team.
                </p>
                <div className="mt-6">
                  <span className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-200 inline-flex items-center">
                    Post a Job
                    <svg className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
>>>>>>> Stashed changes
                </div>
              </div>
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup/user"
<<<<<<< Updated upstream
              className="w-full sm:w-auto text-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-transform hover:scale-[1.03]"
=======
              className="w-full sm:w-auto text-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
>>>>>>> Stashed changes
            >
              Join as a Job Seeker
            </Link>
            <Link
              href="/signup/recruiter"
<<<<<<< Updated upstream
              className="w-full sm:w-auto text-center rounded-full bg-white px-8 py-3 font-semibold text-blue-700 border border-blue-200 shadow-md hover:bg-blue-50 transition-transform hover:scale-[1.03]"
=======
              className="w-full sm:w-auto text-center rounded-full bg-white px-8 py-4 font-semibold text-blue-700 border-2 border-blue-200 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98]"
>>>>>>> Stashed changes
            >
              Join as a Recruiter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
