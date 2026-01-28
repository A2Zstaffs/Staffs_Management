'use client';

export default function HowItWorks() {
    const steps = [
        {
            step: '01',
            title: 'Create Account',
            description: 'Sign up for free and set up your professional profile.',
        },
        {
            step: '02',
            title: 'Search Jobs',
            description: 'Browse thousands of jobs compatible with your skills.',
        },
        {
            step: '03',
            title: 'Apply',
            description: 'Apply to jobs with a single click using your profile.',
        },
        {
            step: '04',
            title: 'Get Hired',
            description: 'Get interviewed and start your new career journey.',
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Your journey to a better career starts with simple steps
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-0"></div>

                    {steps.map((item, index) => (
                        <div key={index} className="relative z-10 bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group border border-gray-100">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:bg-blue-700 transition-colors shadow-md border-4 border-white">
                                {item.step}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
