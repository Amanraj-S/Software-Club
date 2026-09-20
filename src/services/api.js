const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Helper for HTTP requests
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add student session header if present
  const sessionId = localStorage.getItem('dsa_student_session_id');
  if (sessionId) {
    headers['x-student-session-id'] = sessionId;
  }

  // Add admin token header if present
  const adminToken = localStorage.getItem('dsa_admin_token');
  if (adminToken) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('text/csv')) {
    const text = await response.text();
    return { ok: response.ok, data: text, isCSV: true };
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// Student APIs
export const apiRegisterStudent = (data) => fetchAPI('/students/register', { method: 'POST', body: JSON.stringify(data) });
export const apiLoginStudent = (registerNumber) => fetchAPI('/students/login', { method: 'POST', body: JSON.stringify({ registerNumber }) });
export const apiGetStudentSession = () => fetchAPI('/students/session');

// Round 1 APIs
export const apiStartRound1 = () => fetchAPI('/round1/start', { method: 'POST' });
export const apiGetRound1Questions = () => fetchAPI('/round1/questions');
export const apiSubmitRound1 = (answers) => fetchAPI('/round1/submit', { method: 'POST', body: JSON.stringify({ answers }) });

// Round 2 APIs
export const apiGetRound2Access = () => fetchAPI('/round2/access');
export const apiStartRound2 = () => fetchAPI('/round2/start', { method: 'POST' });
export const apiGetRound2Questions = () => fetchAPI('/round2/questions');
export const apiSubmitRound2 = () => fetchAPI('/round2/submit', { method: 'POST' });

// Coding APIs
export const apiRunPythonCode = (questionId, code) => fetchAPI('/coding/run', { method: 'POST', body: JSON.stringify({ questionId, code }) });
export const apiSaveDraftCode = (questionId, code) => fetchAPI('/coding/save', { method: 'POST', body: JSON.stringify({ questionId, code }) });
export const apiGetSavedSubmissions = () => fetchAPI('/coding/submissions');

// Exam Security API
export const apiReportViolation = (round, eventType) => fetchAPI('/exam/violation', { method: 'POST', body: JSON.stringify({ round, eventType }) });

// Admin APIs
export const apiAdminLogin = (username, password) => fetchAPI('/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) });
export const apiAdminLogout = () => fetchAPI('/admin/logout', { method: 'POST' });
export const apiGetAdminDashboardStats = () => fetchAPI('/admin/dashboard');
export const apiGetAdminStudents = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/admin/students${query ? `?${query}` : ''}`);
};
export const apiGetStudentDetail = (id) => fetchAPI(`/admin/students/${id}`);
export const apiGrantRound2Access = (studentId) => fetchAPI(`/admin/round2/grant/${studentId}`, { method: 'POST' });
export const apiRevokeRound2Access = (studentId) => fetchAPI(`/admin/round2/revoke/${studentId}`, { method: 'POST' });
export const apiGrantSelectedRound2Access = (studentIds) => fetchAPI('/admin/round2/grant-selected', { method: 'POST', body: JSON.stringify({ studentIds }) });
export const apiExportResultsCSV = () => fetchAPI('/admin/export');
