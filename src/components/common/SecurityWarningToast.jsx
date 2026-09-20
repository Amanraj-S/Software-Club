import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SecurityWarningToast({
  isOpen,
  onClose,
  violationCount,
  maxViolations = 3,
  reason
}) {
  if (!isOpen) return null;

  const isLastWarning = violationCount >= maxViolations;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative max-w-md w-full rounded-2xl border border-red-500/40 bg-[#0d1527] p-6 shadow-2xl shadow-red-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <ShieldAlert className="h-6 w-6 animate-pulse" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                EXAM INTEGRITY VIOLATION DETECTED
              </h3>
              <p className="mt-1 text-xs text-red-300 font-medium">
                {reason || "Leaving the exam window or tab switching is logged as a security violation."}
              </p>

              <div className="mt-4 rounded-xl bg-red-950/40 border border-red-500/20 p-3">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                  <span>Violation Count:</span>
                  <span className="text-red-400 font-mono font-bold text-sm">
                    {violationCount} / {maxViolations}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-300"
                    style={{ width: `${(violationCount / maxViolations) * 100}%` }}
                  />
                </div>
              </div>

              {isLastWarning ? (
                <p className="mt-3 text-xs text-red-400 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Maximum violations reached. Your exam is being automatically submitted now.
                </p>
              ) : (
                <p className="mt-3 text-xs text-slate-400">
                  Please keep this exam tab active in fullscreen mode. Further violations will cause automatic submission.
                </p>
              )}

              {!isLastWarning && (
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={onClose}
                    className="btn-cyber-primary rounded-xl px-5 py-2 text-xs uppercase tracking-wider"
                  >
                    I Understand & Resume Exam
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
