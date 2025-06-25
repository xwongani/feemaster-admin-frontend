import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParentPortal } from '../contexts/parentPortalContext';
import { makePayment } from '../services/parentPortalApi';

const ParentPaymentPage: React.FC = () => {
  const { portalData } = useParentPortal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!portalData) return <div>No data found. Please start from the lookup page.</div>;
  const { student, outstanding_fees } = portalData;
  const total = outstanding_fees.reduce((sum: number, fee: any) => sum + Number(fee.amount), 0);

  // Placeholder for TUMENY widget integration
  const handleTumenyPayment = async () => {
    setLoading(true);
    setError('');
    try {
      // Here you would trigger the TUMENY widget and get a payment confirmation/token
      // For now, we simulate success
      // const tumenyResult = await tumenyWidget({ amount: total, ... });
      // if (tumenyResult.success) {
      await makePayment({
        student_id: student.id,
        amount: total,
        payment_method: 'tumeny',
        allocations: outstanding_fees.map((fee: any) => ({ student_fee_id: fee.id, amount: fee.amount }))
      });
      navigate('/parent-portal/confirmation');
      // }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Pay Outstanding Fees</h2>
      <div>Total Due: <b>{total} ZMW</b></div>
      {/* TUMENY widget/button goes here */}
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <button onClick={handleTumenyPayment} disabled={loading} style={{ marginTop: 24, width: '100%' }}>
        {loading ? 'Processing...' : 'Pay with TUMENY'}
      </button>
    </div>
  );
};

export default ParentPaymentPage; 