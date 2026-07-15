import React from "react";
import { LearningProgress } from "@/lib/types/enterprise";

export const LearningProgressChart = React.memo(function LearningProgressChart({ data }: { data: LearningProgress[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#162947]/50 border border-slate-700/50 rounded-2xl p-6 flex items-center justify-center h-[200px]">
        <span className="text-slate-500 text-sm">No data available</span>
      </div>
    );
  }

  // Generate dynamic SVG path based on data
  // We assume values are 0-100 and map them to the SVG viewBox 0 40
  // viewBox="0 0 100 40" -> X is 0 to 100, Y is 0 to 40 (inverted)
  const width = 100;
  const height = 40;
  
  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - (d.value / 100) * height; 
    return { x, y };
  });

  // Create smooth bezier curve path
  const createPath = (pts: {x: number, y: number}[]) => {
    if (pts.length === 0) return "";
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp1y = p0.y;
      const cp2x = p1.x - (p1.x - p0.x) / 3;
      const cp2y = p1.y;
      d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
    }
    return d;
  };

  const pathD = createPath(points);

  // Pick 2 random points for the glowing dots to simulate hover/active states
  const p1 = points[Math.floor(points.length * 0.4)] || points[0];
  const p2 = points[Math.floor(points.length * 0.8)] || points[0];

  return (
    <div className="bg-[#162947]/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between group h-full w-full min-h-[200px]">
      <div className="text-sm font-semibold text-slate-200 mb-6">Learning Progress</div>
      <div className="relative flex-1 w-full flex items-end justify-between px-2 gap-1 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-1">
          <div className="border-b border-slate-700/40 w-full h-px"></div>
          <div className="border-b border-slate-700/40 w-full h-px"></div>
          <div className="border-b border-slate-700/40 w-full h-px"></div>
          <div className="border-b border-slate-700/40 w-full h-px"></div>
        </div>
        
        {/* Dynamic CSS mocked curve using SVG */}
        <svg className="absolute inset-0 w-full h-full drop-shadow-[0_4px_12px_rgba(59,130,246,0.5)] group-hover:drop-shadow-[0_4px_16px_rgba(59,130,246,0.8)] transition-all duration-300" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d={pathD} fill="none" stroke="url(#blue-grad-dyn)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in fade-in duration-1000" />
          <defs>
            <linearGradient id="blue-grad-dyn" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Plot points */}
        <div className="absolute w-2.5 h-2.5 rounded-full bg-blue-400 border-2 border-white shadow-[0_0_10px_#3b82f6] transition-all" style={{ left: `calc(${p1.x}% - 5px)`, top: `calc(${(p1.y / height) * 100}% - 5px)` }}></div>
        <div className="absolute w-2.5 h-2.5 rounded-full bg-indigo-400 border-2 border-white shadow-[0_0_10px_#8b5cf6] transition-all" style={{ left: `calc(${p2.x}% - 5px)`, top: `calc(${(p2.y / height) * 100}% - 5px)` }}></div>
      </div>
    </div>
  );
});
