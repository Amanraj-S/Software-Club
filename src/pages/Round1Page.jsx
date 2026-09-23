import React, { useState, useEffect } from 'react';
import QuestionPalette from '../components/exam/QuestionPalette';
import QuestionCard from '../components/exam/QuestionCard';
import Round1ResultCard from '../components/exam/Round1ResultCard';
import ExamPreStartModal from '../components/exam/ExamPreStartModal';
import TimerBadge from '../components/common/TimerBadge';
import SecurityWarningToast from '../components/common/SecurityWarningToast';
import { useExamTimer } from '../hooks/useExamTimer';
import { useSecurityMonitor } from '../hooks/useSecurityMonitor';
import { apiStartRound1, apiGetRound1Questions, apiSubmitRound1, apiReportViolation, apiGetStudentSession, apiGetPublicConfig } from '../services/api';
import { Shield, Loader2, AlertCircle, Maximize, AlertTriangle } from 'lucide-react';

export default function Round1Page({ studentSession, onProceedToRound2Access, onBackHome }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreStartModal, setShowPreStartModal] = useState(false);

  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [initialTimeRemaining, setInitialTimeRemaining] = useState(2100); // 35 minutes default

  const [isLockedByAdmin, setIsLockedByAdmin] = useState(false);

  // Check student status on load to decide whether to show Pre-Start modal or directly load exam
  const checkStatusAndInit = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsLockedByAdmin(false);

      // Check public config FIRST to see if Round 1 is enabled by Admin
      const configRes = await apiGetPublicConfig();
      if (!configRes.round1Enabled) {
        setIsLockedByAdmin(true);
        setError('Round 1 has not been enabled by the Event Administrator yet. Please wait for the announcement.');
        setLoading(false);
        setShowPreStartModal(false);
        return;
      }

      const sessionRes = await apiGetStudentSession();
      const st = sessionRes.student;

      if (st && st.round1Status === 'NOT_STARTED') {
        // First time starting Round 1 and Round 1 is enabled -> Show Rules & Regulations + 25s Countdown Modal!
        setShowPreStartModal(true);
        setLoading(false);
      } else {
        // Already IN_PROGRESS or COMPLETED -> Directly initialize exam session
        await initRound1();
      }
    } catch (err) {
      // Fallback check config
      try {
        const configRes = await apiGetPublicConfig();
        if (!configRes.round1Enabled) {
          setIsLockedByAdmin(true);
          setError('Round 1 has not been enabled by the Event Administrator yet. Please wait for the announcement.');
          setLoading(false);
          setShowPreStartModal(false);
          return;
        }
      } catch (e) {}
      await initRound1();
    }
  };

  const initRound1 = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsLockedByAdmin(false);

      // Start exam on backend & get server timestamp
      const startRes = await apiStartRound1();

      if (startRes.status === 'COMPLETED' || (startRes.message && startRes.message.includes('completed'))) {
        setIsSubmitted(true);
        setLoading(false);
        return;
      }

      if (startRes.round1StartedAt) {
        const startedAtMs = new Date(startRes.round1StartedAt).getTime();
        const elapsedSec = Math.floor((Date.now() - startedAtMs) / 1000);
        const remainingSec = Math.max(0, (startRes.durationMinutes || 35) * 60 - elapsedSec);
        setInitialTimeRemaining(remainingSec);
      }

      // Fetch questions from backend (sanitized without answers)
      const qRes = await apiGetRound1Questions();
      setQuestions(qRes.questions || []);

      setLoading(false);
    } catch (err) {
      console.error('Failed to initialize Round 1:', err);
      if (err.message && err.message.includes('completed')) {
        setIsSubmitted(true);
        setLoading(false);
      } else if (err.message && err.message.includes('enabled by the Administrator')) {
        setIsLockedByAdmin(true);
        setError(err.message);
        setLoading(false);
      } else {
        setError(err.message || 'Failed to load exam. Please check backend connection.');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    checkStatusAndInit();
  }, []);

  // Timer Hook (35 minutes, server timestamp synchronized)
  const { secondsLeft, formattedTime, warningState } = useExamTimer(
    initialTimeRemaining,
    () => handleAutoSubmit('Timer expired'),
    !isSubmitted && !loading && !error
  );

  // Security Integrity Monitor Hook
  const {
    violationCount,
    showWarningModal,
    setShowWarningModal,
    lastViolationReason,
    requestFullscreen,
    isFullscreen
  } = useSecurityMonitor({
    isEnabled: !isSubmitted && !loading && !error,
    isPaused: showConfirmSubmit, // Pause security violations while confirmation modal is active
    maxViolations: 5,
    onMaxViolationsExceeded: (count, reason) => handleAutoSubmit(`Max security violations reached (${reason})`),
    onViolationOccurred: async (count, reason) => {
      try {
        await apiReportViolation('ROUND_1', reason);
      } catch (e) {
        console.error('Failed to log violation:', e);
      }
    }
  });

  useEffect(() => {
    if (!isSubmitted && !loading && !error && !showConfirmSubmit) {
      requestFullscreen();
    }
  }, [isSubmitted, loading, error, showConfirmSubmit]);

  const handleSelectOption = (optionIndex) => {
    const questionId = questions[currentIndex]?.id;
    if (!questionId) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleToggleMarkForReview = () => {
    const questionId = questions[currentIndex]?.id;
    if (!questionId) return;
    setMarkedForReview((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const handleClearAnswer = () => {
    const questionId = questions[currentIndex]?.id;
    if (!questionId) return;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const submitExamToBackend = async (reason = '') => {
    try {
      setLoading(true);
      await apiSubmitRound1(answers);
      setIsSubmitted(true);
      setLoading(false);
    } catch (err) {
      console.error('Error submitting Round 1:', err);
      // Even on error, if backend completed it, set state to submitted
      setIsSubmitted(true);
      setLoading(false);
    }
  };

  const handleAutoSubmit = (reason) => {
    submitExamToBackend(reason);
  };

  const handleManualSubmit = () => {
    setShowConfirmSubmit(true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
        <p className="text-sm font-mono font-bold text-amber-800">Initializing Round 1 Secure Session...</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="py-10 px-4">
        <Round1ResultCard onCheckRound2Status={onProceedToRound2Access} />
      </div>
    );
  }

  if (isLockedByAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="glass-panel rounded-3xl p-8 max-w-md w-full border border-amber-300 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 mb-4">
            <Shield className="h-7 w-7" />
          </div>
          <span className="rounded-full bg-amber-100 border border-amber-300 px-3 py-1 font-mono text-xs font-bold text-amber-900">
            ROUND 1 LOCKED BY ADMIN
          </span>
          <h3 className="mt-4 text-xl font-black text-slate-900 uppercase tracking-tight">Round 1 Not Active Yet</h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
            Round 1 has not been enabled by the Event Administrator yet. Please wait for the administrator to unlock Round 1 for all candidates.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                if (onBackHome) onBackHome();
                else window.location.hash = '#home';
              }}
              className="btn-cyber-secondary rounded-xl px-5 py-3 text-xs font-bold"
            >
              Return to Home
            </button>
            <button
              onClick={checkStatusAndInit}
              className="btn-cyber-primary rounded-xl px-6 py-3 text-xs font-black uppercase tracking-wider shadow-md"
            >
              REFRESH ROUND 1 STATUS
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="glass-panel rounded-3xl p-8 max-w-md w-full border border-red-300 text-center shadow-lg">
          <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 uppercase">Exam Connection Error</h3>
          <p className="mt-2 text-xs text-slate-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 btn-cyber-primary rounded-xl px-6 py-2.5 text-xs font-bold uppercase"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      {/* Fullscreen Prompt Bar if exited */}
      {!isFullscreen && !showConfirmSubmit && (
        <div
          onClick={requestFullscreen}
          className="mb-3 cursor-pointer rounded-xl bg-amber-500 text-white p-2.5 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-amber-600 transition-all"
        >
          <Maximize className="h-4 w-4 animate-bounce" />
          <span>FULLSCREEN EXAM MODE REQUIRED — CLICK HERE TO LOCK SCREEN</span>
        </div>
      )}

      {/* Top Header Exam Bar */}
      <div className="glass-panel rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-4 border border-amber-300/80 shadow-sm">
        <div>
          <span className="rounded-full bg-amber-100 border border-amber-300 px-3 py-1 font-mono text-xs font-bold text-amber-900">
            ROUND 1 • DSA FUNDAMENTALS (35 MINS)
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
            Question {currentIndex + 1} of {questions.length}
          </h2>
        </div>

        {/* Security & Timer Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs text-amber-900 font-mono font-bold">
            <Shield className="h-4 w-4 text-amber-600" />
            <span>Violations: {violationCount}/5</span>
          </div>

          <TimerBadge formattedTime={formattedTime} warningState={warningState} />
        </div>
      </div>

      {/* Main Grid: Left Palette + Right Question Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left Navigator (4 cols on lg) */}
        <div className="lg:col-span-4 h-full">
          <QuestionPalette
            questions={questions}
            totalQuestions={questions.length}
            answers={answers}
            markedForReview={markedForReview}
            currentIndex={currentIndex}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />
        </div>

        {/* Right Question Card (8 cols on lg) */}
        <div className="lg:col-span-8 h-full">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            selectedOption={currentQuestion ? answers[currentQuestion.id] : undefined}
            isMarkedForReview={currentQuestion ? markedForReview.includes(currentQuestion.id) : false}
            onSelectOption={handleSelectOption}
            onToggleMarkForReview={handleToggleMarkForReview}
            onClearAnswer={handleClearAnswer}
            onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            onSubmitExam={handleManualSubmit}
          />
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-300 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 mb-4">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
            </div>

            <h3 className="text-xl font-black text-slate-900 uppercase">
              SUBMIT ROUND 1 EXAM
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
              Are you sure you want to submit Round 1?<br />
              <strong className="text-slate-800">Answered: {answeredCount} / {questions.length}</strong> ({unansweredCount} unanswered)
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="btn-cyber-secondary rounded-xl px-5 py-2.5 text-xs font-bold"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  submitExamToBackend('User manual submission');
                }}
                className="btn-cyber-primary rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-wider"
              >
                SUBMIT ROUND 1
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pre-Start Rules & Regulations + 25s Countdown Modal */}
      <ExamPreStartModal
        isOpen={showPreStartModal}
        roundNumber={1}
        roundTitle="Round 1: DSA Fundamentals"
        durationText="35 Minutes"
        onStartConfirmed={() => {
          setShowPreStartModal(false);
          initRound1();
        }}
        onCancel={() => {
          setShowPreStartModal(false);
          if (onBackHome) onBackHome();
          else window.location.hash = '#home';
        }}
      />

      {/* Security Toast Warning Modal */}
      <SecurityWarningToast
        isOpen={showWarningModal}
        onClose={() => {
          setShowWarningModal(false);
          requestFullscreen();
        }}
        violationCount={violationCount}
        maxViolations={5}
        reason={lastViolationReason}
      />
    </div>
  );
}
