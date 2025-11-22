'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-sky-50">
      {/* Soft background image layer (optional) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url(/image/homepage.png)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-sky-200/40 blur-3xl" />

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
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center items-stretch">
            {/* Job Seekers - Lissnify style box */}
            <div className="group cursor-pointer h-full">
              <div className="relative w-full max-w-[400px] md:h-[320px] flex flex-col items-center text-center p-10 rounded-[30px] border border-white/40 bg-gradient-to-b from-blue-50 to-blue-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out will-change-transform group-hover:scale-[1.03] group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-blue-600 shadow-sm">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="mt-5 text-[28px] md:text-[32px] font-bold text-gray-800">For Job Seekers</h3>
                <p className="mt-3 text-[16px] md:text-[18px] leading-relaxed text-gray-600">
                  Connect with top companies, explore opportunities, and find a job you'll love.
                </p>
                <div className="mt-5">
                  <Link href="/candidate/explore-jobs" className="text-blue-600 font-semibold hover:underline">
                    Browse Jobs →
                  </Link>
                </div>
              </div>
            </div>

            {/* Recruiters - Lissnify style box */}
            <div className="group cursor-pointer h-full">
              <div className="relative w-full max-w-[400px] md:h-[320px] flex flex-col items-center text-center p-10 rounded-[30px] border border-white/40 bg-gradient-to-b from-blue-50 to-blue-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out will-change-transform group-hover:scale-[1.03] group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-indigo-600 shadow-sm">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mt-5 text-[28px] md:text-[32px] font-bold text-gray-800">For Recruiters</h3>
                <p className="mt-3 text-[16px] md:text-[18px] leading-relaxed text-gray-600">
                  Access a diverse talent pool and find the perfect candidate to grow your team.
                </p>
                <div className="mt-5">
                  <Link href="/signup/recruiter" className="text-blue-600 font-semibold hover:underline">
                    Post a Job →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/signup/user"
              className="w-full sm:w-auto text-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-transform hover:scale-[1.03]"
            >
              Join as a Job Seeker
            </Link>
            <Link
              href="/signup/recruiter"
              className="w-full sm:w-auto text-center rounded-full bg-white px-8 py-3 font-semibold text-blue-700 border border-blue-200 shadow-md hover:bg-blue-50 transition-transform hover:scale-[1.03]"
            >
              Join as a Recruiter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


