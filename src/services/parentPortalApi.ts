import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const lookupParentOrStudent = async (payload: { student_id?: string; parent_phone?: string }) => {
  const { data } = await axios.post(`${API_BASE}/parent-portal/parent-lookup`, payload);
  return data;
};

export const signupParent = async (payload: any) => {
  const { data } = await axios.post(`${API_BASE}/parents`, payload);
  return data;
};

export const updateParent = async (parentId: string, payload: any) => {
  const { data } = await axios.put(`${API_BASE}/parents/${parentId}`, payload);
  return data;
};

export const deleteParent = async (parentId: string) => {
  const { data } = await axios.delete(`${API_BASE}/parents/${parentId}`);
  return data;
};

export const makePayment = async (payload: any) => {
  const { data } = await axios.post(`${API_BASE}/payments`, payload);
  return data;
}; 