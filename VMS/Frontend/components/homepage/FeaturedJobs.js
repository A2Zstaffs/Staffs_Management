export default function FeaturedJobs() {
  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $150k',
      type: 'Full-time',
      posted: '2 days ago',
      logo: '🏢',
      featured: true
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$100k - $130k',
      type: 'Full-time',
      posted: '1 day ago',
      logo: '🚀',
      featured: true
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'DesignStudio',
      location: 'New York, NY',
      salary: '$80k - $100k',
      type: 'Full-time',
      posted: '3 days ago',
      logo: '🎨',
      featured: false
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'DataFlow Systems',
      location: 'Austin, TX',
      salary: '$110k - $140k',
      type: 'Full-time',
      posted: '4 days ago',
      logo: '📊',
      featured: false
    },
    {
      id: 5,
      title: 'Marketing Manager',
      company: 'GrowthCo',
      location: 'Chicago, IL',
      salary: '$70k - $90k',
      type: 'Full-time',
      posted: '5 days ago',
      logo: '📈',
      featured: false
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      location: 'Seattle, WA',
      salary: '$130k - $160k',
      type: 'Full-time',
      posted: '1 week ago',
      logo: '☁️',
      featured: false
    }
  ];

  return (
    <section className="py-16 bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Featured Jobs
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Discover the latest opportunities from top companies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white rounded-lg border border-secondary-100 p-6 hover:border-primary-300 hover:shadow-md transition-all duration-200 ${
                job.featured ? 'ring-1 ring-accent-200' : ''
              }`}
            >
              {job.featured && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700 mb-4">
                  Featured
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{job.logo}</div>
                  <div>
                    <h3 className="text-base font-semibold text-secondary-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-secondary-600">{job.company}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-secondary-600">
                  <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </div>
                <div className="flex items-center text-xs text-secondary-600">
                  <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {job.salary}
                </div>
                <div className="flex items-center text-xs text-secondary-600">
                  <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.type}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary-500">{job.posted}</span>
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-white hover:bg-secondary-50 text-primary-600 border-2 border-primary-500 px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
            View All Jobs
          </button>
        </div>
      </div>
    </section>
  );
}


