import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface MarketplaceSortProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarketplaceSort({ value, onChange }: MarketplaceSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground hidden sm:inline-flex items-center gap-1">
        <ArrowUpDown className="w-4 h-4" /> Sort by:
      </span>
      <Select value={value} onValueChange={(val) => onChange(val as string)}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recommended">Recommended</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
          <SelectItem value="price_asc">Lowest Price</SelectItem>
          <SelectItem value="price_desc">Highest Price</SelectItem>
          <SelectItem value="newest">Recently Active</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
