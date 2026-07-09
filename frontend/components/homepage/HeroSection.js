'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Award,
} from 'lucide-react';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Staggered entrance animation on mount (reduced-motion safe).
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      setMounted(true);
      return;
    }
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const rise = (order) =>
    reduced
      ? {}
      : {
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'none' : 'translateY(22px)',
          transition: `opacity 0.6s ease-out ${order * 110}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${order * 110}ms`,
        };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-80"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#1A73FF 1px, transparent 1px), linear-gradient(90deg, #1A73FF 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 pb-20">
        {/* Enterprise Badge */}
        <div className="flex justify-center mb-8" style={rise(0)}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-primary-200 rounded-full shadow-sm">
            <Award className="w-4 h-4 text-primary-500" />
            <span className="text-primary-600 text-sm font-semibold">Enterprise Recruitment Solutions</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto" style={rise(1)}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            <span className="text-secondary-900">Powering Your</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
              Recruitment Success
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed">
            A2Z Staffs partners with businesses and recruitment professionals to deliver
            <span className="text-secondary-900 font-semibold"> scalable hiring solutions</span> that drive growth and build exceptional teams.
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto" style={rise(2)}>
          {/* For Clients Card */}
          <div className="group relative bg-white rounded-3xl border border-secondary-200 p-8 shadow-lg hover:shadow-xl hover:border-primary-200 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-3">For Clients</h3>
              <p className="text-secondary-600 mb-6 leading-relaxed">
                Partner with us to access pre-vetted talent and streamline your hiring process with dedicated recruitment support.
              </p>
              <ul className="space-y-3 mb-8">
                {['Dedicated account management', 'Pre-screened candidates', 'End-to-end hiring support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-secondary-600">
                    <CheckCircle2 className="w-5 h-5 text-accent-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-95 group-hover:shadow-lg"
              >
                Talk to Our Team
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* For Recruiters Card */}
          <div className="group relative bg-white rounded-3xl border border-secondary-200 p-8 shadow-lg hover:shadow-xl hover:border-primary-200 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-3">For Recruiters</h3>
              <p className="text-secondary-600 mb-6 leading-relaxed">
                Join our network of recruitment professionals and grow your career with access to exclusive mandates and resources.
              </p>
              <ul className="space-y-3 mb-8">
                {['Access client mandates', 'Performance-based earnings', 'Professional development'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-secondary-600">
                    <CheckCircle2 className="w-5 h-5 text-accent-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-95 group-hover:shadow-lg"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center" style={rise(3)}>
          <p className="text-secondary-500 text-sm mb-4">Ready to transform your recruitment operations?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <span>Schedule a Consultation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-secondary-300 text-secondary-700 font-semibold rounded-full hover:bg-secondary-50 hover:border-secondary-400 transition-all duration-300"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
