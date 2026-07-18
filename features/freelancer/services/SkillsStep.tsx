import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceFormData } from "./ServiceWizard";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepProps {
  data: ServiceFormData;
  updateData: (data: Partial<ServiceFormData>) => void;
}

const COMMON_SKILLS = ["React", "Node.js", "TypeScript", "Tailwind CSS", "Figma", "Next.js", "Python", "GraphQL", "AWS", "UI/UX"];

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
        <h2 className="text-2xl font-semibold tracking-tight">Skills & Technologies</h2>
        <p className="text-muted-foreground">What tools and skills do you use for this service?</p>
      </div>
      
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Relevant Skills</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="Type a skill and press Enter..." 
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              className="py-5 focus-visible:ring-purple-500"
            />
            <Button type="button" onClick={() => addSkill(currentSkill)} className="h-11 px-6 bg-purple-600 hover:bg-purple-700">Add</Button>
          </div>
        </div>

        {data.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border p-4 rounded-xl bg-purple-50/50">
            {data.skills.map(skill => (
              <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm bg-white border flex items-center gap-1.5 shadow-sm">
                {skill}
                <X className="w-3.5 h-3.5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors" onClick={() => removeSkill(skill)} />
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-2 pt-4">
          <Label className="text-muted-foreground text-xs uppercase flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-purple-500" /> Suggested</Label>
          <div className="flex flex-wrap gap-2">
            {COMMON_SKILLS.filter(s => !data.skills.includes(s)).map(skill => (
              <Badge 
                key={skill} 
                variant="outline" 
                className="cursor-pointer hover:bg-purple-50 hover:border-purple-500 hover:text-purple-700 transition-colors"
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
