import React from "react";

interface StatisticCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export const StatisticCard = React.memo(function StatisticCard({ icon, value, label }: StatisticCardProps) {
  return (
    <div className="group bg-[#0F1E33]/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 flex flex-col gap-2 hover:-translate-y-1 hover:bg-[#162947]/80 hover:border-blue-500/30 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden w-full h-full">
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors"></div>
      <div className="flex items-center gap-3 relative z-10">
        <div className="p-2 rounded-lg bg-[#081526]/80 border border-slate-700/50 group-hover:border-blue-500/30 transition-colors shrink-0">
          {icon}
        </div>
        <div className="text-xl md:text-2xl font-black text-white truncate">{value}</div>
      </div>
      <div className="text-xs md:text-sm font-medium text-slate-400 relative z-10">{label}</div>
    </div>
  );
});
