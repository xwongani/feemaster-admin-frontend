import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useParentPortal } from '../contexts/parentPortalContext';

const ParentStudentInfo: React.FC = () => {
  // const { portalData } = useParentPortal();
  const navigate = useNavigate();

  // Placeholder: Replace with real parent/children data from context or API
  const parent = { first_name: 'Jane', last_name: 'Doe' };
  const children = [
    { first_name: 'Alice', last_name: 'Doe', student_id: 'S2024001', grade: 'Grade 10' },
    { first_name: 'Bob', last_name: 'Doe', student_id: 'S2024002', grade: 'Grade 8' }
  ];

  return (
    <div>
      <h2>Welcome, {parent.first_name} {parent.last_name}</h2>
      <h3>Your Children:</h3>
      <ul style={{ marginBottom: 24 }}>
        {children.map(child => (
          <li key={child.student_id}>
            <b>{child.first_name} {child.last_name}</b> ({child.student_id}) - {child.grade}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/parent-portal/pay')} style={{ width: '100%', marginBottom: 8 }}>
        Go to Payment
      </button>
      <button onClick={() => navigate('/parent-portal/update')} style={{ width: '100%', marginBottom: 8 }}>
        Update Info
      </button>
      <button onClick={() => navigate('/parent-portal/delete')} style={{ color: 'red', width: '100%' }}>
        Delete Account
      </button>
    </div>
  );
};

export default ParentStudentInfo; 