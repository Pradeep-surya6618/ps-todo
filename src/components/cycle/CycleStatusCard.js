"use client";

import { Droplets, Sparkles } from "lucide-react";

export default function CycleStatusCard({
  currentDay = 12,
  totalDays = 28,
  periodDays = 5,
}) {
  // Calculate progress percentage for the circle
  const percentage = (currentDay / totalDays) * 100;

  // Determine phase based on day
  let phase = "Follicular Phase";
  let phaseDescription = "Energy levels rising";
  let PhaseIcon = Sparkles;

  if (currentDay <= periodDays) {
    phase = "Menstruation";
    phaseDescription = "Time to rest & recharge";
    PhaseIcon = Droplets;
  } else if (currentDay >= totalDays - 14 && currentDay <= totalDays - 10) {
    phase = "Ovulation";
    phaseDescription = "Peak energy & confidence";
  } else if (currentDay > totalDays - 14) {
    phase = "Luteal Phase";
    phaseDescription = "Take it slow, be kind to yourself";
  }

  return (
    <div className="w-full bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl shadow-pink-500/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-2xl -ml-5 -mb-5" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="text-white/90 text-sm font-medium uppercase tracking-wider mb-6">
          Current Cycle
        </h2>

        {/* Main Cycle Display */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          {/* Outer track */}
          <div className="absolute inset-0 rounded-full border-[6px] border-white/20" />

          {/* Progress Arc (Simplified with SVG for better control than CSS border-radius hacks) */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88" // 96 - 8 (border width/2)
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className="text-white"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - percentage / 100)}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-medium text-white/80 mb-1">Day</span>
            <span className="text-6xl font-black">{currentDay}</span>
            <span className="text-sm font-medium text-white/60 mt-1">
              of {totalDays}
            </span>
          </div>
        </div>

        {/* Phase Info */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <PhaseIcon size={18} className="text-white/90" />
            <h3 className="text-xl font-bold">{phase}</h3>
          </div>
          <p className="text-white/70 text-sm font-medium">
            {phaseDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
