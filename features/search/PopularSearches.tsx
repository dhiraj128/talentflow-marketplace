"use client";

import { Badge } from "@/components/ui/badge";
import { SearchType, searchService } from "@/lib/services/search.service";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import React from "react";

interface PopularSearchesProps {
  type: SearchType;
  onSelect: (term: string) => void;
}

export const PopularSearches = React.memo(function PopularSearches({ type, onSelect }: PopularSearchesProps) {
  const { data: popularSearches, isLoading } = useQuery({
    queryKey: ['search', 'popular', type],
    queryFn: () => searchService.getPopularSearches(type),
  });

  if (isLoading || !popularSearches || popularSearches.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 text-sm text-muted-foreground">
      <span className="font-medium mr-2">Popular Searches:</span>
      {popularSearches.map((term) => (
        <Badge
          key={term}
          variant="secondary"
          className="cursor-pointer hover:bg-primary/20 transition-colors flex items-center gap-1"
          onClick={() => onSelect(term)}
        >
          {term}
        </Badge>
      ))}
    </div>
  );
});
