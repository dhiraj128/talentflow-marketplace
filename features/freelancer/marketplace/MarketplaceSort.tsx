"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MarketplaceSortProps {
  value: string;
  onChange: (val: string) => void;
}

export function MarketplaceSort({ value, onChange }: MarketplaceSortProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">Sort by:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] bg-white h-10 border-input font-medium focus:ring-purple-500">
          <SelectValue placeholder="Sort freelancers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recommended">Recommended</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
          <SelectItem value="price_asc">Lowest Rate</SelectItem>
          <SelectItem value="price_desc">Highest Rate</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="projects">Most Projects</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
