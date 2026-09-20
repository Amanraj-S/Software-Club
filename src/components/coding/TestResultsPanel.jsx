import React from 'react';
import { CheckCircle2, XCircle, Terminal, Clock, AlertOctagon } from 'lucide-react';

export default function TestResultsPanel({
  testResult,
  publicTestCases = [],
  isRunning = false
}) {
  if (isRunning) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-amber-300 text-center flex flex-col items-center justify-center min-h-[160px] bg-white/90">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        <p className="mt-3 text-xs font-mono font-bold text-amber-900">
          Running Python Execution Sandbox...
        </p>
      </div>
    );
  }

  if (!testResult) {
    return (
      <div className="glass-panel rounded-2xl p-4 border border-amber-300 text-center text-slate-700 text-xs flex items-center justify-center min-h-[120px] bg-white/90">
        <div className="flex items-center gap-2 font-mono font-bold">
          <Terminal className="h-4 w-4 text-amber-600" />
          <span>Click [ RUN CODE ] or [ SUBMIT SOLUTION ] to view execution results.</span>
        </div>
      </div>
    );
  }

  const { isSubmission, passedCount, totalCount, caseResults, executionTime, rawOutput, error } = testResult;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-amber-300 flex flex-col space-y-4 bg-white/95 shadow-sm">
      {/* Top Console Status Bar */}
      <div className="flex items-center justify-between border-b border-amber-200 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-amber-600" />
          <span className="text-xs font-black uppercase text-slate-900 tracking-wider">
            {isSubmission ? 'Final Evaluation Matrix' : 'Test Run Console'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-bold">
          {executionTime && (
            <div className="flex items-center gap-1 text-slate-700">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span>{executionTime}</span>
            </div>
          )}
          {caseResults && (
            <span
              className={`rounded-full px-2.5 py-0.5 font-bold ${
                passedCount === totalCount
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-red-100 text-red-900 border border-red-300'
              }`}
            >
              {passedCount} / {totalCount} Test Cases Passed
            </span>
          )}
        </div>
      </div>

      {/* Error Traceback if any */}
      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-mono text-red-900">
          <div className="flex items-center gap-1.5 font-bold text-red-700 mb-1">
            <AlertOctagon className="h-4 w-4" />
            <span>Python Execution Error</span>
          </div>
          <pre className="whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed font-bold">{error}</pre>
        </div>
      )}

      {/* Test Case Matrix */}
      {caseResults && caseResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Test Case Details
          </h4>
          <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
            {caseResults.map((tc, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-3 text-xs font-mono transition-all ${
                  tc.passed
                    ? 'border-emerald-300 bg-emerald-50/80 text-slate-900'
                    : 'border-red-300 bg-red-50/80 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {tc.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                    )}
                    <span className="font-bold text-slate-900">
                      Test Case {idx + 1} {tc.isHidden ? '(Hidden)' : ''}
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold ${tc.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                    {tc.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>

                {!tc.isHidden && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-slate-500 block font-sans">Actual Output:</span>
                      <span className="text-amber-900 font-mono font-bold block truncate">{tc.actual || '""'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-sans">Expected Output:</span>
                      <span className="text-emerald-800 font-mono font-bold block truncate">{tc.expected}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Output Stream */}
      {rawOutput && !caseResults && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-mono">
          <span className="text-[10px] text-slate-500 uppercase block mb-1 font-sans">Standard Output:</span>
          <pre className="text-amber-900 font-bold whitespace-pre-wrap overflow-x-auto">{rawOutput}</pre>
        </div>
      )}
    </div>
  );
}
