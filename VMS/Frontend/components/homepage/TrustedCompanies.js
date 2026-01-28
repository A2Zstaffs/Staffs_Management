'use client';

export default function TrustedCompanies() {
    const companies = [
        'Microsoft', 'Google', 'Amazon', 'Netflix', 'Tesla', 'Adobe', 'Salesforce', 'Uber'
    ];

    return (
        <section className="py-10 bg-white border-b border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-500 font-medium mb-8">TRUSTED BY LEADING COMPANIES WORLDWIDE</p>

                <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {companies.map((company, index) => (
                        <div key={index} className="text-2xl font-bold text-gray-400 hover:text-gray-800 transition-colors select-none">
                            {company}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
