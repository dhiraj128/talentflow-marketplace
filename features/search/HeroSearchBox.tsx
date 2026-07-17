"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2, Briefcase, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchService } from "@/lib/services/search.service";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface Suggestion {
  text: string;
  type: string;
}

export function HeroSearchBox() {
  const router = useRouter();
  
  // Keyword State
  const [query, setQuery] = useState("");
  const [isQueryFocused, setIsQueryFocused] = useState(false);
  const [querySuggestions, setQuerySuggestions] = useState<Suggestion[]>([]);
  const [isFetchingQuery, setIsFetchingQuery] = useState(false);
  const [queryActiveIndex, setQueryActiveIndex] = useState(-1);
  const queryWrapperRef = useRef<HTMLDivElement>(null);
  
  // Location State
  const [location, setLocation] = useState("");
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationActiveIndex, setLocationActiveIndex] = useState(-1);
  const locationWrapperRef = useRef<HTMLDivElement>(null);

  // Debounced Values (300ms)
  const debouncedQuery = useDebounce(query, 300);
  const debouncedLocation = useDebounce(location, 300);

  // Abort Controllers for canceling stale requests
  const queryAbortController = useRef<AbortController | null>(null);
  const locationAbortController = useRef<AbortController | null>(null);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (queryWrapperRef.current && !queryWrapperRef.current.contains(event.target as Node)) {
        setIsQueryFocused(false);
      }
      if (locationWrapperRef.current && !locationWrapperRef.current.contains(event.target as Node)) {
        setIsLocationFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Query Suggestions
  useEffect(() => {
    setQueryActiveIndex(-1);
    
    if (debouncedQuery.length < 2) {
      setQuerySuggestions([]);
      setIsFetchingQuery(false);
      return;
    }

    if (queryAbortController.current) {
      queryAbortController.current.abort();
    }
    queryAbortController.current = new AbortController();

    const fetchSuggestions = async () => {
      setIsFetchingQuery(true);
      try {
        const data = await searchService.getJobSuggestions(debouncedQuery, queryAbortController.current?.signal);
        setQuerySuggestions(data.suggestions || []);
      } catch (error: any) {
        if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
          console.error("Failed to fetch job suggestions", error);
        }
      } finally {
        setIsFetchingQuery(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Fetch Location Suggestions
  useEffect(() => {
    setLocationActiveIndex(-1);

    if (locationAbortController.current) {
      locationAbortController.current.abort();
    }
    locationAbortController.current = new AbortController();

    const fetchLocations = async () => {
      setIsFetchingLocation(true);
      try {
        const data = await searchService.getLocationSuggestions(debouncedLocation, locationAbortController.current?.signal);
        setLocationSuggestions(data.locations || []);
      } catch (error: any) {
        if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
          console.error("Failed to fetch location suggestions", error);
        }
      } finally {
        setIsFetchingLocation(false);
      }
    };

    if (isLocationFocused) {
      fetchLocations();
    }
  }, [debouncedLocation, isLocationFocused]);

  // Handlers
  const handleSearch = useCallback((overrideQuery?: string) => {
    const finalQuery = overrideQuery !== undefined ? overrideQuery : query;
    if (!finalQuery.trim()) {
      return;
    }
    const params = new URLSearchParams({
      ...(finalQuery && { q: finalQuery }),
      ...(location && { location }),
    });
    router.push(`/find-jobs?${params.toString()}`);
  }, [query, location, router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'company': return <Building2 className="h-4 w-4 text-blue-500" />;
      case 'skill': return <Hash className="h-4 w-4 text-emerald-500" />;
      default: return <Briefcase className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative z-40">
      <form onSubmit={onSubmit} className="bg-card p-2 rounded-2xl shadow-xl border w-full flex flex-col md:flex-row gap-2 relative z-50">
        
        {/* Keyword Search */}
        <div ref={queryWrapperRef} className="relative flex-[2] w-full">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 z-10 group-hover:text-primary transition-colors" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsQueryFocused(true);
              }}
              onFocus={() => setIsQueryFocused(true)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setQueryActiveIndex(prev => Math.min(prev + 1, querySuggestions.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setQueryActiveIndex(prev => Math.max(prev - 1, -1));
                } else if (e.key === "Enter") {
                  if (queryActiveIndex >= 0 && querySuggestions[queryActiveIndex]) {
                    e.preventDefault();
                    setQuery(querySuggestions[queryActiveIndex].text);
                    setIsQueryFocused(false);
                    document.getElementById('hero-location-input')?.focus();
                  }
                } else if (e.key === "Escape") {
                  setIsQueryFocused(false);
                }
              }}
              placeholder="Job title, skills, or company"
              className="pl-12 pr-4 border-0 shadow-none focus-visible:ring-0 text-base h-14 rounded-xl w-full bg-transparent"
              autoComplete="off"
            />
          </div>
          
          {/* Keyword Dropdown */}
          {isQueryFocused && query.length >= 2 && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-card border rounded-xl shadow-2xl overflow-hidden z-[100] max-h-[300px] overflow-y-auto">
              {isFetchingQuery && query === debouncedQuery ? (
                <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Loading...
                </div>
              ) : querySuggestions.length > 0 ? (
                <div className="flex flex-col py-2">
                  {querySuggestions.map((suggestion, idx) => (
                    <button
                      key={`${suggestion.type}-${suggestion.text}-${idx}`}
                      type="button"
                      className={cn(
                        "w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-sm",
                        queryActiveIndex === idx ? "bg-muted" : ""
                      )}
                      onClick={() => {
                        setQuery(suggestion.text);
                        setIsQueryFocused(false);
                        document.getElementById('hero-location-input')?.focus();
                      }}
                    >
                      {getIconForType(suggestion.type)}
                      <span className="font-medium text-foreground">{suggestion.text}</span>
                      <span className="ml-auto text-xs text-muted-foreground uppercase tracking-wider">{suggestion.type.replace('_', ' ')}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No matching suggestions found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden md:block w-px h-10 bg-border mx-1 self-center"></div>

        {/* Location Search */}
        <div ref={locationWrapperRef} className="relative flex-1 w-full md:w-auto">
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 z-10 group-hover:text-primary transition-colors" />
            <Input 
              id="hero-location-input"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setIsLocationFocused(true);
              }}
              onFocus={() => setIsLocationFocused(true)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setLocationActiveIndex(prev => Math.min(prev + 1, locationSuggestions.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setLocationActiveIndex(prev => Math.max(prev - 1, -1));
                } else if (e.key === "Enter") {
                  if (locationActiveIndex >= 0 && locationSuggestions[locationActiveIndex]) {
                    e.preventDefault();
                    setLocation(locationSuggestions[locationActiveIndex]);
                    setIsLocationFocused(false);
                  }
                } else if (e.key === "Escape") {
                  setIsLocationFocused(false);
                }
              }}
              placeholder="City, state, or remote" 
              className="pl-12 pr-4 border-0 shadow-none focus-visible:ring-0 text-base h-14 rounded-xl w-full bg-transparent"
              autoComplete="off" 
            />
          </div>

          {/* Location Dropdown */}
          {isLocationFocused && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-card border rounded-xl shadow-2xl overflow-hidden z-[100] max-h-[300px] overflow-y-auto">
              {isFetchingLocation && location === debouncedLocation ? (
                 <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                 <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
               </div>
              ) : locationSuggestions.length > 0 ? (
                <div className="flex flex-col py-2">
                  {locationSuggestions.map((loc, idx) => (
                    <button
                      key={loc}
                      type="button"
                      className={cn(
                        "w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-sm",
                        locationActiveIndex === idx ? "bg-muted" : ""
                      )}
                      onClick={() => {
                        setLocation(loc);
                        setIsLocationFocused(false);
                      }}
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{loc}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0 shrink-0">
          <Button type="submit" size="lg" className="h-14 px-8 rounded-xl text-base w-full md:w-auto font-bold">
            Search
          </Button>
        </div>
      </form>

      {/* Popular Searches */}
      <div className="flex flex-wrap justify-center items-center mt-6 gap-3 text-sm text-muted-foreground">
        <span className="font-medium">Popular:</span>
        <button type="button" onClick={() => { handleSearch("Software Engineer"); }} className="hover:text-primary transition-colors hover:underline">Software Engineer</button>
        <button type="button" onClick={() => { handleSearch("Product Manager"); }} className="hover:text-primary transition-colors hover:underline hidden sm:block">Product Manager</button>
        <button type="button" onClick={() => { handleSearch("React"); }} className="hover:text-primary transition-colors hover:underline">React</button>
        <button type="button" onClick={() => { handleSearch("UI/UX Designer"); }} className="hover:text-primary transition-colors hover:underline hidden sm:block">UI/UX Designer</button>
      </div>
    </div>
  );
}
