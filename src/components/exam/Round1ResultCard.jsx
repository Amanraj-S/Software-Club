import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Round1ResultCard({ onCheckRound2Status }) {
  return (
    <div
      className="mx-auto max-w-xl glass-panel rounded-3xl p-8 sm:p-10 border border-amber-300 text-center relative overflow-hidden shadow-xl"
    >
      {/* Background subtle glow */}
      <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-yellow-400/10 blur-3xl" />

      {/* Header Badge Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 mb-6">
        <CheckCircle2 className="h-9 w-9 text-emerald-600" />
      </div>

      <span className="rounded-full bg-amber-100 border border-amber-300 px-3.5 py-1 font-mono text-xs font-bold text-amber-900">
        ROUND 1 SUBMISSION
      </span>

      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 uppercase">
        ROUND 1 COMPLETED
      </h2>

      <div className="my-6 space-y-3 rounded-2xl bg-amber-50 border border-amber-200 p-6 text-slate-800">
        <p className="text-base font-bold text-amber-900">
          “Your responses have been successfully submitted.”
        </p>
        <p className="text-xs text-slate-600 font-sans leading-relaxed font-medium">
          “Please wait for further instructions from the event administrator.”
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-100/50 p-4 text-xs text-amber-900 font-bold flex items-center justify-center gap-2 mb-6">
        <Clock className="h-4 w-4 text-amber-600 shrink-0" />
        <span>Round 1 results are being evaluated by the event administrators.</span>
      </div>

      <div className="pt-2 flex justify-center">
        <button
          onClick={onCheckRound2Status}
          className="btn-cyber-primary rounded-2xl px-8 py-3.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md"
        >
          <span>[ CHECK ROUND 2 STATUS ]</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
