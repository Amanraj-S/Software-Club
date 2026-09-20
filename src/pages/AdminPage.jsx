import React, { useState, useEffect } from 'react';
import {
  apiAdminLogin,
  apiGetAdminDashboardStats,
  apiGetAdminStudents,
  apiGrantRound2Access,
  apiRevokeRound2Access,
  apiGrantSelectedRound2Access,
  apiExportResultsCSV,
  apiGetStudentDetail
} from '../services/api';
import {
  Shield,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Lock,
  LogOut,
  CheckSquare,
  Square,
  RefreshCw,
  Loader2,
  AlertCircle,
  Filter,
  UserCheck
} from 'lucide-react';

export default function AdminPage({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('dsa_admin_token'));
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [stats, setStats] = useState({
    totalStudents: 0,
    round1Completed: 0,
    qualified: 0,
    notQualified: 0,
    round2AccessGranted: 0,
    round2InProgress: 0,
    round2Completed: 0
  });

  const [students, setStudents] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('finalScore');
  const [sortOrder, setSortOrder] = useState('desc');

  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [inspectStudent, setInspectStudent] = useState(null);
  const [inspectDetail, setInspectDetail] = useState(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  const [actionMessage, setActionMessage] = useState(null);

  // Load Dashboard Data
  const loadDashboard = async () => {
    if (!isAuthenticated) return;
    try {
      setLoadingData(true);
      const [statsRes, studentsRes] = await Promise.all([
        apiGetAdminDashboardStats(),
        apiGetAdminStudents({ search: searchTerm, filter, sortBy, order: sortOrder })
      ]);

      setStats(statsRes.stats || {});
      setStudents(studentsRes.students || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      if (err.message && (err.message.includes('authorized') || err.message.includes('token'))) {
        localStorage.removeItem('dsa_admin_token');
        setIsAuthenticated(false);
      }
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboard();
    }
  }, [isAuthenticated, filter, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDashboard();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setAuthError('');
    try {
      const res = await apiAdminLogin(username, password);
      if (res.token) {
        localStorage.setItem('dsa_admin_token', res.token);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setAuthError(err.message || 'Invalid admin credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dsa_admin_token');
    setIsAuthenticated(false);
  };

  // Grant individual Round 2 Access (No cutoff restriction)
  const handleGrantAccess = async (student) => {
    if (window.confirm(`Grant Round 2 Access to ${student.name} (${student.registerNumber})?`)) {
      try {
        const res = await apiGrantRound2Access(student._id);
        setActionMessage(res.message);
        setTimeout(() => setActionMessage(null), 4000);
        loadDashboard();
      } catch (err) {
        alert(err.message || 'Failed to grant Round 2 access.');
      }
    }
  };

  // Revoke Round 2 Access
  const handleRevokeAccess = async (student) => {
    if (student.round2Status === 'IN_PROGRESS') {
      alert(`Student ${student.name} is currently IN_PROGRESS with Round 2. Cannot revoke access while exam is active.`);
      return;
    }

    if (window.confirm(`Revoke Round 2 Access for ${student.name}?`)) {
      try {
        const res = await apiRevokeRound2Access(student._id);
        setActionMessage(res.message);
        setTimeout(() => setActionMessage(null), 4000);
        loadDashboard();
      } catch (err) {
        alert(err.message || 'Failed to revoke Round 2 access.');
      }
    }
  };

  // Batch Grant Selected (No cutoff restriction)
  const handleGrantSelected = async () => {
    if (selectedStudentIds.length === 0) {
      alert('Please select at least one student from the table.');
      return;
    }

    if (window.confirm(`Grant Round 2 Access to ${selectedStudentIds.length} selected student(s)?`)) {
      try {
        const res = await apiGrantSelectedRound2Access(selectedStudentIds);
        setActionMessage(res.message);
        setSelectedStudentIds([]);
        setTimeout(() => setActionMessage(null), 4000);
        loadDashboard();
      } catch (err) {
        alert(err.message || 'Failed to batch grant access.');
      }
    }
  };

  // Export CSV
  const handleExportCSV = async () => {
    try {
      const res = await apiExportResultsCSV();
      if (res.isCSV) {
        const blob = new Blob([res.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dsa_competition_results_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      alert('Failed to export CSV: ' + err.message);
    }
  };

  // Deep inspect student details
  const handleInspectStudent = async (student) => {
    setInspectStudent(student);
    setInspectLoading(true);
    try {
      const res = await apiGetStudentDetail(student._id);
      setInspectDetail(res);
    } catch (err) {
      console.error(err);
    } finally {
      setInspectLoading(false);
    }
  };

  const toggleSelectStudent = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map((s) => s._id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-amber-300 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 mb-4">
            <Shield className="h-7 w-7" />
          </div>

          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            ADMINISTRATOR LOGIN
          </h2>
          <p className="mt-1 text-xs text-slate-500 font-mono font-medium">
            Sathyabama Software Club Event Control Portal
          </p>

          {authError && (
            <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-2.5 text-xs text-red-700 flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-cyber-secondary flex-1 rounded-xl py-2.5 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loginLoading}
                className="btn-cyber-primary flex-1 rounded-xl py-2.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
              >
                {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'LOGIN'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Top Admin Navigation Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-amber-300/80 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600" />
            <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              ADMIN CONTROL PORTAL • RESULTS & ROUND 2 MANAGEMENT
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-mono font-medium mt-0.5">
            Sathyabama Institute of Science and Technology • Software Club
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleGrantSelected}
            disabled={selectedStudentIds.length === 0}
            className="btn-cyber-primary rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 shadow-md"
          >
            <UserCheck className="h-4 w-4" />
            <span>GRANT SELECTED ({selectedStudentIds.length})</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="btn-cyber-secondary rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <Download className="h-4 w-4 text-amber-600" />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={loadDashboard}
            className="btn-cyber-secondary rounded-xl p-2 text-xs text-slate-700 hover:text-slate-900"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${loadingData ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="btn-cyber-secondary rounded-xl px-3 py-2 text-xs text-slate-600 hover:text-red-600 hover:border-red-300 flex items-center gap-1"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-900 font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="glass-panel rounded-2xl p-3.5 border border-amber-200 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Students</span>
          <div className="mt-1 text-xl font-black font-mono text-slate-900">{stats.totalStudents || 0}</div>
        </div>

        <div className="glass-panel rounded-2xl p-3.5 border border-amber-200 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">R1 Completed</span>
          <div className="mt-1 text-xl font-black font-mono text-slate-900">{stats.round1Completed || 0}</div>
        </div>

        <div className="glass-panel rounded-2xl p-3.5 border border-amber-200 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Qualified</span>
          <div className="mt-1 text-xl font-black font-mono text-emerald-600">{stats.qualified || 0}</div>
        </div>

        <div className="glass-panel rounded-2xl p-3.5 border border-amber-200 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Not Qualified</span>
          <div className="mt-1 text-xl font-black font-mono text-amber-700">{stats.notQualified || 0}</div>
        </div>

        <div className="glass-panel rounded-2xl p-3.5 border border-amber-200 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">R2 Granted</span>
          <div className="mt-1 text-xl font-black font-mono text-amber-600">{stats.round2AccessGranted || 0}</div>
        </div>

        <div className="glass-panel rounded-2xl p-3.5 border border-amber-200 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">R2 In Progress</span>
          <div className="mt-1 text-xl font-black font-mono text-amber-600">{stats.round2InProgress || 0}</div>
        </div>

        <div className="glass-panel rounded-2xl p-3.5 border border-amber-200 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">R2 Completed</span>
          <div className="mt-1 text-xl font-black font-mono text-yellow-700">{stats.round2Completed || 0}</div>
        </div>
      </div>

      {/* Filters and Search Control Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-amber-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name or register number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 focus:border-amber-500 focus:outline-none font-medium"
          />
        </form>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-amber-600" />
          <span className="text-slate-600 font-bold">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
          >
            <option value="all">All Students</option>
            <option value="qualified">Qualified</option>
            <option value="not_qualified">Not Qualified</option>
            <option value="r2_pending">R2 Pending (Locked)</option>
            <option value="r2_granted">R2 Granted</option>
            <option value="r2_in_progress">R2 In Progress</option>
            <option value="r2_completed">R2 Completed</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-bold">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
          >
            <option value="finalScore">Final Score</option>
            <option value="round1Score">Round 1 Score</option>
            <option value="round2Score">Round 2 Score</option>
            <option value="name">Student Name</option>
            <option value="registerNumber">Register Number</option>
            <option value="violationCount">Violations</option>
          </select>

          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-800 font-mono font-bold"
          >
            {sortOrder.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="glass-panel rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-mono font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3 text-center w-10">
                  <button onClick={toggleSelectAll} className="text-slate-500 hover:text-amber-600">
                    {selectedStudentIds.length > 0 && selectedStudentIds.length === students.length ? (
                      <CheckSquare className="h-4 w-4 text-amber-600" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Reg Number</th>
                <th className="px-4 py-3">Dept / Year</th>
                <th className="px-4 py-3 text-center">R1 Score</th>
                <th className="px-4 py-3 text-center">R2 Access</th>
                <th className="px-4 py-3 text-center">R2 Status</th>
                <th className="px-4 py-3 text-center">R2 Score</th>
                <th className="px-4 py-3 text-center">Final Score</th>
                <th className="px-4 py-3 text-center">Violations</th>
                <th className="px-4 py-3 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {loadingData ? (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-slate-500 font-mono">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-amber-600" />
                    Loading student results from MongoDB...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-slate-500 font-mono">
                    No student records match the filter criteria.
                  </td>
                </tr>
              ) : (
                students.map((s) => {
                  const isSelected = selectedStudentIds.includes(s._id);
                  return (
                    <tr key={s._id} className={`hover:bg-amber-50/50 transition-colors ${isSelected ? 'bg-amber-100/50' : ''}`}>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleSelectStudent(s._id)} className="text-slate-400">
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-amber-600" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">{s.name}</td>
                      <td className="px-4 py-3 font-mono font-bold text-amber-900">{s.registerNumber}</td>
                      <td className="px-4 py-3">{s.department} ({s.year})</td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-slate-800">
                        {s.round1Score ?? 0} / 30
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            s.round2Access === 'GRANTED'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : s.round2Access === 'REVOKED'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-slate-200 text-slate-800 border border-slate-300'
                          }`}
                        >
                          {s.round2Access}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-xs font-bold">
                        <span
                          className={`${
                            s.round2Status === 'COMPLETED'
                              ? 'text-amber-800'
                              : s.round2Status === 'IN_PROGRESS'
                              ? 'text-amber-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {s.round2Status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-slate-800">
                        {s.round2Score ?? 0} / 100
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-black text-amber-900 text-sm">
                        {s.finalScore ?? 0}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-mono font-bold ${
                            (s.violationCount || 0) > 0 ? 'text-red-600' : 'text-slate-400'
                          }`}
                        >
                          {s.violationCount || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {s.round2Access === 'GRANTED' ? (
                            <button
                              onClick={() => handleRevokeAccess(s)}
                              className="rounded-lg border border-red-300 bg-red-50 px-2 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"
                              title="Revoke Access"
                            >
                              Revoke
                            </button>
                          ) : (
                            <button
                              onClick={() => handleGrantAccess(s)}
                              className="rounded-lg border border-amber-400 bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-600 shadow-xs"
                              title="Grant Access"
                            >
                              Grant R2
                            </button>
                          )}

                          <button
                            onClick={() => handleInspectStudent(s)}
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
                            title="Inspect Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
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
      </div>

      {/* Student Deep-Dive Inspector Modal */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-panel rounded-3xl p-6 max-w-2xl w-full border border-amber-300 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{inspectStudent.name}</h3>
                <p className="text-xs text-amber-700 font-mono font-bold">
                  Reg: {inspectStudent.registerNumber} • {inspectStudent.department} ({inspectStudent.year})
                </p>
              </div>
              <button
                onClick={() => {
                  setInspectStudent(null);
                  setInspectDetail(null);
                }}
                className="btn-cyber-secondary rounded-lg px-3 py-1 text-xs"
              >
                Close
              </button>
            </div>

            {inspectLoading ? (
              <div className="py-8 text-center text-slate-500">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-amber-600" />
                Fetching student exam logs...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Round 1 Score</span>
                    <span className="text-lg font-black font-mono text-slate-900">{inspectStudent.round1Score || 0} / 30</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Round 2 Score</span>
                    <span className="text-lg font-black font-mono text-amber-700">{inspectStudent.round2Score || 0} / 100</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Final Score</span>
                    <span className="text-lg font-black font-mono text-amber-900">{inspectStudent.finalScore || 0}</span>
                  </div>
                </div>

                {/* Violation Logs */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
                    Security Violation Logs ({inspectDetail?.violations?.length || 0})
                  </h4>
                  {inspectDetail?.violations?.length === 0 ? (
                    <p className="text-slate-500 font-mono">No security violations recorded for this student.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {inspectDetail?.violations?.map((v, i) => (
                        <div key={i} className="flex justify-between items-center rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-[11px] text-red-800 font-medium">
                          <span>{v.eventType} ({v.round})</span>
                          <span className="font-mono text-slate-500">{new Date(v.timestamp).toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
