import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Alternative: import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// Use HashRouter if you're having issues with page reloads and can't configure the server
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RouteFallback from './components/RouteFallback';
import LoadingSpinner from './components/LoadingSpinner';
import './index.css';

// Lazy load components for better performance
const LandingPage = React.lazy(() => import('./components/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const UnauthorizedPage = React.lazy(() => import('./pages/UnauthorizedPage'));

// Public pages
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));
const HelpPage = React.lazy(() => import('./pages/HelpPage'));

// Parent Portal Components
const ParentDashboard = React.lazy(() => import('./pages/parent/Dashboard'));
const ParentProfile = React.lazy(() => import('./pages/parent/Profile'));
const ParentChildren = React.lazy(() => import('./pages/parent/Children'));
const ParentFees = React.lazy(() => import('./pages/parent/Fees'));
const ParentPayment = React.lazy(() => import('./pages/parent/Payment'));
const ParentPaymentHistory = React.lazy(() => import('./pages/parent/PaymentHistory'));
const ParentNotifications = React.lazy(() => import('./pages/parent/Notifications'));

// Admin Components
const AdminDashboard = React.lazy(() => import('./pages/Dashboard')); // Using existing Dashboard
const AdminStudents = React.lazy(() => import('./pages/Students')); // Using existing Students
const AdminSchools = React.lazy(() => import('./pages/admin/Schools'));
const AdminParents = React.lazy(() => import('./pages/admin/Parents'));
const AdminFees = React.lazy(() => import('./pages/admin/Fees'));
const AdminPayments = React.lazy(() => import('./pages/admin/Payments'));
const AdminReports = React.lazy(() => import('./pages/admin/Reports'));
const AdminSettings = React.lazy(() => import('./pages/admin/Settings'));

// Payment Components
const PaymentProcess = React.lazy(() => import('./pages/payment/Process'));
const PaymentSuccess = React.lazy(() => import('./pages/payment/Success'));
const PaymentCancel = React.lazy(() => import('./pages/payment/Cancel'));
const PaymentFailure = React.lazy(() => import('./pages/payment/Failure'));

// Legacy routes for backward compatibility
const LegacyDashboard = React.lazy(() => import('./pages/Dashboard'));
const LegacyStudents = React.lazy(() => import('./pages/Students'));
const LegacyLogin = React.lazy(() => import('./pages/Login'));

// Loading component for Suspense
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="xl" text="Loading page..." />
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Public Information Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/help" element={<HelpPage />} />

            {/* Parent Portal Routes */}
            <Route path="/parent/*" element={
              <ProtectedRoute allowedUserTypes={['parent']}>
                <Routes>
                  <Route path="dashboard" element={<ParentDashboard />} />
                  <Route path="profile" element={<ParentProfile />} />
                  <Route path="children" element={<ParentChildren />} />
                  <Route path="fees" element={<ParentFees />} />
                  <Route path="payment" element={<ParentPayment />} />
                  <Route path="payment/history" element={<ParentPaymentHistory />} />
                  <Route path="notifications" element={<ParentNotifications />} />
                  <Route path="*" element={<RouteFallback />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedUserTypes={['admin']}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="schools" element={<AdminSchools />} />
                  <Route path="students" element={<AdminStudents />} />
                  <Route path="parents" element={<AdminParents />} />
                  <Route path="fees" element={<AdminFees />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="*" element={<RouteFallback />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* Payment Gateway Routes */}
            <Route path="/payment/*" element={
              <ProtectedRoute>
                <Routes>
                  <Route path="process" element={<PaymentProcess />} />
                  <Route path="success" element={<PaymentSuccess />} />
                  <Route path="cancel" element={<PaymentCancel />} />
                  <Route path="failure" element={<PaymentFailure />} />
                  <Route path="*" element={<RouteFallback />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* Legacy Routes for Backward Compatibility */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedUserTypes={['admin']}>
                <LegacyDashboard />
              </ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute allowedUserTypes={['admin']}>
                <LegacyStudents />
              </ProtectedRoute>
            } />

            {/* Fallback Route - handles unknown URLs */}
            <Route path="*" element={<RouteFallback />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App; 