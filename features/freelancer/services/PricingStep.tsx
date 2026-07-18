import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceFormData } from "./ServiceWizard";

interface StepProps {
  data: ServiceFormData;
  updateData: (data: Partial<ServiceFormData>) => void;
}

export function PricingStep({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Pricing</h2>
        <p className="text-muted-foreground">Set your standard hourly rate and minimum project size.</p>
      </div>
      
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input 
              id="hourlyRate" 
              type="number"
              placeholder="e.g. 50" 
              value={data.hourlyRate}
              onChange={(e) => updateData({ hourlyRate: e.target.value })}
              className="py-5 pl-8 focus-visible:ring-purple-500"
            />
          </div>
          <p className="text-xs text-muted-foreground">The platform fee is 10% on all earnings.</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="projectMin">Minimum Project Size ($)</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input 
              id="projectMin" 
              type="number"
              placeholder="e.g. 500" 
              value={data.projectMin}
              onChange={(e) => updateData({ projectMin: e.target.value })}
              className="py-5 pl-8 focus-visible:ring-purple-500"
            />
          </div>
          <p className="text-xs text-muted-foreground">Employers must commit to at least this amount to hire you for this service.</p>
        </div>
      </div>
    </div>
  );
}
