import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-warm-400">VMS Recruit</span>
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Connecting talent with opportunity through innovative recruitment solutions
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary-800 mb-8">Our Mission</h2>
              <p className="text-lg text-secondary-500 mb-6 leading-relaxed">
                At VMS Recruit, we believe that finding the right talent should be simple, efficient, and effective. 
                Our mission is to revolutionize the recruitment process by providing cutting-edge tools and 
                technologies that connect the best candidates with the right opportunities.
              </p>
              <p className="text-lg text-secondary-500 leading-relaxed">
                We're committed to creating a seamless experience for both job seekers and recruiters, 
                ensuring that every interaction on our platform leads to meaningful career connections.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-secondary-800 mb-4">Innovation First</h3>
                <p className="text-primary-500">
                  We leverage the latest technology to make recruitment faster, smarter, and more effective.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-800 mb-6">Our Values</h2>
            <p className="text-xl text-secondary-500 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-100 hover:border-primary-200">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-800 mb-4">Excellence</h3>
              <p className="text-primary-500">
                We strive for excellence in every interaction, ensuring the highest quality service for our users.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-100 hover:border-primary-200">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-800 mb-4">Collaboration</h3>
              <p className="text-primary-500">
                We believe in the power of working together to achieve common goals and create mutual success.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-100 hover:border-primary-200">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-800 mb-4">Innovation</h3>
              <p className="text-primary-500">
                We continuously innovate to provide cutting-edge solutions that meet evolving market needs.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-100 hover:border-primary-200">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-800 mb-4">Integrity</h3>
              <p className="text-primary-500">
                We conduct business with honesty, transparency, and respect for all our stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-800 mb-6">Meet Our Team</h2>
            <p className="text-xl text-secondary-500 max-w-3xl mx-auto">
              The passionate professionals behind VMS Recruit
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">JD</span>
              </div>
              <h3 className="text-xl font-bold text-secondary-800 mb-2">John Doe</h3>
              <p className="text-primary-500 font-semibold mb-4">CEO & Founder</p>
              <p className="text-primary-500">
                Visionary leader with 15+ years in recruitment technology and talent management.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">JS</span>
              </div>
              <h3 className="text-xl font-bold text-secondary-800 mb-2">Jane Smith</h3>
              <p className="text-primary-500 font-semibold mb-4">CTO</p>
              <p className="text-primary-500">
                Technology expert focused on building scalable and innovative recruitment solutions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">MJ</span>
              </div>
              <h3 className="text-xl font-bold text-secondary-800 mb-2">Mike Johnson</h3>
              <p className="text-primary-500 font-semibold mb-4">Head of Product</p>
              <p className="text-primary-500">
                Product strategist dedicated to creating exceptional user experiences.
              </p>
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
              <div className="text-5xl font-bold text-white mb-4">10K+</div>
              <div className="text-primary-200 text-lg">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-4">500+</div>
              <div className="text-primary-200 text-lg">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-4">50K+</div>
              <div className="text-primary-200 text-lg">Jobs Posted</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-4">95%</div>
              <div className="text-primary-200 text-lg">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-secondary-800 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-secondary-500 mb-12 max-w-3xl mx-auto">
            Join thousands of professionals who trust VMS Recruit for their career and hiring needs.
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
