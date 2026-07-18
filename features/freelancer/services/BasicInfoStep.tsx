import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ServiceFormData } from "./ServiceWizard";

interface StepProps {
  data: ServiceFormData;
  updateData: (data: Partial<ServiceFormData>) => void;
}

export function BasicInfoStep({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Basic Information</h2>
        <p className="text-muted-foreground">What service are you offering?</p>
      </div>
      
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="title">Service Title <span className="text-red-500">*</span></Label>
          <Input 
            id="title" 
            placeholder="e.g. Full-Stack Web Development with React" 
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            className="text-lg py-6"
            autoFocus
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input 
            id="category" 
            placeholder="e.g. Web Development" 
            value={data.category}
            onChange={(e) => updateData({ category: e.target.value })}
            className="py-5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Service Description <span className="text-red-500">*</span></Label>
          <Textarea 
            id="description" 
            placeholder="Describe what you will do..." 
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            className="min-h-[150px] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
