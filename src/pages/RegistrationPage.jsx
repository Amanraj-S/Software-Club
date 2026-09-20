import React, { useState } from 'react';
import { User, CreditCard, Building2, GraduationCap, ArrowRight, AlertCircle, Loader2, LogIn, UserPlus } from 'lucide-react';
import { apiRegisterStudent, apiLoginStudent } from '../services/api';

export default function RegistrationPage({ onStartRound1 }) {
  const [activeTab, setActiveTab] = useState('REGISTER'); // 'REGISTER' or 'LOGIN'
  
  // Register Form State
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    department: 'CSE',
    year: '3rd Year'
  });

  // Login Form State
  const [loginRegNo, setLoginRegNo] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const departments = ['CSE', 'IT', 'AI & DS', 'ECE', 'EEE', 'Mechatronics', 'Mechanical', 'Civil', 'BioTech'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  // Handle New Registration Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full Name.');
      return;
    }
    if (!formData.registerNumber.trim()) {
      setErrorMsg('Please enter your Register Number.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await apiRegisterStudent(formData);
      if (res.sessionId) {
        localStorage.setItem('dsa_student_session_id', res.sessionId);
      }
      onStartRound1(res.student);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Candidate Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginRegNo.trim()) {
      setErrorMsg('Please enter your Register Number.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await apiLoginStudent(loginRegNo);
      if (res.sessionId) {
        localStorage.setItem('dsa_student_session_id', res.sessionId);
      }
      onStartRound1(res.student);
    } catch (err) {
      setErrorMsg(err.message || 'Register Number not found. Please register first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-xl relative">
        <div className="text-center">
          <span className="rounded-full bg-amber-100 border border-amber-300 px-3.5 py-1 font-mono text-xs font-bold text-amber-900">
            CANDIDATE PORTAL
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            {activeTab === 'REGISTER' ? 'CANDIDATE REGISTRATION' : 'CANDIDATE LOGIN'}
          </h2>
          <p className="mt-1 text-xs text-slate-500 font-mono font-medium">
            {activeTab === 'REGISTER' 
              ? 'Enter your details to initiate your official exam session'
              : 'Enter your registered Register Number to resume your exam'}
          </p>
        </div>

        {/* Register / Login Dual Tabs */}
        <div className="mt-6 flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('REGISTER');
              setErrorMsg('');
            }}
            className={`flex-1 rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === 'REGISTER'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>REGISTER</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('LOGIN');
              setErrorMsg('');
            }}
            className={`flex-1 rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeTab === 'LOGIN'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="h-4 w-4" />
            <span>CANDIDATE LOGIN</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-800 font-medium">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: NEW CANDIDATE REGISTRATION */}
        {activeTab === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-amber-600">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="e.g. Aravind Swaminathan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium disabled:opacity-50"
                />
              </div>
            </div>

            {/* Register Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Register Number <span className="text-amber-600">*</span>
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="e.g. 42110001"
                  value={formData.registerNumber}
                  onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono font-bold uppercase disabled:opacity-50"
                />
              </div>
            </div>

            {/* Department & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Department <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <select
                    disabled={loading}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium appearance-none disabled:opacity-50"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept} className="bg-white text-slate-900">
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Year of Study <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <select
                    disabled={loading}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium appearance-none disabled:opacity-50"
                  >
                    {years.map((y) => (
                      <option key={y} value={y} className="bg-white text-slate-900">
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn-cyber-primary w-full rounded-xl py-3.5 text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>REGISTERING...</span>
                  </>
                ) : (
                  <>
                    <span>[ START ROUND 1 ]</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: EXISTING CANDIDATE LOGIN */}
        {activeTab === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Registered Register Number <span className="text-amber-600">*</span>
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="Enter your Register Number (e.g. 42110001)"
                  value={loginRegNo}
                  onChange={(e) => setLoginRegNo(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono font-bold uppercase disabled:opacity-50"
                />
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-slate-700">
              <p className="font-bold text-amber-900 mb-0.5">Already registered?</p>
              <p className="text-slate-600 font-medium">
                Enter your exact Register Number to log in and resume your exam or check your Round 2 access status.
              </p>
            </div>

            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn-cyber-primary w-full rounded-xl py-3.5 text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>[ LOGIN & CONTINUE EXAM ]</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
