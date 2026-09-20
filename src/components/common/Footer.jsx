import React from 'react';
import { Award, Code2, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-amber-200 bg-white/95 text-slate-700 text-xs py-6 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <p className="font-extrabold text-slate-900">
              Sathyabama Institute of Science and Technology
            </p>
            <p className="text-slate-600 font-medium">
              Student Development Cell – Software Club • Organized for Excellence in Programming
            </p>
          </div>

          <div className="flex items-center gap-6 text-slate-800 font-bold">
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-600" />
              <span>E-Certificates Provided</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              <span>Secured Exam Portal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Code2 className="h-4 w-4 text-amber-600" />
              <span>Python 3 Engine</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-200 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 font-medium gap-2">
          <p>© 2026 Sathyabama Software Club. All rights reserved.</p>
          <p className="flex items-center gap-1 font-mono">
            Mastering DSA Basics with Python • SDC Software Club
          </p>
        </div>
      </div>
    </footer>
  );
}
