'use client';

import GradientHeader from '../components/GradientHeader';
import Link from 'next/link';

export default function RecruitersPage() {
  return (
    <div className="min-h-screen">
      <GradientHeader />
      <main className="p-8">
        <div className="rounded-xl bg-white/5 backdrop-blur-md border border-white/20 p-8 shadow-lg shadow-blue-900/20">
          <h2 className="text-white text-2xl font-bold mb-4">Recruiters Management</h2>
          <p className="text-blue-200 mb-6">Manage all recruiters on the platform</p>
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}









