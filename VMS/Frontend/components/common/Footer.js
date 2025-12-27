import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-8">
              <Link href="/" className="inline-block mb-4 relative">
                <div className="relative">
                  <Image
                    src="/image/a2zstaff logo.png"
                    alt="A2Z STAFFS Logo"
                    width={180}
                    height={60}
                    className="h-12 w-auto object-contain relative z-10"
                    style={{
                      filter: 'brightness(1.3) contrast(1.2) saturate(1.5) hue-rotate(-5deg)',
                    }}
                  />
                  {/* Subtle primary color overlay to match website theme on dark background */}
                  <div
                    className="absolute inset-0 mix-blend-screen opacity-10 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.3) 100%)',
                    }}
                  />
                </div>
              </Link>
              <p className="text-secondary-400 text-lg leading-relaxed">
                Streamline your recruitment process with our advanced talent management system.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="https://www.linkedin.com/company/a2zstaffs/" target="_blank" rel="noopener noreferrer" className="text-secondary-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="mailto:info@a2zstaffs.com" className="text-secondary-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">Email</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="text-secondary-400 text-lg flex items-start">
                <span className="mr-2">Email:</span>
                <a href="mailto:info@a2zstaffs.com" className="hover:text-white transition-colors duration-200">
                  info@a2zstaffs.com
                </a>
              </li>
              <li className="text-secondary-400 text-lg flex items-start">
                <span className="mr-2">Phone:</span>
                <a href="tel:9110492256" className="hover:text-white transition-colors duration-200">
                  9110492256
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <a href="/" className="text-secondary-400 hover:text-white transition-colors duration-200 text-lg">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-secondary-400 hover:text-white transition-colors duration-200 text-lg">
                  About Us
                </a>
              </li>
              <li>
                <Link href="/login" className="text-secondary-400 hover:text-white transition-colors duration-200 text-lg">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="/contact" className="text-secondary-400 hover:text-white transition-colors duration-200 text-lg">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Services</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-secondary-400 hover:text-white transition-colors duration-200 text-lg">
                  Talent Sourcing
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-400 hover:text-white transition-colors duration-200 text-lg">
                  Candidate Management
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-400 hover:text-white transition-colors duration-200 text-lg">
                  Interview Scheduling
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-400 hover:text-white transition-colors duration-200 text-lg">
                  Analytics & Reports
                </a>
              </li>
            </ul>
          </div>
          {/* join now  */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Join Now</h4>
            <ul className="space-y-4">
              <li>
                <a href="/signup/client" className="text-secondary-400 hover:text-white transition-colors duration-200 text-lg">
                  Join as Client
                </a>
              </li>
              <li>
                <a href="/signup/consultancy" className="text-secondary-400 hover:text-white transition-colors duration-200 text-lg">
                  Join as Consultancy
                </a>
              </li>
            </ul>
          </div>

        </div>




        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-secondary-400 text-lg">
              © 2024 A2Z Staffs. All rights reserved.
            </div>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <a href="/privacy-policy" className="text-secondary-400 hover:text-white text-lg transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-secondary-400 hover:text-white text-lg transition-colors duration-200">
                Terms of Service
              </a>
              <a href="/cookie-policy" className="text-secondary-400 hover:text-white text-lg transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

