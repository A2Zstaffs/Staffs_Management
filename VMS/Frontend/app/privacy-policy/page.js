export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">1. Introduction</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                VMS Recruit ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our recruitment platform and services.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">2. Information We Collect</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-lg text-secondary-500 space-y-2 mb-4">
                <li>Personal identification information (name, email address, phone number)</li>
                <li>Professional information (resume, work history, skills, education)</li>
                <li>Account credentials and profile information</li>
                <li>Job application data and preferences</li>
                <li>Communication records and correspondence</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">3. How We Use Your Information</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-lg text-secondary-500 space-y-2 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Match candidates with job opportunities</li>
                <li>Process and manage job applications</li>
                <li>Communicate with you about our services</li>
                <li>Send you updates, newsletters, and promotional materials</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">4. Information Sharing and Disclosure</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-lg text-secondary-500 space-y-2 mb-4">
                <li>With employers and recruiters when you apply for jobs</li>
                <li>With service providers who assist us in operating our platform</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
                <li>With your explicit consent</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">5. Data Security</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">6. Your Rights</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-lg text-secondary-500 space-y-2 mb-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">7. Cookies and Tracking Technologies</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">8. Third-Party Links</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">9. Children's Privacy</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">10. Changes to This Privacy Policy</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">11. Contact Us</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-lg text-secondary-500 leading-relaxed">
                <strong>Email:</strong> privacy@vmsrecruit.com<br />
                <strong>Address:</strong> VMS Recruit, Privacy Department
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


