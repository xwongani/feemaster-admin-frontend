import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

const HelpPage: React.FC = () => {
  const { logDataAction } = useAnalytics();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  React.useEffect(() => {
    logDataAction('Help Page');
  }, []);

  const categories = [
    { id: 'all', name: 'All Topics', icon: 'fas fa-th-large' },
    { id: 'getting-started', name: 'Getting Started', icon: 'fas fa-rocket' },
    { id: 'payments', name: 'Payments', icon: 'fas fa-credit-card' },
    { id: 'students', name: 'Student Management', icon: 'fas fa-user-graduate' },
    { id: 'reports', name: 'Reports & Analytics', icon: 'fas fa-chart-bar' },
    { id: 'integrations', name: 'Integrations', icon: 'fas fa-plug' },
    { id: 'account', name: 'Account & Settings', icon: 'fas fa-cog' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: 'fas fa-tools' }
  ];

  const helpArticles = [
    {
      id: 'getting-started-1',
      category: 'getting-started',
      title: 'How to Set Up Your School Account',
      description: 'Complete guide to setting up your FeeMaster account for your school.',
      content: `
        <h3>Step 1: Account Creation</h3>
        <p>Begin by creating your school account with basic information including school name, address, and contact details.</p>
        
        <h3>Step 2: School Profile Setup</h3>
        <p>Configure your school profile with academic year settings, fee structures, and payment terms.</p>
        
        <h3>Step 3: User Management</h3>
        <p>Add administrators, teachers, and staff members with appropriate access levels.</p>
        
        <h3>Step 4: Payment Gateway Configuration</h3>
        <p>Set up your preferred payment methods and configure transaction settings.</p>
        
        <h3>Step 5: Student Import</h3>
        <p>Import your existing student database or add students manually to the system.</p>
      `,
      tags: ['setup', 'onboarding', 'configuration'],
      difficulty: 'Beginner',
      readTime: '5 min read'
    },
    {
      id: 'payments-1',
      category: 'payments',
      title: 'Understanding Payment Processing',
      description: 'Learn how payments are processed and what happens after a payment is made.',
      content: `
        <h3>Payment Flow</h3>
        <p>When a parent makes a payment, it goes through several stages:</p>
        <ol>
          <li><strong>Initiation:</strong> Parent selects payment method and amount</li>
          <li><strong>Processing:</strong> Payment gateway processes the transaction</li>
          <li><strong>Verification:</strong> System verifies payment details</li>
          <li><strong>Confirmation:</strong> Payment is confirmed and recorded</li>
          <li><strong>Notification:</strong> All parties are notified of successful payment</li>
        </ol>
        
        <h3>Payment Methods</h3>
        <p>We support multiple payment methods:</p>
        <ul>
          <li>Credit/Debit Cards (Visa, MasterCard, American Express)</li>
          <li>ACH Bank Transfers</li>
          <li>Digital Wallets (Apple Pay, Google Pay)</li>
          <li>Check Payments (manual processing)</li>
        </ul>
        
        <h3>Processing Times</h3>
        <p>Payment processing times vary by method:</p>
        <ul>
          <li>Credit/Debit Cards: Instant</li>
          <li>ACH Transfers: 1-3 business days</li>
          <li>Digital Wallets: Instant</li>
          <li>Checks: 5-7 business days</li>
        </ul>
      `,
      tags: ['payments', 'processing', 'methods'],
      difficulty: 'Intermediate',
      readTime: '8 min read'
    },
    {
      id: 'students-1',
      category: 'students',
      title: 'Managing Student Records',
      description: 'Complete guide to adding, editing, and managing student information.',
      content: `
        <h3>Adding New Students</h3>
        <p>You can add students individually or in bulk:</p>
        
        <h4>Individual Addition</h4>
        <ol>
          <li>Navigate to Students section</li>
          <li>Click "Add New Student"</li>
          <li>Fill in required information</li>
          <li>Assign to appropriate grade/class</li>
          <li>Set up fee structure</li>
        </ol>
        
        <h4>Bulk Import</h4>
        <ol>
          <li>Prepare CSV file with student data</li>
          <li>Use "Bulk Import" feature</li>
          <li>Map columns to fields</li>
          <li>Review and confirm import</li>
        </ol>
        
        <h3>Student Information Fields</h3>
        <p>Required fields include:</p>
        <ul>
          <li>Student ID</li>
          <li>First and Last Name</li>
          <li>Date of Birth</li>
          <li>Grade/Class</li>
          <li>Parent/Guardian Information</li>
        </ul>
        
        <h3>Fee Assignment</h3>
        <p>Each student can be assigned specific fee structures based on their grade level, program, or special circumstances.</p>
      `,
      tags: ['students', 'records', 'management'],
      difficulty: 'Beginner',
      readTime: '6 min read'
    },
    {
      id: 'reports-1',
      category: 'reports',
      title: 'Generating Financial Reports',
      description: 'Learn how to create and interpret various financial reports.',
      content: `
        <h3>Available Reports</h3>
        <p>FeeMaster provides several types of reports:</p>
        
        <h4>Payment Reports</h4>
        <ul>
          <li>Daily payment summaries</li>
          <li>Monthly collection reports</li>
          <li>Payment method analysis</li>
          <li>Outstanding balance reports</li>
        </ul>
        
        <h4>Student Reports</h4>
        <ul>
          <li>Individual student statements</li>
          <li>Class-wise fee collection</li>
          <li>Grade-level summaries</li>
          <li>Payment history reports</li>
        </ul>
        
        <h4>Analytics Reports</h4>
        <ul>
          <li>Collection trends</li>
          <li>Payment pattern analysis</li>
          <li>Revenue forecasting</li>
          <li>Performance metrics</li>
        </ul>
        
        <h3>Customizing Reports</h3>
        <p>You can customize reports by:</p>
        <ul>
          <li>Selecting date ranges</li>
          <li>Filtering by student groups</li>
          <li>Choosing specific fee types</li>
          <li>Adding custom fields</li>
        </ul>
        
        <h3>Export Options</h3>
        <p>Reports can be exported in multiple formats:</p>
        <ul>
          <li>PDF for printing</li>
          <li>Excel for analysis</li>
          <li>CSV for data processing</li>
          <li>Email delivery</li>
        </ul>
      `,
      tags: ['reports', 'analytics', 'financial'],
      difficulty: 'Intermediate',
      readTime: '10 min read'
    },
    {
      id: 'integrations-1',
      category: 'integrations',
      title: 'Setting Up Third-Party Integrations',
      description: 'Connect FeeMaster with your existing school management systems.',
      content: `
        <h3>Supported Integrations</h3>
        <p>FeeMaster integrates with popular school management systems:</p>
        
        <h4>Student Information Systems</h4>
        <ul>
          <li>PowerSchool</li>
          <li>Blackbaud</li>
          <li>Infinite Campus</li>
          <li>Skyward</li>
          <li>SchoolTool</li>
        </ul>
        
        <h4>Accounting Software</h4>
        <ul>
          <li>QuickBooks</li>
          <li>Xero</li>
          <li>Sage</li>
          <li>FreshBooks</li>
        </ul>
        
        <h4>Communication Platforms</h4>
        <ul>
          <li>Mailchimp</li>
          <li>Constant Contact</li>
          <li>SendGrid</li>
          <li>Twilio</li>
        </ul>
        
        <h3>Setup Process</h3>
        <ol>
          <li>Navigate to Integrations section</li>
          <li>Select your system from the list</li>
          <li>Enter API credentials</li>
          <li>Configure data mapping</li>
          <li>Test the connection</li>
          <li>Enable synchronization</li>
        </ol>
        
        <h3>Data Synchronization</h3>
        <p>Integration ensures:</p>
        <ul>
          <li>Automatic student data updates</li>
          <li>Real-time payment synchronization</li>
          <li>Consistent fee structures</li>
          <li>Unified reporting</li>
        </ul>
      `,
      tags: ['integrations', 'api', 'synchronization'],
      difficulty: 'Advanced',
      readTime: '12 min read'
    },
    {
      id: 'troubleshooting-1',
      category: 'troubleshooting',
      title: 'Common Issues and Solutions',
      description: 'Quick fixes for frequently encountered problems.',
      content: `
        <h3>Payment Issues</h3>
        
        <h4>Payment Declined</h4>
        <p><strong>Possible causes:</strong></p>
        <ul>
          <li>Insufficient funds</li>
          <li>Card expired</li>
          <li>Incorrect card information</li>
          <li>Bank security restrictions</li>
        </ul>
        <p><strong>Solutions:</strong></p>
        <ul>
          <li>Verify card details</li>
          <li>Contact bank for authorization</li>
          <li>Try alternative payment method</li>
          <li>Check with our support team</li>
        </ul>
        
        <h4>Payment Not Showing</h4>
        <p><strong>Possible causes:</strong></p>
        <ul>
          <li>Processing delay</li>
          <li>System synchronization issue</li>
          <li>Incorrect student assignment</li>
        </ul>
        <p><strong>Solutions:</strong></p>
        <ul>
          <li>Wait 24-48 hours for processing</li>
          <li>Check payment confirmation email</li>
          <li>Contact support with transaction ID</li>
        </ul>
        
        <h3>Account Access Issues</h3>
        
        <h4>Can't Log In</h4>
        <p><strong>Solutions:</strong></p>
        <ul>
          <li>Reset password using "Forgot Password"</li>
          <li>Check email for verification link</li>
          <li>Clear browser cache and cookies</li>
          <li>Try different browser or device</li>
        </ul>
        
        <h4>Missing Permissions</h4>
        <p><strong>Solutions:</strong></p>
        <ul>
          <li>Contact your administrator</li>
          <li>Verify your role assignments</li>
          <li>Check account status</li>
        </ul>
      `,
      tags: ['troubleshooting', 'support', 'issues'],
      difficulty: 'Beginner',
      readTime: '7 min read'
    }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleArticleClick = (articleId: string) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
    logDataAction(`help_article_${articleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  logDataAction('help_back_home');
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
                  logDataAction('help_contact_link');
                  window.location.href = '/contact';
                }}
                className="text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Contact Support
              </button>
              <button
                onClick={() => {
                  logDataAction('help_login_link');
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
              <i className="fas fa-question-circle text-white text-4xl" aria-hidden="true"></i>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Help Center
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Find answers to your questions, learn how to use FeeMaster effectively, and get the support you need.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400" aria-hidden="true"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search for help articles, tutorials, or troubleshooting..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <i className="fas fa-video text-white text-2xl" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-gray-600 mb-4">Step-by-step video guides for common tasks</p>
              <button
                onClick={() => logDataAction('help_video_tutorials')}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Watch Videos →
              </button>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors duration-200">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <i className="fas fa-comments text-white text-2xl" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Get instant help from our support team</p>
              <button
                onClick={() => logDataAction('help_live_chat')}
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Start Chat →
              </button>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors duration-200">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                <i className="fas fa-phone text-white text-2xl" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">Speak directly with our experts</p>
              <button
                onClick={() => logDataAction('help_phone_support')}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Call Now →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories and Articles */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    logDataAction(`help_category_${category.id}`);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className={`${category.icon} text-sm`} aria-hidden="true"></i>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Articles */}
          <div className="space-y-6">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            article.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                            article.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {article.difficulty}
                          </span>
                          <span className="text-sm text-gray-500">{article.readTime}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h3>
                        <p className="text-gray-600 mb-3">{article.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4">
                        <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-200 ${
                          expandedArticle === article.id ? 'rotate-180' : ''
                        }`} aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>
                  
                  {expandedArticle === article.id && (
                    <div className="px-6 pb-6 border-t border-gray-200">
                      <div 
                        className="prose prose-lg max-w-none mt-4"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                      />
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => logDataAction(`help_article_helpful_${article.id}`)}
                              className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                            >
                              <i className="fas fa-thumbs-up" aria-hidden="true"></i>
                              <span>Helpful</span>
                            </button>
                            <button
                              onClick={() => logDataAction(`help_article_not_helpful_${article.id}`)}
                              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                            >
                              <i className="fas fa-thumbs-down" aria-hidden="true"></i>
                              <span>Not Helpful</span>
                            </button>
                          </div>
                          <button
                            onClick={() => logDataAction(`help_article_contact_${article.id}`)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Still need help? Contact us
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-search text-gray-400 text-2xl" aria-hidden="true"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search terms or browse by category</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Still Need Help?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Our support team is here to help you get the most out of FeeMaster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                logDataAction('help_contact_support');
                window.location.href = '/contact';
              }}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Support
            </button>
            <button
              onClick={() => {
                logDataAction('help_schedule_call');
                window.location.href = '/contact';
              }}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 