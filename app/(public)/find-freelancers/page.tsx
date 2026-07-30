"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/shared/PageContainer";
import { MarketplaceSearch } from "@/features/freelancer/marketplace/MarketplaceSearch";
import { MarketplaceFilters } from "@/features/freelancer/marketplace/MarketplaceFilters";
import { MarketplaceSort } from "@/features/freelancer/marketplace/MarketplaceSort";
import { CategoryTabs } from "@/features/freelancer/marketplace/CategoryTabs";
import { SearchResultsGrid } from "@/features/freelancer/marketplace/SearchResultsGrid";
import { FeaturedFreelancers } from "@/features/freelancer/marketplace/FeaturedFreelancers";
import { EmptyMarketplaceState } from "@/features/freelancer/marketplace/EmptyMarketplaceState";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { freelancerService } from "@/lib/services/freelancer.service";

const CATEGORIES = ["All", "Web Development", "Mobile Apps", "UI/UX Design", "Digital Marketing", "Writing"];

export default function FindFreelancersPage() {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
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

  const { data: rawFreelancers = [], isLoading } = useQuery({
    queryKey: ["publicFreelancersMarketplace"],
    queryFn: async () => {
      const data = await freelancerService.getMarketplace();
      return Array.isArray(data) ? data : data?.data || [];
    }
  });

  const freelancers = useMemo(() => {
    return (rawFreelancers || []).map((f: any) => ({
      id: f.id,
      name: f.fullName || f.title || "Freelancer",
      isVerified: !!f.isVerified,
      title: f.title || "Freelance Specialist",
      category: f.category || "Web Development",
      hourlyRate: f.hourlyRate || 0,
      rating: f.rating || 5.0,
      reviews: f.reviews?.length || 0,
      location: f.location || "Remote",
      completedProjects: f.completedProjects || 0,
      skills: (f.skills || []).map((s: any) => s.skill?.name || s.name || s),
      isAvailable: f.isAvailable !== false,
      avatarUrl: f.avatarUrl
    }));
  }, [rawFreelancers]);

  const featuredFreelancers = useMemo(() => {
    return freelancers.filter((f: any) => f.rating >= 4.9).slice(0, 4);
  }, [freelancers]);

  const filteredFreelancers = useMemo(() => {
    let result = freelancers;

    if (activeCategory !== "All") {
      result = result.filter((f: any) => f.category === activeCategory);
    }

    if (appliedSearchQuery) {
      const q = appliedSearchQuery.toLowerCase();
      result = result.filter((f: any) => 
        f.name.toLowerCase().includes(q) || 
        f.title.toLowerCase().includes(q) ||
        f.skills.some((s: string) => s.toLowerCase().includes(q))
      );
    }

    if (filters.verifiedOnly) {
      result = result.filter((f: any) => f.isVerified);
    }

    result = result.filter((f: any) => f.hourlyRate <= filters.hourlyRate[0]);

    if (filters.experienceLevel.length > 0) {
      result = result.filter((f: any) => {
        if (filters.experienceLevel.includes("Expert") && f.hourlyRate > 80) return true;
        if (filters.experienceLevel.includes("Intermediate") && f.hourlyRate > 30 && f.hourlyRate <= 80) return true;
        if (filters.experienceLevel.includes("Entry Level") && f.hourlyRate <= 30) return true;
        return false;
      });
    }

    // Sort
    if (sortValue === "rating") result.sort((a: any, b: any) => b.rating - a.rating);
    if (sortValue === "price_asc") result.sort((a: any, b: any) => a.hourlyRate - b.hourlyRate);
    if (sortValue === "price_desc") result.sort((a: any, b: any) => b.hourlyRate - a.hourlyRate);
    if (sortValue === "projects") result.sort((a: any, b: any) => b.completedProjects - a.completedProjects);
    
    return result;
  }, [freelancers, appliedSearchQuery, activeCategory, filters, sortValue]);

  const handleClearFilters = () => {
    setSearchInputValue("");
    setAppliedSearchQuery("");
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
    <div className="bg-background min-h-screen pb-20">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white pt-10 pb-8 px-6 rounded-b-[2rem] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="max-w-[960px] mx-auto text-center space-y-3 relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Hire the World's Best Talent</h1>
          <p className="text-sm md:text-base text-purple-200 max-w-2xl mx-auto">
            Connect with top-rated freelancers and independent professionals for your next project.
          </p>
          <div className="pt-2">
            <MarketplaceSearch 
              value={searchInputValue} 
              onChange={setSearchInputValue} 
              onSearch={() => setAppliedSearchQuery(searchInputValue)}
              onClear={() => {
                setSearchInputValue("");
                setAppliedSearchQuery("");
              }}
            />
          </div>
          <div className="pt-1 flex flex-wrap justify-center gap-2 text-xs md:text-sm text-purple-200 max-w-full overflow-hidden">
            <span className="opacity-70 mr-1 flex items-center">Popular:</span>
            {["React", "Next.js", "Node.js", "HTML", "CSS", "Python", "UI/UX", "AI", "DevOps"].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchInputValue(tag);
                  setAppliedSearchQuery(tag);
                }}
                className="hover:text-white hover:underline transition-colors focus:outline-none focus:text-white"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 -mt-8 relative z-20">
        
        {/* Category Tabs */}
        <div className="bg-card rounded-2xl shadow-sm p-2 mb-8 overflow-hidden w-full min-w-0 border border-border/50">
          <CategoryTabs categories={CATEGORIES} activeCategory={activeCategory} onSelect={setActiveCategory} />
        </div>

        {/* Featured Section */}
        {activeCategory === "All" && !appliedSearchQuery && featuredFreelancers.length > 0 && (
          <div className="mb-12">
            <FeaturedFreelancers freelancers={featuredFreelancers} />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Filters */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-card p-6 rounded-2xl shadow-sm border border-border/50 text-card-foreground">
              <MarketplaceFilters filters={filters} setFilters={setFilters} onClearAll={handleClearFilters} />
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 space-y-6 min-w-0">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {filteredFreelancers.length} {filteredFreelancers.length === 1 ? 'Result' : 'Results'}
              </h2>
              
              <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
                <MarketplaceSort value={sortValue} onChange={setSortValue} />
                
                {/* Mobile Filters Trigger */}
                <Sheet>
                  <SheetTrigger className="lg:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-input bg-card hover:bg-muted transition-colors text-foreground">
                    <Filter className="w-4 h-4" />
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:w-[400px] pt-12 overflow-y-auto bg-background text-foreground">
                    <MarketplaceFilters filters={filters} setFilters={setFilters} onClearAll={handleClearFilters} />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : filteredFreelancers.length > 0 ? (
              <SearchResultsGrid freelancers={filteredFreelancers} />
            ) : (
              <EmptyMarketplaceState onClearFilters={handleClearFilters} />
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
