"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, MapPin, Briefcase, Zap, GraduationCap, ChevronDown, Mic, X, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const SEARCH_CATEGORIES = [
  { id: "jobs", label: "Jobs", icon: Briefcase, path: "/find-jobs" },
  { id: "freelancers", label: "Freelancers", icon: Zap, path: "/find-freelancers" },
  { id: "courses", label: "Courses", icon: GraduationCap, path: "/find-courses" },
];

const TRENDING_SEARCHES = [
  "React Developer",
  "Full Stack Engineer",
  "UI/UX Designer",
  "AWS",
  "Data Scientist",
  "Python",
  "Freelance Designer",
  "DevOps Engineer"
];

export function AdvancedSearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Determine initial category based on pathname
  const initialCategory = SEARCH_CATEGORIES.find(c => pathname.includes(c.path)) || SEARCH_CATEGORIES[0];
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [isSticky, setIsSticky] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("talentflow_recent_searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {}
    }

    const handleScroll = () => {
      setIsSticky(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem("talentflow_recent_searches", JSON.stringify(updated));
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem("talentflow_recent_searches", JSON.stringify(updated));
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("talentflow_recent_searches");
  };

  const executeSearch = (e?: React.FormEvent, overrideKeyword?: string) => {
    if (e) e.preventDefault();
    const finalKeyword = overrideKeyword !== undefined ? overrideKeyword : keyword;
    
    if (finalKeyword) saveRecentSearch(finalKeyword);
    setShowSuggestions(false);

    const params = new URLSearchParams(searchParams.toString());
    
    if (finalKeyword) params.set("q", finalKeyword);
    else params.delete("q");
    
    if (location) params.set("location", location);
    else params.delete("location");
    
    params.set("page", "1");

    router.push(`${activeCategory.path}?${params.toString()}`);
  };

  const suggestions = keyword.trim() ? [
    `${keyword} Developer`,
    `Senior ${keyword}`,
    `${keyword} Remote`,
    `Freelance ${keyword}`
  ] : [];

  return (
    <>
      {isSticky && <div className="h-24 w-full" />}
      
      <div
        ref={searchContainerRef}
        className={cn(
          "w-full z-40 transition-all duration-300",
          isSticky 
            ? "fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md border-b shadow-md py-3 px-4" 
            : "max-w-6xl mx-auto py-4 px-4 sm:px-6"
        )}
      >
        <div className="w-full relative">
          <form 
            onSubmit={executeSearch} 
            className={cn(
              "w-full bg-card flex flex-col md:flex-row items-stretch md:items-center border border-border shadow-lg transition-all duration-300",
              isSticky ? "rounded-xl h-auto md:h-14" : "rounded-2xl md:rounded-full h-auto md:h-16"
            )}
          >
            {/* Category Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                  "flex items-center justify-between hover:bg-muted text-sm md:text-base border-b md:border-b-0 md:border-r border-border h-12 md:h-full px-4 md:px-6 shrink-0 transition-colors",
                  isSticky ? "w-full md:w-36 rounded-t-xl md:rounded-l-xl md:rounded-tr-none" : "w-full md:w-44 rounded-t-2xl md:rounded-l-full md:rounded-tr-none"
                )}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <activeCategory.icon className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
                    <span className="font-semibold truncate">{activeCategory.label}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground ml-2 shrink-0 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 p-2 rounded-xl">
                {SEARCH_CATEGORIES.map(category => (
                  <DropdownMenuItem 
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category);
                      const params = new URLSearchParams(searchParams.toString());
                      if (keyword) params.set("q", keyword);
                      if (location) params.set("location", location);
                      router.push(`${category.path}?${params.toString()}`);
                    }}
                    className="cursor-pointer py-2.5 px-3 rounded-lg flex items-center gap-2 text-sm font-medium"
                  >
                    <category.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{category.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Keyword Input */}
            <div className="relative flex-1 w-full min-w-0 border-b md:border-b-0 border-border group flex items-center h-12 md:h-14 min-h-[48px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-focus-within:text-primary transition-colors shrink-0" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder={
                  activeCategory.id === "jobs" ? "Job title, skill, or company" :
                  activeCategory.id === "freelancers" ? "Freelancer skill or name" :
                  "Course title or topic"
                }
                className="pl-11 md:pl-12 pr-10 border-0 shadow-none focus-visible:ring-0 bg-transparent w-full min-w-0 h-12 md:h-14 min-h-[48px] text-sm md:text-base text-foreground placeholder:text-muted-foreground"
                autoComplete="off"
              />
              {keyword && (
                <button type="button" onClick={() => setKeyword("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Location Input (Only for Jobs and Freelancers) */}
            {activeCategory.id !== "courses" && (
              <>
                <div className="hidden md:block w-px h-8 bg-border self-center shrink-0" />
                <div className="relative flex-1 w-full min-w-0 border-b md:border-b-0 border-border group flex items-center h-12 md:h-14 min-h-[48px]">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-focus-within:text-primary transition-colors shrink-0" />
                  <Input 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, state, or remote" 
                    className="pl-11 md:pl-12 pr-10 border-0 shadow-none focus-visible:ring-0 bg-transparent w-full min-w-0 h-12 md:h-14 min-h-[48px] text-sm md:text-base text-foreground placeholder:text-muted-foreground"
                    autoComplete="off"
                  />
                  {location && (
                    <button type="button" onClick={() => setLocation("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 p-2 md:p-1">
              <Button type="button" variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-primary rounded-full">
                <Mic className="h-4 w-4 md:h-5 md:w-5" />
                <span className="sr-only">Voice Search</span>
              </Button>
              <Button 
                type="submit" 
                size="lg" 
                className={cn(
                  "font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform active:scale-95 w-full md:w-auto h-12 min-h-[48px]",
                  isSticky ? "rounded-lg md:rounded-lg px-6" : "rounded-xl md:rounded-full px-8 md:h-14"
                )}
              >
                Search
              </Button>
            </div>
          </form>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-[100]"
              >
                <div className="grid md:grid-cols-2 p-4 gap-6 max-h-[400px] overflow-y-auto">
                  <div className="space-y-4">
                    {keyword.trim() ? (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Search className="h-3 w-3" /> Suggestions
                        </h4>
                        <div className="flex flex-col">
                          {suggestions.map((s, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setKeyword(s);
                                executeSearch(undefined, s);
                              }}
                              className="text-left px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors flex items-center justify-between group"
                            >
                              <span>{s}</span>
                              <ChevronDown className="h-3 w-3 -rotate-90 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Recent Searches
                          </h4>
                          {recentSearches.length > 0 && (
                            <button type="button" onClick={clearRecentSearches} className="text-xs text-muted-foreground hover:text-primary">
                              Clear All
                            </button>
                          )}
                        </div>
                        {recentSearches.length === 0 ? (
                          <p className="text-xs text-muted-foreground py-2">No recent searches</p>
                        ) : (
                          <div className="flex flex-col">
                            {recentSearches.map((s, i) => (
                              <div key={i} className="flex items-center justify-between px-3 py-2 hover:bg-muted rounded-lg group">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setKeyword(s);
                                    executeSearch(undefined, s);
                                  }}
                                  className="text-left text-sm flex-1"
                                >
                                  {s}
                                </button>
                                <button type="button" onClick={(e) => removeRecentSearch(e, s)} className="text-muted-foreground hover:text-destructive p-1">
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Trending Searches */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-amber-500" /> Trending Searches
                    </h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {TRENDING_SEARCHES.map((term, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setKeyword(term);
                            executeSearch(undefined, term);
                          }}
                          className="px-3 py-1.5 bg-muted/60 hover:bg-primary/10 hover:text-primary rounded-full text-xs font-medium transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
