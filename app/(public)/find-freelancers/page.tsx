"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { MapPin, Star, Verified, ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";

import { PageContainer } from "@/components/shared/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdvancedSearchBox } from "@/features/search/AdvancedSearchBox";
import { DesktopFilterSidebar, FilterGroup } from "@/features/search/DesktopFilterSidebar";
import { MobileFilterDrawer } from "@/features/search/MobileFilterDrawer";
import { ActiveFilterChips } from "@/features/search/ActiveFilterChips";
import { EmptySearchState } from "@/components/shared/EmptySearchState";

import { freelancerService } from "@/lib/services/freelancer.service";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const FREELANCER_FILTERS: FilterGroup[] = [
  {
    id: "availability",
    label: "Availability",
    type: "checkbox",
    options: [
      { label: "Immediate", value: "immediate" },
      { label: "Within 2 weeks", value: "2_weeks" },
      { label: "Within 1 month", value: "1_month" }
    ]
  },
  {
    id: "experience",
    label: "Experience Level",
    type: "checkbox",
    options: [
      { label: "Junior (1-3 yrs)", value: "junior" },
      { label: "Mid-Level (3-5 yrs)", value: "mid" },
      { label: "Senior (5+ yrs)", value: "senior" },
      { label: "Expert (10+ yrs)", value: "expert" }
    ]
  },
  {
    id: "rateMax",
    label: "Max Hourly Rate (USD)",
    type: "slider",
    min: 10,
    max: 250,
    step: 5,
    formatValue: (val) => `$${val}/hr`
  },
  {
    id: "certifications",
    label: "Certifications",
    type: "checkbox",
    options: [
      { label: "AWS Certified", value: "aws" },
      { label: "Google UX Pro", value: "google_ux" },
      { label: "Scrum Master", value: "scrum" },
      { label: "PMP", value: "pmp" }
    ]
  }
];

function FindFreelancersContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    const currentFilters: Record<string, any> = {};
    FREELANCER_FILTERS.forEach(f => {
      const val = searchParams.get(f.id);
      if (val) {
        currentFilters[f.id] = f.type === "checkbox" ? val.split(",") : (f.type === "slider" ? parseInt(val, 10) : val);
      }
    });
    setSelectedFilters(currentFilters);
  }, [searchParams]);

  const updateFiltersInUrl = (filters: Record<string, any>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    FREELANCER_FILTERS.forEach(f => {
      if (filters[f.id] && (!Array.isArray(filters[f.id]) || filters[f.id].length > 0) && filters[f.id] !== "any") {
        current.set(f.id, Array.isArray(filters[f.id]) ? filters[f.id].join(",") : filters[f.id].toString());
      } else {
        current.delete(f.id);
      }
    });
    
    current.set("page", "1");
    const search = current.toString();
    router.push(`${pathname}${search ? `?${search}` : ""}`, { scroll: false });
  };

  const handleFilterChange = (id: string, value: any) => {
    const newFilters = { ...selectedFilters, [id]: value };
    setSelectedFilters(newFilters);
    updateFiltersInUrl(newFilters);
  };

  const handleRemoveFilter = (id: string, value: any) => {
    const current = selectedFilters[id];
    let newFilters = { ...selectedFilters };
    
    if (Array.isArray(current)) {
      newFilters[id] = current.filter(v => v !== value);
      if (newFilters[id].length === 0) delete newFilters[id];
    } else {
      delete newFilters[id];
    }
    
    setSelectedFilters(newFilters);
    updateFiltersInUrl(newFilters);
  };

  const handleClearAllFilters = () => {
    setSelectedFilters({});
    updateFiltersInUrl({});
  };

  const handlePageChange = (newPage: number) => {
    const totalPages = 42; // MOCK
    if (newPage < 1 || newPage > totalPages) return;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", newPage.toString());
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getVisiblePages = (total: number) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "...", total];
    if (page >= total - 2) return [1, "...", total - 3, total - 2, total - 1, total];
    return [1, "...", page - 1, page, page + 1, "...", total];
  };

  const { data: candidatesData, isLoading } = useQuery({
    queryKey: ['find-freelancers', query, location, page, selectedFilters],
    queryFn: async () => {
      const results = await freelancerService.getMarketplace({ 
        location: location || undefined,
        rateMin: undefined,
        rateMax: selectedFilters.rateMax ? selectedFilters.rateMax.toString() : undefined,
        skills: query || undefined // Passing q as skills to api for filtering in demo
      });
      // Client-side pagination mock
      const limit = 6;
      const offset = (page - 1) * limit;
      return results.slice(offset, offset + limit);
    }
  });

  const candidates = candidatesData || [];
  const totalPages = 42; // Fixed mock for UI display
  
  const activeFilterCount = Object.keys(selectedFilters).reduce((acc, key) => {
    const val = selectedFilters[key];
    if (Array.isArray(val)) return acc + val.length;
    if (val && val !== "any" && val !== 0) return acc + 1;
    return acc;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AdvancedSearchBox />
      
      <PageContainer className="flex-1 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Elite Freelancers</h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Hire the top 1% of independent talent on TalentFlow. Secure escrow payments and guaranteed quality.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start relative">
          
          <DesktopFilterSidebar 
            filters={FREELANCER_FILTERS}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAllFilters}
          />

          <main className="flex-1 w-full flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <MobileFilterDrawer 
                  filters={FREELANCER_FILTERS}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAllFilters}
                  activeFilterCount={activeFilterCount}
                />
                <p className="text-muted-foreground text-sm font-medium hidden sm:block">
                  Showing top verified professionals
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:block">Sort by:</span>
                  <Select defaultValue="rating">
                    <SelectTrigger className="w-[140px] h-10 rounded-xl bg-card">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="rating">Top Rated</SelectItem>
                      <SelectItem value="recent">Recently Active</SelectItem>
                      <SelectItem value="rate-low">Lowest Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* View Toggles */}
                <div className="flex items-center bg-card p-1 rounded-xl border">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-8 w-8 rounded-lg", viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary")}
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-8 w-8 rounded-lg", viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary")}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <ActiveFilterChips 
              filters={FREELANCER_FILTERS}
              selectedFilters={selectedFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />

            <div className={cn(
              viewMode === "grid" 
                ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
                : "flex flex-col gap-4"
            )}>
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <Skeleton key={`sk-${i}`} className={cn("rounded-2xl w-full", viewMode === "grid" ? "h-80" : "h-36")} />
                ))
              ) : candidates.length === 0 ? (
                 <div className="col-span-full">
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <EmptySearchState 
                      title="No freelancers found"
                      description="Try reducing your max hourly rate filter or searching for a different skill."
                      onClearFilters={activeFilterCount > 0 ? handleClearAllFilters : undefined}
                      onBrowseAll={() => {
                        handleClearAllFilters();
                        router.push(pathname);
                      }}
                    />
                   </motion.div>
                 </div>
              ) : (
                candidates.map((candidate: any, index: number) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="h-full flex"
                  >
                    <Card className={cn(
                      "overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border bg-card w-full rounded-2xl", 
                      viewMode === "list" ? "flex flex-col sm:flex-row items-start sm:items-center p-6 gap-6" : "flex flex-col p-6 h-full"
                    )}>
                      <div className={cn("flex items-start justify-between w-full sm:w-auto", viewMode === "grid" ? "mb-4" : "")}>
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-primary/10 border-primary/20 border flex items-center justify-center">
                            <span className="text-xl font-bold text-primary">{candidate.fullName?.charAt(0) || '?'}</span>
                          </div>
                          {candidate.availability === 'immediate' && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-background rounded-full" title="Available Now"></div>
                          )}
                        </div>
                        {viewMode === "grid" && (
                          <div className="flex items-center gap-1 bg-orange-500/10 px-2.5 py-1 rounded-lg">
                            <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                            <span className="text-sm font-bold text-orange-700 dark:text-orange-400">{candidate.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className={cn("space-y-1", viewMode === "grid" ? "mb-4" : "flex-1 w-full")}>
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-foreground truncate">{candidate.fullName}</h3>
                          {viewMode === "list" && (
                            <div className="flex items-center gap-1 bg-orange-500/10 px-2.5 py-1 rounded-lg shrink-0">
                              <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                              <span className="text-sm font-bold text-orange-700 dark:text-orange-400">{candidate.rating}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-primary font-semibold">{candidate.title || 'Professional Freelancer'}</p>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mt-1.5 font-medium">
                          <MapPin className="h-3 w-3" />
                          <span>{candidate.location || 'Remote'}</span>
                        </div>
                      </div>
                      
                      <div className={cn("flex flex-wrap gap-2", viewMode === "grid" ? "mb-5 flex-grow" : "flex-1 w-full")}>
                        <Badge variant="outline" className="text-muted-foreground bg-muted/50 rounded-md font-semibold border-border px-2">
                          ${candidate.hourlyRate}/hr
                        </Badge>
                        {(candidate.skills || []).slice(0, 3).map((s: any, idx: number) => (
                          <Badge key={idx} variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-md font-medium">
                            {s.skill?.name || s}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className={cn("border-t pt-5 mt-auto flex gap-3", viewMode === "grid" ? "flex-col border-border/50" : "items-center sm:pl-6 border-t sm:border-t-0 sm:border-l border-border/50 w-full sm:w-auto mt-4 sm:mt-0")}>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground w-full font-medium">
                          <Verified className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span className="truncate">{candidate.reviewCount} Verified Reviews</span>
                        </div>
                        <div className={cn("gap-3", viewMode === "grid" ? "grid grid-cols-2 w-full mt-2" : "flex w-full")}>
                          <Link 
                            href={`/find-freelancers/${candidate.id}`} 
                            className="inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] md:min-h-0 md:h-8 px-2.5 w-full rounded-xl font-semibold border-primary/20 text-foreground hover:bg-primary/5 bg-background border-2"
                          >
                            View Profile
                          </Link>
                          <Link 
                            href={`/messages/new?to=${candidate.id}`} 
                            className="inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] md:min-h-0 md:h-8 px-2.5 w-full rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-transform active:scale-95"
                          >
                            Hire Now
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && candidates.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-8 pb-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-10 h-10 rounded-xl"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {getVisiblePages(totalPages).map((p, idx) => (
                  p === "..." ? (
                    <span key={`dots-${idx}`} className="px-2 text-muted-foreground font-bold">...</span>
                  ) : (
                    <Button 
                      key={`p-${p}`}
                      variant={page === p ? "default" : "outline"} 
                      size="sm" 
                      className={page === p ? "h-10 w-10 p-0 rounded-xl font-bold bg-primary text-primary-foreground" : "h-10 w-10 p-0 rounded-xl font-semibold"}
                      onClick={() => handlePageChange(p as number)}
                      disabled={isLoading}
                    >
                      {p}
                    </Button>
                  )
                ))}

                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-10 h-10 rounded-xl"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || isLoading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </PageContainer>
    </div>
  );
}

export default function FindFreelancersPage() {
  return (
    <Suspense fallback={<PageContainer><div className="flex items-center justify-center h-[50vh]"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div></PageContainer>}>
      <FindFreelancersContent />
    </Suspense>
  );
}
