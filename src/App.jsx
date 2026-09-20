import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import Round1Page from './pages/Round1Page';
import Round2Page from './pages/Round2Page';
import AdminPage from './pages/AdminPage';
import { apiGetStudentSession } from './services/api';

export default function App() {
  const [currentStep, setCurrentStepState] = useState(() => {
    const hash = window.location.hash.replace('#', '').toUpperCase();
    if (['HOME', 'REGISTER', 'ROUND1', 'ROUND2', 'ADMIN'].includes(hash)) {
      return hash;
    }
    return 'HOME';
  });
  const [studentSession, setStudentSession] = useState(null);

  // Helper to sync view state with browser URL hash and history pushState
  const navigateTo = (step, replace = false) => {
    // Lock navigation if in middle of an active exam
    if ((currentStep === 'ROUND1' || currentStep === 'ROUND2') && (step !== 'ROUND1' && step !== 'ROUND2')) {
      console.warn('Navigation blocked during active exam mode');
      return;
    }

    setCurrentStepState(step);
    const hash = `#${step.toLowerCase()}`;
    if (replace) {
      window.history.replaceState({ step }, '', hash);
    } else {
      window.history.pushState({ step }, '', hash);
    }
  };

  // Listen to browser Back / Forward buttons with Exam Security Lock
  useEffect(() => {
    const handlePopState = (e) => {
      if (currentStep === 'ROUND1' || currentStep === 'ROUND2') {
        // Prevent navigating away during active exam
        window.history.pushState({ step: currentStep }, '', `#${currentStep.toLowerCase()}`);
        return;
      }

      if (e.state && e.state.step) {
        setCurrentStepState(e.state.step);
      } else {
        const hash = window.location.hash.replace('#', '').toUpperCase();
        if (['HOME', 'REGISTER', 'ROUND1', 'ROUND2', 'ADMIN'].includes(hash)) {
          setCurrentStepState(hash);
        } else {
          setCurrentStepState('HOME');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentStep]);

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

  useEffect(() => {
    async function restoreSession() {
      const sessionId = localStorage.getItem('dsa_student_session_id');
      if (sessionId) {
        try {
          const res = await apiGetStudentSession();
          if (res.student) {
            setStudentSession(res.student);
            // Restore step based on status if no explicit hash is present
            const hash = window.location.hash.replace('#', '').toUpperCase();
            if (!['ROUND1', 'ROUND2', 'ADMIN'].includes(hash)) {
              if (res.student.round2Status === 'IN_PROGRESS' || res.student.round2Status === 'COMPLETED' || res.student.round2Access === 'GRANTED') {
                navigateTo('ROUND2', true);
              } else if (res.student.round1Status === 'COMPLETED') {
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
      if (studentSession.round2Status === 'IN_PROGRESS' || studentSession.round2Status === 'COMPLETED' || studentSession.round2Access === 'GRANTED' || studentSession.round1Status === 'COMPLETED') {
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
          />
        )}

        {currentStep === 'ROUND2' && (
          <Round2Page
            studentSession={studentSession}
            onBackHome={() => {
              setCurrentStepState('HOME');
              window.history.pushState({ step: 'HOME' }, '', '#home');
            }}
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
