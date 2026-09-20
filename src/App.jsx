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
  const [currentStep, setCurrentStep] = useState('HOME'); // HOME, REGISTER, ROUND1, ROUND2, ADMIN
  const [studentSession, setStudentSession] = useState(null);

  useEffect(() => {
    async function restoreSession() {
      const sessionId = localStorage.getItem('dsa_student_session_id');
      if (sessionId) {
        try {
          const res = await apiGetStudentSession();
          if (res.student) {
            setStudentSession(res.student);
            // Auto restore step based on backend status
            if (res.student.round2Status === 'IN_PROGRESS' || res.student.round2Status === 'COMPLETED' || res.student.round2Access === 'GRANTED') {
              setCurrentStep('ROUND2');
            } else if (res.student.round1Status === 'COMPLETED') {
              setCurrentStep('ROUND2');
            } else if (res.student.round1Status === 'IN_PROGRESS') {
              setCurrentStep('ROUND1');
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
        setCurrentStep('ROUND2');
      } else {
        setCurrentStep('ROUND1');
      }
    } else {
      setCurrentStep('REGISTER');
    }
  };

  const handleRegisterComplete = (student) => {
    setStudentSession(student);
    setCurrentStep('ROUND1');
  };

  const handleProceedToRound2Access = () => {
    setCurrentStep('ROUND2');
  };

  const handleStudentLogout = () => {
    if (window.confirm('Are you sure you want to log out of candidate session?')) {
      localStorage.removeItem('dsa_student_session_id');
      setStudentSession(null);
      setCurrentStep('HOME');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 relative flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-950 overflow-x-hidden">
      {/* Main Top Header */}
      <Header
        studentSession={studentSession}
        onOpenAdmin={() => setCurrentStep('ADMIN')}
        onStudentLogout={handleStudentLogout}
        currentStep={currentStep}
      />

      {/* Main View Container */}
      <main className="flex-1 relative z-10">
        {currentStep === 'HOME' && (
          <HomePage
            onStartChallenge={handleStartChallenge}
            onOpenAdmin={() => setCurrentStep('ADMIN')}
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
            onBackHome={() => setCurrentStep('HOME')}
          />
        )}

        {currentStep === 'ADMIN' && (
          <AdminPage onClose={() => setCurrentStep('HOME')} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
