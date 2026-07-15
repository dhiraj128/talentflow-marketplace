import React from "react";
import { Building2, ArrowRight, Users, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/features/enterprise-dashboard/components/DashboardLayout";
import { StatisticCard } from "@/features/enterprise-dashboard/components/StatisticCard";

export function EnterpriseHero() {
  return (
    <section className="mt-20 w-full relative rounded-[2rem] overflow-hidden bg-[#081526] border border-blue-500/20 p-8 md:p-12 lg:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
        {/* CSS Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-8 xl:gap-16 items-center">
        
        {/* Left Side (45%) */}
        <div className="w-full lg:w-[45%] flex flex-col gap-6 lg:gap-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md w-fit">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-400 tracking-wide uppercase">For Enterprises</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight">
            Elevate Your Team's <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Performance
            </span>
          </h2>
          
          <p className="text-lg text-slate-400 max-w-[600px] leading-relaxed">
            Enterprise-level learning platform designed to train, manage and certify teams at scale. Create, monitor and measure employee growth from one unified dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button size="lg" className="h-14 px-8 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all border-0">
              Request Enterprise Demo <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold rounded-xl border-slate-600 text-white hover:bg-slate-800 hover:text-white bg-transparent transition-colors">
              View Pricing Plans
            </Button>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 lg:pt-8 w-full">
            <StatisticCard icon={<Building2 className="w-5 h-5 text-blue-400" />} value="500+" label="Enterprise Clients" />
            <StatisticCard icon={<Users className="w-5 h-5 text-indigo-400" />} value="50K+" label="Employees Trained" />
            <StatisticCard icon={<Award className="w-5 h-5 text-purple-400" />} value="200K+" label="Certificates Issued" />
            <StatisticCard icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} value="98%" label="Customer Satisfaction" />
          </div>
        </div>

        {/* Right Side (55%) - Dashboard Mockup */}
        <div className="w-full lg:w-[55%] flex min-h-[550px]">
          <DashboardLayout />
        </div>
      </div>
    </section>
  );
}
