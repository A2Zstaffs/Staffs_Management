export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Learn about how we use cookies and similar technologies on our platform.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <p className="text-secondary-500 text-lg mb-4">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">1. What Are Cookies?</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">2. How We Use Cookies</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                VMS Recruit uses cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc list-inside text-lg text-secondary-500 space-y-2 mb-4">
                <li>Remember your preferences and settings</li>
                <li>Keep you signed in to your account</li>
                <li>Understand how you use our platform</li>
                <li>Improve our services and user experience</li>
                <li>Provide personalized content and recommendations</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Deliver targeted advertisements</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">3. Types of Cookies We Use</h2>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-secondary-800 mb-4">Essential Cookies</h3>
                <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                  These cookies are necessary for the Platform to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-secondary-800 mb-4">Performance Cookies</h3>
                <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                  These cookies help us understand how visitors interact with our Platform by collecting and reporting information anonymously. This helps us improve the way our Platform works.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-secondary-800 mb-4">Functionality Cookies</h3>
                <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                  These cookies allow the Platform to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-secondary-800 mb-4">Targeting/Advertising Cookies</h3>
                <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                  These cookies are used to deliver advertisements that are relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">4. Third-Party Cookies</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Platform, deliver advertisements, and so on. These third parties may set their own cookies or similar technologies on your device.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">5. Managing Cookies</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside text-lg text-secondary-500 space-y-2 mb-4">
                <li>See what cookies you have and delete them individually</li>
                <li>Block third-party cookies</li>
                <li>Block cookies from particular sites</li>
                <li>Block all cookies from being set</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                Please note that if you choose to block or delete cookies, some features of the Platform may not function properly or may be unavailable.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">6. Browser-Specific Instructions</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                To manage cookies in your browser, please refer to the following links:
              </p>
              <ul className="list-disc list-inside text-lg text-secondary-500 space-y-2 mb-4">
                <li>Google Chrome</li>
                <li>Mozilla Firefox</li>
                <li>Microsoft Edge</li>
                <li>Safari</li>
                <li>Opera</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">7. Do Not Track Signals</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want to have your online activity tracked. Currently, there is no standard for how DNT signals work, so we do not currently respond to DNT signals.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">8. Updates to This Cookie Policy</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data use practices. We will notify you of any material changes by posting the new Cookie Policy on this page.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">9. Contact Us</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
              </p>
              <p className="text-lg text-secondary-500 leading-relaxed">
                <strong>Email:</strong> cookies@vmsrecruit.com<br />
                <strong>Address:</strong> VMS Recruit, Cookie Policy Department
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

