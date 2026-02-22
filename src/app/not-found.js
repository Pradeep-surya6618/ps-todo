import Link from "next/link";
import { Home, ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative flex items-center justify-center transition-colors duration-500">
      {/* Animated Space Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */}
        {[...Array(50)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse-slow"
              style={{
                top: `${((i * 37 + 13) % 97)}%`,
                left: `${((i * 53 + 7) % 99)}%`,
                animationDelay: `${(i * 0.06) % 3}s`,
                opacity: (i % 7) * 0.1 + 0.3,
              }}
            />
          ))}

        {/* Floating Moons */}
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-2xl animate-float" />
        <div className="absolute bottom-32 left-16 w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl animate-float-delayed" />

        {/* Large Moon */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 opacity-10 dark:opacity-5">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 animate-pulse-slow" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Animated 404 with Moon */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* First 4 */}
            <div className="text-[120px] md:text-[180px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-500 to-pink-500 animate-fade-in">
              4
            </div>

            {/* Moon in the middle */}
            <div className="relative animate-float">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-2xl shadow-primary/50 border-4 border-primary/30">
                <img
                  src="/icons/Moon.jpg"
                  alt="Moon"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-purple-500/40 blur-xl animate-pulse-slow" />
            </div>

            {/* Second 4 */}
            <div className="text-[120px] md:text-[180px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-500 to-pink-500 animate-fade-in-delayed">
              4
            </div>
          </div>

          {/* Sparkles around */}
          <div className="absolute -top-4 left-1/4 animate-float">
            <Sparkles className="text-primary w-6 h-6" />
          </div>
          <div className="absolute top-1/2 right-1/4 animate-float-delayed">
            <Sparkles className="text-purple-500 w-5 h-5" />
          </div>
          <div className="absolute -bottom-4 left-1/3 animate-float">
            <Sparkles className="text-pink-500 w-4 h-4" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-6 animate-slide-up">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Lost in Space
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
            Oops! This page has drifted into the cosmic void. Let's get you back
            to your tasks.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/dashboard"
              className="group px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-primary text-white font-bold text-sm sm:text-base uppercase tracking-wider shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 sm:gap-3 cursor-pointer"
            >
              <Home size={18} className="sm:w-5 sm:h-5" />
              Go to Dashboard
              <div className="group-hover:translate-x-1 transition-transform">
                →
              </div>
            </Link>

            <Link
              href="/"
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-all text-sm sm:text-base flex items-center gap-2 sm:gap-3 cursor-pointer"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Floating cosmic elements */}
        <div className="mt-16 flex justify-center gap-8 opacity-30">
          {[...Array(5)].map((_, i) => (
            <div
              key={`cosmic-${i}`}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-purple-500 animate-float"
              style={{
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
