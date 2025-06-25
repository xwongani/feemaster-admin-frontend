import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';

interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  grade: string;
  class_name?: string;
  status: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  parent_student_links?: Array<{
    relationship: string;
    is_primary_contact: boolean;
    parents: {
      first_name: string;
      last_name: string;
      phone: string;
      email: string;
    };
  }>;
}

interface StudentStats {
  total_students: number;
  active_students: number;
  inactive_students: number;
  fully_paid: number;
  partially_paid: number;
  unpaid: number;
}

interface StudentForm {
  student_id: string;
  first_name: string;
  last_name: string;
  grade: string;
  class_name: string;
  status: string;
  date_of_birth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  parent_first_name: string;
  parent_last_name: string;
  parent_phone: string;
  parent_email: string;
  relationship: string;
}

const Students: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StudentStats>({
    total_students: 0,
    active_students: 0,
    inactive_students: 0,
    fully_paid: 0,
    partially_paid: 0,
    unpaid: 0
  });
  const [filters, setFilters] = useState({
    grade: 'all',
    className: 'all',
    status: 'all'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);

  // Form state
  const [form, setForm] = useState<StudentForm>({
    student_id: '',
    first_name: '',
    last_name: '',
    grade: '',
    class_name: '',
    status: 'active',
    date_of_birth: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    parent_first_name: '',
    parent_last_name: '',
    parent_phone: '',
    parent_email: '',
    relationship: 'parent'
  });

  // Use standard React environment variable access
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

  useEffect(() => {
    // Always fetch data - we have fallback auth for development
    fetchStudents();
    fetchStudentStats();
  }, [currentPage, filters]);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the auth token from localStorage
      const authToken = localStorage.getItem('access_token');

      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.grade !== 'all' && { grade: filters.grade })
      });

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/students?${params}`, {
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setStudents(result.data || []);
        setTotalPages(result.total_pages || 1);
      } else {
        throw new Error(result.message || 'Failed to fetch students');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error fetching students:', err);
      setError(`Failed to load students: ${errorMessage}. Using fallback data.`);
      
      // Fallback data
      setStudents([
        {
          id: '1',
          student_id: 'STU-001423',
          first_name: 'John',
          last_name: 'Mwanza',
          grade: 'Grade 7',
          class_name: '7A',
          status: 'active',
          date_of_birth: '2010-05-15',
          gender: 'Male',
          address: '123 Main Street, Lusaka',
          phone: '+260 97 123 4567',
          email: 'john.mwanza@school.com',
          parent_student_links: [{
            relationship: 'parent',
            is_primary_contact: true,
            parents: {
              first_name: 'Mary',
              last_name: 'Mwanza',
              phone: '+260 97 123 4567',
              email: 'mary.mwanza@example.com'
            }
          }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentStats = async () => {
    try {
      // Get the auth token from localStorage
      const authToken = localStorage.getItem('access_token');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/students/stats/overview`, {
        headers,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch stats:', response.status, errorText);
      }
    } catch (err) {
      console.error('Error fetching student stats:', err);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.parent_student_links?.[0]?.parents?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const authToken = localStorage.getItem('access_token');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const payload = {
        student_id: form.student_id,
        first_name: form.first_name,
        last_name: form.last_name,
        grade: form.grade,
        class_name: form.class_name,
        status: form.status,
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        address: form.address,
        phone: form.phone,
        email: form.email,
        parent_info: {
          first_name: form.parent_first_name,
          last_name: form.parent_last_name,
          phone: form.parent_phone,
          email: form.parent_email,
          relationship: form.relationship
        }
      };

      const url = editingStudent 
        ? `${API_BASE_URL}/students/${editingStudent.id}`
        : `${API_BASE_URL}/students`;

      const method = editingStudent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Refresh the students list
        await fetchStudents();
        setShowModal(false);
        setEditingStudent(null);
        resetForm();
      } else {
        throw new Error(result.message || 'Failed to save student');
      }
    } catch (err) {
      console.error('Error saving student:', err);
      setError('Failed to save student. Please try again.');
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setForm({
      student_id: student.student_id,
      first_name: student.first_name,
      last_name: student.last_name,
      grade: student.grade,
      class_name: student.class_name || '',
      status: student.status,
      date_of_birth: student.date_of_birth || '',
      gender: student.gender || '',
      address: student.address || '',
      phone: student.phone || '',
      email: student.email || '',
      parent_first_name: student.parent_student_links?.[0]?.parents?.first_name || '',
      parent_last_name: student.parent_student_links?.[0]?.parents?.last_name || '',
      parent_phone: student.parent_student_links?.[0]?.parents?.phone || '',
      parent_email: student.parent_student_links?.[0]?.parents?.email || '',
      relationship: student.parent_student_links?.[0]?.relationship || 'parent'
    });
    setShowModal(true);
  };

  const handleDelete = async (studentId: string) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      const authToken = localStorage.getItem('access_token');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Refresh the students list
        await fetchStudents();
      } else {
        throw new Error(result.message || 'Failed to delete student');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      setError('Failed to delete student. Please try again.');
    }
  };

  const resetForm = () => {
    setForm({
      student_id: '',
      first_name: '',
      last_name: '',
      grade: '',
      class_name: '',
      status: 'active',
      date_of_birth: '',
      gender: '',
      address: '',
      phone: '',
      email: '',
      parent_first_name: '',
      parent_last_name: '',
      parent_phone: '',
      parent_email: '',
      relationship: 'parent'
    });
  };

  const openModal = () => {
    setEditingStudent(null);
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    resetForm();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    }
  };

  const getPaymentStatus = (student: Student) => {
    // This would be calculated based on actual payment data
    // For now, return a random status for display
    const statuses = ['paid', 'partial', 'unpaid'];
    return statuses[Math.floor(Math.random() * statuses.length)] as 'paid' | 'partial' | 'unpaid';
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      unpaid: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      suspended: 'bg-yellow-100 text-yellow-800'
    };
    const statusText = {
      paid: 'Paid',
      partial: 'Partial',
      unpaid: 'Unpaid',
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {statusText[status as keyof typeof statusText]}
      </span>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getParentInfo = (student: Student) => {
    const primaryParent = student.parent_student_links?.find(link => link.is_primary_contact);
    if (primaryParent) {
      return {
        name: `${primaryParent.parents.first_name} ${primaryParent.parents.last_name}`,
        email: primaryParent.parents.email,
        phone: primaryParent.parents.phone
      };
    }
    return {
      name: 'No parent info',
      email: 'N/A',
      phone: 'N/A'
    };
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
        <p className="text-gray-600">Manage student records, track payments, and maintain academic information.</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-triangle text-red-400"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-user-graduate text-white text-xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.total_students}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-white text-xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Students</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.active_students}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-money-bill-wave text-white text-xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Fully Paid</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.fully_paid}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-white text-xl"></i>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Unpaid</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.unpaid}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            Add Student
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2">
            <i className="fas fa-upload"></i>
            Import CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={filters.grade}
          onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Grades</option>
          <option value="Grade 1">Grade 1</option>
          <option value="Grade 2">Grade 2</option>
          <option value="Grade 3">Grade 3</option>
          <option value="Grade 4">Grade 4</option>
          <option value="Grade 5">Grade 5</option>
          <option value="Grade 6">Grade 6</option>
          <option value="Grade 7">Grade 7</option>
          <option value="Grade 8">Grade 8</option>
          <option value="Grade 9">Grade 9</option>
          <option value="Grade 10">Grade 10</option>
          <option value="Grade 11">Grade 11</option>
          <option value="Grade 12">Grade 12</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade/Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent/Guardian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading students...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const parentInfo = getParentInfo(student);
                  const paymentStatus = getPaymentStatus(student);
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                              {getInitials(student.first_name, student.last_name)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.first_name} {student.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{student.student_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{student.grade}</div>
                        <div className="text-sm text-gray-500">{student.class_name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{parentInfo.name}</div>
                        <div className="text-sm text-gray-500">{parentInfo.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{parentInfo.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(paymentStatus)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit(student)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={() => handleDelete(student.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Student Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.student_id}
                        onChange={(e) => setForm({...form, student_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        required
                        value={form.status}
                        onChange={(e) => setForm({...form, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.first_name}
                        onChange={(e) => setForm({...form, first_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.last_name}
                        onChange={(e) => setForm({...form, last_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grade *
                      </label>
                      <select
                        required
                        value={form.grade}
                        onChange={(e) => setForm({...form, grade: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Grade</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class
                      </label>
                      <input
                        type="text"
                        value={form.class_name}
                        onChange={(e) => setForm({...form, class_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={form.date_of_birth}
                        onChange={(e) => setForm({...form, date_of_birth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({...form, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({...form, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={form.address}
                        onChange={(e) => setForm({...form, address: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Parent Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Parent/Guardian Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.parent_first_name}
                        onChange={(e) => setForm({...form, parent_first_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.parent_last_name}
                        onChange={(e) => setForm({...form, parent_last_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.parent_phone}
                        onChange={(e) => setForm({...form, parent_phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.parent_email}
                        onChange={(e) => setForm({...form, parent_email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship
                      </label>
                      <select
                        value={form.relationship}
                        onChange={(e) => setForm({...form, relationship: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="parent">Parent</option>
                        <option value="guardian">Guardian</option>
                        <option value="sibling">Sibling</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {editingStudent ? 'Update Student' : 'Add Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;