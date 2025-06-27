import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

const AboutPage: React.FC = () => {
  const { logDataAction } = useAnalytics();

  React.useEffect(() => {
    logDataAction('view', 'about', 'about');
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: 'Former educator with 15+ years experience in educational technology. Passionate about bridging the gap between technology and education.',
      linkedin: '#',
      twitter: '#'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Tech leader with expertise in scalable systems and fintech solutions. Previously led engineering teams at major tech companies.',
      linkedin: '#',
      twitter: '#'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      bio: 'Product strategist focused on user experience and educational outcomes. Dedicated to creating intuitive solutions for schools and parents.',
      linkedin: '#',
      twitter: '#'
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'Head of Sales',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Sales leader with deep understanding of educational institutions. Committed to helping schools modernize their fee management processes.',
      linkedin: '#',
      twitter: '#'
    }
  ];

  const stats = [
    { number: '500+', label: 'Schools Trust Us', icon: 'fas fa-school' },
    { number: '50K+', label: 'Students Served', icon: 'fas fa-user-graduate' },
    { number: '$10M+', label: 'Payments Processed', icon: 'fas fa-dollar-sign' },
    { number: '99.9%', label: 'Uptime', icon: 'fas fa-shield-alt' }
  ];

  const values = [
    {
      icon: 'fas fa-heart',
      title: 'Student-First',
      description: 'Every decision we make prioritizes the educational experience and success of students.'
    },
    {
      icon: 'fas fa-lock',
      title: 'Security & Privacy',
      description: 'We maintain the highest standards of data protection and financial security.'
    },
    {
      icon: 'fas fa-lightbulb',
      title: 'Innovation',
      description: 'Continuously improving our platform with cutting-edge technology and user feedback.'
    },
    {
      icon: 'fas fa-hands-helping',
      title: 'Partnership',
      description: 'Working closely with schools to understand and solve their unique challenges.'
    }
  ];

  const timeline = [
    {
      year: '2020',
      title: 'Founded',
      description: 'FeeMaster was born from a simple observation: school fee management needed to be simpler, more secure, and more transparent.'
    },
    {
      year: '2021',
      title: 'First 100 Schools',
      description: 'Reached our first milestone of 100 schools using FeeMaster, processing over $1M in payments.'
    },
    {
      year: '2022',
      title: 'Series A Funding',
      description: 'Secured $5M in funding to expand our team and accelerate product development.'
    },
    {
      year: '2023',
      title: 'National Expansion',
      description: 'Expanded to serve schools across 25 states, processing over $10M in payments annually.'
    },
    {
      year: '2024',
      title: 'Future Forward',
      description: 'Launching advanced analytics, AI-powered insights, and mobile-first experiences.'
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
                  logDataAction('click', 'about_back_home', 'about_back_home');
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
                  logDataAction('click', 'about_contact_link', 'about_contact_link');
                  window.location.href = '/contact';
                }}
                className="text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Contact Us
              </button>
              <button
                onClick={() => {
                  logDataAction('click', 'about_login_link', 'about_login_link');
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
              <i className="fas fa-graduation-cap text-white text-4xl" aria-hidden="true"></i>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About FeeMaster
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Revolutionizing school fee management with secure, transparent, and user-friendly solutions that empower educational institutions and families.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  logDataAction('click', 'about_demo_request', 'about_demo_request');
                  window.location.href = '/contact';
                }}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Request Demo
              </button>
              <button
                onClick={() => {
                  logDataAction('click', 'about_learn_more', 'about_learn_more');
                  document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                  <i className={`${stat.icon} text-white text-2xl`} aria-hidden="true"></i>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div id="mission" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To simplify and modernize school fee management, making it easier for educational institutions to focus on what matters most: educating students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why We Exist</h3>
              <p className="text-gray-600 mb-6">
                Traditional school fee management is often complex, time-consuming, and prone to errors. Schools spend countless hours on manual processes, while parents struggle with unclear payment requirements and outdated communication methods.
              </p>
              <p className="text-gray-600 mb-6">
                FeeMaster was created to solve these challenges by providing a comprehensive, secure, and user-friendly platform that streamlines the entire fee management process.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-xs" aria-hidden="true"></i>
                  </div>
                  <span className="text-gray-700">Automated payment processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-xs" aria-hidden="true"></i>
                  </div>
                  <span className="text-gray-700">Real-time financial reporting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-xs" aria-hidden="true"></i>
                  </div>
                  <span className="text-gray-700">Secure parent portal</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                <h4 className="text-xl font-semibold mb-4">Our Vision</h4>
                <p className="text-blue-100">
                  To become the leading platform for educational financial management, empowering schools worldwide to operate more efficiently while providing families with transparent, accessible payment solutions.
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-gray-600">Schools Trust Us</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                  <i className={`${value.icon} text-white text-2xl`} aria-hidden="true"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a simple idea to a trusted platform serving hundreds of schools nationwide.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind FeeMaster, dedicated to transforming educational financial management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-200"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  <a
                    href={member.linkedin}
                    className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <i className="fab fa-linkedin text-lg" aria-hidden="true"></i>
                  </a>
                  <a
                    href={member.twitter}
                    className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    aria-label={`${member.name} Twitter`}
                  >
                    <i className="fab fa-twitter text-lg" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your School?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of schools already using FeeMaster to streamline their fee management processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                logDataAction('click', 'about_get_started', 'about_get_started');
                window.location.href = '/register';
              }}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Get Started Today
            </button>
            <button
              onClick={() => {
                logDataAction('click', 'about_schedule_demo', 'about_schedule_demo');
                window.location.href = '/contact';
              }}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 