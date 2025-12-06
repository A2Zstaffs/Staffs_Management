export default function WhyChooseUs() {
  const features = [
    {
      icon: '✅',
      title: 'Easy Job Applications',
      description: 'Apply to multiple jobs with just one click. Save time and effort with our streamlined application process.'
    },
    {
      icon: '🏢',
      title: 'Verified Companies',
      description: 'All companies on our platform are thoroughly verified to ensure legitimate opportunities and safe job hunting.'
    },
    {
      icon: '🤖',
      title: 'Smart Matching Algorithm',
      description: 'Our AI-powered system matches you with the most relevant job opportunities based on your skills and preferences.'
    },
    {
      icon: '🆓',
      title: 'Free for Job Seekers',
      description: 'No hidden fees or premium subscriptions required. Access all features completely free for job seekers.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-500 mb-4">
            Why Choose VMS Recruit?
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            We make job hunting and hiring simple, efficient, and successful
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-200"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-200">
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-primary-500 mb-4 group-hover:text-primary-600 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-sm text-secondary-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


