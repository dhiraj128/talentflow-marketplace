"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { MapPin, Briefcase, Bookmark, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AdvancedSearchBox } from "@/features/search/AdvancedSearchBox";
import { DesktopFilterSidebar, FilterGroup } from "@/features/search/DesktopFilterSidebar";
import { MobileFilterDrawer } from "@/features/search/MobileFilterDrawer";
import { ActiveFilterChips } from "@/features/search/ActiveFilterChips";
import { EmptySearchState } from "@/components/shared/EmptySearchState";

import { jobService } from "@/lib/services/job.service";
import { motion } from "framer-motion";

const JOB_FILTERS: FilterGroup[] = [
  {
    id: "type",
    label: "Job Type",
    type: "checkbox",
    options: [
      { label: "Full-time", value: "Full-time" },
      { label: "Part-time", value: "Part-time" },
      { label: "Contract", value: "Contract" },
      { label: "Freelance", value: "Freelance" },
      { label: "Internship", value: "Internship" }
    ]
  },
  {
    id: "level",
    label: "Experience Level",
    type: "checkbox",
    options: [
      { label: "Entry Level", value: "Entry Level" },
      { label: "Mid Level", value: "Mid Level" },
      { label: "Senior Level", value: "Senior Level" },
      { label: "Director", value: "Director" },
      { label: "Executive", value: "Executive" }
    ]
  },
  {
    id: "mode",
    label: "Work Mode",
    type: "checkbox",
    options: [
      { label: "Remote", value: "Remote" },
      { label: "On-site", value: "On-site" },
      { label: "Hybrid", value: "Hybrid" }
    ]
  },
  {
    id: "salary",
    label: "Salary Range",
    type: "select",
    options: [
      { label: "$50k+", value: "50k" },
      { label: "$100k+", value: "100k" },
      { label: "$150k+", value: "150k" },
      { label: "$200k+", value: "200k" }
    ]
  }
];

function FindJobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  
  // Parse filters from URL
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  
  useEffect(() => {
    const currentFilters: Record<string, any> = {};
    JOB_FILTERS.forEach(f => {
      const val = searchParams.get(f.id);
      if (val) {
        currentFilters[f.id] = f.type === "checkbox" ? val.split(",") : val;
      }
    });
    setSelectedFilters(currentFilters);
  }, [searchParams]);

  const updateFiltersInUrl = (filters: Record<string, any>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    JOB_FILTERS.forEach(f => {
      if (filters[f.id] && (!Array.isArray(filters[f.id]) || filters[f.id].length > 0) && filters[f.id] !== "any") {
        current.set(f.id, Array.isArray(filters[f.id]) ? filters[f.id].join(",") : filters[f.id]);
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

  const { data: jobsResponse, isLoading, isError } = useQuery({
    queryKey: ['find-jobs', query, location, page, selectedFilters],
    queryFn: async () => {
      // existing api expects type as string
      const typeStr = Array.isArray(selectedFilters.type) ? selectedFilters.type.join(",") : "";
      
      return await jobService.getJobs({
        q: query,
        location,
        type: typeStr,
        page,
        limit: 10
      });
    }
  });

  const jobListings = jobsResponse?.data || [];
  const totalJobs = jobsResponse?.total || 0;
  const totalPages = jobsResponse?.totalPages || 1;

  const activeFilterCount = Object.keys(selectedFilters).reduce((acc, key) => {
    const val = selectedFilters[key];
    if (Array.isArray(val)) return acc + val.length;
    if (val && val !== "any") return acc + 1;
    return acc;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AdvancedSearchBox />
      
      <PageContainer className="flex-1 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Find Your Next Role</h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Browse thousands of job openings from top companies and find the perfect match for your career aspirations.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start relative">
          
          <DesktopFilterSidebar 
            filters={JOB_FILTERS}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAllFilters}
          />

          <main className="flex-1 w-full flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <MobileFilterDrawer 
                  filters={JOB_FILTERS}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAllFilters}
                  activeFilterCount={activeFilterCount}
                />
                <p className="text-muted-foreground text-sm font-medium hidden sm:block">
                  Showing <span className="font-bold text-foreground">{isLoading ? "..." : totalJobs}</span> jobs
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto self-end sm:self-auto">
                <span className="text-sm text-muted-foreground hidden sm:block">Sort by:</span>
                <Select defaultValue="relevant">
                  <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-xl bg-card">
                    <SelectValue placeholder="Sort jobs" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="relevant">Most Relevant</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="salary-high">Highest Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ActiveFilterChips 
              filters={JOB_FILTERS}
              selectedFilters={selectedFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />

            <div className="flex flex-col gap-4">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <Skeleton key={`sk-${i}`} className="h-56 w-full rounded-2xl" />
                ))
              ) : jobListings.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <EmptySearchState 
                    onClearFilters={activeFilterCount > 0 ? handleClearAllFilters : undefined}
                    onBrowseAll={() => {
                      handleClearAllFilters();
                      router.push(pathname);
                    }}
                  />
                </motion.div>
              ) : (
                jobListings.map((job: any, index: number) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden border-border group bg-card">
                      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-muted border flex items-center justify-center shrink-0 overflow-hidden">
                             {job.employer?.logoUrl ? (
                               <img src={job.employer.logoUrl} alt="logo" className="w-full h-full object-cover" />
                             ) : (
                               <span className="font-bold text-muted-foreground text-xl">{(job.employer?.companyName || "C").charAt(0)}</span>
                             )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link href={`/jobs/${job.id}`} className="hover:text-primary transition-colors">
                                <CardTitle className="text-xl font-bold leading-tight">{job.title}</CardTitle>
                              </Link>
                              {job.posted === "2 days ago" && (
                                <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none rounded-full px-2 py-0.5 text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="flex items-center gap-x-4 gap-y-2 text-sm flex-wrap mt-1">
                              <Link href={`/company/${job.employerId}`} className="font-semibold text-foreground hover:underline">
                                {job.employer?.companyName || "Unknown Company"}
                              </Link>
                              <span className="flex items-center gap-1.5 text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" /> {job.location || "Remote"}
                              </span>
                              <span className="flex items-center gap-1.5 text-muted-foreground">
                                <Briefcase className="h-3.5 w-3.5" /> {job.type || "Full-time"}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className={job.saved ? "text-primary bg-primary/10 rounded-full" : "text-muted-foreground hover:text-primary rounded-full hover:bg-primary/10 transition-colors"}>
                          <Bookmark className="h-5 w-5" fill={job.saved ? "currentColor" : "none"} />
                        </Button>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="flex gap-2 flex-wrap mb-4">
                            {(job.requiredSkills || []).slice(0, 4).map((skill: any) => (
                              <Badge key={skill.skillId || skill} variant="secondary" className="font-medium bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-md">
                                {skill.skill?.name || skill}
                              </Badge>
                            ))}
                            {(job.requiredSkills?.length > 4) && (
                              <Badge variant="outline" className="font-medium text-muted-foreground rounded-md">+{job.requiredSkills.length - 4}</Badge>
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-4 bg-muted/50 p-3 rounded-xl border border-muted">
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Salary</span>
                              <span className="font-bold text-foreground">{job.salaryRange || "Competitive"}</span>
                            </div>
                            <div className="flex flex-col hidden sm:flex">
                              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Posted</span>
                              <span className="font-bold text-foreground">{new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          {job.matchScore && (
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-emerald-500" />
                              <span className="font-bold text-emerald-600">{job.matchScore}% Match</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 pb-5">
                        <div className="flex gap-3 w-full sm:w-auto ml-auto">
                          <Button variant="outline" className="rounded-xl h-11 px-6 font-semibold hidden sm:flex" asChild>
                            <Link href={`/jobs/${job.id}`}>View Details</Link>
                          </Button>
                          <Button className="w-full sm:w-auto rounded-xl h-11 px-8 font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-transform active:scale-95">
                            Quick Apply
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
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

export default function FindJobsPage() {
  return (
    <Suspense fallback={<PageContainer><div className="flex items-center justify-center h-[50vh]"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div></PageContainer>}>
      <FindJobsContent />
    </Suspense>
  );
}
