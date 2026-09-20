import React from 'react';
import { Bookmark, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions = 30,
  selectedOption,
  isMarkedForReview,
  onSelectOption,
  onToggleMarkForReview,
  onClearAnswer,
  onPrev,
  onNext,
  onSubmitExam
}) {
  if (!question) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full border border-amber-300 bg-white/95 shadow-sm">
      <div>
        {/* Topic Badge & Question Index */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-bold text-amber-900">
              {question.topic}
            </span>
            <span className="text-xs text-slate-600 font-mono font-bold">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>

          <button
            onClick={onToggleMarkForReview}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-bold transition-all ${
              isMarkedForReview
                ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                : 'bg-white border-slate-300 text-slate-700 hover:border-amber-400 hover:bg-amber-50'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>{isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}</span>
          </button>
        </div>

        {/* Question Text */}
        <div className="my-6">
          <h2 className="text-base sm:text-lg font-black text-slate-900 whitespace-pre-wrap leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {question.options.map((optionText, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

            return (
              <label
                key={optIdx}
                onClick={() => onSelectOption(optIdx)}
                className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-100/80 text-amber-950 shadow-sm ring-2 ring-amber-400/50'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-amber-300 hover:bg-amber-50/50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {optionLetter}
                  </div>
                  <span className="text-sm font-bold leading-normal">{optionText}</span>
                </div>

                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? 'border-amber-500 bg-amber-500 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons Footer */}
      <div className="mt-8 pt-6 border-t border-amber-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={questionNumber === 1}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-amber-50 hover:border-amber-400 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={onNext}
            disabled={questionNumber === totalQuestions}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-amber-50 hover:border-amber-400 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {selectedOption !== undefined && (
            <button
              onClick={onClearAnswer}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:border-red-400 hover:text-red-600"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear Answer</span>
            </button>
          )}

          <button
            onClick={onSubmitExam}
            className="btn-cyber-primary rounded-xl px-5 py-2 text-xs uppercase tracking-wider font-extrabold shadow-md"
          >
            Submit Round 1
          </button>
        </div>
      </div>
    </div>
  );
}
