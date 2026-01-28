'use client';

import { useState } from 'react';

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: 'How do I apply for jobs?',
            answer: 'Simply create an account, upload your resume, and browse our job listings. When you find a role you like, click "Apply Now" to submit your application instantly.'
        },
        {
            question: 'Is it free for job seekers?',
            answer: 'Yes! Our platform is 100% free for candidates. You can browse jobs, apply, and get interviewed without any cost.'
        },
        {
            question: 'How can companies hire talent?',
            answer: 'Companies can sign up as a Client, post job openings, and search our database of qualified candidates. We also offer KAM support for premium hiring needs.'
        },
        {
            question: 'Can I track my application status?',
            answer: 'Absolutely. Your dashboard tracks every application in real-time, showing you when you are shortlisted, interviewed, or hired.'
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-lg text-gray-600">
                        Everything you need to know about A2Z Staffs
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <button
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                            >
                                <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                                <span className={`transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
