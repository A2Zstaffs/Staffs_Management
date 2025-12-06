'use client';

import { useState, useEffect } from 'react';
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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-sky-50 isolate">
      {/* 3D Background Image Layer - Scoped to Hero Section Only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.15] md:opacity-[0.18]"
        style={{
          backgroundImage: "url(/image/homepage.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: 'blur(0.5px) brightness(1.1)',
          transform: 'perspective(1000px) rotateX(2deg) scale(1.05)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      />
      {/* Depth shadow overlay for 3D effect */}
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(14, 165, 233, 0.08) 50%, rgba(99, 102, 241, 0.12) 100%)',
          boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.1), inset 0 0 200px rgba(99, 102, 241, 0.05)',
        }}
      />

      {/* Enhanced 3D Glow Effects - Scoped to Hero Section Only */}
      <div 
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl"
        style={{
          boxShadow: '0 0 100px rgba(99, 102, 241, 0.3), 0 0 200px rgba(99, 102, 241, 0.2)',
        }}
      />
      <div 
        className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-sky-200/40 blur-3xl"
        style={{
          boxShadow: '0 0 100px rgba(14, 165, 233, 0.3), 0 0 200px rgba(14, 165, 233, 0.2)',
        }}
      />
      
      {/* Additional depth layers for 3D effect - Scoped to Hero Section Only */}
      <div 
        className="pointer-events-none absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-300/20 blur-2xl opacity-60" 
        style={{
          filter: 'blur(60px)',
        }}
      />
      <div 
        className="pointer-events-none absolute bottom-1/3 left-1/3 h-80 w-80 rounded-full bg-indigo-300/20 blur-2xl opacity-60"
        style={{
          filter: 'blur(60px)',
        }}
      />

      {/* Text contrast overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 pointer-events-none z-[1]" />
      
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 pb-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]">
              <span className="block relative">
                Find Your Dream Job.
                <span 
                  className="absolute inset-0 blur-xl opacity-30"
                  style={{
                    textShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
                  }}
                  aria-hidden="true"
                >
                  Find Your Dream Job.
                </span>
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                Hire the Best Talent.
                <span 
                  className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 blur-sm opacity-50"
                  aria-hidden="true"
                  style={{
                    filter: 'blur(8px)',
                  }}
                >
                  Hire the Best Talent.
                </span>
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600 drop-shadow-[0_1px_4px_rgba(255,255,255,0.8)] font-medium">
              Join thousands of job seekers and recruiters on <span className="font-semibold text-blue-700 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">VMS Recruit</span> — the platform that connects talent with opportunity.
            </p>
          </div>

          <form onSubmit={handleSearch} className="mt-8 sm:mt-10 max-w-3xl mx-auto">
            <div 
              className="flex flex-col sm:flex-row gap-3 bg-white/95 backdrop-blur-sm border border-gray-200/80 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.5)_inset] rounded-2xl p-3 sm:p-3.5 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.6)_inset]"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.5) inset, 0 0 60px rgba(99, 102, 241, 0.1)',
              }}
            >
              <input
                type="text"
                placeholder="Job title or keyword"
                value={searchData.jobTitle}
                onChange={(e) => setSearchData({ ...searchData, jobTitle: e.target.value })}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
              />
              <input
                type="text"
                placeholder="Location"
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-[1.02]"
                style={{
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                }}
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center items-stretch">
            {/* Job Seekers - Enhanced 3D style box */}
            <div className="group cursor-pointer h-full">
              <div 
                className="relative w-full max-w-[400px] md:h-[320px] flex flex-col items-center text-center p-10 rounded-[30px] border border-white/60 bg-gradient-to-b from-blue-50/95 to-blue-100/95 backdrop-blur-sm transition-all duration-300 ease-out will-change-transform group-hover:scale-[1.03] group-hover:-translate-y-1"
                style={{
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5) inset, 0 0 60px rgba(59, 130, 246, 0.1)',
                  transform: 'perspective(1000px) rotateX(0deg)',
                  transformStyle: 'preserve-3d',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.6) inset, 0 0 80px rgba(59, 130, 246, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5) inset, 0 0 60px rgba(59, 130, 246, 0.1)';
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 backdrop-blur-sm text-blue-600 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
                  }}
                >
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="mt-5 text-[28px] md:text-[32px] font-bold text-gray-800 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">For Job Seekers</h3>
                <p className="mt-3 text-[16px] md:text-[18px] leading-relaxed text-gray-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
                  Connect with top companies, explore opportunities, and find a job you'll love.
                </p>
                <div className="mt-5">
                  <Link href="/candidate/explore-jobs" className="text-blue-600 font-semibold hover:underline transition-all duration-200 hover:text-blue-700">
                    Browse Jobs →
                  </Link>
                </div>
              </div>
            </div>

            {/* Recruiters - Lissnify style box */}
            <div className="group cursor-pointer h-full">
              <div 
                className="relative w-full max-w-[400px] md:h-[320px] flex flex-col items-center text-center p-10 rounded-[30px] border border-white/60 bg-gradient-to-b from-blue-50/95 to-blue-100/95 backdrop-blur-sm transition-all duration-300 ease-out will-change-transform group-hover:scale-[1.03] group-hover:-translate-y-1"
                style={{
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5) inset, 0 0 60px rgba(99, 102, 241, 0.1)',
                  transform: 'perspective(1000px) rotateX(0deg)',
                  transformStyle: 'preserve-3d',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.6) inset, 0 0 80px rgba(99, 102, 241, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5) inset, 0 0 60px rgba(99, 102, 241, 0.1)';
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 backdrop-blur-sm text-indigo-600 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
                  }}
                >
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mt-5 text-[28px] md:text-[32px] font-bold text-gray-800 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">For Recruiters</h3>
                <p className="mt-3 text-[16px] md:text-[18px] leading-relaxed text-gray-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
                  Access a diverse talent pool and find the perfect candidate to grow your team.
                </p>
                <div className="mt-5">
                  <Link href="/signup/recruiter" className="text-blue-600 font-semibold hover:underline transition-all duration-200 hover:text-blue-700">
                    Post a Job →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup/user"
              className="w-full sm:w-auto text-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5"
              style={{
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 30px rgba(59, 130, 246, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 40px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 0 30px rgba(59, 130, 246, 0.2)';
              }}
            >
              Join as a Job Seeker
            </Link>
            <Link
              href="/signup/recruiter"
              className="w-full sm:w-auto text-center rounded-full bg-white/95 backdrop-blur-sm px-8 py-3 font-semibold text-blue-700 border border-blue-200/80 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 hover:bg-blue-50/95"
              style={{
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8) inset, 0 0 20px rgba(59, 130, 246, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.9) inset, 0 0 30px rgba(59, 130, 246, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8) inset, 0 0 20px rgba(59, 130, 246, 0.1)';
              }}
            >
              Join as a Recruiter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
