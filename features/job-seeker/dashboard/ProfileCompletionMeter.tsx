"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface MissingItem {
  label: string;
  actionHref: string;
}

interface ProfileCompletionMeterProps {
  score: number;
  missingItems: MissingItem[];
}

export function ProfileCompletionMeter({ score, missingItems }: ProfileCompletionMeterProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(score), 500);
    return () => clearTimeout(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="h-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Profile Completion</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-zinc-100 dark:text-zinc-800 stroke-current"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
              ></circle>
              <motion.circle
                className="text-primary stroke-current"
                strokeWidth="8"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              ></motion.circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{progress}%</span>
            </div>
          </div>
          <p className="text-sm text-center text-muted-foreground mt-4 max-w-[250px]">
            Complete your profile to improve your AI Match Score and visibility to recruiters.
          </p>
        </div>

        {missingItems.length > 0 && (
          <div className="space-y-3 w-full bg-zinc-50 dark:bg-zinc-950/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Missing Information
            </h4>
            <ul className="space-y-2">
              {missingItems.map((item, i) => (
                <li key={i} className="flex items-center justify-between group">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.label}</span>
                  <Link href={item.actionHref}>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Add <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
