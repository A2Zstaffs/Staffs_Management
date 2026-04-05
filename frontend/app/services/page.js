import Link from 'next/link';

export const metadata = {
  title: 'Our Services — A2Z Staffs | Recruitment & Talent Management Solutions',
  description: 'Explore A2Z Staffs services: Talent Sourcing, Candidate Management, Interview Scheduling, and Analytics & Reports. End-to-end recruitment solutions for businesses.',
  keywords: ['recruitment services', 'talent sourcing', 'candidate management', 'interview scheduling', 'hiring analytics', 'staffing solutions India'],
  alternates: { canonical: 'https://a2zstaffs.com/services' },
  openGraph: {
    title: 'Our Services — A2Z Staffs | Recruitment Solutions',
    description: 'End-to-end recruitment solutions: Talent Sourcing, Candidate Management, Interview Scheduling, and Analytics.',
    url: 'https://a2zstaffs.com/services',
    type: 'website',
    images: [{ url: 'https://a2zstaffs.com/image/homepage.png', width: 1200, height: 630, alt: 'A2Z Staffs Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services — A2Z Staffs',
    description: 'End-to-end recruitment and talent management solutions.',
    images: ['https://a2zstaffs.com/image/homepage.png'],
  },
};

export default function ServicesPage() {
    const services = [
        {
            title: 'Talent Sourcing',
            description: 'We use advanced AI algorithms and our extensive network to find the best talent for your specific needs.',
            icon: (
                <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            title: 'Candidate Management',
            description: 'Streamline your recruitment process with our comprehensive candidate management system.',
            icon: (
                <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            title: 'Interview Scheduling',
            description: 'Automated scheduling tools to coordinate interviews effortlessly between candidates and interviewers.',
            icon: (
                <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            title: 'Analytics & Reports',
            description: 'Gain insights into your hiring process with detailed analytics and customizable reports.',
            icon: (
                <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-blue-600 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Our Services</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Comprehensive solutions to streamline your recruitment and talent management process.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex flex-col items-center text-center">
                                {service.icon}
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to get started?</h2>
                    <div className="flex justify-center space-x-4">
                        <Link href="/signup/client" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                            For Employers
                        </Link>
                        <Link href="/signup/user" className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                            For Candidates
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
