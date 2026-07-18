import React from "react";
import { Badge } from "@/components/ui/badge";

interface SkillsWidgetProps {
  skills: string[];
}

export function SkillsWidget({ skills }: SkillsWidgetProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">Skills & Expertise</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-sm font-medium bg-muted text-foreground hover:bg-purple-100 hover:text-purple-700 transition-colors">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
