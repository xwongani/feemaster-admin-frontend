import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useParentPortal } from '../contexts/parentPortalContext';

const ParentStudentInfo: React.FC = () => {
  // const { portalData } = useParentPortal();
  const navigate = useNavigate();

  // For now, just show a placeholder until parent portal context is ready
  return (
    <div>
      <h2>Student Information</h2>
      <div>Parent portal student info will appear here.</div>
      <button onClick={() => navigate('/parent-portal')}>Back to Lookup</button>
    </div>
  );
};

export default ParentStudentInfo; 