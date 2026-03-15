'use client';

import { useState, useEffect } from 'react';
import { Star, ArrowRight } from 'lucide-react';

export default function TrustedCompanies() {
    const companies = [
        { name: 'Codeyoung', logo: '/companies/primary_logo.png' },
        { name: 'Dominos', logo: '/companies/dominos.png' },
        { name: 'Subway', logo: '/companies/subway-logo.e7b602efa8e0c7316077.png' },
        { name: 'Ckers Finance', logo: '/companies/ckers-logo.png' },
        { name: 'Basic Home Loans', logo: '/companies/basic-home-loan.svg' },
    ];

    // Duplicate for seamless scroll
    const marqueeCompanies = [...companies, ...companies];

    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const testimonials = [
        {
            quote: "A2Z Staffs transformed our hiring process with their dedicated support and quality candidates.",
            company: companies[0].name,
            logo: companies[0].logo
        },
        {
            quote: "Their recruitment expertise helped us scale our team efficiently across multiple locations.",
            company: companies[1].name,
            logo: companies[1].logo
        },
        {
            quote: "Professional, reliable, and always delivering exceptional talent for our business needs.",
            company: companies[2].name,
            logo: companies[2].logo
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-16 bg-secondary-50 border-y border-secondary-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
                    <div>
                        <h2 className="text-2xl font-bold text-secondary-900">Trusted by Industry Leaders</h2>
                        <p className="text-secondary-500 mt-1">Companies that rely on A2Z Staffs for their recruitment needs</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-accent-50 border border-accent-200 rounded-full">
                        <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
                        <span className="text-accent-700 text-sm font-semibold">Trusted Partner Network</span>
                    </div>
                </div>

                {/* Logo Marquee */}
                <div className="relative overflow-hidden w-full mb-12">
                    {/* Gradient Masks */}
                    <div className="absolute top-0 left-0 z-10 h-full w-32 bg-gradient-to-r from-secondary-50 to-transparent"></div>
                    <div className="absolute top-0 right-0 z-10 h-full w-32 bg-gradient-to-l from-secondary-50 to-transparent"></div>

                    <div className="flex w-max animate-scroll pause-on-hover">
                        {marqueeCompanies.map((company, index) => (
                            <div
                                key={index}
                                className="mx-6 md:mx-10 flex items-center justify-center h-28 w-48 md:w-56 bg-white rounded-2xl border border-secondary-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300 transform hover:scale-105"
                            >
                                <img
                                    src={company.logo}
                                    alt={`${company.name} logo`}
                                    className="object-contain w-full h-full max-h-20 p-3"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rotating Testimonial */}
                <div className="max-w-3xl mx-auto">
                    <div className="relative bg-white rounded-2xl border border-secondary-200 p-8 shadow-lg">
                        {/* Quote Icon */}
                        <div className="absolute -top-4 left-8 w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                        </div>

                        <div className="text-center">
                            <p className="text-lg text-secondary-700 italic mb-6 leading-relaxed">
                                "{testimonials[activeTestimonial].quote}"
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <img
                                    src={testimonials[activeTestimonial].logo}
                                    alt={testimonials[activeTestimonial].company}
                                    className="h-10 w-auto object-contain"
                                />
                                <div className="h-8 w-px bg-secondary-200" />
                                <span className="text-secondary-600 font-medium">{testimonials[activeTestimonial].company}</span>
                            </div>
                        </div>

                        {/* Dots Indicator */}
                        <div className="flex items-center justify-center gap-2 mt-6">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTestimonial(i)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${activeTestimonial === i
                                        ? 'w-6 bg-primary-500'
                                        : 'bg-secondary-300 hover:bg-secondary-400'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-10">
                    <a
                        href="/about"
                        className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group"
                    >
                        See our client success stories
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
}
