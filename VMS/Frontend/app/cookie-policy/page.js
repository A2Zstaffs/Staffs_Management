export default function CookiePolicy() {
    return (
        <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>

                <div className="prose prose-lg text-gray-600">
                    <p className="mb-6">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. What Are Cookies</h2>
                    <p className="mb-4">
                        Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Cookies</h2>
                    <p className="mb-4">
                        We use cookies for several reasons:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>To keep you signed in</li>
                        <li>To understand how you use our website</li>
                        <li>To remember your preferences</li>
                        <li>To improve your user experience</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Types of Cookies We Use</h2>
                    <div className="space-y-4 mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Essential Cookies</h3>
                            <p>These cookies are necessary for the website to function and cannot be switched off in our systems.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Performance Cookies</h3>
                            <p>These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Functional Cookies</h3>
                            <p>These cookies enable the website to provide enhanced functionality and personalization.</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Manage Your Cookies</h2>
                    <p className="mb-4">
                        Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
                    <p>
                        If you have any questions about our use of cookies, please contact us at info@a2zstaffs.com.
                    </p>
                </div>
            </div>
        </div>
    );
}
