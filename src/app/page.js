"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  ListTodo,
  Moon,
  Sun,
  Calendar,
  Bell,
  Heart,
  CheckCircle2,
  Star,
  Download,
} from "lucide-react";

// Scroll-triggered reveal component
function Reveal({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Parallax wrapper
function Parallax({ children, className, speed = 0.5 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroProgress, [0, 1], [0, -200]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.6], [1, 0.95]);

  // Floating orb parallax
  const orbY1 = useTransform(heroProgress, [0, 1], [0, -250]);
  const orbY2 = useTransform(heroProgress, [0, 1], [0, -150]);
  const orbY3 = useTransform(heroProgress, [0, 1], [0, -350]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Built with Next.js 16 & React 19 for blazing speed.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      desc: "Your data encrypted and synced via MongoDB Atlas.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: ListTodo,
      title: "Smart Tasks",
      desc: "Organize todos with priorities, categories & streaks.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: "Calendar Sync",
      desc: "Track events, birthdays & milestones in one view.",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      icon: Bell,
      title: "Push Alerts",
      desc: "Real-time push notifications so you never miss a task.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: Heart,
      title: "Cycle Tracker",
      desc: "Monitor wellness cycles with beautiful visual insights.",
      gradient: "from-red-500 to-pink-500",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Uptime", icon: Zap },
    { value: "PWA", label: "Installable", icon: Download },
    { value: "Free", label: "Forever", icon: Star },
    { value: "Dark", label: "Mode Ready", icon: Moon },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden">
      {/* ───── Floating Background Orbs (Parallax) ───── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          style={{ y: orbY1 }}
          className="absolute top-[-15%] right-[-10%] w-[55%] h-[55%] bg-primary/10 dark:bg-primary/15 blur-[150px] rounded-full animate-float"
        />
        <motion.div
          style={{ y: orbY2 }}
          className="absolute top-[35%] left-[-15%] w-[45%] h-[45%] bg-purple-500/5 dark:bg-purple-500/10 blur-[120px] rounded-full animate-float-delayed"
        />
        <motion.div
          style={{ y: orbY3 }}
          className="absolute bottom-[-10%] right-[10%] w-[35%] h-[35%] bg-pink-500/5 dark:bg-pink-500/10 blur-[100px] rounded-full animate-pulse-slow"
        />
      </div>

      {/* ───── Navbar ───── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-primary/20">
              <img
                src="/icons/Logo.png"
                alt="SunMoonie"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-black text-xl tracking-tight">
              SunMoonie
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <Link
              href="/login"
              className="hidden sm:inline-flex px-5 py-2 rounded-full text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* ───── Hero Section ───── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-20 pb-10"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="max-w-7xl mx-auto px-6 text-center relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8"
          >
            <Sparkles size={14} className="animate-pulse-slow" />
            Your Cosmic Productivity App
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            <span className="block">Organize Life</span>
            <motion.span
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500"
              style={{ backgroundSize: "200% auto" }}
            >
              In Cosmic Rhythm.
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium mb-12 leading-relaxed"
          >
            SunMoonie harmonizes your workflow between the energy of the sun and
            the calm of the moon. Tasks, calendar, notes & wellness — all in one
            place.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-row gap-3 sm:gap-4 justify-center"
          >
            <Link
              href="/register"
              className="group px-6 py-3 sm:px-10 sm:py-4 rounded-xl sm:rounded-2xl bg-primary text-white font-bold text-sm sm:text-base uppercase tracking-wider shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-3 cursor-pointer"
            >
              Get Started
              <ArrowRight
                size={18}
                className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 sm:px-10 sm:py-4 rounded-xl sm:rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 font-bold text-sm sm:text-base hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer text-center"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16 sm:mt-20"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 mx-auto flex items-start justify-center p-1.5"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── Features Section ───── */}
      <section className="relative py-24 sm:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16 sm:mb-20">
            <span className="text-primary text-xs sm:text-sm font-black uppercase tracking-widest">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mt-4 mb-6">
              Everything You Need
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              A complete suite of tools designed for your daily rhythm.
            </p>
          </Reveal>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative p-7 sm:p-8 rounded-3xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:border-primary/20 transition-all duration-500 cursor-default overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                <div
                  className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500`}
                >
                  <f.icon size={26} />
                </div>
                <h3 className="relative text-xl font-bold mb-3">{f.title}</h3>
                <p className="relative text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-sm sm:text-base">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── Bento Showcase (Parallax) ───── */}
      <section className="relative py-24 sm:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16 sm:mb-20">
            <span className="text-primary text-xs sm:text-sm font-black uppercase tracking-widest">
              App Preview
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mt-4 mb-6">
              Designed for Flow
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* Large card - Theme */}
            <Reveal delay={0.1} className="lg:col-span-2 lg:row-span-2">
              <div className="h-full min-h-[320px] sm:min-h-[400px] p-8 sm:p-10 rounded-[2rem] bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 border border-primary/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Parallax speed={0.15} className="relative z-10">
                  <Sun size={36} className="text-primary mb-6" />
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">
                    Day & Night Mode
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-md">
                    Seamlessly switch between light and dark themes. Your cosmic
                    workspace adapts to your rhythm.
                  </p>
                </Parallax>
                {/* Decorative floating icons */}
                <Parallax speed={-0.2}>
                  <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex gap-3 sm:gap-4">
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/30 dark:border-white/10 flex items-center justify-center shadow-lg"
                    >
                      <Sun size={22} className="text-amber-500" />
                    </motion.div>
                    <motion.div
                      whileHover={{ rotate: -15, scale: 1.1 }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/30 dark:border-white/10 flex items-center justify-center shadow-lg"
                    >
                      <Moon size={22} className="text-indigo-400" />
                    </motion.div>
                  </div>
                </Parallax>
              </div>
            </Reveal>

            {/* Small card - Streaks */}
            <Reveal delay={0.2}>
              <div className="h-full p-7 sm:p-8 rounded-[2rem] bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 group hover:border-emerald-500/20 transition-all duration-500">
                <Parallax speed={0.1}>
                  <CheckCircle2 size={32} className="text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Daily Streaks</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Build habits with streak tracking. Stay consistent, stay
                    productive.
                  </p>
                  {/* Mini streak visualization */}
                  <div className="flex gap-1.5 mt-5">
                    {[...Array(7)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg ${
                          i < 5
                            ? "bg-emerald-500/20 border border-emerald-500/30"
                            : "bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5"
                        } flex items-center justify-center`}
                      >
                        {i < 5 && (
                          <CheckCircle2
                            size={12}
                            className="text-emerald-500"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </Parallax>
              </div>
            </Reveal>

            {/* Small card - PWA */}
            <Reveal delay={0.3}>
              <div className="h-full p-7 sm:p-8 rounded-[2rem] bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 group hover:border-blue-500/20 transition-all duration-500">
                <Parallax speed={0.1}>
                  <Download size={32} className="text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Install Anywhere</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    PWA support means SunMoonie works like a native app on any
                    device.
                  </p>
                  {/* Device pills */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {["iOS", "Android", "Desktop", "Offline"].map((d, i) => (
                      <motion.span
                        key={d}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      >
                        {d}
                      </motion.span>
                    ))}
                  </div>
                </Parallax>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───── Stats Section ───── */}
      <section className="relative py-24 sm:py-32 px-6 overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="text-center group p-6 rounded-3xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <s.icon size={24} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-foreground mb-1">
                  {s.value}
                </div>
                <div className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── Marquee Ticker ───── */}
      <section className="relative py-12 overflow-hidden border-y border-black/5 dark:border-white/5">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, loop) => (
            <div key={loop} className="flex items-center gap-8 mx-8">
              {[
                "Tasks",
                "Calendar",
                "Notes",
                "Cycle Tracker",
                "Push Notifications",
                "Dark Mode",
                "PWA",
                "Streaks",
              ].map((item, i) => (
                <span
                  key={`${loop}-${i}`}
                  className="text-2xl sm:text-3xl font-black text-foreground/10 dark:text-foreground/10 uppercase tracking-wider flex items-center gap-4"
                >
                  {item}
                  <Sparkles size={16} className="text-primary/30" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ───── CTA Section ───── */}
      <section className="relative py-24 sm:py-32 px-6">
        <Reveal>
          <div className="max-w-4xl mx-auto text-center p-10 sm:p-16 md:p-20 rounded-[2.5rem] sm:rounded-[3rem] bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 border border-primary/10 relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-[-50%] right-[-20%] w-[60%] h-[100%] bg-primary/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-50%] left-[-20%] w-[60%] h-[100%] bg-purple-500/10 blur-[100px] rounded-full" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8"
              >
                <Heart size={32} className="sm:w-10 sm:h-10" />
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-6">
                Ready to Start Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                  Cosmic Journey?
                </span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mb-10 max-w-xl mx-auto">
                Join SunMoonie today and transform how you organize your life.
                It&apos;s free, forever.
              </p>
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 sm:gap-3 px-8 py-3.5 sm:px-12 sm:py-5 rounded-xl sm:rounded-2xl bg-primary text-white font-bold text-sm sm:text-lg uppercase tracking-wider shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Create Free Account
                <ArrowRight
                  size={18}
                  className="sm:w-[22px] sm:h-[22px] group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───── Footer ───── */}
      <footer className="relative py-10 sm:py-12 px-6 border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img
                src="/icons/Logo.png"
                alt="SunMoonie"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-black text-lg tracking-tight">
              SunMoonie
            </span>
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            &copy; 2026 SunMoonie. Crafted with cosmic love.
          </p>
        </div>
      </footer>
    </div>
  );
}
