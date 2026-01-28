'use client';

import { useEffect, useState } from 'react';

export default function StatsSection() {
    const stats = [
        { label: 'Active Jobs', value: 50, suffix: '+', color: 'text-blue-600' },
        { label: 'Companies', value: 10, suffix: '+', color: 'text-green-600' },
        { label: 'Candidates Hired', value: 100, suffix: '+', color: 'text-purple-600' },
        { label: 'Cities', value: 5, suffix: '+', color: 'text-orange-600' },
    ];

    return (
        <section className="py-16 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
                    {stats.map((stat, index) => (
                        <div key={index} className="p-4 group hover:transform hover:scale-105 transition-transform duration-300">
                            <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                                {stat.value}{stat.suffix}
                            </div>
                            <div className="text-gray-600 font-medium text-lg">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
