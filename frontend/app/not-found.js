'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search, Briefcase } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen animated-background-light flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background blobs — same style as login page */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-80 h-80 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute top-[10%] right-[10%] w-80 h-80 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[15%] left-[25%] w-80 h-80 bg-sky-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-white/30 blur-3xl rounded-3xl -z-10"></div>

        {/* Card */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-white/60">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/image/a2zstaff logo.png"
              alt="A2Z Staffs"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>

          {/* 404 Number */}
          <div className="relative mb-4">
            <p className="text-[96px] font-black text-blue-600/10 leading-none select-none">404</p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-100 rounded-2xl px-5 py-2">
                <p className="text-blue-700 font-bold text-lg tracking-wide">Page Not Found</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            <br />
            Let's get you back on track.
          </p>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 text-sm"
            >
              <Home size={16} />
              Go Home
            </Link>
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-slate-200 hover:-translate-y-0.5 text-sm"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>

          {/* Secondary links */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100">
            <Link
              href="/candidate/explore-jobs"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium"
            >
              <Search size={13} />
              Browse Jobs
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium"
            >
              <Briefcase size={13} />
              Sign In
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
