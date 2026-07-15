import { useRef, useState, useEffect, useCallback } from "react";
import { SearchType, searchService } from "@/lib/services/search.service";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchSuggestions } from "./SearchSuggestions";
import { RecentSearches, useRecentSearches } from "./RecentSearches";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchBoxProps {
  type: SearchType;
  onSearch: (query: string, location: string) => void;
  onToggleFilters: () => void;
}

import React from "react";
export const SearchBox = React.memo(function SearchBox({ type, onSearch, onToggleFilters }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 400);
  const { addSearch } = useRecentSearches();
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery, isOpen]);


  // Handle Ctrl+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data: suggestions, isLoading, isFetching } = useQuery({
    queryKey: ['search', 'suggestions', debouncedQuery, type],
    queryFn: ({ signal }) => searchService.getSuggestions(debouncedQuery, type, signal),
    enabled: debouncedQuery.length >= 2,
  });

  const placeholders = {
    talent: "Search by skills, job title, company...",
    jobs: "Search jobs, companies or skills...",
    freelancers: "Search by skills, services...",
    courses: "Search courses, technologies...",
  };

  const handleSuggestionSelect = useCallback((term: string) => {
    setQuery(term);
    setIsOpen(false);
  }, []);

  const handleSearch = useCallback((term: string) => {
    if (!term.trim()) {
      alert("Please enter a job title, skill, or keyword.");
      return;
    }
    setQuery(term);
    setIsOpen(false);
    addSearch(term);
    onSearch(term, location);
  }, [addSearch, onSearch, location]);

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  }, [handleSearch, query]);

  return (
    <form onSubmit={onSubmit} className="w-full relative z-50">
      <div className="bg-card p-2 rounded-2xl shadow-lg border w-full flex flex-col md:flex-row gap-2 relative z-50 items-center">
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger render={<div />} nativeButton={false} className="w-full flex-[2]">
            <div className="relative w-full group cursor-text" onClick={() => {
              inputRef.current?.focus();
              setIsOpen(true);
            }}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 group-hover:text-primary transition-colors z-10" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onKeyDown={(e) => {
                  if (!isOpen) return;
                  
                  const hasSuggestions = suggestions?.suggestions && suggestions.suggestions.length > 0;
                  const suggestionsList = suggestions?.suggestions || [];
                  const totalItems = query ? suggestionsList.length : 0;

                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (hasSuggestions) setActiveIndex(prev => Math.min(prev + 1, totalItems - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (hasSuggestions) setActiveIndex(prev => Math.max(prev - 1, -1));
                  } else if (e.key === "Enter") {
                    if (activeIndex >= 0 && hasSuggestions) {
                      e.preventDefault();
                      handleSuggestionSelect(suggestionsList[activeIndex].title);
                    }
                  } else if (e.key === "Escape" || e.key === "Tab") {
                    setIsOpen(false);
                  }
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholders[type]}
                className="pl-12 pr-4 border-0 shadow-none focus-visible:ring-0 text-base h-14 rounded-xl w-full bg-transparent"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[var(--radix-popover-trigger-width,var(--base-popover-anchor-width,100%))] p-0 shadow-xl rounded-xl border z-[100]" 
            align="start"
            sideOffset={8}
          >
            <div className="flex flex-col max-h-[400px] overflow-y-auto">
              {!query ? (
                <RecentSearches onSelect={handleSuggestionSelect} />
              ) : query.length < 2 ? (
                null
              ) : (isFetching || query !== debouncedQuery) ? (
                <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Loading suggestions...
                </div>
              ) : suggestions ? (
                <SearchSuggestions suggestions={suggestions} onSelect={handleSuggestionSelect} activeIndex={activeIndex} />
              ) : null}
            </div>
          </PopoverContent>
        </Popover>

        <div className="hidden md:block w-px h-10 bg-border mx-1"></div>

        <div className="relative flex-1 w-full md:w-auto">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
          <Input 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, state, or remote" 
            className="pl-12 pr-4 border-0 shadow-none focus-visible:ring-0 text-base h-14 rounded-xl w-full bg-transparent" 
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            type="button"
            variant="outline" 
            size="icon" 
            className="h-14 w-14 rounded-xl shrink-0 border-dashed"
            onClick={onToggleFilters}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
          <Button type="submit" size="lg" className="h-14 px-8 rounded-xl text-base w-full md:w-auto">
            Search
          </Button>
        </div>
      </div>
    </form>
  );
});
