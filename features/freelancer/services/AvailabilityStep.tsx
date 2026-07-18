import React from "react";
import { ServiceFormData } from "./ServiceWizard";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Calendar, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProps {
  data: ServiceFormData;
  updateData: (data: Partial<ServiceFormData>) => void;
}

const AVAILABILITY_OPTIONS = [
  { id: "Full-time (30+ hrs/week)", icon: Clock, desc: "Available for extensive commitments" },
  { id: "Part-time (10-30 hrs/week)", icon: Calendar, desc: "Available for moderate commitments" },
  { id: "As needed / Project based", icon: CheckCircle, desc: "Available on a per-project basis" }
];

export function AvailabilityStep({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Availability</h2>
        <p className="text-muted-foreground">How much time can you commit to this service?</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 pt-4">
        {AVAILABILITY_OPTIONS.map(opt => {
          const Icon = opt.icon;
          const isSelected = data.availability === opt.id;
          
          return (
            <div 
              key={opt.id}
              onClick={() => updateData({ availability: opt.id })}
              className={cn(
                "border rounded-xl p-4 cursor-pointer transition-all hover:border-purple-500/50 flex items-center gap-4",
                isSelected ? "border-purple-600 bg-purple-50/50 shadow-sm ring-1 ring-purple-600/20" : "border-muted hover:bg-muted/30"
              )}
            >
              <div className={cn("p-2 rounded-lg", isSelected ? "bg-purple-600 text-white" : "bg-muted text-muted-foreground")}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-base">{opt.id}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{opt.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
