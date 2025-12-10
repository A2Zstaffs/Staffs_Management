'use client';

import { useState } from 'react';
import Link from 'next/link';
import { candidatesMock } from '../data/adminData';

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState(candidatesMock);
    const [filter, setFilter] = useState('All');

    const handleAction = (id, action) => {
        console.log(`${action} candidate:`, id);
        if (action === 'delete') {
            setCandidates(prev => prev.filter(c => c.id !== id));
        }
    };

    const filteredCandidates = filter === 'All'
        ? candidates
        : candidates.filter(c => c.status === filter);

    return (
        <div className="min-h-screen bg-transparent">
            <main className="p-4 lg:p-8">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-secondary-900 text-2xl font-bold">Candidates Management</h2>
                        <p className="text-secondary-600">Track and manage candidate applications</p>
                    </div>
                    <Link href="/admin" className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-secondary-700 hover:bg-gray-50 transition-colors">
                        ← Back
                    </Link>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['All', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-secondary-600 hover:bg-blue-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="rounded-xl bg-white/50 backdrop-blur-md border border-white/60 shadow-xl shadow-blue-900/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-white/50">
                                    <th className="p-4 text-secondary-600 font-semibold text-sm">Name</th>
                                    <th className="p-4 text-secondary-600 font-semibold text-sm">Role</th>
                                    <th className="p-4 text-secondary-600 font-semibold text-sm">Applied Date</th>
                                    <th className="p-4 text-secondary-600 font-semibold text-sm">Status</th>
                                    <th className="p-4 text-secondary-600 font-semibold text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCandidates.map((candidate) => (
                                    <tr key={candidate.id} className="hover:bg-white/60 transition-colors">
                                        <td className="p-4 text-secondary-900 font-medium">{candidate.name}</td>
                                        <td className="p-4 text-secondary-600">{candidate.role}</td>
                                        <td className="p-4 text-secondary-600">{new Date(candidate.date).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2 py-1 text-xs rounded-full border ${candidate.status === 'Selected' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    candidate.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                                        'bg-blue-100 text-blue-700 border-blue-200'
                                                }`}>
                                                {candidate.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleAction(candidate.id, 'view')} className="text-secondary-400 hover:text-blue-600 mr-3">View</button>
                                            <button onClick={() => handleAction(candidate.id, 'delete')} className="text-secondary-400 hover:text-red-600">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
