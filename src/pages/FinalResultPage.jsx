import React, { useEffect } from 'react';
import { Award, CheckCircle2, Trophy, Code2, Sparkles, Download, ArrowRight, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export default function FinalResultPage({ studentSession, onBackHome }) {
  useEffect(() => {
    // Subtle professional celebration confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#4facfe', '#7928ca']
    });
  }, []);

  if (!studentSession) return null;

  const {
    name,
    registerNo,
    department,
    year,
    round1Score = 0,
    round2Score = 0,
    finalScore = 0,
    round2SolvedCount = 0,
    round2TestCasesPassed = 0,
    round2TotalTestCases = 25
  } = studentSession;

  const totalMax = 130;
  const percentage = Math.round((finalScore / totalMax) * 100);

  return (
    <div className="relative min-h-[calc(100vh-100px)] py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel rounded-3xl p-8 sm:p-12 border border-cyan-500/30 text-center relative overflow-hidden shadow-2xl"
      >
        {/* Subtle background glow */}
        <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

        {/* Top Trophy Emblem */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/20 mb-6">
          <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-[#060913]">
            <Trophy className="h-10 w-10 text-cyan-400" />
          </div>
        </div>

        <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-4 py-1 text-xs font-mono font-bold text-cyan-300">
          SATHYABAMA SOFTWARE CLUB • OFFICIAL EVALUATION
        </span>

        <h1 className="mt-3 text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          MASTERING DSA BASICS <span className="text-cyan-400 font-mono">WITH PYTHON</span>
        </h1>
        <p className="mt-1 text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
          FINAL COMPETITION RESULT
        </p>

        {/* Student Info Card */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-slate-950/80 border border-slate-800 px-6 py-3 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <User className="h-4 w-4 text-cyan-400" />
            <span>{name}</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-cyan-300">Reg: {registerNo}</span>
          <span className="text-slate-600">•</span>
          <span>{department} ({year})</span>
        </div>

        {/* Total Score Big Display */}
        <div className="my-8 rounded-3xl bg-slate-950/90 border border-cyan-500/30 p-8 shadow-inner">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Overall Performance Score
          </div>
          <div className="mt-3 text-6xl sm:text-7xl font-black font-mono text-cyan-400">
            {finalScore} <span className="text-2xl text-slate-500 font-sans font-normal">/ {totalMax}</span>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold border-t border-slate-800/80 pt-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
              <span className="text-slate-500 text-[10px] uppercase block">Round 1 Score</span>
              <span className="text-lg font-bold font-mono text-cyan-300">{round1Score} / 30</span>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
              <span className="text-slate-500 text-[10px] uppercase block">Round 2 Score</span>
              <span className="text-lg font-bold font-mono text-blue-300">{round2Score} / 100</span>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
              <span className="text-slate-500 text-[10px] uppercase block">Problems Solved</span>
              <span className="text-lg font-bold font-mono text-emerald-300">{round2SolvedCount} / 5</span>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3">
              <span className="text-slate-500 text-[10px] uppercase block">Test Cases Passed</span>
              <span className="text-lg font-bold font-mono text-purple-300">{round2TestCasesPassed} / {round2TotalTestCases}</span>
            </div>
          </div>
        </div>

        {/* E-Certificate Preview Badge */}
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-950 to-blue-950/40 p-6 text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">E-Certificate Issued</h3>
              <p className="mt-1 text-xs text-slate-300">
                Official verified completion certificate generated by Sathyabama Student Development Cell.
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="btn-cyber-primary shrink-0 rounded-2xl px-6 py-3 text-xs uppercase font-bold tracking-wider flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Certificate</span>
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onBackHome}
            className="btn-cyber-secondary rounded-xl px-6 py-2.5 text-xs font-semibold"
          >
            Return to Home Page
          </button>
        </div>
      </motion.div>
    </div>
  );
}
