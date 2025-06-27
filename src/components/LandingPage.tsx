import React from 'react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';

const LandingPage: React.FC = () => {
  const { logDataAction } = useAnalytics();

  React.useEffect(() => {
    logDataAction('view', 'landing', 'landing');
  }, []);

  const handleGetStartedClick = () => {
    logDataAction('view', 'landing_get_started', 'landing_get_started');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="absolute inset-0 opacity-30">
          {/* Floating particles animation */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Company Name */}
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 text-center tracking-tight">
          FeeMaster
        </h1>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl text-white/90 mb-8 text-center">
          Smarter School Fee Management
        </p>
        
        {/* CTA Button */}
        <Link
          to="/login"
          onClick={handleGetStartedClick}
          className="bg-white text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg mb-12 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="Get started with FeeMaster"
        >
          Get Started
        </Link>
        
        {/* Process Timeline */}
        <div className="flex items-center space-x-4 md:space-x-8 max-w-2xl" role="region" aria-label="Getting started process">
          {[
            { step: 1, label: 'Sign Up' },
            { step: 2, label: 'Your Details' },
            { step: 3, label: 'Confirm Info' },
            { step: 4, label: 'Finish' }
          ].map((item, index) => (
            <div key={item.step} className="flex flex-col items-center">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 bg-white rounded-full shadow-lg"
                  aria-label={`Step ${item.step}: ${item.label}`}
                ></div>
                {index < 3 && (
                  <div className="w-12 md:w-16 h-0.5 bg-white/60 ml-2"></div>
                )}
              </div>
              <span className="text-white text-sm md:text-base mt-2 text-center">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Additional Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-shield-alt text-2xl" aria-hidden="true"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
            <p className="text-white/80 text-sm">Bank-grade security for all transactions</p>
          </div>
          
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-chart-line text-2xl" aria-hidden="true"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
            <p className="text-white/80 text-sm">Track payments and generate reports instantly</p>
          </div>
          
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-mobile-alt text-2xl" aria-hidden="true"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-white/80 text-sm">Access from any device, anywhere</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-16 flex flex-wrap justify-center gap-6 text-white/80">
          <Link 
            to="/about" 
            className="text-sm hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
            onClick={() => logDataAction('view', 'landing_about_link', 'landing_about_link')}
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            className="text-sm hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
            onClick={() => logDataAction('view', 'landing_contact_link', 'landing_contact_link')}
          >
            Contact
          </Link>
          <Link 
            to="/privacy" 
            className="text-sm hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
            onClick={() => logDataAction('view', 'landing_privacy_link', 'landing_privacy_link')}
          >
            Privacy Policy
          </Link>
          <Link 
            to="/terms" 
            className="text-sm hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
            onClick={() => logDataAction('view', 'landing_terms_link', 'landing_terms_link')}
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 