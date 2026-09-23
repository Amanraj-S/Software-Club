import React, { useState, useEffect } from 'react';
import ProblemStatement from '../components/coding/ProblemStatement';
import PythonEditor from '../components/coding/PythonEditor';
import TestResultsPanel from '../components/coding/TestResultsPanel';
import TimerBadge from '../components/common/TimerBadge';
import SecurityWarningToast from '../components/common/SecurityWarningToast';
import ExamPreStartModal from '../components/exam/ExamPreStartModal';
import { useExamTimer } from '../hooks/useExamTimer';
import { useSecurityMonitor } from '../hooks/useSecurityMonitor';
import {
  apiGetRound2Access,
  apiStartRound2,
  apiGetRound2Questions,
  apiRunPythonCode,
  apiSaveDraftCode,
  apiGetSavedSubmissions,
  apiSubmitRound2,
  apiReportViolation
} from '../services/api';
import {
  Send,
  Shield,
  AlertTriangle,
  Lock,
  Clock,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Maximize,
  Code2
} from 'lucide-react';

export default function Round2Page({ studentSession, onBackHome }) {
  // Access and Exam States
  const [accessState, setAccessState] = useState('LOCKED'); // LOCKED, GRANTED, REVOKED
  const [statusState, setStatusState] = useState('NOT_STARTED'); // NOT_STARTED, IN_PROGRESS, COMPLETED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreStartModal, setShowPreStartModal] = useState(false);

  // Coding state
  const [problems, setProblems] = useState([]);
  const [currentProblemId, setCurrentProblemId] = useState(1);
  const [codeSubmissions, setCodeSubmissions] = useState({});
  const [testResults, setTestResults] = useState({});
  const [solvedStatus, setSolvedStatus] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [initialTimeRemaining, setInitialTimeRemaining] = useState(3600); // 60 minutes (1 Hour) default

  // Check Round 2 Access on Mount & Refresh
  const fetchAccess = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGetRound2Access();

      setAccessState(res.accessState || 'LOCKED');
      setStatusState(res.statusState || 'NOT_STARTED');

      if (res.round2StartedAt) {
        const startedMs = new Date(res.round2StartedAt).getTime();
        const elapsedSec = Math.floor((Date.now() - startedMs) / 1000);
        const remainingSec = Math.max(0, (res.durationMinutes || 60) * 60 - elapsedSec);
        setInitialTimeRemaining(remainingSec);
      }

      if (res.accessState === 'GRANTED' && (res.statusState === 'IN_PROGRESS' || res.statusState === 'COMPLETED')) {
        await loadCodingData();
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to fetch Round 2 access:', err);
      setError(err.message || 'Error checking Round 2 access.');
      setLoading(false);
    }
  };

  const loadCodingData = async () => {
    try {
      const qRes = await apiGetRound2Questions();
      const problemList = qRes.questions || [];
      setProblems(problemList);

      // Load draft saved code
      const subRes = await apiGetSavedSubmissions();
      const savedMap = subRes.submissions || {};

      const initialCode = {};
      problemList.forEach((p) => {
        if (savedMap[p.id] && savedMap[p.id].code) {
          initialCode[p.id] = savedMap[p.id].code;
        } else {
          initialCode[p.id] = p.starterCode;
        }
      });

      setCodeSubmissions(initialCode);
      if (problemList.length > 0 && !currentProblemId) {
        setCurrentProblemId(problemList[0].id);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load coding environment data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccess();
  }, []);

  // Timer Hook (60 minutes / 1 Hour)
  const { secondsLeft, formattedTime, warningState } = useExamTimer(
    initialTimeRemaining,
    () => handleAutoSubmitFinal('60-minute Timer Expired'),
    statusState === 'IN_PROGRESS' && accessState === 'GRANTED'
  );

  // Security Monitor Hook
  const {
    violationCount,
    showWarningModal,
    setShowWarningModal,
    lastViolationReason,
    requestFullscreen,
    isFullscreen
  } = useSecurityMonitor({
    isEnabled: statusState === 'IN_PROGRESS' && accessState === 'GRANTED',
    isPaused: showConfirmSubmit, // Pause security monitor while submit confirmation modal is active
    maxViolations: 5,
    onMaxViolationsExceeded: (count, reason) => handleAutoSubmitFinal(`Max security violations reached (${reason})`),
    onViolationOccurred: async (count, reason) => {
      try {
        await apiReportViolation('ROUND_2', reason);
      } catch (e) {
        console.error('Failed to log violation:', e);
      }
    }
  });

  useEffect(() => {
    if (statusState === 'IN_PROGRESS' && accessState === 'GRANTED' && !showConfirmSubmit) {
      requestFullscreen();
    }
  }, [statusState, accessState, showConfirmSubmit]);

  // Handle Start Round 2
  const handleStartExam = async () => {
    try {
      setLoading(true);
      const startRes = await apiStartRound2();
      if (startRes.round2StartedAt) {
        const startedMs = new Date(startRes.round2StartedAt).getTime();
        const elapsedSec = Math.floor((Date.now() - startedMs) / 1000);
        const remainingSec = Math.max(0, (startRes.durationMinutes || 90) * 60 - elapsedSec);
        setInitialTimeRemaining(remainingSec);
      }
      setStatusState('IN_PROGRESS');
      await loadCodingData();
    } catch (err) {
      setError(err.message || 'Failed to start Round 2.');
      setLoading(false);
    }
  };

  const currentProblem = problems.find((p) => p.id === currentProblemId) || problems[0];
  const currentCode = (currentProblem && codeSubmissions[currentProblem.id]) || (currentProblem?.starterCode || '');

  const handleChangeCode = (newCode) => {
    if (!currentProblem) return;
    setCodeSubmissions((prev) => ({
      ...prev,
      [currentProblem.id]: newCode
    }));

    // Auto-save draft code to backend asynchronously
    apiSaveDraftCode(currentProblem.id, newCode).catch(() => {});
  };

  const handleResetCode = () => {
    if (!currentProblem) return;
    if (window.confirm('Reset code to initial starter template?')) {
      const reset = currentProblem.starterCode;
      setCodeSubmissions((prev) => ({
        ...prev,
        [currentProblem.id]: reset
      }));
      apiSaveDraftCode(currentProblem.id, reset).catch(() => {});
    }
  };

  // Run against Public Test Cases using backend python execution service
  const handleRunCode = async () => {
    if (!currentProblem) return;
    setIsRunning(true);
    try {
      const runRes = await apiRunPythonCode(currentProblem.id, currentCode);

      const testOutput = {
        isSubmission: false,
        passedCount: runRes.passedCount || 0,
        totalCount: runRes.totalCount || 0,
        caseResults: runRes.testResults || [],
        executionTime: runRes.executionTime || '0ms',
        error: runRes.error
      };

      setTestResults((prev) => ({
        ...prev,
        [currentProblem.id]: testOutput
      }));

    } catch (err) {
      setTestResults((prev) => ({
        ...prev,
        [currentProblem.id]: {
          isSubmission: false,
          passedCount: 0,
          totalCount: currentProblem.publicTestCases?.length || 0,
          caseResults: [],
          executionTime: '0ms',
          error: err.message
        }
      }));
    } finally {
      setIsRunning(false);
    }
  };

  // Final Submit to Backend
  const handleAutoSubmitFinal = async (reason = '') => {
    try {
      setIsSubmitting(true);
      // Auto-save active problem code draft before submitting
      if (currentProblem && codeSubmissions[currentProblem.id]) {
        await apiSaveDraftCode(currentProblem.id, codeSubmissions[currentProblem.id]).catch(() => {});
      }
      await apiSubmitRound2();
      setStatusState('COMPLETED');
    } catch (err) {
      console.error('Submit Round 2 Error:', err);
      setStatusState('COMPLETED');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
        <p className="text-sm font-mono font-bold text-amber-900">Checking Round 2 Access Permissions...</p>
      </div>
    );
  }

  // --- STATE 1: ACCESS PENDING (LOCKED) ---
  if (accessState === 'LOCKED' && statusState !== 'COMPLETED') {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-amber-300 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 mb-4">
            <Clock className="h-8 w-8 animate-pulse" />
          </div>

          <span className="rounded-full bg-amber-100 border border-amber-300 px-3.5 py-1 font-mono text-xs font-bold text-amber-900">
            ROUND 2 ACCESS PENDING
          </span>

          <h2 className="mt-4 text-2xl font-black text-slate-900 uppercase tracking-tight">
            ROUND 2 ACCESS PENDING
          </h2>

          <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-5 text-xs text-slate-700 leading-relaxed font-sans space-y-2">
            <p className="font-bold text-amber-900">“Round 2 access is currently pending.”</p>
            <p className="font-medium">
              Please wait for further instructions from the event administrator. The administrator is currently reviewing student results and granting Round 2 access to candidates.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onBackHome}
              className="btn-cyber-secondary rounded-xl px-5 py-3 text-xs font-bold"
            >
              Return to Home
            </button>
            <button
              onClick={fetchAccess}
              className="btn-cyber-primary rounded-xl px-6 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              <span>REFRESH ACCESS STATUS</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STATE 2: ACCESS NOT AVAILABLE (REVOKED) ---
  if (accessState === 'REVOKED' && statusState !== 'COMPLETED') {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-slate-300 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 border border-slate-300 text-slate-600 mb-4">
            <Lock className="h-8 w-8" />
          </div>

          <span className="rounded-full bg-slate-100 border border-slate-300 px-3 py-1 font-mono text-xs font-bold text-slate-600">
            ACCESS DENIED
          </span>

          <h2 className="mt-4 text-2xl font-black text-slate-900 uppercase tracking-tight">
            ROUND 2 ACCESS NOT AVAILABLE
          </h2>

          <p className="mt-3 text-xs text-slate-600 leading-relaxed font-medium">
            Round 2 access is not available for this session. Thank you for participating in the competition.
          </p>

          <button
            onClick={onBackHome}
            className="mt-6 btn-cyber-secondary rounded-xl px-6 py-2.5 text-xs font-bold"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // --- STATE 3: ACCESS AVAILABLE (GRANTED, NOT_STARTED) ---
  if (accessState === 'GRANTED' && statusState === 'NOT_STARTED') {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
        <div className="max-w-lg w-full glass-panel rounded-3xl p-8 border border-amber-300 text-center shadow-xl relative overflow-hidden">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 mb-4">
            <Code2 className="h-8 w-8" />
          </div>

          <span className="rounded-full bg-amber-100 border border-amber-300 px-3.5 py-1 font-mono text-xs font-bold text-amber-900">
            ROUND 2 UNLOCKED
          </span>

          <h2 className="mt-4 text-2xl font-black text-slate-900 uppercase tracking-tight">
            ROUND 2 ACCESS AVAILABLE
          </h2>

          <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-5 text-xs text-slate-700 leading-relaxed space-y-2 text-left">
            <p className="font-bold text-amber-900">
              The event administrator has granted you access to Round 2!
            </p>
            <ul className="space-y-1 list-disc list-inside text-slate-600 font-mono font-medium">
              <li>Duration: 60 Minutes (1 Hour)</li>
              <li>Challenges: 5 Algorithmic Python Problems</li>
              <li>Environment: Monaco IDE with sandboxed execution</li>
              <li>Security monitoring active during coding</li>
            </ul>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-700 font-bold text-center">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onBackHome}
              className="btn-cyber-secondary rounded-2xl px-6 py-4 text-xs font-bold"
            >
              Return to Home
            </button>
            <button
              onClick={() => setShowPreStartModal(true)}
              className="btn-cyber-primary rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-wider flex items-center gap-3 shadow-xl"
            >
              <span>[ START ROUND 2 ]</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STATE 5: COMPLETED ---
  if (statusState === 'COMPLETED') {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
        <div className="max-w-lg w-full glass-panel rounded-3xl p-8 sm:p-10 border border-amber-300 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 mb-6">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <span className="rounded-full bg-amber-100 border border-amber-300 px-3.5 py-1 font-mono text-xs font-bold text-amber-900">
            FINAL SUBMISSION CONFIRMED
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 uppercase">
            ROUND 2 COMPLETED
          </h2>

          <div className="my-6 space-y-3 rounded-2xl bg-amber-50 border border-amber-200 p-6 text-slate-800">
            <p className="text-base font-bold text-amber-900">
              “Your solutions have been successfully submitted.”
            </p>
            <p className="text-xs text-slate-600 font-sans leading-relaxed font-medium">
              “Thank you for participating.”
            </p>
          </div>

          <p className="text-xs text-slate-500 font-mono font-medium mb-6">
            E-certificates will be provided to participants after final evaluation by the organizers.
          </p>

          <div className="flex justify-center">
            <button
              onClick={onBackHome}
              className="btn-cyber-primary rounded-xl px-8 py-3 text-xs font-black uppercase tracking-wider"
            >
              RETURN TO HOME PAGE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STATE 4: IN_PROGRESS (MONACO PYTHON IDE) ---
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      {/* Fullscreen Prompt Bar if exited */}
      {!isFullscreen && (
        <div
          onClick={requestFullscreen}
          className="mb-3 cursor-pointer rounded-xl bg-amber-500 text-white p-2.5 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-amber-600 transition-all"
        >
          <Maximize className="h-4 w-4 animate-bounce" />
          <span>FULLSCREEN EXAM MODE REQUIRED — CLICK HERE TO LOCK SCREEN</span>
        </div>
      )}

      {/* Round 2 IDE Top Navigation Header */}
      <div className="glass-panel rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-4 border border-amber-300/80 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-amber-100 border border-amber-300 px-3 py-1 font-mono text-xs font-bold text-amber-900">
            ROUND 2 • PYTHON CODING ENVIRONMENT
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="btn-cyber-primary rounded-xl px-5 py-2 text-xs font-black uppercase tracking-wider flex items-center gap-2"
          >
            <Send className="h-3.5 w-3.5" />
            <span>SUBMIT ROUND 2</span>
          </button>

          <TimerBadge formattedTime={formattedTime} warningState={warningState} />
        </div>
      </div>

      {/* Main IDE Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* Left Pane: Problem Description & Specs (5 cols on lg) */}
        <div className="lg:col-span-5 h-[640px]">
          <ProblemStatement
            problems={problems}
            currentProblemId={currentProblemId}
            onSelectProblem={(id) => setCurrentProblemId(id)}
            solvedStatus={solvedStatus}
          />
        </div>

        {/* Right Pane: Monaco Code Editor + Output Console (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col space-y-4 h-[640px]">
          <div className="flex-1">
            <PythonEditor
              code={currentCode}
              onChangeCode={handleChangeCode}
              onResetCode={handleResetCode}
              onRunCode={handleRunCode}
              onSubmitCode={handleRunCode}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="h-[210px] shrink-0">
            <TestResultsPanel
              testResult={testResults[currentProblemId]}
              publicTestCases={currentProblem?.publicTestCases}
              isRunning={isRunning || isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Final Submission Confirmation Dialog */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-md w-full border border-amber-300 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 mb-4">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
            </div>

            <h3 className="text-xl font-black text-slate-900 uppercase">
              CONFIRM ROUND 2 SUBMISSION
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
              Are you sure you want to submit your Round 2 solutions? Once submitted, your exam will be finalized.
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
                  handleAutoSubmitFinal('User manual final submission');
                }}
                className="btn-cyber-primary rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-wider"
              >
                SUBMIT FINAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pre-Start Rules & Regulations + 25s Countdown Modal */}
      <ExamPreStartModal
        isOpen={showPreStartModal}
        roundNumber={2}
        roundTitle="Round 2: Python Coding Challenge"
        durationText="60 Minutes (1 Hour)"
        onStartConfirmed={() => {
          setShowPreStartModal(false);
          handleStartExam();
        }}
        onCancel={() => setShowPreStartModal(false)}
      />

      {/* Security Warning Modal */}
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
