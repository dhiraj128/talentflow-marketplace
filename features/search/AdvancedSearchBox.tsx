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
    // Load recent searches
    const stored = localStorage.getItem("talentflow_recent_searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {}
    }

    // Sticky observer
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
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
    
    // Reset page on new search
    params.set("page", "1");

    router.push(`${activeCategory.path}?${params.toString()}`);
  };

  // Mock Suggestions based on keyword
  const suggestions = keyword.trim() ? [
    `${keyword} Developer`,
    `Senior ${keyword}`,
    `${keyword} Remote`,
    `Freelance ${keyword}`
  ] : [];

  return (
    <>
      {/* Spacer to prevent layout shift when sticky */}
      {isSticky && <div className="h-24 w-full" />}
      
      <motion.div
        ref={searchContainerRef}
        initial={false}
        animate={{
          y: isSticky ? 0 : 0,
          position: isSticky ? "fixed" : "relative",
          top: isSticky ? 0 : "auto",
          left: isSticky ? 0 : "auto",
          right: isSticky ? 0 : "auto",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "w-full z-50 transition-all duration-300",
          isSticky 
            ? "bg-background/80 backdrop-blur-xl border-b shadow-md py-4" 
            : "max-w-6xl mx-auto py-2"
        )}
      >
        <div className={cn("mx-auto flex flex-col items-center relative", isSticky ? "px-4 max-w-7xl" : "px-0")}>
          <form 
            onSubmit={executeSearch} 
            className={cn(
              "w-full bg-card flex flex-col md:flex-row items-center border transition-all duration-300 relative",
              isSticky ? "rounded-xl shadow-sm h-14" : "rounded-2xl shadow-xl h-auto md:h-16 p-2 md:p-1 md:rounded-full"
            )}
            style={{
              background: isSticky ? "var(--card)" : "linear-gradient(to right, hsl(var(--card)), hsl(var(--muted)/0.3))"
            }}
          >
            {/* Category Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(
                  "flex-none justify-between hover:bg-muted text-base border-r-0 md:border-r border-border rounded-xl md:rounded-l-full md:rounded-r-none h-12 md:h-full",
                  isSticky ? "w-[140px] px-4" : "w-full md:w-48 px-6"
                )}>
                  <div className="flex items-center gap-2">
                    <activeCategory.icon className={cn("text-primary", isSticky ? "h-4 w-4" : "h-5 w-5")} />
                    <span>{activeCategory.label}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 p-2 rounded-xl">
                {SEARCH_CATEGORIES.map(category => (
                  <DropdownMenuItem 
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category);
                      // Trigger search immediately on category change if we have keyword
                      const params = new URLSearchParams(searchParams.toString());
                      if (keyword) params.set("q", keyword);
                      if (location) params.set("location", location);
                      router.push(`${category.path}?${params.toString()}`);
                    }}
                    className="cursor-pointer py-3 px-4 rounded-lg flex items-center gap-2 text-base font-medium"
                  >
                    <category.icon className="h-5 w-5 text-muted-foreground" />
                    <span>{category.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Keyword Input */}
            <div className="relative flex-1 w-full border-b md:border-b-0 border-border group">
              <Search className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary",
                isSticky ? "h-4 w-4" : "h-5 w-5"
              )} />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder={
                  activeCategory.id === "jobs" ? "Job title, skill, or company" :
                  activeCategory.id === "freelancers" ? "Freelancer skill or name" :
                  "Course title or topic"
                }
                className={cn(
                  "pl-12 pr-10 border-0 shadow-none focus-visible:ring-0 bg-transparent w-full",
                  isSticky ? "h-full text-sm" : "h-12 md:h-full text-base"
                )}
                autoComplete="off"
              />
              {keyword && (
                <button type="button" onClick={() => setKeyword("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="hidden md:block w-px h-8 bg-border self-center"></div>

            {/* Location Input (Only for Jobs and Freelancers) */}
            <AnimatePresence>
              {activeCategory.id !== "courses" && (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative flex-1 w-full group overflow-hidden"
                >
                  <MapPin className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary",
                    isSticky ? "h-4 w-4" : "h-5 w-5"
                  )} />
                  <Input 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, state, or remote" 
                    className={cn(
                      "pl-12 pr-10 border-0 shadow-none focus-visible:ring-0 bg-transparent w-full",
                      isSticky ? "h-full text-sm" : "h-12 md:h-full text-base"
                    )}
                    autoComplete="off"
                  />
                  {location && (
                    <button type="button" onClick={() => setLocation("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className={cn("flex items-center gap-2 flex-none p-1", isSticky ? "pr-2" : "")}>
              <Button type="button" variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-primary rounded-full">
                <Mic className="h-5 w-5" />
                <span className="sr-only">Voice Search</span>
              </Button>
              <Button 
                type="submit" 
                size={isSticky ? "default" : "lg"} 
                className={cn(
                  "font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform active:scale-95 w-full md:w-auto",
                  isSticky ? "rounded-lg px-6" : "rounded-xl md:rounded-full px-8 h-12 md:h-14"
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
                className="absolute top-full left-0 right-0 mt-2 bg-card border shadow-2xl rounded-2xl overflow-hidden z-[100]"
              >
                <div className="grid md:grid-cols-2 p-4 gap-6 max-h-[400px] overflow-y-auto">
                  
                  {/* Left Column: Suggestions */}
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
                              onClick={() => { setKeyword(s); executeSearch(undefined, s); }}
                              className="text-left px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors flex items-center gap-2 group"
                            >
                              <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              <span className="font-medium text-foreground">{s}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Recent Searches
                          </h4>
                          {recentSearches.length > 0 && (
                            <button onClick={clearRecentSearches} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Clear All</button>
                          )}
                        </div>
                        {recentSearches.length > 0 ? (
                          <div className="flex flex-col">
                            {recentSearches.map((s, i) => (
                              <div key={i} className="flex items-center justify-between group px-3 py-2 hover:bg-muted rounded-lg transition-colors">
                                <button
                                  type="button"
                                  onClick={() => { setKeyword(s); executeSearch(undefined, s); }}
                                  className="text-left text-sm flex-1 flex items-center gap-2"
                                >
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-foreground">{s}</span>
                                </button>
                                <button onClick={(e) => removeRecentSearch(e, s)} className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all">
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic px-3">No recent searches.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Trending */}
                  <div className="space-y-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Trending Searches
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_SEARCHES.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => { setKeyword(tag); executeSearch(undefined, tag); }}
                          className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors border border-primary/20"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
