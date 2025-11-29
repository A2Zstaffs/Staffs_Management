'use client';

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
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Browse Jobs by Category
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Find opportunities in your field of expertise
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer relative bg-white/80 backdrop-blur-sm rounded-2xl border border-secondary-100/60 p-6 sm:p-8 transition-all duration-300 ease-out will-change-transform hover:scale-[1.06] hover:-translate-y-1"
              style={{
                boxShadow: `
                  0 2px 8px rgba(0, 0, 0, 0.04),
                  0 1px 3px rgba(0, 0, 0, 0.06),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8),
                  inset -1px -1px 2px rgba(0, 0, 0, 0.02)
                `,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `
                  0 8px 24px rgba(0, 0, 0, 0.08),
                  0 4px 12px rgba(0, 0, 0, 0.06),
                  0 0 0 1px rgba(255, 255, 255, 0.9) inset,
                  -2px -2px 4px rgba(255, 255, 255, 0.7),
                  2px 2px 4px rgba(0, 0, 0, 0.05)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `
                  0 2px 8px rgba(0, 0, 0, 0.04),
                  0 1px 3px rgba(0, 0, 0, 0.06),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8),
                  inset -1px -1px 2px rgba(0, 0, 0, 0.02)
                `;
              }}
            >
              <div className="text-center">
                <div 
                  className="text-4xl sm:text-5xl mb-5 sm:mb-6 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-2"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                  }}
                >
                  {category.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-secondary-900 mb-3 sm:mb-4 group-hover:text-primary-600 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-secondary-500 mb-4 sm:mb-5">
                  {category.jobs.toLocaleString()} jobs
                </p>
                <div 
                  className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${category.color} transition-all duration-300 group-hover:scale-105`}
                  style={{
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  }}
                >
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


