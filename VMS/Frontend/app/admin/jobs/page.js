'use client';

import { useState } from 'react';
import Link from 'next/link';
import { jobsMock } from '../data/adminData';

export default function JobsPage() {
    const [jobs, setJobs] = useState(jobsMock);

    const toggleStatus = (id, currentStatus) => {
        setJobs(prev => prev.map(job =>
            job.id === id
                ? { ...job, status: currentStatus === 'Active' ? 'Paused' : 'Active' }
                : job
        ));
    };

    return (
        <div className="min-h-screen bg-transparent">
            <main className="p-4 lg:p-8">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-secondary-900 text-2xl font-bold">Jobs Management</h2>
                        <p className="text-secondary-600">Review and manage job postings</p>
                    </div>
                    <Link href="/admin" className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-secondary-700 hover:bg-gray-50 transition-colors">
                        ← Back
                    </Link>
                </div>

                <div className="rounded-xl bg-white/50 backdrop-blur-md border border-white/60 shadow-xl shadow-blue-900/5 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 bg-white/50">
                                <th className="p-4 text-secondary-600 font-semibold text-sm">Job Title</th>
                                <th className="p-4 text-secondary-600 font-semibold text-sm">Company</th>
                                <th className="p-4 text-secondary-600 font-semibold text-sm text-center">Applicants</th>
                                <th className="p-4 text-secondary-600 font-semibold text-sm">Status</th>
                                <th className="p-4 text-secondary-600 font-semibold text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-white/60 transition-colors">
                                    <td className="p-4 text-secondary-900 font-medium">{job.title}</td>
                                    <td className="p-4 text-secondary-600">{job.company}</td>
                                    <td className="p-4 text-secondary-600 text-center">{job.applicants}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-2 py-1 text-xs rounded-full border ${job.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                                                job.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                    'bg-gray-100 text-gray-700 border-gray-200'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => toggleStatus(job.id, job.status)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            {job.status === 'Active' ? 'Pause' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
