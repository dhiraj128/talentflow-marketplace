import React from "react";
import { CategoryAnalytics } from "@/lib/types/enterprise";

export const CategoryChart = React.memo(function CategoryChart({ data }: { data: CategoryAnalytics[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#162947]/50 border border-slate-700/50 rounded-2xl p-6 flex items-center justify-center h-[200px] w-full">
        <span className="text-slate-500 text-sm">No data</span>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentOffset = 0;
  
  return (
    <div className="bg-[#162947]/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center relative group h-full w-full min-h-[200px]">
      <div className="text-sm font-semibold text-slate-200 mb-4 self-start w-full">Top Categories</div>
      <div className="w-32 h-32 rounded-full border-[5px] border-slate-700 relative flex items-center justify-center mt-2 group-hover:scale-105 transition-transform duration-300">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const offset = 100 - currentOffset;
            const slice = (
              <circle 
                key={item.id}
                cx="50%" 
                cy="50%" 
                r="45%" 
                fill="none" 
                stroke={item.color} 
                strokeWidth="10%" 
                strokeDasharray={`${percentage} 100`} 
                strokeDashoffset={offset === 100 ? 0 : -currentOffset} 
                className="opacity-90 transition-all duration-1000 ease-out"
                style={{ strokeDasharray: `${percentage} 100`, strokeDashoffset: -currentOffset }}
              />
            );
            currentOffset += percentage;
            return slice;
          })}
        </svg>
        <div className="flex flex-col items-center z-10">
          <span className="text-xs text-slate-400">Total</span>
          <span className="text-base font-bold text-slate-200">{total > 1000 ? (total/1000).toFixed(1)+'k' : total}</span>
        </div>
      </div>
    </div>
  );
});
