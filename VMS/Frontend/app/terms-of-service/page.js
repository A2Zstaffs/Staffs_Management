export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our platform.
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
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">1. Acceptance of Terms</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                By accessing and using VMS Recruit ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">2. Description of Service</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                VMS Recruit is a recruitment platform that connects job seekers with employers and recruiters. We provide tools and services to facilitate the recruitment process, including job postings, candidate profiles, application management, and related services.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">3. User Accounts</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                To access certain features of the Platform, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-lg text-secondary-500 space-y-2 mb-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information</li>
                <li>Maintain the security of your password and identification</li>
                <li>Accept all responsibility for activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">4. User Conduct</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                You agree not to use the Platform to:
              </p>
              <ul className="list-disc list-inside text-lg text-secondary-500 space-y-2 mb-4">
                <li>Post false, inaccurate, misleading, or fraudulent information</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others, including intellectual property rights</li>
                <li>Transmit any harmful code, viruses, or malicious software</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Collect or store personal data about other users without their consent</li>
                <li>Use the Platform for any illegal or unauthorized purpose</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">5. Job Postings and Applications</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                Employers and recruiters are responsible for the accuracy of job postings. Candidates are responsible for the accuracy of their applications and profiles. We do not guarantee job placement or employment opportunities.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">6. Intellectual Property</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                The Platform and its original content, features, and functionality are owned by VMS Recruit and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">7. Payment Terms</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                Certain features of the Platform may require payment. By purchasing a subscription or service, you agree to pay all charges associated with your account. All fees are non-refundable unless otherwise stated.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">8. Termination</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                We may terminate or suspend your account and access to the Platform immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">9. Disclaimer of Warranties</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                The Platform is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the Platform will be uninterrupted, secure, or error-free.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">10. Limitation of Liability</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                To the fullest extent permitted by law, VMS Recruit shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">11. Indemnification</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                You agree to defend, indemnify, and hold harmless VMS Recruit and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your use of the Platform.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">12. Changes to Terms</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last Updated" date.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">13. Governing Law</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-secondary-800 mb-6">14. Contact Information</h2>
              <p className="text-lg text-secondary-500 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-lg text-secondary-500 leading-relaxed">
                <strong>Email:</strong> legal@vmsrecruit.com<br />
                <strong>Address:</strong> VMS Recruit, Legal Department
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

