import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParentPortal } from '../contexts/parentPortalContext';
import { updateParent } from '../services/parentPortalApi';

const ParentUpdateForm: React.FC = () => {
  const { portalData, setPortalData } = useParentPortal();
  const navigate = useNavigate();
  if (!portalData) return <div>No data found. Please start from the lookup page.</div>;
  const parent = portalData.parents[0];
  const [form, setForm] = useState({
    first_name: parent.first_name,
    last_name: parent.last_name,
    email: parent.email,
    phone: parent.phone,
    address: parent.address || ''
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
      await updateParent(parent.id, form);
      setPortalData({ ...portalData, parents: [{ ...parent, ...form }] });
      navigate('/parent-portal/student');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Parent Info</h2>
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
        {loading ? 'Updating...' : 'Update'}
      </button>
    </form>
  );
};

export default ParentUpdateForm; 