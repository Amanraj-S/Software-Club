import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import Round1Page from './pages/Round1Page';
import Round2Page from './pages/Round2Page';
import AdminPage from './pages/AdminPage';
import { apiGetStudentSession } from './services/api';

export default function App() {
  const [studentSession, setStudentSession] = useState(null);

  // Validate navigation access to prevent direct URL manipulation security bypasses
  const validateRouteAccess = useCallback((targetStep, session = studentSession) => {
    const rawStep = (targetStep || '').toUpperCase();
    if (!['HOME', 'REGISTER', 'ROUND1', 'ROUND2', 'ADMIN'].includes(rawStep)) {
      return 'HOME';
    }

    const sessionId = localStorage.getItem('dsa_student_session_id');

    // Security Guard 1: Direct /round1 navigation check
    if (rawStep === 'ROUND1') {
      if (!sessionId) {
        console.warn('Security Guard: Unauthenticated access attempt to Round 1 blocked.');
        return 'REGISTER';
      }
    }

    // Security Guard 2: Direct /round2 navigation check
    if (rawStep === 'ROUND2') {
      if (!sessionId) {
        console.warn('Security Guard: Unauthenticated access attempt to Round 2 blocked.');
        return 'REGISTER';
      }
    }

    return rawStep;
  }, [studentSession]);

  const [currentStep, setCurrentStepState] = useState(() => {
    const hash = window.location.hash.replace('#', '').toUpperCase();
    return validateRouteAccess(hash);
  });

  // Helper to sync view state with browser URL hash and history pushState
  const navigateTo = (step, replace = false, force = false) => {
    // Lock navigation only if in middle of an ACTIVE exam in progress
    if (!force && (currentStep === 'ROUND1' || currentStep === 'ROUND2') && (step !== 'ROUND1' && step !== 'ROUND2')) {
      if (studentSession?.round1Status === 'IN_PROGRESS' || studentSession?.round2Status === 'IN_PROGRESS') {
        console.warn('Security Lock: Navigation blocked during active exam mode');
        window.history.pushState({ step: currentStep }, '', `#${currentStep.toLowerCase()}`);
        return;
      }
    }

    const validStep = validateRouteAccess(step);
    setCurrentStepState(validStep);
    const hash = `#${validStep.toLowerCase()}`;
    if (replace) {
      window.history.replaceState({ step: validStep }, '', hash);
    } else {
      window.history.pushState({ step: validStep }, '', hash);
    }
  };

  // Listen to browser Back / Forward & direct URL address bar Hash changes
  useEffect(() => {
    const handleUrlChange = () => {
      // Security Lock: Prevent navigating away ONLY during active exam in progress
      if (currentStep === 'ROUND1' || currentStep === 'ROUND2') {
        if (studentSession?.round1Status === 'IN_PROGRESS' || studentSession?.round2Status === 'IN_PROGRESS') {
          const targetHash = window.location.hash.replace('#', '').toUpperCase();
          if (targetHash !== currentStep) {
            window.history.pushState({ step: currentStep }, '', `#${currentStep.toLowerCase()}`);
            return;
          }
        }
      }

      const hash = window.location.hash.replace('#', '').toUpperCase();
      const validStep = validateRouteAccess(hash);

      if (validStep !== hash) {
        window.history.replaceState({ step: validStep }, '', `#${validStep.toLowerCase()}`);
      }
      setCurrentStepState(validStep);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [currentStep, validateRouteAccess, studentSession]);

  // Tab Close / Page Refresh Protection during exam
  useEffect(() => {
    if (currentStep !== 'ROUND1' && currentStep !== 'ROUND2') return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Exam in progress! Leaving will record a security violation.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStep]);

  // Session Restore on App Load - ONLY auto-redirect if an exam is actively IN_PROGRESS
  useEffect(() => {
    async function restoreSession() {
      const sessionId = localStorage.getItem('dsa_student_session_id');
      if (sessionId) {
        try {
          const res = await apiGetStudentSession();
          if (res.student) {
            setStudentSession(res.student);

            const hash = window.location.hash.replace('#', '').toUpperCase();
            if (!['ROUND1', 'ROUND2', 'ADMIN'].includes(hash)) {
              if (res.student.round2Status === 'IN_PROGRESS') {
                navigateTo('ROUND2', true);
              } else if (res.student.round1Status === 'IN_PROGRESS') {
                navigateTo('ROUND1', true);
              }
            }
          }
        } catch (err) {
          console.error('Session restore error:', err);
        }
      }
    }

    restoreSession();
  }, []);

  const handleStartChallenge = () => {
    const sessionId = localStorage.getItem('dsa_student_session_id');
    if (studentSession && studentSession.name && sessionId) {
      if (
        studentSession.round2Status === 'IN_PROGRESS' ||
        studentSession.round2Status === 'COMPLETED' ||
        studentSession.round2Access === 'GRANTED' ||
        studentSession.round1Status === 'COMPLETED'
      ) {
        navigateTo('ROUND2');
      } else {
        navigateTo('ROUND1');
      }
    } else {
      navigateTo('REGISTER');
    }
  };

  const handleRegisterComplete = (student) => {
    setStudentSession(student);
    navigateTo('ROUND1');
  };

  const handleProceedToRound2Access = () => {
    navigateTo('ROUND2');
  };

  const handleStudentLogout = () => {
    if (window.confirm('Are you sure you want to log out of candidate session?')) {
      localStorage.removeItem('dsa_student_session_id');
      setStudentSession(null);
      setCurrentStepState('HOME');
      window.history.pushState({ step: 'HOME' }, '', '#home');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 relative flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-950 overflow-x-hidden">
      {/* Main Top Header */}
      <Header
        studentSession={studentSession}
        onOpenAdmin={() => navigateTo('ADMIN')}
        onStudentLogout={handleStudentLogout}
        currentStep={currentStep}
      />

      {/* Main View Container */}
      <main className="flex-1 relative z-10">
        {currentStep === 'HOME' && (
          <HomePage
            onStartChallenge={handleStartChallenge}
            onOpenAdmin={() => navigateTo('ADMIN')}
          />
        )}

        {currentStep === 'REGISTER' && (
          <RegistrationPage onStartRound1={handleRegisterComplete} />
        )}

        {currentStep === 'ROUND1' && (
          <Round1Page
            studentSession={studentSession}
            onProceedToRound2Access={handleProceedToRound2Access}
            onBackHome={() => navigateTo('HOME', false, true)}
          />
        )}

        {currentStep === 'ROUND2' && (
          <Round2Page
            studentSession={studentSession}
            onBackHome={() => navigateTo('HOME', false, true)}
          />
        )}

        {currentStep === 'ADMIN' && (
          <AdminPage onClose={() => navigateTo('HOME')} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
