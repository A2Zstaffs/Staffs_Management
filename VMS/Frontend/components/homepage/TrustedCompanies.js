'use client';

export default function TrustedCompanies() {
    const companies = [
        { name: 'Codeyoung', logo: '/companies/primary_logo.png' },
        { name: 'Dominos', logo: '/companies/dominos.png' },
        { name: 'Subway', logo: '/companies/subway-logo.e7b602efa8e0c7316077.png' },
        { name: 'Ckers Finance', logo: '/companies/ckers-logo.png' },
        { name: 'Basic Home Loans', logo: '/companies/basic-home-loan.svg' },
    ];

    // Duplicate the array to create a seamless infinite scroll effect
    const marqueeCompanies = [...companies, ...companies];

    return (
        <section className="py-10 bg-white border-b border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-500 font-medium mb-12 uppercase tracking-widest text-sm">Trusted by Leading Companies</p>

                <div className="relative overflow-hidden w-full">
                    {/* Gradient Masks for fade effect at edges */}
                    <div className="absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent"></div>
                    <div className="absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent"></div>

                    <div className="flex w-max animate-scroll pause-on-hover">
                        {marqueeCompanies.map((company, index) => (
                            <div key={index} className="mx-8 md:mx-12 flex items-center justify-center h-20 w-32 md:w-40 transition-all duration-300 transform hover:scale-110">
                                <img
                                    src={company.logo}
                                    alt={`${company.name} logo`}
                                    className="object-contain w-full h-full max-h-16"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
