'use client';

import { useEffect, useState, useRef } from 'react';
import { Briefcase, Building2, Users, MapPin } from 'lucide-react';

export default function StatsSection() {
    const stats = [
        { label: 'Active Roles', value: 50, suffix: '+', icon: Briefcase, color: 'text-primary-500' },
        { label: 'Partner Companies', value: 10, suffix: '+', icon: Building2, color: 'text-accent-500' },
        { label: 'Placements Made', value: 100, suffix: '+', icon: Users, color: 'text-purple-500' },
        { label: 'Cities Covered', value: 5, suffix: '+', icon: MapPin, color: 'text-warm-400' },
    ];

    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState(stats.map(() => 0));
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isVisible) {
            stats.forEach((stat, index) => {
                let start = 0;
                const end = stat.value;
                const duration = 2000;
                const stepTime = duration / end;

                const timer = setInterval(() => {
                    start += 1;
                    setCounts(prev => {
                        const newCounts = [...prev];
                        newCounts[index] = start;
                        return newCounts;
                    });
                    if (start >= end) clearInterval(timer);
                }, stepTime);
            });
        }
    }, [isVisible]);

    return (
        <section ref={sectionRef} className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-secondary-900 mb-3">Our Impact in Numbers</h2>
                    <p className="text-secondary-500 max-w-xl mx-auto">
                        Delivering measurable results for our clients and recruitment partners
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-secondary-50 rounded-2xl p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 text-center"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative">
                                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                                        {counts[index]}{stat.suffix}
                                    </div>
                                    <div className="text-secondary-600 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
