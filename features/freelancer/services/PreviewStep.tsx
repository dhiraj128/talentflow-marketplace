import React from "react";
import { ServiceFormData } from "./ServiceWizard";
import { Badge } from "@/components/ui/badge";
import { HourlyRateBadge } from "@/features/freelancer/shared/HourlyRateBadge";
import { Link as LinkIcon } from "lucide-react";

interface StepProps {
  data: ServiceFormData;
}

export function PreviewStep({ data }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Review Service</h2>
        <p className="text-muted-foreground">Make sure everything looks good before publishing.</p>
      </div>
      
      <div className="bg-muted/30 border rounded-2xl p-6 md:p-8 space-y-8 mt-4">
        
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">{data.title || "Untitled Service"}</h1>
            {data.hourlyRate && <HourlyRateBadge rate={Number(data.hourlyRate)} className="text-lg py-1 px-3" />}
          </div>
          {data.category && <p className="text-purple-600 font-medium">{data.category}</p>}
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg border-b pb-2">Description</h3>
          <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {data.description || "No description provided."}
          </p>
        </div>

        {data.skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map(skill => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}

        {data.portfolioLinks.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Portfolio</h3>
            <div className="space-y-2">
              {data.portfolioLinks.map(link => (
                <div key={link} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <LinkIcon className="w-4 h-4" />
                  <a href={link} target="_blank" rel="noreferrer" className="truncate">{link}</a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
          <div>
            <h4 className="text-sm text-muted-foreground font-medium mb-1">Minimum Project Size</h4>
            <p className="font-semibold">{data.projectMin ? `$${data.projectMin}` : "Not specified"}</p>
          </div>
          <div>
            <h4 className="text-sm text-muted-foreground font-medium mb-1">Availability</h4>
            <p className="font-semibold">{data.availability || "Not specified"}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
