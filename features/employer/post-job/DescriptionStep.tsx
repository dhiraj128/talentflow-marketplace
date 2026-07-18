import React from "react";
import { Label } from "@/components/ui/label";
import { JobFormData } from "./PostJobWizard";
import { Textarea } from "@/components/ui/textarea";

interface StepProps {
  data: JobFormData;
  updateData: (data: Partial<JobFormData>) => void;
}

export function DescriptionStep({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Job Description</h2>
        <p className="text-muted-foreground">Describe the role, responsibilities, and what you offer.</p>
      </div>
      
      <div className="space-y-6 pt-4 flex-1 flex flex-col">
        <div className="space-y-2 flex-1 flex flex-col">
          <Label htmlFor="description">About the Role <span className="text-red-500">*</span></Label>
          <Textarea 
            id="description" 
            placeholder="We are looking for..." 
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            className="flex-1 min-h-[150px] resize-none"
          />
        </div>
        
        <div className="space-y-2 flex-1 flex flex-col">
          <Label htmlFor="requirements">Key Requirements</Label>
          <Textarea 
            id="requirements" 
            placeholder="Requirements and qualifications..." 
            value={data.requirements}
            onChange={(e) => updateData({ requirements: e.target.value })}
            className="flex-1 min-h-[150px] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
