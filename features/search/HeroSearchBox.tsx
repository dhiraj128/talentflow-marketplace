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
      <form onSubmit={handleSearch} className="bg-white dark:bg-gray-950 p-2 rounded-3xl md:rounded-full shadow-sm border border-gray-200 dark:border-gray-800 w-full flex flex-col md:flex-row gap-2 relative z-50 transition-all duration-300">
        
        {/* Category Dropdown */}
        <div className="flex-none w-full md:w-[18%] flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full h-14 justify-between rounded-2xl md:rounded-full px-5 lg:px-6 flex items-center shrink-0 border border-transparent bg-clip-padding transition-all outline-none select-none hover:bg-gray-50 dark:hover:bg-gray-900 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-base font-medium">
                <div className="flex items-center gap-3">
                  <activeCategory.icon className="h-5 w-5 text-blue-600 dark:text-blue-500 shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200 truncate">{activeCategory.label}</span>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400 ml-2 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full sm:w-56 p-2 rounded-xl">
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

        <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-800 self-center shrink-0"></div>

        {/* Keyword Input */}
        <div className="relative w-full md:w-[45%] flex items-center rounded-2xl md:rounded-full transition-all duration-200 focus-within:bg-blue-50 dark:focus-within:bg-blue-900/20 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900">
          <Search className="absolute left-5 lg:left-6 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title, skills, or company"
            className="pl-12 lg:pl-14 pr-4 lg:pr-6 border-0 shadow-none focus-visible:ring-0 text-base h-14 w-full bg-transparent truncate"
          />
        </div>

        <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-800 self-center shrink-0"></div>

        {/* Location Input */}
        <div className="relative w-full md:w-[25%] flex items-center rounded-2xl md:rounded-full transition-all duration-200 focus-within:bg-blue-50 dark:focus-within:bg-blue-900/20 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900">
          <MapPin className="absolute left-5 lg:left-6 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
          <Input 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, state, or remote" 
            className="pl-12 lg:pl-14 pr-4 lg:pr-6 border-0 shadow-none focus-visible:ring-0 text-base h-14 w-full bg-transparent truncate"
          />
        </div>

        {/* Search Button */}
        <div className="flex-none w-full md:flex-1 md:flex md:items-center">
          <Button 
            type="submit" 
            size="lg" 
            className="h-14 rounded-full text-base w-full md:max-w-[140px] md:ml-auto font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.2)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
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
