import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobFormData } from "./PostJobWizard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepProps {
  data: JobFormData;
  updateData: (data: Partial<JobFormData>) => void;
}

export function CompensationStep({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Compensation & Experience</h2>
        <p className="text-muted-foreground">Set the budget and required experience level.</p>
      </div>
      
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <Label htmlFor="salaryRange">Salary Range / Budget</Label>
          <Input 
            id="salaryRange" 
            placeholder="e.g. $80k - $120k / year, or $50/hr" 
            value={data.salaryRange}
            onChange={(e) => updateData({ salaryRange: e.target.value })}
            className="py-5"
          />
          <p className="text-xs text-muted-foreground">Clear salary ranges attract higher quality candidates.</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experience">Experience Level</Label>
          <Select value={data.experience} onValueChange={(val) => updateData({ experience: val || "" })}>
            <SelectTrigger className="py-5 text-base">
              <SelectValue placeholder="Select required experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Entry Level (0-2 years)">Entry Level (0-2 years)</SelectItem>
              <SelectItem value="Mid Level (3-5 years)">Mid Level (3-5 years)</SelectItem>
              <SelectItem value="Senior (5-8 years)">Senior (5-8 years)</SelectItem>
              <SelectItem value="Lead / Manager (8+ years)">Lead / Manager (8+ years)</SelectItem>
              <SelectItem value="Director / Executive">Director / Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
