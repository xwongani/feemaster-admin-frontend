import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParentPortal } from '../contexts/parentPortalContext';
import { deleteParent } from '../services/parentPortalApi';

const ParentDeleteAccount: React.FC = () => {
  const { portalData } = useParentPortal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  if (!portalData) return <div>No data found. Please start from the lookup page.</div>;
  const parent = portalData.parents[0];

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteParent(parent.id);
      navigate('/parent-portal');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Delete failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Delete Account</h2>
      <p>Are you sure you want to delete your parent account? This action cannot be undone.</p>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <button onClick={handleDelete} disabled={loading} style={{ color: 'red', width: '100%' }}>
        {loading ? 'Deleting...' : 'Delete Account'}
      </button>
      <button onClick={() => navigate('/parent-portal/student')} style={{ marginTop: 16, width: '100%' }}>
        Cancel
      </button>
    </div>
  );
};

export default ParentDeleteAccount; 