import Link from 'next/link';
import { Building2, Briefcase, ArrowRight, Phone } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Partner with A2Z Staffs and experience recruitment excellence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Clients CTA */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="mb-6">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                <Building2 className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                For Clients
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Streamline your hiring with our dedicated recruitment support.
                We handle the sourcing and screening so you can focus on building your team.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-md"
              >
                Talk to Our Team
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <Phone className="w-4 h-4" />
                Schedule a Call
              </Link>
            </div>
          </div>

          {/* Recruiters CTA */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="mb-6">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                <Briefcase className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                For Recruiters
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Join our network of recruitment professionals. Access exclusive mandates,
                earn competitively, and grow your career with industry-leading support.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-md"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="flex items-center justify-center gap-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
