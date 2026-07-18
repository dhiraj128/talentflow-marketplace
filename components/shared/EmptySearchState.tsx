"use client";

import React from "react";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptySearchStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  onBrowseAll?: () => void;
}

export function EmptySearchState({ 
  title = "No results found", 
  description = "We couldn't find anything matching your current search criteria. Try adjusting your filters or keyword.",
  onClearFilters,
  onBrowseAll
}: EmptySearchStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-card rounded-2xl border shadow-sm h-full min-h-[400px]">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <SearchX className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold tracking-tight mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-4">
        {onClearFilters && (
          <Button onClick={onClearFilters} variant="outline" size="lg" className="h-12 px-8 rounded-xl font-semibold">
            Clear Filters
          </Button>
        )}
        {onBrowseAll && (
          <Button onClick={onBrowseAll} size="lg" className="h-12 px-8 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
            Browse All
          </Button>
        )}
      </div>
    </div>
  );
}
