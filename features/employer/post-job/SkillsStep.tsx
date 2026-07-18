import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobFormData } from "./PostJobWizard";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepProps {
  data: JobFormData;
  updateData: (data: Partial<JobFormData>) => void;
}

const COMMON_SKILLS = ["React", "TypeScript", "Node.js", "Python", "AWS", "Figma", "UI/UX", "Marketing", "Sales", "Project Management"];

export function SkillsStep({ data, updateData }: StepProps) {
  const [currentSkill, setCurrentSkill] = useState("");

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      updateData({ skills: [...data.skills, trimmed] });
    }
    setCurrentSkill("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(currentSkill);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateData({ skills: data.skills.filter(s => s !== skillToRemove) });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Skills & AI Matching</h2>
        <p className="text-muted-foreground">Add skills to help our AI find the best candidates.</p>
      </div>
      
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Required Skills</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="Type a skill and press Enter..." 
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              className="py-5"
            />
            <Button type="button" onClick={() => addSkill(currentSkill)} variant="secondary" className="h-11 px-6">Add</Button>
          </div>
        </div>

        {data.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border p-4 rounded-xl bg-muted/20">
            {data.skills.map(skill => (
              <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm bg-background border flex items-center gap-1.5 shadow-sm">
                {skill}
                <X className="w-3.5 h-3.5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors" onClick={() => removeSkill(skill)} />
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-2 pt-4">
          <Label className="text-muted-foreground text-xs uppercase flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-purple-500" /> Suggested Skills</Label>
          <div className="flex flex-wrap gap-2">
            {COMMON_SKILLS.filter(s => !data.skills.includes(s)).map(skill => (
              <Badge 
                key={skill} 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-colors"
                onClick={() => addSkill(skill)}
              >
                + {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
