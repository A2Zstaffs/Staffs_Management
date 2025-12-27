'use client';

import { useState } from 'react';
import Link from 'next/link';
import { payoutsMock } from '../data/adminData';

export default function PayoutsPage() {
    return (
        <div className="">
            <main className="p-4 lg:p-8">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-secondary-900 text-2xl font-bold">Payouts & Commission</h2>
                        <p className="text-secondary-600">Track recruiter earnings and platform revenue (80/20 split)</p>
                    </div>
                    <Link href="/admin" className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-secondary-700 hover:bg-gray-50 transition-colors">
                        ← Back
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/50 backdrop-blur-md p-6 rounded-xl border border-white/60 shadow-sm">
                        <h3 className="text-secondary-600 text-sm font-medium uppercase">Total Paid</h3>
                        <p className="text-2xl font-bold text-green-600 mt-1">$45,000</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-md p-6 rounded-xl border border-white/60 shadow-sm">
                        <h3 className="text-secondary-600 text-sm font-medium uppercase">Pending</h3>
                        <p className="text-2xl font-bold text-orange-500 mt-1">$12,500</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-md p-6 rounded-xl border border-white/60 shadow-sm">
                        <h3 className="text-secondary-600 text-sm font-medium uppercase">Platform Revenue (20%)</h3>
                        <p className="text-2xl font-bold text-blue-600 mt-1">$14,375</p>
                    </div>
                </div>

                <div className="rounded-xl bg-white/50 backdrop-blur-md border border-white/60 shadow-xl shadow-blue-900/5 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 bg-white/50">
                                <th className="p-4 text-secondary-600 font-semibold text-sm">Recruiter</th>
                                <th className="p-4 text-secondary-600 font-semibold text-sm">Candidate</th>
                                <th className="p-4 text-secondary-600 font-semibold text-sm text-right">Amount</th>
                                <th className="p-4 text-secondary-600 font-semibold text-sm text-center">Split (80/20)</th>
                                <th className="p-4 text-secondary-600 font-semibold text-sm">Date</th>
                                <th className="p-4 text-secondary-600 font-semibold text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {payoutsMock.map((payout) => (
                                <tr key={payout.id} className="hover:bg-white/60 transition-colors">
                                    <td className="p-4 text-secondary-900 font-medium">{payout.recruiter}</td>
                                    <td className="p-4 text-secondary-600">{payout.candidate}</td>
                                    <td className="p-4 text-secondary-900 font-mono text-right">${payout.amount.toLocaleString()}</td>
                                    <td className="p-4 text-secondary-500 text-xs text-center font-mono">
                                        ${(payout.amount * 0.8).toLocaleString()} / ${(payout.amount * 0.2).toLocaleString()}
                                    </td>
                                    <td className="p-4 text-secondary-600 text-sm">{new Date(payout.date).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-2 py-1 text-xs rounded-full border ${payout.status === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' :
                                                'bg-orange-100 text-orange-700 border-orange-200'
                                            }`}>
                                            {payout.status}
                                        </span>
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
