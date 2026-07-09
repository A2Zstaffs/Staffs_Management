import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-indigo-50 via-white to-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <Link href="/">
                <Image
                  src="/image/a2zstaff logo.png"
                  alt="A2Z Staffs"
                  width={180}
                  height={60}
                  className="h-16 w-auto object-contain"
                />
              </Link>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              Your trusted partner in talent management and recruitment solutions.
            </p>
            {/* Contact Links */}
            <div className="flex space-x-6 mt-8">
              <a href="mailto:info@a2zstaffs.com" className="text-gray-600 hover:text-primary-600 transition-colors duration-200" title="Email us">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a href="tel:9214093346" className="text-gray-600 hover:text-primary-600 transition-colors duration-200" title="Call us">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
              <a href="https://linkedin.com" className="text-gray-600 hover:text-primary-600 transition-colors duration-200" title="LinkedIn">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <a href="/" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-lg">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-lg">
                  About Us
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-lg">
                  Services
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-lg">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-6">Services</h4>
            <ul className="space-y-4">
              <li>
                <a href="/services" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-lg">
                  Talent Sourcing
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-lg">
                  Candidate Management
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-lg">
                  Interview Scheduling
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-lg">
                  Analytics & Reports
                </a>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-6">Explore</h4>
            <ul className="space-y-4">
              <li>
                <a href="/candidate/explore-jobs" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-lg">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-lg">
                  Get in Touch
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-lg">
              © {new Date().getFullYear()} A2Z Staffs. All rights reserved.
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <span>Designed with</span>
              <span className="text-red-500 animate-pulse">♥</span>
              <span>by</span>
              <a
                href="https://www.linkedin.com/in/abhishekagi/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gray-600 hover:text-primary-600 transition-colors duration-200 underline underline-offset-2 decoration-dotted"
              >
                Abhishek
              </a>
            </div>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <a href="/privacy-policy" className="text-gray-600 hover:text-primary-600 text-lg transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-gray-600 hover:text-primary-600 text-lg transition-colors duration-200">
                Terms of Service
              </a>
              <a href="/cookie-policy" className="text-gray-600 hover:text-primary-600 text-lg transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
