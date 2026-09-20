import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function TimerBadge({ formattedTime, warningState }) {
  let badgeStyles = "border-amber-400 bg-amber-500 text-white shadow-sm shadow-amber-500/20";
  let iconColor = "text-white";
  let animateClass = "";

  if (warningState === 'WARNING') {
    badgeStyles = "border-amber-500 bg-amber-600 text-white shadow-md shadow-amber-600/30";
    iconColor = "text-white";
  } else if (warningState === 'DANGER') {
    badgeStyles = "border-orange-500 bg-orange-600 text-white shadow-md shadow-orange-500/30";
    iconColor = "text-white animate-pulse";
  } else if (warningState === 'CRITICAL') {
    badgeStyles = "border-red-600 bg-red-600 text-white shadow-lg shadow-red-500/40 animate-pulse";
    iconColor = "text-white";
    animateClass = "scale-105 transition-transform";
  }

  return (
    <div className={`flex items-center gap-2 rounded-xl border px-4 py-1.5 font-mono text-sm font-black shadow-sm backdrop-blur-md transition-all ${badgeStyles} ${animateClass}`}>
      {warningState === 'CRITICAL' || warningState === 'DANGER' ? (
        <AlertTriangle className={`h-4 w-4 ${iconColor}`} />
      ) : (
        <Clock className={`h-4 w-4 ${iconColor}`} />
      )}
      <div className="flex flex-col leading-none">
        <span className="text-[9px] uppercase font-sans tracking-wider text-amber-100 font-extrabold">
          Time Remaining
        </span>
        <span className="text-sm tracking-wider font-mono font-black">{formattedTime}</span>
      </div>
    </div>
  );
}
