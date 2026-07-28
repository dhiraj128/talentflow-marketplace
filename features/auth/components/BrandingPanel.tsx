"use client";

import { Star, Users, Building2, MonitorPlay, BookOpen, Briefcase, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export function BrandingPanel() {
  return (
    <div className="relative w-full flex-1 bg-[#081526] text-white flex flex-col justify-start pt-8 pb-4 px-6 sm:px-8 xl:px-12 overflow-hidden">
      
      {/* Decorative Abstract Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#2563EB]/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-[#2563EB]/10 rounded-full blur-[100px]" />
        <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
          <path d="M0,50 Q25,80 50,50 T100,50" fill="none" stroke="#2563EB" strokeWidth="1" />
          <path d="M0,70 Q25,30 50,70 T100,70" fill="none" stroke="#2563EB" strokeWidth="0.5" />
        </svg>
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-[520px] mx-auto flex flex-col gap-3 xl:gap-4 my-auto shrink-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* 1. Hero Section */}
        <motion.div variants={itemVariants} className="shrink-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[0.98] text-white">
            Find Better <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-blue-400">Talent.</span><br />
            Build Better <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-blue-400">Careers.</span>
          </h1>
        </motion.div>

        {/* 2. Subtitle */}
        <motion.div variants={itemVariants} className="shrink-0">
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-[520px] leading-relaxed">
            The complete hiring ecosystem for professionals, employers, freelancers and trainers.
          </p>
        </motion.div>

        {/* 3. Statistics Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2 xl:gap-3 shrink-0">
          <div className="bg-[#0F1E33]/80 border border-[#22344F] backdrop-blur-sm rounded-xl xl:rounded-2xl p-2.5 xl:p-3 transition-all hover:border-[#2563EB]/50">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Users className="w-3.5 h-3.5 text-[#2563EB]"/>
            </div>
            <div className="text-lg xl:text-2xl font-bold text-white flex items-baseline leading-none">
              <AnimatedCounter value={20000} />
              <span className="text-[#2563EB] ml-0.5">+</span>
            </div>
            <div className="text-[10px] xl:text-xs font-medium text-slate-400 mt-1">Verified Professionals</div>
          </div>
          
          <div className="bg-[#0F1E33]/80 border border-[#22344F] backdrop-blur-sm rounded-xl xl:rounded-2xl p-2.5 xl:p-3 transition-all hover:border-[#2563EB]/50">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-500"/>
            </div>
            <div className="text-lg xl:text-2xl font-bold text-white flex items-baseline leading-none">
              <AnimatedCounter value={5000} />
              <span className="text-emerald-500 ml-0.5">+</span>
            </div>
            <div className="text-[10px] xl:text-xs font-medium text-slate-400 mt-1">Companies</div>
          </div>

          <div className="bg-[#0F1E33]/80 border border-[#22344F] backdrop-blur-sm rounded-xl xl:rounded-2xl p-2.5 xl:p-3 transition-all hover:border-[#2563EB]/50">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <MonitorPlay className="w-3.5 h-3.5 text-purple-500"/>
            </div>
            <div className="text-lg xl:text-2xl font-bold text-white flex items-baseline leading-none">
              <AnimatedCounter value={3000} />
              <span className="text-purple-500 ml-0.5">+</span>
            </div>
            <div className="text-[10px] xl:text-xs font-medium text-slate-400 mt-1">Freelancers</div>
          </div>

          <div className="bg-[#0F1E33]/80 border border-[#22344F] backdrop-blur-sm rounded-xl xl:rounded-2xl p-2.5 xl:p-3 transition-all hover:border-[#2563EB]/50">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-orange-500"/>
            </div>
            <div className="text-lg xl:text-2xl font-bold text-white flex items-baseline leading-none">
              <AnimatedCounter value={800} />
              <span className="text-orange-500 ml-0.5">+</span>
            </div>
            <div className="text-[10px] xl:text-xs font-medium text-slate-400 mt-1">Training Programs</div>
          </div>
        </motion.div>

        {/* 4. Fully Responsive Analytics Illustration Mockup */}
        <motion.div variants={itemVariants} className="w-full max-w-full min-w-0 bg-[#0F1E33]/90 border border-[#22344F] backdrop-blur-sm shadow-xl rounded-xl xl:rounded-2xl p-3 xl:p-4 shrink-0 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Briefcase className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span className="text-xs font-bold text-white truncate">TalentFlow Analytics Overview</span>
            </div>
            
            {/* Inline Integrated +48% Badge */}
            <div className="flex items-center gap-1.5 bg-[#142640] border border-[#22344F] rounded-lg px-2 py-1 shrink-0">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-[11px] font-extrabold text-emerald-400">+48%</span>
              <span className="text-[9px] text-slate-400 hidden sm:inline">Hires</span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full h-16 sm:h-20 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
              <path d="M0,60 L40,35 L80,50 L130,20 L180,40 L230,10 L300,30" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M0,60 L40,35 L80,50 L130,20 L180,40 L230,10 L300,30 L300,80 L0,80 Z" fill="url(#brand-chart-grad)" stroke="none" />
              <defs>
                <linearGradient id="brand-chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Bottom Metric Badges Container */}
          <div className="flex items-center justify-between border-t border-[#22344F]/60 pt-2.5 gap-2">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full flex items-center justify-center bg-[#142640] border border-[#2563EB]/40 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="#22344F" strokeWidth="2" />
                  <circle cx="12" cy="12" r="9" fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="56" strokeDashoffset="5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 leading-tight">Talent Match</div>
                <div className="text-xs font-bold text-white leading-tight">92% Match Score</div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] text-slate-400 leading-tight">Active Candidates</div>
              <div className="text-xs font-bold text-emerald-400 leading-tight">1,420 Live</div>
            </div>
          </div>
        </motion.div>

        {/* 5. Testimonial Compact Card */}
        <motion.div variants={itemVariants} className="bg-[#0F1E33]/60 border border-[#22344F] backdrop-blur-md shadow-lg rounded-xl xl:rounded-2xl p-3 xl:p-3.5 relative overflow-hidden shrink-0 mt-0.5">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#2563EB]/10 rounded-full blur-[20px] -mr-8 -mt-8" />
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />
            ))}
          </div>
          <p className="text-xs font-medium text-slate-200 leading-snug mb-1.5 relative z-10 italic">
            "TalentFlow reduced hiring time by 70%. The verified talent pool is unmatched."
          </p>
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-5 h-5 rounded-full bg-[#2563EB]/20 flex items-center justify-center text-[8px] font-bold text-[#2563EB]">HR</div>
            <div>
              <div className="text-[10px] xl:text-xs font-bold text-white leading-tight">HR Director</div>
              <div className="text-[8px] xl:text-[9px] text-slate-400 leading-tight">Enterprise Customer</div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
