"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CareerJourneyTimelineProps {
  currentStepIndex: number;
}

const steps = [
  { label: "Sign Up" },
  { label: "Build Profile" },
  { label: "AI Matches" },
  { label: "Applied" },
  { label: "Shortlisted" },
  { label: "Interview" },
  { label: "Hired" },
];

export function CareerJourneyTimeline({ currentStepIndex }: CareerJourneyTimelineProps) {
  return (
    <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm overflow-x-auto no-scrollbar">
      <div className="min-w-[600px] flex items-center justify-between relative px-2">
        {/* Background Line */}
        <div className="absolute left-[20px] right-[20px] top-4 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
        
        {/* Active Line */}
        <motion.div 
          className="absolute left-[20px] top-4 h-1 bg-primary rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentStepIndex / (steps.length - 1) }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ width: `calc(100% - 40px)` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div key={step.label} className="relative flex flex-col items-center gap-3 z-10 w-24">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 bg-white dark:bg-zinc-950 transition-colors duration-300",
                  isCompleted 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : isCurrent 
                      ? "border-primary text-primary" 
                      : "border-zinc-200 dark:border-zinc-700 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isCurrent ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                ) : (
                  <Circle className="w-3 h-3 text-zinc-300 dark:text-zinc-600" />
                )}
              </motion.div>
              
              <span 
                className={cn(
                  "text-xs font-medium text-center",
                  isCurrent ? "text-primary" : isCompleted ? "text-zinc-700 dark:text-zinc-300" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
