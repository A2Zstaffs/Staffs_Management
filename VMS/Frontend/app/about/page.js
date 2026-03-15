import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-warm-400">A2Z Staffs</span>
            </h1>
            <p className="text-xl text-secondary-100 max-w-2xl mx-auto">
              Connecting talent with opportunity through innovation and improved recruitment processes.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">Our Mission</h2>
              <p className="text-lg text-secondary-600 mb-6 leading-relaxed">
                At A2Z Staffs, we believe that finding the right talent should be simple, efficient, and effective.
                Our mission is to bridge the gap between employers and job seekers by providing a seamless,
                intelligent platform that saves time and improves hiring quality.
              </p>
              <p className="text-lg text-secondary-600 leading-relaxed">
                We're committed to revolutionizing the recruitment industry through technology,
                making it easier for companies to build their dream teams and for individuals to find their perfect roles.
              </p>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Team collaborating"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-secondary-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-secondary-600">Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-secondary-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-secondary-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              The principles that guide us in everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Value 1 */}
            <div className="p-8 bg-secondary-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">Integrity</h3>
              <p className="text-secondary-600">
                We operate with transparency and honesty in all our dealings with clients and candidates.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-8 bg-secondary-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">Innovation</h3>
              <p className="text-secondary-600">
                We accurately match talent with opportunity through data-driven insights and technology.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-8 bg-secondary-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">Client Success</h3>
              <p className="text-secondary-600">
                We are dedicated to the growth and success of both our partner companies and candidates.
              </p>
            </div>
          </div>

          {/* Founder Section */}
          <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 rounded-2xl p-8 md:p-12 shadow-2xl text-white">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="inline-block px-4 py-1.5 bg-primary-600 text-white text-sm font-semibold rounded-full mb-6">
                Our Founder
              </div>
              <h3 className="text-3xl font-bold mb-2">Sandeep Kushwaha</h3>
              <p className="text-primary-400 font-medium text-lg mb-8">Founder | Project Sales & Key Account Management</p>

              <div className="space-y-4 text-secondary-200 leading-relaxed text-lg">
                <p>
                  Founder with 8+ years of experience in project sales and key account management across B2B and B2G markets. Worked with brands like Schindler Elevators, Asian Paints, and Trident Structures, delivering complex projects through strong dealer and partner networks.
                </p>
                <p>
                  Focused on building scalable, execution-driven businesses that create real customer value.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Our Impact</h2>
            <p className="text-xl text-primary-100">
              Numbers that speak to our success
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-4">50+</div>
              <div className="text-primary-200 text-lg">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-4">10+</div>
              <div className="text-primary-200 text-lg">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-4">100+</div>
              <div className="text-primary-200 text-lg">Candidates Hired</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-4">5+</div>
              <div className="text-primary-200 text-lg">Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-secondary-800 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-secondary-500 mb-12 max-w-3xl mx-auto">
            Join thousands of professionals who trust A2Z Staffs for their career and hiring needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 shadow-lg">
              Start Your Journey
            </button>
            <button className="bg-white hover:bg-primary-50 text-primary-500 border-2 border-primary-500 px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 shadow-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
