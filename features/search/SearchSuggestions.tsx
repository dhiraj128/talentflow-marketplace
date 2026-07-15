"use client";

import { SearchSuggestionsResponse } from "@/lib/services/search.service";
import { Search } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchSuggestionsProps {
  suggestions: SearchSuggestionsResponse;
  onSelect: (term: string) => void;
  activeIndex?: number;
}
import React from "react";

export const SearchSuggestions = React.memo(function SearchSuggestions({ suggestions, onSelect, activeIndex = -1 }: SearchSuggestionsProps) {
  const hasResults = suggestions.suggestions && suggestions.suggestions.length > 0;

  if (!hasResults) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        No results found.
      </div>
    );
  }

  return (
    <Command shouldFilter={false}>
      <CommandList>
        <CommandGroup heading="Suggestions">
          {suggestions.suggestions?.map((item, index) => (
            <CommandItem
              key={item.id}
              value={item.title}
              onSelect={(currentValue) => onSelect(currentValue)}
              className={`flex items-center cursor-pointer py-3 ${activeIndex === index ? 'bg-accent text-accent-foreground' : ''}`}
            >
              <div className="mr-3 flex h-4 w-4 items-center justify-center text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <span className="font-medium text-foreground">{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
});
