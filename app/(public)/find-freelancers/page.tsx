"use client";

import React, { useState, useMemo } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { MarketplaceSearch } from "@/features/freelancer/marketplace/MarketplaceSearch";
import { MarketplaceFilters } from "@/features/freelancer/marketplace/MarketplaceFilters";
import { MarketplaceSort } from "@/features/freelancer/marketplace/MarketplaceSort";
import { CategoryTabs } from "@/features/freelancer/marketplace/CategoryTabs";
import { FreelancerGrid } from "@/features/freelancer/marketplace/FreelancerGrid";
import { FeaturedFreelancers } from "@/features/freelancer/marketplace/FeaturedFreelancers";
import { EmptyMarketplaceState } from "@/features/freelancer/marketplace/EmptyMarketplaceState";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

// Mock Data
import { MOCK_FREELANCERS } from "./mockData";

const CATEGORIES = ["All", "Web Development", "Mobile Apps", "UI/UX Design", "Digital Marketing", "Writing"];

export default function FindFreelancersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortValue, setSortValue] = useState("recommended");
  const [filters, setFilters] = useState({
    hourlyRate: [150],
    verifiedOnly: false,
    remoteOnly: false,
    experienceLevel: [] as string[],
    skills: [] as string[],
    languages: [] as string[],
    rating: 0
  });

  const featuredFreelancers = useMemo(() => {
    return MOCK_FREELANCERS.filter(f => f.rating >= 4.9).slice(0, 4);
  }, []);

  const filteredFreelancers = useMemo(() => {
    let result = MOCK_FREELANCERS;

    if (activeCategory !== "All") {
      result = result.filter(f => f.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(q) || 
        f.title.toLowerCase().includes(q) ||
        f.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (filters.verifiedOnly) {
      result = result.filter(f => f.isVerified);
    }

    result = result.filter(f => f.hourlyRate <= filters.hourlyRate[0]);

    if (filters.experienceLevel.length > 0) {
      // Mock simple matching
      result = result.filter(f => {
        if (filters.experienceLevel.includes("Expert") && f.hourlyRate > 80) return true;
        if (filters.experienceLevel.includes("Intermediate") && f.hourlyRate > 30 && f.hourlyRate <= 80) return true;
        if (filters.experienceLevel.includes("Entry Level") && f.hourlyRate <= 30) return true;
        return false;
      });
    }

    // Sort
    if (sortValue === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sortValue === "price_asc") result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    if (sortValue === "price_desc") result.sort((a, b) => b.hourlyRate - a.hourlyRate);
    if (sortValue === "projects") result.sort((a, b) => b.completedProjects - a.completedProjects);
    
    return result;
  }, [searchQuery, activeCategory, filters, sortValue]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setFilters({ 
      hourlyRate: [150], 
      verifiedOnly: false, 
      remoteOnly: false,
      experienceLevel: [],
      skills: [],
      languages: [],
      rating: 0
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white pt-16 pb-12 px-6 rounded-b-[2rem] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="max-w-[900px] mx-auto text-center space-y-4 relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Hire the World's Best Talent</h1>
          <p className="text-base md:text-lg text-purple-200 max-w-2xl mx-auto">
            Connect with top-rated freelancers and independent professionals for your next project.
          </p>
          <div className="pt-2">
            <MarketplaceSearch value={searchQuery} onChange={setSearchQuery} onSearch={() => {}} />
          </div>
          <div className="pt-3 flex flex-wrap justify-center gap-2 text-sm text-purple-200">
            <span className="opacity-70 mr-2 flex items-center">Popular:</span>
            {["React", "Next.js", "Node.js", "HTML", "CSS", "Python", "UI/UX", "AI", "DevOps"].map(tag => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="hover:text-white hover:underline transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 xl:px-10 -mt-8 relative z-20">
        
        {/* Category Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-2 mb-8">
          <CategoryTabs categories={CATEGORIES} activeCategory={activeCategory} onSelect={setActiveCategory} />
        </div>

        {/* Featured Section */}
        {activeCategory === "All" && !searchQuery && (
          <div className="mb-12">
            <FeaturedFreelancers freelancers={featuredFreelancers} />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Filters */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-border/50">
              <MarketplaceFilters filters={filters} setFilters={setFilters} />
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 space-y-6 min-w-0">
            
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {filteredFreelancers.length} {filteredFreelancers.length === 1 ? 'Result' : 'Results'}
              </h2>
              
              <div className="flex items-center gap-3">
                <MarketplaceSort value={sortValue} onChange={setSortValue} />
                
                {/* Mobile Filters Trigger */}
                <Sheet>
                  <SheetTrigger className="lg:hidden flex h-10 w-10 items-center justify-center rounded-md border border-input bg-white hover:bg-slate-50 transition-colors">
                    <Filter className="w-4 h-4" />
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:w-[400px] pt-12 overflow-y-auto bg-slate-50">
                    <MarketplaceFilters filters={filters} setFilters={setFilters} />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {filteredFreelancers.length > 0 ? (
              <FreelancerGrid freelancers={filteredFreelancers} />
            ) : (
              <EmptyMarketplaceState onClearFilters={handleClearFilters} />
            )}

            {/* Pagination Placeholder (As Requested) */}
            {filteredFreelancers.length > 0 && (
              <div className="pt-12 pb-8 flex items-center justify-center gap-2">
                <Button variant="outline" className="w-24 bg-white">Previous</Button>
                <Button variant="outline" className="w-10 bg-purple-600 text-white hover:bg-purple-700 hover:text-white">1</Button>
                <Button variant="outline" className="w-10 bg-white">2</Button>
                <Button variant="outline" className="w-10 bg-white">3</Button>
                <span className="px-2 text-muted-foreground">...</span>
                <Button variant="outline" className="w-24 bg-white">Next</Button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
