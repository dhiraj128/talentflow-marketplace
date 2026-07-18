"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ATSScoreChartProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function ATSScoreChart({ score, size = 120, strokeWidth = 10 }: ATSScoreChartProps) {
  const [currentScore, setCurrentScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  useEffect(() => {
    // Animate to target score
    const timer = setTimeout(() => {
      setCurrentScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  // Determine color based on score
  let strokeColor = "stroke-red-500";
  let bgGradient = "from-red-50 to-red-100";
  let textColor = "text-red-600";
  
  if (score >= 80) {
    strokeColor = "stroke-green-500";
    bgGradient = "from-green-50 to-green-100";
    textColor = "text-green-600";
  } else if (score >= 60) {
    strokeColor = "stroke-amber-500";
    bgGradient = "from-amber-50 to-amber-100";
    textColor = "text-amber-600";
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background decoration */}
      <div className={cn("absolute inset-2 rounded-full bg-gradient-to-br opacity-50 dark:opacity-20", bgGradient)} />
      
      {/* SVG Circle */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={strokeColor}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={cn("text-3xl font-bold tracking-tight", textColor)}>
          {currentScore}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
          ATS Score
        </span>
      </div>
    </div>
  );
}
