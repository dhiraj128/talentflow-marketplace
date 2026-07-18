import React from "react";
import { JobFormData } from "./PostJobWizard";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, DollarSign, Clock, ShieldCheck } from "lucide-react";

interface StepProps {
  data: JobFormData;
}

export function PreviewStep({ data }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1 border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{data.title || "Untitled Role"}</h2>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {data.location || "Location not specified"}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {data.type || "Type not specified"}</span>
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {data.salaryRange || "Salary not specified"}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {data.experience || "Experience not specified"}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 pt-2">
        <h3 className="font-semibold text-lg">Required Skills</h3>
        {data.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.skills.map(skill => (
              <Badge key={skill} variant="secondary" className="px-3 py-1 bg-primary/5">{skill}</Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No skills specified.</p>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-lg">About the Role</h3>
        {data.description ? (
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">{data.description}</div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No description provided.</p>
        )}
      </div>

      {data.requirements && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold text-lg">Requirements</h3>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">{data.requirements}</div>
        </div>
      )}

      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-start gap-3 mt-8">
        <ShieldCheck className="w-5 h-5 mt-0.5 text-blue-600 shrink-0" />
        <div>
          <p className="font-medium text-sm text-blue-900">Admin Review Required</p>
          <p className="text-xs text-blue-700/80 mt-1">Once submitted, your job posting will go live typically within 2-4 hours after our team reviews it to ensure quality guidelines are met.</p>
        </div>
      </div>
    </div>
  );
}
