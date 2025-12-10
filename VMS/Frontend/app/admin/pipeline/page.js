'use client';

import { useState } from 'react';
import Link from 'next/link';
import { pipelineMock } from '../data/adminData';

export default function PipelinePage() {
    const [pipeline, setPipeline] = useState(pipelineMock);

    return (
        <div className="min-h-screen bg-transparent">
            <main className="p-4 lg:p-8">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-secondary-900 text-2xl font-bold">CV Pipeline</h2>
                        <p className="text-secondary-600">Track candidates through the hiring process</p>
                    </div>
                    <Link href="/admin" className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-secondary-700 hover:bg-gray-50 transition-colors">
                        ← Back
                    </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4">
                    {Object.entries(pipeline).map(([stage, items]) => (
                        <div key={stage} className="min-w-[280px] w-72 bg-white/50 backdrop-blur-md rounded-xl border border-white/60 shadow-sm flex flex-col max-h-[calc(100vh-12rem)]">
                            <div className="p-4 border-b border-gray-200 bg-white/50 sticky top-0 rounded-t-xl">
                                <h3 className="font-bold text-secondary-900 capitalize flex items-center justify-between">
                                    {stage.replace(/_/g, ' ')}
                                    <span className="bg-white text-secondary-500 text-xs px-2 py-0.5 rounded-full border border-gray-200">
                                        {items.length}
                                    </span>
                                </h3>
                            </div>
                            <div className="p-3 space-y-3 overflow-y-auto flex-1">
                                {items.length === 0 && (
                                    <div className="text-center py-8 text-secondary-400 text-sm italic">
                                        No candidates
                                    </div>
                                )}
                                {items.map(item => (
                                    <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                                        <div className="font-semibold text-secondary-900">{item.candidate}</div>
                                        <div className="text-xs text-secondary-500 mt-1">{item.job}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
