import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceFormData } from "./ServiceWizard";
import { Button } from "@/components/ui/button";
import { X, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

interface StepProps {
  data: ServiceFormData;
  updateData: (data: Partial<ServiceFormData>) => void;
}

export function PortfolioStep({ data, updateData }: StepProps) {
  const [currentLink, setCurrentLink] = useState("");

  const addLink = () => {
    const trimmed = currentLink.trim();
    if (trimmed && !data.portfolioLinks.includes(trimmed)) {
      updateData({ portfolioLinks: [...data.portfolioLinks, trimmed] });
    }
    setCurrentLink("");
  };

  const removeLink = (linkToRemove: string) => {
    updateData({ portfolioLinks: data.portfolioLinks.filter(l => l !== linkToRemove) });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Portfolio Links</h2>
        <p className="text-muted-foreground">Add links to your past work (GitHub, Dribbble, live sites, etc.).</p>
      </div>
      
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Project URL</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="https://..." 
                value={currentLink}
                onChange={(e) => setCurrentLink(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())}
                className="py-5 pl-9 focus-visible:ring-purple-500"
              />
            </div>
            <Button type="button" onClick={addLink} className="h-11 px-6 bg-purple-600 hover:bg-purple-700">Add</Button>
          </div>
        </div>

        {data.portfolioLinks.length > 0 && (
          <div className="space-y-2 pt-2">
            {data.portfolioLinks.map(link => (
              <div key={link} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                <div className="flex items-center gap-3 overflow-hidden text-sm">
                  <div className="p-2 bg-background rounded border">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="truncate max-w-[200px] sm:max-w-md">{link}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeLink(link)} className="h-8 w-8 text-muted-foreground hover:text-red-500">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
