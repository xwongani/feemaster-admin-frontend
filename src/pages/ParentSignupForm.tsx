import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import { signupParent } from '../services/parentPortalApi';
// import { useParentPortal } from '../contexts/parentPortalContext';

const ParentSignupForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: location.state?.parentPhone || '',
    address: ''
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
      // await signupParent(form);
      navigate('/parent-portal');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up as Parent</h2>
      <div style={{ marginBottom: 16 }}>
        <label>First Name</label>
        <input name="first_name" value={form.first_name} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Last Name</label>
        <input name="last_name" value={form.last_name} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Address</label>
        <input name="address" value={form.address} onChange={handleChange} />
      </div>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <button type="submit" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default ParentSignupForm; 