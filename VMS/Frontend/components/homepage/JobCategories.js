export default function JobCategories() {
  const categories = [
    {
      id: 1,
      name: 'IT & Software',
      icon: '💻',
      jobs: 2500,
      color: 'bg-primary-100 text-primary-600'
    },
    {
      id: 2,
      name: 'Marketing',
      icon: '📈',
      jobs: 1200,
      color: 'bg-accent-100 text-accent-600'
    },
    {
      id: 3,
      name: 'Finance',
      icon: '💰',
      jobs: 1800,
      color: 'bg-warm-100 text-warm-600'
    },
    {
      id: 4,
      name: 'Education',
      icon: '🎓',
      jobs: 900,
      color: 'bg-primary-200 text-primary-700'
    },
    {
      id: 5,
      name: 'Healthcare',
      icon: '🏥',
      jobs: 1500,
      color: 'bg-accent-200 text-accent-700'
    },
    {
      id: 6,
      name: 'Design',
      icon: '🎨',
      jobs: 800,
      color: 'bg-primary-300 text-primary-800'
    },
    {
      id: 7,
      name: 'Sales',
      icon: '📞',
      jobs: 1100,
      color: 'bg-secondary-200 text-secondary-700'
    },
    {
      id: 8,
      name: 'Others',
      icon: '🔧',
      jobs: 2000,
      color: 'bg-secondary-100 text-secondary-600'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Browse Jobs by Category
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Find opportunities in your field of expertise
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer bg-white rounded-lg border border-secondary-100 p-6 hover:border-primary-300 hover:shadow-md transition-all duration-200"
            >
              <div className="text-center">
                <div className="text-3xl mb-4 group-hover:scale-105 transition-transform duration-200">
                  {category.icon}
                </div>
                <h3 className="text-base font-semibold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                  {category.name}
                </h3>
                <p className="text-xs text-secondary-500 mb-3">
                  {category.jobs.toLocaleString()} jobs
                </p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                  View Jobs
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


