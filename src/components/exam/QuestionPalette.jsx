import React from 'react';
import { Bookmark, CheckCircle2, HelpCircle } from 'lucide-react';

export default function QuestionPalette({
  questions = [],
  totalQuestions = 30,
  answers = {},
  markedForReview = [],
  currentIndex = 0,
  onSelectQuestion
}) {
  const answeredCount = Object.keys(answers).length;
  const reviewCount = markedForReview.length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col h-full border border-amber-300 bg-white/95 shadow-sm">
      {/* Header Stats */}
      <h3 className="text-sm font-black tracking-wider text-slate-900 uppercase mb-3 flex items-center justify-between">
        <span>Question Navigation</span>
        <span className="text-xs text-amber-800 font-mono font-bold">
          {currentIndex + 1} / {totalQuestions}
        </span>
      </h3>

      {/* Summary Legend */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-bold">
        <div className="flex items-center gap-2 rounded-lg bg-emerald-100 border border-emerald-300 px-2.5 py-1.5 text-emerald-900">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-amber-100 border border-amber-300 px-2.5 py-1.5 text-amber-900">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-600" />
          <span>Review ({reviewCount})</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-300 px-2.5 py-1.5 text-slate-700 col-span-2">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
          <span>Unanswered ({unansweredCount})</span>
        </div>
      </div>

      {/* Grid of 30 Buttons */}
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 overflow-y-auto max-h-[380px] p-1 pr-2">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = idx === currentIndex;
          const qId = questions[idx]?.id ?? (idx + 1);
          const isAnswered = answers[qId] !== undefined;
          const isMarked = markedForReview.includes(qId);

          let btnStyles = "bg-white text-slate-700 border-slate-300 hover:border-amber-400 hover:bg-amber-50";

          if (isMarked) {
            btnStyles = "bg-amber-500 text-white border-amber-600 shadow-sm";
          } else if (isAnswered) {
            btnStyles = "bg-emerald-600 text-white border-emerald-700 shadow-sm";
          }

          if (isCurrent) {
            btnStyles += " ring-2 ring-amber-500 ring-offset-2 ring-offset-white font-black scale-105";
          }

          return (
            <button
              key={idx}
              onClick={() => onSelectQuestion(idx)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-bold transition-all ${btnStyles}`}
            >
              {idx + 1}
              {isMarked && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-yellow-300 border border-amber-700" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
