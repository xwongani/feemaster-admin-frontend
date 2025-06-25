import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { lookupParentOrStudent } from '../services/parentPortalApi';
// import { useParentPortal } from '../contexts/parentPortalContext';

const ParentLookupForm: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const { setPortalData } = useParentPortal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // const res = await lookupParentOrStudent({ student_id: studentId, parent_phone: parentPhone });
      // setPortalData(res);
      navigate('/parent-portal/student');
    } catch (err: any) {
      if (err?.response?.status === 404) {
        navigate('/parent-portal/signup', { state: { parentPhone } });
      } else {
        setError(err?.response?.data?.detail || 'An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Parent Portal</h2>
      <p>Enter your child's Student ID or your phone number to view and pay fees.</p>
      <div style={{ marginBottom: 16 }}>
        <label>Student ID</label>
        <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="e.g. S12345" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Parent Phone</label>
        <input type="text" value={parentPhone} onChange={e => setParentPhone(e.target.value)} placeholder="e.g. 097XXXXXXX" />
      </div>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <button type="submit" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Looking up...' : 'Continue'}
      </button>
    </form>
  );
};

export default ParentLookupForm; 