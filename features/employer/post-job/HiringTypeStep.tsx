import React from "react";
import { Label } from "@/components/ui/label";
import { JobFormData } from "./PostJobWizard";
import { Briefcase, Clock, FileText, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProps {
  data: JobFormData;
  updateData: (data: Partial<JobFormData>) => void;
}

const TYPES = [
  { id: "Full-time", icon: Briefcase, desc: "Standard 40 hrs/week" },
  { id: "Contract", icon: FileText, desc: "Fixed duration or project based" },
  { id: "Freelance", icon: Globe, desc: "Independent contractor" },
  { id: "Outsourcing", icon: Clock, desc: "Agency or team based" }
];

export function HiringTypeStep({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Hiring Type</h2>
        <p className="text-muted-foreground">What kind of employment are you offering?</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {TYPES.map(type => {
          const Icon = type.icon;
          const isSelected = data.type === type.id;
          
          return (
            <div 
              key={type.id}
              onClick={() => updateData({ type: type.id })}
              className={cn(
                "border rounded-xl p-6 cursor-pointer transition-all hover:border-primary/50 flex flex-col gap-3",
                isSelected ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20" : "border-muted hover:bg-muted/30"
              )}
            >
              <div className={cn("p-2 rounded-lg w-fit", isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{type.id}</h3>
                <p className="text-sm text-muted-foreground mt-1">{type.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
