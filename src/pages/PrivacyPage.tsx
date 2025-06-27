import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

const PrivacyPage: React.FC = () => {
  const { logDataAction } = useAnalytics();

  React.useEffect(() => {
    logDataAction('view', 'privacy', 'privacy');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  logDataAction('view', 'privacy_back_home', 'privacy_back_home');
                  window.location.href = '/';
                }}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                <i className="fas fa-arrow-left" aria-hidden="true"></i>
                <span>Back to Home</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  logDataAction('view', 'privacy_contact_link', 'privacy_contact_link');
                  window.location.href = '/contact';
                }}
                className="text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Contact Us
              </button>
              <button
                onClick={() => {
                  logDataAction('view', 'privacy_login_link', 'privacy_login_link');
                  window.location.href = '/login';
                }}
                className="primary-btn"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center shadow-2xl mb-8">
              <i className="fas fa-shield-alt text-white text-4xl" aria-hidden="true"></i>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Privacy Policy</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Your privacy is our priority. Learn how we protect and handle your personal information.
            </p>
            <p className="text-lg text-blue-200">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h2>
            <p className="text-gray-700 mb-6">
              FeeMaster ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our school fee management platform.
            </p>
            <p className="text-gray-700 mb-6">
              By using FeeMaster, you agree to the collection and use of information in accordance with this policy. We are committed to transparency and will notify you of any changes to this policy.
            </p>
          </div>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Information We Collect</h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h3>
            <p className="text-gray-700 mb-4">We collect information that you provide directly to us:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>Account Information:</strong> Name, email address, phone number, and password</li>
              <li><strong>School Information:</strong> School name, address, contact details, and administrative information</li>
              <li><strong>Student Information:</strong> Student names, IDs, grade levels, and academic information</li>
              <li><strong>Parent/Guardian Information:</strong> Contact details, payment information, and relationship to students</li>
              <li><strong>Payment Information:</strong> Credit card details, bank account information, and transaction history</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Automatically Collected Information</h3>
            <p className="text-gray-700 mb-4">We automatically collect certain information when you use our platform:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>Usage Data:</strong> Pages visited, features used, and time spent on the platform</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
              <li><strong>Log Data:</strong> Server logs, error reports, and performance metrics</li>
              <li><strong>Cookies and Tracking:</strong> Session cookies, analytics cookies, and preference settings</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Information</h3>
            <p className="text-gray-700 mb-4">We may receive information from third parties:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Payment processors and financial institutions</li>
              <li>School management systems and educational platforms</li>
              <li>Analytics and monitoring services</li>
              <li>Customer support and communication tools</li>
            </ul>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Service Provision</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Process payments and manage fee collections</li>
                  <li>Generate reports and financial statements</li>
                  <li>Send notifications and communications</li>
                  <li>Provide customer support and assistance</li>
                  <li>Maintain and improve our platform</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Business Operations</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Analyze usage patterns and trends</li>
                  <li>Develop new features and services</li>
                  <li>Ensure platform security and reliability</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Prevent fraud and abuse</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sharing */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Information Sharing and Disclosure</h2>
            
            <p className="text-gray-700 mb-6">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">With Your Consent</h3>
                <p className="text-gray-700">We may share your information when you explicitly consent to such sharing.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Service Providers</h3>
                <p className="text-gray-700 mb-3">We work with trusted third-party service providers who assist us in:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Payment processing and financial services</li>
                  <li>Cloud hosting and infrastructure</li>
                  <li>Customer support and communication</li>
                  <li>Analytics and monitoring</li>
                  <li>Security and fraud prevention</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Legal Requirements</h3>
                <p className="text-gray-700">We may disclose your information when required by law, court order, or government request.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Business Transfers</h3>
                <p className="text-gray-700">In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Safety and Security</h3>
                <p className="text-gray-700">We may share information to protect the safety and security of our users, platform, or the public.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Security</h2>
            
            <p className="text-gray-700 mb-6">
              We implement comprehensive security measures to protect your personal information:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Safeguards</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>End-to-end encryption for data transmission</li>
                  <li>Secure socket layer (SSL) technology</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Multi-factor authentication for account access</li>
                  <li>Automated threat detection and response</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Organizational Measures</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Employee training on data protection</li>
                  <li>Access controls and role-based permissions</li>
                  <li>Regular backup and disaster recovery procedures</li>
                  <li>Incident response and breach notification protocols</li>
                  <li>Compliance with industry security standards</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Security Certifications</h3>
              <p className="text-blue-800">
                FeeMaster is PCI DSS Level 1 compliant and SOC 2 Type II certified, ensuring the highest standards of data security and privacy protection.
              </p>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Privacy Rights</h2>
            
            <p className="text-gray-700 mb-6">
              You have certain rights regarding your personal information:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Access and Portability</h3>
                  <p className="text-gray-700">Request access to your personal information and receive a copy in a portable format.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Correction</h3>
                  <p className="text-gray-700">Request correction of inaccurate or incomplete personal information.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Deletion</h3>
                  <p className="text-gray-700">Request deletion of your personal information, subject to legal requirements.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Restriction</h3>
                  <p className="text-gray-700">Request restriction of processing in certain circumstances.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Objection</h3>
                  <p className="text-gray-700">Object to processing of your personal information for specific purposes.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Withdrawal of Consent</h3>
                  <p className="text-gray-700">Withdraw consent for processing where consent was the legal basis.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-green-50 rounded-lg">
              <h3 className="text-lg font-bold text-green-900 mb-2">Exercise Your Rights</h3>
              <p className="text-green-800 mb-4">
                To exercise any of these rights, please contact us using the information provided below. We will respond to your request within 30 days.
              </p>
              <button
                onClick={() => {
                  logDataAction('view', 'privacy_contact_rights', 'privacy_contact_rights');
                  window.location.href = '/contact';
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Contact Us About Your Rights
              </button>
            </div>
          </div>
        </div>

        {/* Cookies and Tracking */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Cookies and Tracking Technologies</h2>
            
            <p className="text-gray-700 mb-6">
              We use cookies and similar tracking technologies to enhance your experience on our platform:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Essential Cookies</h3>
                <p className="text-gray-700">Required for basic platform functionality, including authentication and security.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics Cookies</h3>
                <p className="text-gray-700">Help us understand how users interact with our platform to improve performance.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Preference Cookies</h3>
                <p className="text-gray-700">Remember your settings and preferences for a personalized experience.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Marketing Cookies</h3>
                <p className="text-gray-700">Used to deliver relevant advertisements and measure campaign effectiveness.</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">Cookie Management</h3>
              <p className="text-yellow-800">
                You can control cookie settings through your browser preferences. However, disabling certain cookies may affect platform functionality.
              </p>
            </div>
          </div>
        </div>

        {/* Children's Privacy */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Children's Privacy</h2>
            
            <p className="text-gray-700 mb-6">
              FeeMaster is designed for educational institutions and is not intended for direct use by children under 13. Student information is collected and processed by schools and parents/guardians who have provided consent.
            </p>

            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-bold text-purple-900 mb-2">COPPA Compliance</h3>
              <p className="text-purple-800">
                We comply with the Children's Online Privacy Protection Act (COPPA) and work with schools to ensure proper consent and data handling for student information.
              </p>
            </div>
          </div>
        </div>

        {/* International Transfers */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">International Data Transfers</h2>
            
            <p className="text-gray-700 mb-6">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers:
            </p>

            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Standard contractual clauses approved by data protection authorities</li>
              <li>Adequacy decisions for countries with equivalent data protection standards</li>
              <li>Certification schemes and codes of conduct</li>
              <li>Regular assessments of transfer mechanisms and recipient countries</li>
            </ul>

            <div className="p-6 bg-indigo-50 rounded-lg">
              <h3 className="text-lg font-bold text-indigo-900 mb-2">GDPR Compliance</h3>
              <p className="text-indigo-800">
                For users in the European Union, we comply with the General Data Protection Regulation (GDPR) and provide additional rights and protections.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
            
            <p className="text-gray-700 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy Officer</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> privacy@feemaster.com</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Address:</strong> 123 Education Street, Tech City, TC 12345</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Data Protection Officer</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> dpo@feemaster.com</p>
                  <p><strong>Phone:</strong> +1 (555) 234-5678</p>
                  <p><strong>Address:</strong> 456 Compliance Avenue, Security City, SC 54321</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Report Privacy Concerns</h3>
              <p className="text-blue-800 mb-4">
                If you believe we have not addressed your privacy concerns adequately, you have the right to contact your local data protection authority.
              </p>
              <button
                onClick={() => {
                  logDataAction('view', 'privacy_contact_concerns', 'privacy_contact_concerns');
                  window.location.href = '/contact';
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Report a Privacy Concern
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                logDataAction('view', 'privacy_terms_link', 'privacy_terms_link');
                window.location.href = '/terms';
              }}
              className="secondary-btn"
            >
              Terms of Service
            </button>
            <button
              onClick={() => {
                logDataAction('view', 'privacy_contact_link', 'privacy_contact_link');
                window.location.href = '/contact';
              }}
              className="primary-btn"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage; 