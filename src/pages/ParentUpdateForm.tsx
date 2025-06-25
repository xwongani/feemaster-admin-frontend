import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useParentPortal } from '../contexts/parentPortalContext';
// import { updateParent } from '../services/parentPortalApi';

const ParentUpdateForm: React.FC = () => {
  // const { portalData, setPortalData } = useParentPortal();
  const navigate = useNavigate();
  
  // Placeholder data - replace with real data from context
  const [form, setForm] = useState({
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane.doe@email.com',
    phone: '0971112222',
    address: '123 Main Street, Lusaka, Zambia'
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Replace with real API call
      // await updateParent(parent.id, form);
      // setPortalData({ ...portalData, parents: [{ ...parent, ...form }] });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message and redirect
      navigate('/parent-portal/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/parent-portal/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Update Profile</h1>
            <p className="text-gray-600 mt-1">Update your personal information and contact details</p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <div className="flex">
                <i className="fas fa-exclamation-circle mt-0.5 mr-2"></i>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  className="form-input w-full"
                  placeholder="Enter your first name"
                  value={form.first_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  className="form-input w-full"
                  placeholder="Enter your last name"
                  value={form.last_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-input w-full"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  This email will be used for important notifications and password recovery
                </p>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="form-input w-full"
                  placeholder="e.g., 0971112222"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter your mobile number for SMS notifications
                </p>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="form-input w-full"
                  placeholder="Enter your full address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Optional: Your residential address for records
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              )}
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Information Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <i className="fas fa-info-circle text-blue-400 mt-0.5 mr-2"></i>
          <div className="text-sm text-blue-700">
            <p className="font-medium">Important:</p>
            <p className="mt-1">
              Changes to your contact information may require verification. 
              You'll receive a confirmation email after updating your details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentUpdateForm; 