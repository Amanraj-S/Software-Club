import React from 'react';
import { CheckCircle2, FileText, AlertCircle, Layers } from 'lucide-react';

export default function ProblemStatement({
  problems = [],
  currentProblemId,
  onSelectProblem,
  solvedStatus = {}
}) {
  const problem = problems.find(p => p.id === currentProblemId) || problems[0];

  if (!problem) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col h-full border border-amber-300 overflow-hidden shadow-sm bg-white/95">
      {/* Problem Tabs Header (1 to 5) */}
      <div className="flex items-center gap-2 border-b border-amber-200 pb-3 overflow-x-auto no-scrollbar">
        {problems.map((p, idx) => {
          const isActive = p.id === currentProblemId;
          const isSolved = solvedStatus[p.id] === true;

          return (
            <button
              key={p.id}
              onClick={() => onSelectProblem(p.id)}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-black whitespace-nowrap transition-all ${
                isActive
                  ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-amber-400 hover:bg-amber-50'
              }`}
            >
              <span>Problem {idx + 1}</span>
              {isSolved && (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Problem Content Container */}
      <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-5 text-slate-800">
        {/* Title & Metadata */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold uppercase text-amber-800">
              Problem {problem.id} of {problems.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
                {problem.difficulty}
              </span>
              <span className="rounded-full bg-yellow-100 border border-yellow-300 px-2.5 py-0.5 text-[11px] font-bold text-yellow-900">
                {problem.points} Points
              </span>
            </div>
          </div>
          <h2 className="mt-2 text-lg font-black text-slate-900 tracking-tight">
            {problem.title}
          </h2>
        </div>

        {/* Detailed Description */}
        <div className="text-xs leading-relaxed space-y-3 font-medium text-slate-800">
          <div dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br/>') }} />
        </div>

        {/* Input & Output Specs */}
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
              Input Format
            </h4>
            <p className="text-slate-700 font-medium leading-relaxed">{problem.inputFormat}</p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
              Output Format
            </h4>
            <p className="text-slate-700 font-medium leading-relaxed">{problem.outputFormat}</p>
          </div>
        </div>

        {/* Constraints */}
        {problem.constraints && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
              <span>Constraints</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 font-mono font-bold">
              {problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Sample Input & Output */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-3.5 text-xs space-y-3">
          <h4 className="font-black text-amber-900 uppercase tracking-wider text-[11px]">
            Sample Case
          </h4>
          <div>
            <span className="text-[10px] text-slate-600 uppercase font-mono font-bold">Sample Input:</span>
            <pre className="mt-1 rounded-lg bg-white border border-amber-300 p-2.5 font-mono font-bold text-slate-900 overflow-x-auto">
              {problem.sampleInput}
            </pre>
          </div>
          <div>
            <span className="text-[10px] text-slate-600 uppercase font-mono font-bold">Sample Output:</span>
            <pre className="mt-1 rounded-lg bg-white border border-amber-300 p-2.5 font-mono font-bold text-emerald-800 overflow-x-auto">
              {problem.sampleOutput}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
