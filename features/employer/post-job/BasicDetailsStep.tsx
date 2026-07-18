import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobFormData } from "./PostJobWizard";

interface StepProps {
  data: JobFormData;
  updateData: (data: Partial<JobFormData>) => void;
}

export function BasicDetailsStep({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Basic Details</h2>
        <p className="text-muted-foreground">Let's start with the name and location of the role.</p>
      </div>
      
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label>
          <Input 
            id="title" 
            placeholder="e.g. Senior Frontend Engineer" 
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            className="text-lg py-6"
            autoFocus
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            placeholder="e.g. Remote, New York, NY" 
            value={data.location}
            onChange={(e) => updateData({ location: e.target.value })}
            className="py-5"
          />
        </div>
      </div>
    </div>
  );
}
