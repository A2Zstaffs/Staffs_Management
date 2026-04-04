'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Award,
  Globe
} from 'lucide-react';

export default function HeroSection() {
  const [activeMetric, setActiveMetric] = useState(0);

  // Animated metrics for enterprise feel
  const metrics = [
    { label: 'Successful Placements', icon: CheckCircle2, color: 'text-accent-500' },
    { label: 'Client Companies', icon: Building2, color: 'text-primary-500' },
    { label: 'Recruitment Partners', icon: Users, color: 'text-purple-500' },
    { label: 'Industries Served', icon: Globe, color: 'text-warm-400' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-primary-200 rounded-full shadow-sm">
            <Award className="w-4 h-4 text-primary-500" />
            <span className="text-primary-600 text-sm font-semibold">Enterprise Recruitment Solutions</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
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

        {/* Dynamic Metrics Display */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div
                  key={i}
                  className={`relative p-6 rounded-2xl border bg-white transition-all duration-500 ${activeMetric === i
                      ? 'border-primary-300 shadow-lg shadow-primary-100 scale-105'
                      : 'border-secondary-200 shadow-sm'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${activeMetric === i ? 'bg-primary-100' : 'bg-secondary-100'
                    }`}>
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <p className="text-secondary-700 text-sm font-medium">{metric.label}</p>
                  {activeMetric === i && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-400 rounded-b-2xl" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Value Proposition Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
                href="/signup/client"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors group-hover:shadow-lg"
              >
                Partner With Us
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
                href="/signup/recruiter"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors group-hover:shadow-lg"
              >
                Join as Recruiter
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
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
