"use client";

import { Droplets, Sparkles, Zap, Moon } from "lucide-react";

export default function CycleStatusCard({
  currentDay = 12,
  totalDays = 28,
  periodDays = 5,
}) {
  const percentage = (currentDay / totalDays) * 100;
  const ovulationDay = totalDays - 14;

  let phase = "Follicular Phase";
  let phaseDescription = "Energy levels rising";
  let PhaseIcon = Sparkles;
  let gradientFrom = "from-emerald-500";
  let gradientTo = "to-teal-600";
  let shadowColor = "shadow-emerald-500/20";

  if (currentDay <= periodDays) {
    phase = "Menstruation";
    phaseDescription = "Time to rest & recharge";
    PhaseIcon = Droplets;
    gradientFrom = "from-pink-500";
    gradientTo = "to-rose-600";
    shadowColor = "shadow-pink-500/20";
  } else if (
    currentDay >= ovulationDay - 3 &&
    currentDay <= ovulationDay + 1
  ) {
    phase = "Ovulation";
    phaseDescription = "Peak energy & confidence";
    PhaseIcon = Zap;
    gradientFrom = "from-amber-500";
    gradientTo = "to-orange-600";
    shadowColor = "shadow-amber-500/20";
  } else if (currentDay > ovulationDay + 1) {
    phase = "Luteal Phase";
    phaseDescription = "Take it slow, be kind to yourself";
    PhaseIcon = Moon;
    gradientFrom = "from-violet-500";
    gradientTo = "to-purple-600";
    shadowColor = "shadow-violet-500/20";
  }

  return (
    <div
      className={`w-full bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-3xl p-6 text-white shadow-xl ${shadowColor} relative overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-2xl -ml-5 -mb-5" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="text-white/90 text-sm font-medium uppercase tracking-wider mb-6">
          Current Cycle
        </h2>

        {/* Main Cycle Display */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border-[6px] border-white/20" />

          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className="text-white"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - percentage / 100)}
              style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
            />
          </svg>

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
