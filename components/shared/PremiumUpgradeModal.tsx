"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PricingPlanCard, PricingPlanProps } from "./PricingPlanCard";
import { Sparkles, ShieldCheck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PremiumUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const plans: PricingPlanProps[] = [
  {
    id: "basic",
    name: "Basic ATS",
    price: 199,
    description: "Essential tools to get past the initial ATS screen.",
    buttonText: "Coming Soon",
    disabled: true,
    features: [
      { name: "ATS Optimized Resume", included: true },
      { name: "Keyword Optimization", included: true },
      { name: "ATS Compatibility Score", included: true },
      { name: "Resume Preview", included: true },
      { name: "AI Suggestions", included: false },
      { name: "Cover Letter Template", included: false },
      { name: "Priority Resume", included: false },
    ]
  },
  {
    id: "professional",
    name: "Professional ATS",
    price: 499,
    description: "Our most popular plan for serious job seekers.",
    isPopular: true,
    buttonText: "Coming Soon",
    disabled: true,
    features: [
      { name: "Professional Resume Design", included: true },
      { name: "Industry Keywords", included: true },
      { name: "ATS Optimization", included: true },
      { name: "AI Suggestions", included: true },
      { name: "Cover Letter Template", included: true },
      { name: "Priority Resume", included: false },
      { name: "Multiple Resume Versions", included: false },
    ]
  },
  {
    id: "premium",
    name: "Premium Career Package",
    price: 999,
    description: "The complete career acceleration package.",
    buttonText: "Coming Soon",
    disabled: true,
    features: [
      { name: "Everything in Professional", included: true },
      { name: "Priority Resume", included: true },
      { name: "Multiple Resume Versions", included: true },
      { name: "AI Career Suggestions", included: true },
      { name: "Premium Templates", included: true },
      { name: "Recruiter Visibility (Future)", included: true, tooltip: "Increases your chance to be seen by top recruiters." },
    ]
  }
];

export function PremiumUpgradeModal({ open, onOpenChange }: PremiumUpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl p-0 overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <div className="p-6 pb-2 text-center space-y-2">
          <DialogTitle className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            Upgrade to Premium ATS
          </DialogTitle>
          <DialogDescription className="text-base">
            Publish an ATS-optimized resume to multiply your interview chances.
          </DialogDescription>
        </div>
        
        <ScrollArea className="max-h-[70vh] px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            {plans.map((plan) => (
              <PricingPlanCard key={plan.id} {...plan} />
            ))}
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            Secure Payments Coming Soon
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
