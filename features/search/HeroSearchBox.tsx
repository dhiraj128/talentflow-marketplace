"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, Zap, GraduationCap, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SEARCH_CATEGORIES = [
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "freelancers", label: "Freelancers", icon: Zap },
  { id: "training", label: "Training", icon: GraduationCap },
];

const TRENDING_TAGS = [
  "Software Engineer",
  "UI Designer",
  "Data Analyst",
  "DevOps",
  "AI Engineer",
  "Digital Marketing"
];

export function HeroSearchBox() {
  const router = useRouter();
  
  const [activeCategory, setActiveCategory] = useState(SEARCH_CATEGORIES[0]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e?: React.FormEvent, tag?: string) => {
    if (e) e.preventDefault();
    
    const finalKeyword = tag || keyword;
    if (!finalKeyword && !location) return;

    const params = new URLSearchParams();
    if (finalKeyword) params.set("q", finalKeyword);
    if (location) params.set("location", location);

    let path = "/find-jobs";
    if (activeCategory.id === "freelancers") path = "/find-freelancers";
    if (activeCategory.id === "training") path = "/find-courses";

    router.push(`${path}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto relative z-40">
      <form onSubmit={handleSearch} className="bg-card p-2 rounded-2xl md:rounded-full shadow-2xl border w-full flex flex-col md:flex-row gap-2 relative z-50 transition-all duration-300">
        
        {/* Category Dropdown */}
        <div className="flex-none md:w-48">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full h-14 justify-between rounded-xl md:rounded-r-none md:rounded-l-2xl px-4 flex items-center shrink-0 border border-transparent bg-clip-padding transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 hover:bg-muted text-sm font-medium">
                <div className="flex items-center gap-2">
                  <activeCategory.icon className="h-5 w-5 text-primary" />
                  <span>{activeCategory.label}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 p-2 rounded-xl">
              {SEARCH_CATEGORIES.map(category => (
                <DropdownMenuItem 
                  key={category.id}
                  onClick={() => setActiveCategory(category)}
                  className="cursor-pointer py-3 px-4 rounded-lg flex items-center gap-2 text-base"
                >
                  <category.icon className="h-5 w-5 text-muted-foreground" />
                  <span>{category.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden md:block w-px h-10 bg-border self-center"></div>

        {/* Keyword Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title, skills, or company"
            className="pl-12 pr-4 border-0 shadow-none focus-visible:ring-0 text-base h-14 w-full bg-transparent"
          />
        </div>

        <div className="hidden md:block w-px h-10 bg-border self-center"></div>

        {/* Location Input */}
        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, state, or remote" 
            className="pl-12 pr-4 border-0 shadow-none focus-visible:ring-0 text-base h-14 w-full bg-transparent"
          />
        </div>

        {/* Search Button */}
        <div className="flex-none">
          <Button type="submit" size="lg" className="h-14 px-10 rounded-xl md:rounded-r-full text-base w-full md:w-auto font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-transform active:scale-95">
            Search
          </Button>
        </div>
      </form>

      {/* Quick Filters / Trending */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2 flex-wrap justify-center text-muted-foreground">
          <span className="font-semibold text-foreground mr-2">Trending:</span>
          {TRENDING_TAGS.map(tag => (
            <button 
              key={tag}
              type="button" 
              onClick={() => handleSearch(undefined, tag)} 
              className="px-3 py-1.5 rounded-full bg-muted hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer border"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
