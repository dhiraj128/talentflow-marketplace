"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileText, UploadCloud, Edit, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { ATSScoreChart } from "./ATSScoreChart";
import { PremiumBadge } from "@/components/shared/PremiumBadge";
import { PremiumUpgradeModal } from "@/components/shared/PremiumUpgradeModal";

interface ATSResumeServicesWidgetProps {
  score?: number;
  hasPremium?: boolean;
}

export function ATSResumeServicesWidget({ score = 88, hasPremium = false }: ATSResumeServicesWidgetProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <>
      <Card className="h-full bg-gradient-to-br from-amber-500/5 to-amber-600/10 dark:from-amber-900/10 dark:to-amber-950/20 border-amber-200/50 dark:border-amber-900/50 overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                ATS Resume Services
              </CardTitle>
              <CardDescription className="text-amber-700/80 dark:text-amber-400/80 mt-1">
                Maximize your interview chances
              </CardDescription>
            </div>
            {hasPremium ? <PremiumBadge /> : <PremiumBadge variant="free" />}
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0">
            <ATSScoreChart score={hasPremium ? score : 45} size={130} strokeWidth={8} />
          </div>
          
          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-border/50">
                <span className="text-xs text-muted-foreground block mb-1">Resume Type</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <FileText className="w-4 h-4 text-amber-500" />
                  {hasPremium ? "ATS Optimized" : "Original (Standard)"}
                </div>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-border/50">
                <span className="text-xs text-muted-foreground block mb-1">Selected Plan</span>
                <div className="flex items-center gap-1.5 font-medium">
                  {hasPremium ? (
                    <><Sparkles className="w-4 h-4 text-amber-500" /> Professional ATS</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4 text-slate-500" /> Free Plan</>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Actionable Insights
              </h4>
              <ul className="text-sm space-y-1.5 text-muted-foreground">
                {hasPremium ? (
                  <>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      Keywords matched for Target Role
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      Formatting is 100% readable by ATS
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      Missing 4 key industry terms
                    </li>
                    <li className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      Layout may confuse some parsers
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 border-t border-border/30 mt-2 gap-2 flex-wrap">
          {hasPremium ? (
            <>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                <UploadCloud className="w-4 h-4 mr-2" /> Publish ATS Resume
              </Button>
              <Button size="sm" variant="outline" className="bg-white/50 dark:bg-black/20">
                <Edit className="w-4 h-4 mr-2" /> Edit Content
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto shadow-md" onClick={() => setShowUpgradeModal(true)}>
                <Sparkles className="w-4 h-4 mr-2" /> Upgrade to Premium
              </Button>
              <Button size="sm" variant="outline" className="bg-white/50 dark:bg-black/20 w-full sm:w-auto">
                Improve Score <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <PremiumUpgradeModal 
        open={showUpgradeModal} 
        onOpenChange={setShowUpgradeModal} 
      />
    </>
  );
}
