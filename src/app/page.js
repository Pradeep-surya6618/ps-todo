import Link from "next/link";
import { ListTodo, ArrowRight, Zap, Shield, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden">
      {/* Navbar Area */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20">
            <img
              src="/icons/Moon.jpg"
              alt="SunMoonie"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white">SunMoonie</span>
        </div>
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all text-sm md:text-base text-white"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-40 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8">
          <Sparkles size={14} />
          Now with Offline Mode
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] text-white">
          Organize Life <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
            In Cosmic Rhythm.
          </span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-gray-500 font-medium mb-12 leading-relaxed">
          SunMoonie harmonies your workflow between the energy of the sun and
          the calm of the moon. Experience the ultimate productivity companion.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <Link
            href="/login"
            className="px-10 py-5 rounded-3xl bg-primary text-white font-black text-lg uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            Get Started Free
            <ArrowRight size={22} />
          </Link>
        </div>

        {/* Feature Bento Preview */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {[
            {
              icon: Zap,
              title: "High Performance",
              desc: "Built with Next.js for lightning speed operations.",
            },
            {
              icon: Shield,
              title: "Secure Sync",
              desc: "Your data is encrypted and synced via MongoDB Atlas.",
            },
            {
              icon: ListTodo,
              title: "PWA Native",
              desc: "Installable on any device with full offline support.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="glass bg-white/5 p-8 rounded-[2.5rem] border border-white/5 text-left group hover:bg-white/10 transition-all duration-500 shadow-2xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                <f.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{f.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
