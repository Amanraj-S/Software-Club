import React from 'react';
import { Terminal, Shield, Calendar, Clock, MapPin, User, LogOut } from 'lucide-react';

export default function Header({ studentSession, onOpenAdmin, onStudentLogout, currentStep }) {
  if (currentStep === 'ROUND1' || currentStep === 'ROUND2') {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-amber-200/80 bg-white/90 backdrop-blur-xl transition-all shadow-sm">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-2.5 sm:px-6 gap-4">
        {/* Left: Branding & Event Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 p-0.5 shadow-md shadow-amber-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-900">
              <Terminal className="h-5 w-5 text-amber-400" />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-[11px] font-extrabold tracking-wider text-amber-700 uppercase">
                Sathyabama Institute of Science and Technology
              </span>
              <span className="hidden sm:inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-300">
                SDC - Software Club
              </span>
            </div>
            <h1 className="text-sm font-black tracking-tight text-amber-800 uppercase whitespace-nowrap">
              MASTERING DSA BASICS <span className="font-mono">WITH PYTHON</span>
            </h1>
          </div>
        </div>

        {/* Center: Event Info Bar */}
        {(!currentStep || currentStep === 'HOME' || currentStep === 'REGISTER') && (
          <div className="hidden xl:flex items-center gap-5 rounded-full border border-amber-300/60 bg-amber-50/80 px-5 py-2 text-xs text-slate-700 backdrop-blur-md whitespace-nowrap shrink-0 shadow-sm">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Calendar className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span className="font-bold text-slate-800">23.09.2026</span>
            </div>
            <div className="h-3.5 w-px bg-amber-300/80" />
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span className="font-bold text-slate-800">1:15 PM – 3:15 PM</span>
            </div>
            <div className="h-3.5 w-px bg-amber-300/80" />
            <div className="flex items-center gap-2 whitespace-nowrap">
              <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span className="font-bold text-slate-800">IT Seminar Hall-1</span>
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
          {studentSession && studentSession.name && (
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-amber-300/60 bg-amber-50/80 px-3.5 py-1.5 text-xs text-slate-800 whitespace-nowrap shadow-sm">
                <User className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span className="font-bold text-slate-900">{studentSession.name}</span>
                <span className="text-amber-800 font-mono font-semibold">({studentSession.registerNumber || studentSession.registerNo})</span>
              </div>
              
              <button
                onClick={onStudentLogout}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-red-600 hover:border-red-400 hover:bg-red-50 transition-all whitespace-nowrap shadow-sm"
                title="Logout Candidate Session"
              >
                <LogOut className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 rounded-xl border border-amber-400/80 bg-amber-500 text-white px-3.5 py-1.5 text-xs font-extrabold hover:bg-amber-600 transition-all shadow-sm shadow-amber-500/20 whitespace-nowrap"
            title="Sathyabama Admin Dashboard"
          >
            <Shield className="h-3.5 w-3.5 shrink-0 text-white" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
