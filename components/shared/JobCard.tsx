"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Building } from "lucide-react";

export interface JobCardProps {
  title?: string;
  company?: string;
  location?: string;
  salary?: string;
  type?: string;
  postedAt?: string;
  matchScore?: number;
  onApply?: () => void;
  onSave?: () => void;
  job?: any;
  [key: string]: any;
}

export function JobCard({ title, company, location, salary, type, postedAt, matchScore, onApply, onSave, job, ...rest }: JobCardProps) {
  const displayTitle = title || (job && job.title) || "";
  const displayCompany = company || (job && job.company) || "";
  const displayLocation = location || (job && job.location) || "";
  const displaySalary = salary || (job && job.salary) || "";
  const displayType = type || (job && job.type) || "";
  const displayPostedAt = postedAt || (job && (job.postedAt || job.posted)) || "";
  const displayMatchScore = matchScore || (job && job.matchScore) || (job && job.match);
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">{displayTitle}</h3>
            <div className="flex items-center text-muted-foreground mt-1 text-sm gap-2">
              <Building className="w-4 h-4" />
              <span>{displayCompany}</span>
            </div>
          </div>
          {displayMatchScore && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              {displayMatchScore}% Match
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {displayLocation}</div>
          <div className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {displaySalary}</div>
          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {displayType}</div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <span className="text-xs text-muted-foreground">Posted {displayPostedAt}</span>
          <div className="flex gap-2">
            {onSave && <Button variant="outline" size="sm" onClick={onSave}>Save</Button>}
            {onApply && <Button size="sm" onClick={onApply}>Apply Now</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
