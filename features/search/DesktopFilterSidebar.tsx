"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: "checkbox" | "select" | "slider";
  options?: FilterOption[];
  // For slider
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (val: number) => string;
}

interface DesktopFilterSidebarProps {
  filters: FilterGroup[];
  selectedFilters: Record<string, any>;
  onFilterChange: (id: string, value: any) => void;
  onClearAll: () => void;
}

export function DesktopFilterSidebar({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll
}: DesktopFilterSidebarProps) {
  return (
    <aside className="hidden md:flex w-64 flex-shrink-0 flex-col gap-8 sticky top-32 self-start max-h-[calc(100vh-140px)] overflow-y-auto pr-4 custom-scrollbar">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          Filters
        </h2>
        <Button onClick={onClearAll} variant="link" size="sm" className="h-8 text-muted-foreground hover:text-primary px-0">
          Clear all
        </Button>
      </div>

      <div className="space-y-8 flex-1">
        {filters.map((filter) => (
          <div key={filter.id} className="space-y-4">
            <h3 className="font-semibold text-foreground">{filter.label}</h3>
            
            {filter.type === "checkbox" && filter.options && (
              <div className="space-y-3">
                {filter.options.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-3 group">
                    <Checkbox 
                      id={`${filter.id}-${opt.value}`} 
                      checked={(selectedFilters[filter.id] || []).includes(opt.value)}
                      onCheckedChange={(c) => {
                        const current = selectedFilters[filter.id] || [];
                        if (c) onFilterChange(filter.id, [...current, opt.value]);
                        else onFilterChange(filter.id, current.filter((v: string) => v !== opt.value));
                      }}
                      className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor={`${filter.id}-${opt.value}`}
                      className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {filter.type === "select" && filter.options && (
              <Select 
                value={selectedFilters[filter.id] || "any"} 
                onValueChange={(v) => onFilterChange(filter.id, v === "any" ? null : v)}
              >
                <SelectTrigger className="w-full bg-card rounded-xl">
                  <SelectValue placeholder={`Select ${filter.label}`} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="any">Any {filter.label}</SelectItem>
                  {filter.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {filter.type === "slider" && (
              <div className="space-y-5 px-1">
                <Slider 
                  value={[selectedFilters[filter.id] || filter.min || 0]} 
                  min={filter.min || 0}
                  max={filter.max || 100}
                  step={filter.step || 1}
                  onValueChange={(v) => onFilterChange(filter.id, v[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                  <span>{filter.formatValue ? filter.formatValue(filter.min || 0) : filter.min}</span>
                  <span>{filter.formatValue ? filter.formatValue(filter.max || 100) : filter.max}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
