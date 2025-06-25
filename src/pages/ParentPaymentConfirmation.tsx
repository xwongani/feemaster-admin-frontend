import React from 'react';
import { useParentPortal } from '../contexts/parentPortalContext';

const ParentPaymentConfirmation: React.FC = () => {
  const { portalData } = useParentPortal();
  if (!portalData) return <div>No data found. Please start from the lookup page.</div>;
  const { student } = portalData;
  return (
    <div>
      <h2>Payment Successful</h2>
      <p>Thank you for your payment!</p>
      <div><b>Student:</b> {student.first_name} {student.last_name} ({student.student_id})</div>
      <div style={{ marginTop: 24 }}>
        <a href="/parent-portal">Return to Parent Portal</a>
      </div>
    </div>
  );
};

export default ParentPaymentConfirmation; 