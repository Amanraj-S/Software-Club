import React, { useState, useEffect } from 'react';
import { Shield, BookOpen, CheckCircle2, ArrowRight, Play, FastForward, AlertTriangle } from 'lucide-react';

export default function ExamPreStartModal({
  isOpen,
  roundNumber = 1,
  roundTitle = "Round 1: DSA Fundamentals",
  durationText = "35 Minutes",
  rules = [],
  onStartConfirmed,
  onCancel
}) {
  const [step, setStep] = useState('RULES'); // 'RULES' | 'COUNTDOWN'
  const [agreed, setAgreed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25);

  // Reset modal state whenever opened
  useEffect(() => {
    if (isOpen) {
      setStep('RULES');
      setAgreed(false);
      setSecondsLeft(25);
    }
  }, [isOpen]);

  // Handle 25-Second Countdown Timer
  useEffect(() => {
    if (step !== 'COUNTDOWN') return;

    if (secondsLeft <= 0) {
      onStartConfirmed();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, secondsLeft, onStartConfirmed]);

  if (!isOpen) return null;

  const defaultRound1Rules = [
    "Strict Fullscreen Mode is required throughout the exam.",
    "Security Monitoring is active: Tab switching, window minimization, or opening developer tools will record a Security Violation.",
    "Maximum of 5 Security Violations allowed. Reaching 5 violations will automatically submit your exam.",
    "Total Questions: 30 Multiple Choice Questions covering DSA Fundamentals.",
    "Duration: 35 Minutes (Time is tracked on the server).",
    "Each question has 4 options with 1 mark per correct answer. There is NO negative marking.",
    "Ensure a stable internet connection. Your selected answers are auto-saved."
  ];

  const defaultRound2Rules = [
    "Strict Fullscreen Mode & Security Integrity Monitoring are active (Max 5 violations allowed).",
    "Total Challenges: 5 Algorithmic Python Problems.",
    "Duration: 60 Minutes (1 Hour).",
    "Write and execute code directly in the sandboxed Monaco Python IDE.",
    "Code will be tested against both Public test cases and Hidden evaluation test cases.",
    "Draft code is auto-saved continuously as you type.",
    "Final submission must be completed before the 60-minute timer expires."
  ];

  const activeRules = rules.length > 0 ? rules : (roundNumber === 1 ? defaultRound1Rules : defaultRound2Rules);

  const handleProceedToCountdown = () => {
    if (!agreed) return;
    setStep('COUNTDOWN');
    setSecondsLeft(25);
  };

  // Status message for countdown
  const getStatusMessage = (sec) => {
    if (sec > 18) return "Initializing Secure Exam Environment...";
    if (sec > 11) return "Enforcing Fullscreen & Security Monitors...";
    if (sec > 5) return "Loading Exam Questions & Data Assets...";
    return "GET READY! EXAM STARTING NOW...";
  };

  // Progress percentage for SVG ring (25s total)
  const strokeDashoffset = 440 - (440 * (25 - secondsLeft)) / 25;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      {/* STEP 1: RULES AND REGULATIONS */}
      {step === 'RULES' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-amber-300 max-h-[90vh] overflow-y-auto shadow-2xl relative">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-200">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white font-black shadow-md">
                R{roundNumber}
              </div>
              <div>
                <span className="rounded-full bg-amber-100 border border-amber-300 px-3 py-0.5 font-mono text-[10px] font-bold text-amber-900">
                  OFFICIAL INSTRUCTIONS • {durationText}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                  {roundTitle}
                </h2>
              </div>
            </div>
          </div>

          {/* Rules List */}
          <div className="my-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-600" />
              <span>Rules & Regulations Instructions</span>
            </h3>

            <div className="space-y-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4 text-xs text-slate-800">
              {activeRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="my-5 rounded-2xl border border-amber-300 bg-amber-100/50 p-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-5 w-5 rounded-md border-amber-400 text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-900 leading-normal">
                I have read, understood, and agree to follow all the exam rules and security regulations.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
            {onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="btn-cyber-secondary rounded-xl px-5 py-3 text-xs font-bold"
              >
                CANCEL
              </button>
            ) : <div />}

            <button
              type="button"
              disabled={!agreed}
              onClick={handleProceedToCountdown}
              className="btn-cyber-primary rounded-2xl px-7 py-3.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>AGREE & PROCEED</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: 25-SECOND ANIMATED COUNTDOWN */}
      {step === 'COUNTDOWN' && (
        <div className="glass-panel rounded-3xl p-8 sm:p-12 max-w-lg w-full border border-amber-400 text-center shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="mb-2">
            <span className="rounded-full bg-amber-100 border border-amber-300 px-4 py-1 font-mono text-xs font-bold text-amber-900 uppercase">
              PREPARING EXAM SESSION
            </span>
          </div>

          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">
            Test Starts In...
          </h2>

          {/* Circular Countdown Ring */}
          <div className="relative flex items-center justify-center my-4">
            <svg className="h-44 w-44 transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="70"
                className="stroke-amber-200/60"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r="70"
                className="stroke-amber-500 transition-all duration-1000 ease-linear"
                strokeWidth="10"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-black font-mono text-slate-900 animate-pulse">
                {secondsLeft}
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest mt-1">
                SECONDS
              </span>
            </div>
          </div>

          {/* Dynamic Status Text */}
          <div className="mt-4 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 w-full">
            <p className="text-xs font-mono font-bold text-amber-900 animate-pulse">
              {getStatusMessage(secondsLeft)}
            </p>
          </div>

          <p className="mt-4 text-[11px] text-slate-500 font-medium">
            Please make sure your browser is in full screen mode.
          </p>

          {/* Skip Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={onStartConfirmed}
              className="btn-cyber-secondary rounded-xl px-5 py-2.5 text-xs font-mono font-bold flex items-center gap-2 hover:border-amber-400"
            >
              <FastForward className="h-3.5 w-3.5 text-amber-600" />
              <span>SKIP COUNTDOWN & START NOW</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
