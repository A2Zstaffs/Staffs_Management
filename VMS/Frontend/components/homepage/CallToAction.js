export default function CallToAction() {
  return (
    <section className="py-16 bg-primary-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Seekers CTA */}
          <div className="bg-white rounded-xl p-8 text-center lg:text-left">
            <div className="mb-6">
              <div className="text-4xl mb-4">👨‍💼</div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                Looking for a Job?
              </h3>
              <p className="text-base text-secondary-600 mb-6">
                Join thousands of job seekers who found their dream careers through VMS Recruit. 
                Create your profile and start applying today!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold text-base transition-colors duration-200 shadow-md">
                Sign Up Now
              </button>
              <button className="bg-secondary-100 hover:bg-secondary-200 text-secondary-700 px-6 py-3 rounded-lg font-semibold text-base transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>

          {/* Recruiters CTA */}
          <div className="bg-white rounded-xl p-8 text-center lg:text-left">
            <div className="mb-6">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                Want to Hire Talent?
              </h3>
              <p className="text-base text-secondary-600 mb-6">
                Find the perfect candidates for your company. Post jobs, manage applications, 
                and hire the best talent with our powerful recruitment tools.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold text-base transition-colors duration-200 shadow-md">
                Post a Job Today
              </button>
              <button className="bg-secondary-100 hover:bg-secondary-200 text-secondary-700 px-6 py-3 rounded-lg font-semibold text-base transition-colors duration-200">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


