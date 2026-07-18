"use client";

import React from "react";
import { X } from "lucide-react";
import { FilterGroup } from "./DesktopFilterSidebar";

interface ActiveFilterChipsProps {
  filters: FilterGroup[];
  selectedFilters: Record<string, any>;
  onRemoveFilter: (id: string, value: any) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({
  filters,
  selectedFilters,
  onRemoveFilter,
  onClearAll
}: ActiveFilterChipsProps) {
  
  const activeChips: { id: string, value: any, label: string }[] = [];
  
  filters.forEach(filter => {
    const selected = selectedFilters[filter.id];
    if (selected !== undefined && selected !== null && selected !== "any") {
      if (filter.type === "checkbox" && Array.isArray(selected) && filter.options) {
        selected.forEach(val => {
          const opt = filter.options?.find(o => o.value === val);
          if (opt) activeChips.push({ id: filter.id, value: val, label: opt.label });
        });
      } else if (filter.type === "select" && filter.options) {
        const opt = filter.options.find(o => o.value === selected);
        if (opt) activeChips.push({ id: filter.id, value: selected, label: opt.label });
      } else if (filter.type === "slider") {
        if (selected > (filter.min || 0)) {
           const labelText = filter.formatValue ? filter.formatValue(selected) : selected.toString();
           activeChips.push({ id: filter.id, value: selected, label: `>= ${labelText}` });
        }
      }
    }
  });

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm font-medium text-muted-foreground mr-2">Active Filters:</span>
      {activeChips.map((chip, idx) => (
        <button
          key={`${chip.id}-${chip.value}-${idx}`}
          onClick={() => onRemoveFilter(chip.id, chip.value)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary rounded-full text-sm font-medium transition-colors border border-primary/20 group"
        >
          {chip.label}
          <X className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
        </button>
      ))}
      <button 
        onClick={onClearAll}
        className="text-sm text-muted-foreground hover:text-foreground font-medium ml-2 underline underline-offset-4"
      >
        Clear all
      </button>
    </div>
  );
}
