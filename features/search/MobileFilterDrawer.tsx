"use client";

import React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { FilterGroup } from "./DesktopFilterSidebar";

interface MobileFilterDrawerProps {
  filters: FilterGroup[];
  selectedFilters: Record<string, any>;
  onFilterChange: (id: string, value: any) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

export function MobileFilterDrawer({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
  activeFilterCount
}: MobileFilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden flex items-center gap-2 h-12 rounded-xl px-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground font-semibold inline-flex shrink-0 items-center justify-center border bg-clip-padding transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50">
        <Filter className="h-4 w-4" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-1 px-1.5 min-w-[20px] h-5">{activeFilterCount}</Badge>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl flex flex-col p-0 pb-6 overflow-hidden">
        <SheetHeader className="px-6 py-4 border-b bg-muted/30 text-left flex flex-row items-center justify-between">
          <SheetTitle className="text-xl font-bold flex items-center gap-2 m-0">
            <Filter className="h-5 w-5 text-primary" /> Filters
          </SheetTitle>
          <SheetClose className="inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 rounded-full h-8 w-8">
            <X className="h-4 w-4" />
          </SheetClose>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {filters.map((filter) => (
            <div key={filter.id} className="space-y-4">
              <h3 className="font-semibold text-foreground text-lg">{filter.label}</h3>
              
              {filter.type === "checkbox" && filter.options && (
                <div className="space-y-4">
                  {filter.options.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-3">
                      <Checkbox 
                        id={`m-${filter.id}-${opt.value}`} 
                        checked={(selectedFilters[filter.id] || []).includes(opt.value)}
                        onCheckedChange={(c) => {
                          const current = selectedFilters[filter.id] || [];
                          if (c) onFilterChange(filter.id, [...current, opt.value]);
                          else onFilterChange(filter.id, current.filter((v: string) => v !== opt.value));
                        }}
                        className="h-5 w-5 rounded-md"
                      />
                      <Label
                        htmlFor={`m-${filter.id}-${opt.value}`}
                        className="text-base font-medium leading-none cursor-pointer"
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
                  <SelectTrigger className="w-full h-12 rounded-xl text-base">
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
                <div className="space-y-6 px-2 pt-2">
                  <Slider 
                    value={[selectedFilters[filter.id] || filter.min || 0]} 
                    min={filter.min || 0}
                    max={filter.max || 100}
                    step={filter.step || 1}
                    onValueChange={(v) => onFilterChange(filter.id, Array.isArray(v) ? v[0] : v)}
                    className="py-4"
                  />
                  <div className="flex justify-between text-base font-medium text-muted-foreground">
                    <span>{filter.formatValue ? filter.formatValue(filter.min || 0) : filter.min}</span>
                    <span>{filter.formatValue ? filter.formatValue(filter.max || 100) : filter.max}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="px-6 pt-4 border-t flex items-center gap-4 bg-background">
          <Button onClick={onClearAll} variant="outline" size="lg" className="flex-1 h-14 rounded-xl font-semibold">
            Reset
          </Button>
          <SheetClose className="inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] md:min-h-0 md:h-8 px-2.5 flex-1 h-14 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
            Apply Filters
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
