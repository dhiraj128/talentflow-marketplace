"use client";


import { useRouter } from "next/navigation";
import { SearchType } from "@/lib/services/search.service";
import { SearchTabs } from "./SearchTabs";
import { SearchBox } from "./SearchBox";
import { SearchFilters } from "./SearchFilters";
import { PopularSearches } from "./PopularSearches";
import { TrendingSkills } from "./TrendingSkills";

import React, { useState, useCallback } from "react";
export const UniversalSearch = React.memo(function UniversalSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchType>('talent');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearch = useCallback((query: string, location?: string) => {
    const params = new URLSearchParams({
      ...(query && { q: query }),
      ...(location && { location }),
    });
    
    const route = `/find-${activeTab}`;
    router.push(`${route}?${params.toString()}`);
  }, [activeTab, router]);

  const handleQuickSelect = useCallback((term: string) => {
    handleSearch(term);
  }, [handleSearch]);

  const toggleFilters = useCallback(() => setIsFiltersOpen(prev => !prev), []);
  const closeFilters = useCallback(() => setIsFiltersOpen(false), []);

  return (
    <div className="w-full max-w-4xl mx-auto relative z-40">
      <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <SearchBox 
        type={activeTab} 
        onSearch={handleSearch}
        onToggleFilters={toggleFilters}
      />
      
      <SearchFilters 
        type={activeTab} 
        isOpen={isFiltersOpen} 
        onClose={closeFilters} 
      />

      <div className="flex flex-col items-center mt-6 gap-2">
        <PopularSearches type={activeTab} onSelect={handleQuickSelect} />
        <TrendingSkills type={activeTab} onSelect={handleQuickSelect} />
      </div>
    </div>
  );
});
