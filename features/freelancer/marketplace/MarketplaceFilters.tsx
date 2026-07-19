"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

import { Checkbox } from "@/components/ui/checkbox";

interface Filters {
  hourlyRate: number[];
  verifiedOnly: boolean;
  experienceLevel: string[];
}

interface MarketplaceFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  className?: string;
}

export function MarketplaceFilters({ filters, setFilters, className }: MarketplaceFiltersProps) {
  const handleHourlyRateChange = (val: number | readonly number[]) => {
    const rateArray = typeof val === 'number' ? [val] : [...val];
    setFilters({ ...filters, hourlyRate: rateArray });
  };
  
  const handleVerifiedChange = (checked: boolean) => setFilters({ ...filters, verifiedOnly: checked });

  const handleExperienceChange = (level: string, checked: boolean) => {
    if (checked) {
      setFilters({ ...filters, experienceLevel: [...filters.experienceLevel, level] });
    } else {
      setFilters({ ...filters, experienceLevel: filters.experienceLevel.filter(l => l !== level) });
    }
  };

  return (
    <div className={`space-y-5 ${className || ""}`}>
      
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-semibold text-[16px]">Filters</h3>
        <button onClick={() => setFilters({ hourlyRate: [150], verifiedOnly: false, experienceLevel: [] })} className="text-[13px] text-purple-600 font-medium hover:underline">
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="verified-only" className="cursor-pointer text-[14px]">Verified Professionals Only</Label>
          <Switch id="verified-only" checked={filters.verifiedOnly} onCheckedChange={handleVerifiedChange} />
        </div>
      </div>

      <div className="space-y-5 pt-2">
        
        <div className="space-y-3">
          <h4 className="font-semibold text-[15px]">Hourly Rate (Max)</h4>
          <div className="space-y-4 pt-1">
            <Slider 
              defaultValue={[150]} 
              max={250} 
              step={5} 
              value={filters.hourlyRate}
              onValueChange={handleHourlyRateChange}
              className="[&_[role=slider]]:bg-purple-600"
            />
            <div className="flex justify-between text-sm text-muted-foreground font-medium">
              <span>$10/hr</span>
              <span className="text-purple-600">${filters.hourlyRate[0]}/hr</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h4 className="font-semibold text-[15px]">Experience Level</h4>
          <div className="space-y-2 pt-1">
            {["Entry Level", "Intermediate", "Expert"].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox 
                  id={`exp-${level}`} 
                  checked={filters.experienceLevel.includes(level)}
                  onCheckedChange={(checked) => handleExperienceChange(level, checked as boolean)}
                />
                <Label htmlFor={`exp-${level}`} className="font-normal cursor-pointer text-[14px]">{level}</Label>
              </div>
            ))}
          </div>
        </div>
        
      </div>
      
    </div>
  );
}
