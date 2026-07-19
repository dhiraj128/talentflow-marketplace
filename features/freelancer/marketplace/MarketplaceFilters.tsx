"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface Filters {
  hourlyRate: number[];
  verifiedOnly: boolean;
  remoteOnly: boolean;
  experienceLevel: string[];
  skills: string[];
  languages: string[];
  rating: number;
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
  
  const handleToggle = (key: keyof Filters, checked: boolean) => {
    setFilters({ ...filters, [key]: checked });
  };

  const handleArrayToggle = (key: 'experienceLevel' | 'skills' | 'languages', value: string, checked: boolean) => {
    if (checked) {
      setFilters({ ...filters, [key]: [...filters[key], value] });
    } else {
      setFilters({ ...filters, [key]: filters[key].filter(v => v !== value) });
    }
  };

  const resetFilters = () => {
    setFilters({
      hourlyRate: [150],
      verifiedOnly: false,
      remoteOnly: false,
      experienceLevel: [],
      skills: [],
      languages: [],
      rating: 0
    });
  };

  return (
    <div className={`space-y-6 ${className || ""}`}>
      
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-bold text-[18px]">Filters</h3>
        <button onClick={resetFilters} className="text-[13px] text-purple-600 font-medium hover:underline">
          Clear All
        </button>
      </div>

      {/* Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="verified-only" className="cursor-pointer text-[14px] font-medium">Verified Only</Label>
          <Switch id="verified-only" checked={filters.verifiedOnly} onCheckedChange={(c) => handleToggle('verifiedOnly', c)} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="remote-only" className="cursor-pointer text-[14px] font-medium">Remote Only</Label>
          <Switch id="remote-only" checked={filters.remoteOnly} onCheckedChange={(c) => handleToggle('remoteOnly', c)} />
        </div>
      </div>

      <div className="border-t pt-5 space-y-4">
        <h4 className="font-semibold text-[15px]">Hourly Rate (Max)</h4>
        <div className="pt-2 px-1">
          <Slider 
            defaultValue={[150]} 
            max={250} 
            step={5} 
            value={filters.hourlyRate}
            onValueChange={handleHourlyRateChange}
            className="[&_[role=slider]]:bg-purple-600"
          />
          <div className="flex justify-between mt-3 text-sm text-muted-foreground font-medium">
            <span>$10/hr</span>
            <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">${filters.hourlyRate[0]}/hr</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-5 space-y-3">
        <h4 className="font-semibold text-[15px]">Experience Level</h4>
        <div className="space-y-2.5 pt-1">
          {["Entry Level", "Intermediate", "Expert"].map((level) => (
            <div key={level} className="flex items-center space-x-3">
              <Checkbox 
                id={`exp-${level}`} 
                checked={filters.experienceLevel.includes(level)}
                onCheckedChange={(checked) => handleArrayToggle('experienceLevel', level, checked as boolean)}
              />
              <Label htmlFor={`exp-${level}`} className="font-normal cursor-pointer text-[14px] leading-none">{level}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-5 space-y-3">
        <h4 className="font-semibold text-[15px]">Top Skills</h4>
        <div className="space-y-2.5 pt-1">
          {["React", "Node.js", "UI/UX Design", "Figma", "Python", "AWS"].map((skill) => (
            <div key={skill} className="flex items-center space-x-3">
              <Checkbox 
                id={`skill-${skill}`} 
                checked={filters.skills.includes(skill)}
                onCheckedChange={(checked) => handleArrayToggle('skills', skill, checked as boolean)}
              />
              <Label htmlFor={`skill-${skill}`} className="font-normal cursor-pointer text-[14px] leading-none">{skill}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-5 space-y-3">
        <h4 className="font-semibold text-[15px]">Languages</h4>
        <div className="space-y-2.5 pt-1">
          {["English", "Spanish", "French", "German"].map((lang) => (
            <div key={lang} className="flex items-center space-x-3">
              <Checkbox 
                id={`lang-${lang}`} 
                checked={filters.languages.includes(lang)}
                onCheckedChange={(checked) => handleArrayToggle('languages', lang, checked as boolean)}
              />
              <Label htmlFor={`lang-${lang}`} className="font-normal cursor-pointer text-[14px] leading-none">{lang}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={resetFilters} variant="outline" className="w-full">
          Reset Filters
        </Button>
      </div>
      
    </div>
  );
}
