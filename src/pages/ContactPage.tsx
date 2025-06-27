import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

const ContactPage: React.FC = () => {
  const { logDataAction } = useAnalytics();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    message: '',
    contactMethod: 'email',
    urgency: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  React.useEffect(() => {
    logDataAction('view', 'contact', 'contact');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    logDataAction('click', 'contact_form_submit', 'contact_form_submit');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organization: '',
        subject: '',
        message: '',
        contactMethod: 'email',
        urgency: 'normal'
      });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: 'fas fa-phone',
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      contact: '+1 (555) 123-4567',
      action: 'Call Now'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email Support',
      description: 'Get detailed responses within 24 hours',
      contact: 'support@feemaster.com',
      action: 'Send Email'
    },
    {
      icon: 'fas fa-comments',
      title: 'Live Chat',
      description: 'Instant help during business hours',
      contact: 'Available 9 AM - 6 PM EST',
      action: 'Start Chat'
    }
  ];

  const offices = [
    {
      city: 'San Francisco',
      address: '123 Innovation Drive, Suite 100',
      state: 'CA 94105',
      phone: '+1 (555) 123-4567',
      email: 'sf@feemaster.com',
      hours: 'Mon-Fri, 9AM-6PM PST'
    },
    {
      city: 'New York',
      address: '456 Tech Avenue, Floor 15',
      state: 'NY 10001',
      phone: '+1 (555) 234-5678',
      email: 'nyc@feemaster.com',
      hours: 'Mon-Fri, 9AM-6PM EST'
    },
    {
      city: 'Austin',
      address: '789 Startup Street, Building A',
      state: 'TX 78701',
      phone: '+1 (555) 345-6789',
      email: 'austin@feemaster.com',
      hours: 'Mon-Fri, 9AM-6PM CST'
    }
  ];

  const faqs = [
    {
      question: 'How does FeeMaster work?',
      answer: 'FeeMaster is a comprehensive school fee management platform that allows schools to create fee structures, parents to make payments securely, and administrators to track all transactions in real-time.'
    },
    {
      question: 'Is FeeMaster secure and compliant?',
      answer: 'Yes, FeeMaster is PCI DSS Level 1 compliant and uses bank-grade encryption. We are also SOC 2 Type II certified and follow strict data protection standards.'
    },
    {
      question: 'Can we integrate with our existing school management system?',
      answer: 'Absolutely! FeeMaster offers APIs and integrations with most popular school management systems including PowerSchool, Blackbaud, and custom solutions.'
    },
    {
      question: 'What payment methods are supported?',
      answer: 'We support credit/debit cards, bank transfers, mobile money, and digital wallets. We also offer installment payment plans for larger fees.'
    },
    {
      question: 'How much does FeeMaster cost?',
      answer: 'Our pricing is based on the number of students and includes all features. We offer flexible plans starting from $2 per student per month with volume discounts available.'
    },
    {
      question: 'Do you provide training and support?',
      answer: 'Yes! We provide comprehensive onboarding, training sessions, and 24/7 customer support to ensure a smooth transition and ongoing success.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  logDataAction('click', 'contact_back_home', 'contact_back_home');
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
                  logDataAction('click', 'contact_about_link', 'contact_about_link');
                  window.location.href = '/about';
                }}
                className="text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                About Us
              </button>
              <button
                onClick={() => {
                  logDataAction('click', 'contact_login_link', 'contact_login_link');
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
              <i className="fas fa-headset text-white text-4xl" aria-hidden="true"></i>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              We're here to help! Whether you have questions about our platform, need technical support, or want to explore partnership opportunities, we'd love to hear from you.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Can We Help?</h2>
            <p className="text-lg text-gray-600">Choose the best way to reach us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                  <i className={`${method.icon} text-white text-2xl`} aria-hidden="true"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <p className="text-lg font-medium text-blue-600 mb-6">{method.contact}</p>
                <button
                  onClick={() => {
                    logDataAction('click', `contact_${method.title.toLowerCase().replace(' ', '_')}`, `contact_${method.title.toLowerCase().replace(' ', '_')}`);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  {method.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
              <p className="text-lg text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
            </div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                  School/Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your school or organization name"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="demo">Request Demo</option>
                  <option value="pricing">Pricing Information</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                  Subscribe to our newsletter for updates and tips
                </label>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  onClick={() => {
                    logDataAction('click', 'contact_form_submit', 'contact_form_submit');
                  }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Find quick answers to common questions</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Offices</h2>
            <p className="text-lg text-gray-600">Visit us at one of our locations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offices.map((office, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-map-marker-alt text-white text-xl" aria-hidden="true"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{office.city}</h3>
                    <p className="text-gray-600">{office.address}</p>
                  </div>
                </div>
                <div className="space-y-3 text-gray-600">
                  <p>{office.state}</p>
                  <p className="font-medium text-blue-600">{office.phone}</p>
                  <p className="font-medium text-blue-600">{office.email}</p>
                  <p className="font-medium text-blue-600">{office.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 