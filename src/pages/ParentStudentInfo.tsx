// This file is temporarily disabled due to missing dependencies and build errors.
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useParentPortal } from '../contexts/parentPortalContext';
//
// const ParentStudentInfo: React.FC = () => {
//   const { portalData } = useParentPortal();
//   const navigate = useNavigate();
//
//   if (!portalData) return <div>No data found. Please start from the lookup page.</div>;
//   const { student, parents, outstanding_fees } = portalData;
//
//   return (
//     <div>
//       <h2>Student Information</h2>
//       <div><b>Name:</b> {student.first_name} {student.last_name}</div>
//       <div><b>Student ID:</b> {student.student_id}</div>
//       <div><b>Grade:</b> {student.grade}</div>
//       <h3>Parent Information</h3>
//       {parents.map((p: any) => (
//         <div key={p.id} style={{ marginBottom: 8 }}>
//           <div><b>Name:</b> {p.first_name} {p.last_name}</div>
//           <div><b>Phone:</b> {p.phone}</div>
//           <div><b>Email:</b> {p.email}</div>
//         </div>
//       ))}
//       <h3>Outstanding Fees</h3>
//       {outstanding_fees.length === 0 ? (
//         <div>All fees are paid!</div>
//       ) : (
//         <ul>
//           {outstanding_fees.map((fee: any) => (
//             <li key={fee.id}>
//               {fee.amount} ZMW - Due: {fee.due_date}
//             </li>
//           ))}
//         </ul>
//       )}
//       <div style={{ marginTop: 24 }}>
//         {outstanding_fees.length > 0 && (
//           <button onClick={() => navigate('/parent-portal/pay')} style={{ marginRight: 8 }}>
//             Pay Now
//           </button>
//         )}
//         <button onClick={() => navigate('/parent-portal/update')} style={{ marginRight: 8 }}>
//           Update Info
//         </button>
//         <button onClick={() => navigate('/parent-portal/delete')} style={{ color: 'red' }}>
//           Delete Account
//         </button>
//       </div>
//     </div>
//   );
// };
//
// export default ParentStudentInfo;
export {}; 