import React, { useState, useEffect } from 'react';
import { Terminal, Calendar, Clock, MapPin, Award, CheckCircle2, ArrowRight, Shield, BookOpen, Sparkles, Lock, CheckCircle } from 'lucide-react';
import { apiGetPublicConfig } from '../services/api';

export default function HomePage({ onStartChallenge, onOpenAdmin }) {
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [round1Enabled, setRound1Enabled] = useState(true);

  useEffect(() => {
    async function checkConfig() {
      try {
        const res = await apiGetPublicConfig();
        setRound1Enabled(!!res.round1Enabled);
      } catch (e) {
        console.error('Failed to fetch public config:', e);
      }
    }
    checkConfig();
  }, []);

  const handleStart = () => {
    onStartChallenge();
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-between">
      {/* Hero Section */}
      <section className="text-center pt-6 pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-900 shadow-sm mb-6">
          <Sparkles className="h-4 w-4 text-amber-600" />
          <span>Sathyabama Institute of Science and Technology • Software Club</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 uppercase leading-none">
          MASTERING <span className="text-cyber-gradient">DSA BASICS</span>
          <br />
          <span className="font-mono text-amber-600 text-3xl sm:text-5xl lg:text-6xl block mt-2">
            WITH PYTHON
          </span>
        </h1>

        <p className="mt-4 text-lg sm:text-xl font-mono text-amber-800 tracking-widest uppercase font-extrabold">
          “Think. Code. Solve.”
        </p>

        {/* Details Pill Grid */}
        <div className="mt-8 mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-800 font-bold">
          <div className="glass-panel rounded-2xl p-4 flex items-center justify-center gap-2 border border-amber-200">
            <Calendar className="h-4 w-4 text-amber-600 shrink-0" />
            <span>23.09.2026</span>
          </div>

          <div className="glass-panel rounded-2xl p-4 flex items-center justify-center gap-2 border border-amber-200">
            <Clock className="h-4 w-4 text-amber-600 shrink-0" />
            <span>1:15 PM – 3:15 PM</span>
          </div>

          <div className="glass-panel rounded-2xl p-4 flex items-center justify-center gap-2 border border-amber-200">
            <MapPin className="h-4 w-4 text-amber-600 shrink-0" />
            <span>IT Seminar Hall-1</span>
          </div>
        </div>

        {/* Round 1 Status Pill */}
        <div className="mt-6 flex justify-center">
          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono font-bold shadow-sm border ${
            round1Enabled
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : 'bg-amber-100 text-amber-900 border-amber-300'
          }`}>
            {round1Enabled ? (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>ROUND 1 IS OPEN & ACTIVE</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 text-amber-600" />
                <span>ROUND 1 IS CURRENTLY LOCKED BY ADMIN</span>
              </>
            )}
          </span>
        </div>

        {/* Main CTA */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleStart}
            className="btn-cyber-primary rounded-2xl px-8 py-4 text-sm font-black tracking-wider uppercase flex items-center gap-3 shadow-xl"
          >
            <span>[ START / LOGIN CHALLENGE ]</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          <button
            onClick={() => setShowInstructionsModal(true)}
            className="btn-cyber-secondary rounded-2xl px-6 py-4 text-sm font-bold flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4 text-amber-600" />
            <span>Read Instructions</span>
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="my-8 glass-panel rounded-3xl p-6 sm:p-10 border border-amber-200 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
          <Terminal className="h-6 w-6 text-amber-600" />
          <span>About the Event</span>
        </h2>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed max-w-4xl font-medium">
          Organized by the <strong className="text-amber-900">Student Development Cell – Software Club</strong> of Sathyabama Institute of Science and Technology, this event tests students' core understanding of Data Structures and Algorithms and their problem-solving execution using Python. Designed to replicate modern tech screening platforms, participants will complete a timed DSA quiz followed by hands-on Python programming problems in a sandboxed IDE.
        </p>

        {/* Certificate highlight */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-6 text-xs">
          <div className="flex items-center gap-3 rounded-2xl bg-amber-50/80 border border-amber-200 p-4">
            <Award className="h-6 w-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900">E-Certificates Provided</h4>
              <p className="text-slate-600">All registered participants will receive verified completion e-certificates.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-amber-100/60 border border-amber-300 p-4">
            <Award className="h-6 w-6 text-amber-700 shrink-0" />
            <div>
              <h4 className="font-bold text-amber-950">Winner Certificates</h4>
              <p className="text-slate-700 font-medium">First 3 students will receive special excellence certificates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Structure */}
      <section className="my-8">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight text-center mb-8">
          Competition Structure
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Round 1 Card */}
          <div className="glass-panel-interactive rounded-3xl p-6 sm:p-8 border border-amber-300/80 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="rounded-xl bg-amber-500/10 border border-amber-400/40 px-3 py-1 font-mono text-xs font-black text-amber-800">
                  ROUND 1
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">35 MINUTES</span>
              </div>
              <h3 className="mt-4 text-xl font-black text-slate-900">DSA Fundamentals</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                A 30-question multiple-choice assessment covering Python Data Structures (Lists, Dicts, Sets, Stacks, Queues), Searching, Sorting, Recursion, Time Complexity, Graph Traversals (BFS/DFS), and output prediction.
              </p>

              <div className="mt-6 space-y-2 text-xs font-mono font-bold text-amber-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" />
                  <span>30 Multiple Choice Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" />
                  <span>35 Minutes Duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" />
                  <span>Admin Approved Access to Round 2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Round 2 Card */}
          <div className="glass-panel-interactive rounded-3xl p-6 sm:p-8 border border-amber-400/80 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="rounded-xl bg-amber-500/10 border border-amber-400/40 px-3 py-1 font-mono text-xs font-black text-amber-800">
                  ROUND 2
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">60 MINUTES (1 HOUR)</span>
              </div>
              <h3 className="mt-4 text-xl font-black text-slate-900">Python Coding Challenge</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                An advanced hands-on coding assessment featuring 5 Python programming problems executed directly inside the Monaco-powered sandboxed IDE.
              </p>

              <div className="mt-6 space-y-2 text-xs font-mono font-bold text-amber-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" />
                  <span>5 Algorithmic Python Problems</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" />
                  <span>1 Hour (60 Minutes) Duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" />
                  <span>Automated Public & Hidden Test Cases</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructions Modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-amber-300 max-h-[85vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <BookOpen className="h-5 w-5 text-amber-600" />
              <span>Official Event Instructions</span>
            </h3>

            <div className="mt-4 space-y-3 text-xs text-slate-700 leading-relaxed font-sans">
              <p className="flex items-start gap-2">
                <span className="font-mono text-amber-600 font-bold">1.</span>
                <span>Students must enter their Name, Register Number, Department, and Year before starting.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-mono text-amber-600 font-bold">2.</span>
                <span>Round 1 contains 30 questions with a duration of 35 minutes. Answers are saved automatically.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-mono text-amber-600 font-bold">3.</span>
                <span>Round 2 is unlocked upon Event Administrator selection and approval.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-mono text-amber-600 font-bold">4.</span>
                <span>Round 2 duration is 1 Hour (60 minutes) consisting of 5 Python programming challenges.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-mono text-amber-600 font-bold">5.</span>
                <span>Code must be written and executed directly inside the built-in Monaco Python portal environment.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-mono text-amber-600 font-bold">6.</span>
                <span>Exam Security is active: Tab switching, document hiding, or window blur will trigger security violations (Max 5 violations allowed).</span>
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="btn-cyber-primary rounded-xl px-6 py-2.5 text-xs uppercase font-bold"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
