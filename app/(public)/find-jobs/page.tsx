"use client";

import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Briefcase, Bookmark, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { searchService } from "@/lib/services/search.service";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

function FindJobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const selectedTypes = searchParams.get("type")?.split(',') || [];
  const selectedLevels = searchParams.get("level")?.split(',') || [];
  const selectedSalary = searchParams.get("salary") || "any";
  const selectedModes = searchParams.get("mode")?.split(',') || [];
  const totalPages = 42;

  const handleFilterChange = (key: string, value: string, checked: boolean) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const existing = current.get(key) ? current.get(key)!.split(',') : [];
    let updated;
    if (checked) {
      updated = [...existing, value];
    } else {
      updated = existing.filter(v => v !== value);
    }
    
    if (updated.length > 0) {
      current.set(key, updated.join(','));
    } else {
      current.delete(key);
    }
    
    current.set("page", "1");
    const search = current.toString();
    router.push(`${pathname}${search ? `?${search}` : ""}`, { scroll: false });
  };

  const handleSelectFilter = (key: string, value: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value && value !== 'any') {
      current.set(key, value);
    } else {
      current.delete(key);
    }
    current.set("page", "1");
    const search = current.toString();
    router.push(`${pathname}${search ? `?${search}` : ""}`, { scroll: false });
  };


  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", newPage.toString());
    const search = current.toString();
    const newQuery = search ? `?${search}` : "";
    router.push(`${pathname}${newQuery}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getVisiblePages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (page >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['find-jobs', query, page],
    queryFn: async () => {
      const results = await searchService.searchJobs(query, "");
      const limit = 6;
      const offset = (page - 1) * limit;
      return results.slice(offset, offset + limit);
    }
  });

  const jobListings = jobsData || [];

  return (
    <PageContainer>
      <div className="flex flex-col gap-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Find Your Next Role</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse thousands of job openings from top companies and find the perfect match for your career aspirations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Job title, keywords, or company" className="pl-10 h-12 text-base" />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="City, state, or 'Remote'" className="pl-10 h-12 text-base" />
          </div>
          <Button size="lg" className="h-12 px-8">
            Search Jobs
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </h2>
              <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">
                Clear all
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Job Type</h3>
              <div className="space-y-2.5">
                {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`type-${type}`} 
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={(c) => handleFilterChange("type", type, !!c)}
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Experience Level</h3>
              <div className="space-y-2.5">
                {["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`level-${level}`} 
                      checked={selectedLevels.includes(level)}
                      onCheckedChange={(c) => handleFilterChange("level", level, !!c)}
                    />
                    <label
                      htmlFor={`level-${level}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Salary Range</h3>
              <Select value={selectedSalary} onValueChange={(v) => handleSelectFilter("salary", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Salary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Salary</SelectItem>
                  <SelectItem value="50k">$50k+</SelectItem>
                  <SelectItem value="100k">$100k+</SelectItem>
                  <SelectItem value="150k">$150k+</SelectItem>
                  <SelectItem value="200k">$200k+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
             <div className="space-y-4">
              <h3 className="font-medium">Work Mode</h3>
              <div className="space-y-2.5">
                {["Remote", "On-site", "Hybrid"].map((mode) => (
                  <div key={mode} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`mode-${mode}`} 
                      checked={selectedModes.includes(mode)}
                      onCheckedChange={(c) => handleFilterChange("mode", mode, !!c)}
                    />
                    <label
                      htmlFor={`mode-${mode}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {mode}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Job Results */}
          <main className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">1,245</span> jobs matching your criteria
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select defaultValue="relevant">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort jobs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevant">Most Relevant</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="salary-high">Highest Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <Skeleton key={`sk-${i}`} className="h-48 w-full rounded-xl" />
                ))
              ) : jobListings.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/jobs/${job.id}`} className="hover:underline">
                           <CardTitle className="text-xl">{job.title}</CardTitle>
                        </Link>
                        {job.posted === "2 days ago" && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            New
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-4 text-base flex-wrap">
                        <Link href={`/company/${job.employerId}`} className="font-medium text-foreground hover:underline">
                          {job.employer?.companyName || "Unknown Company"}
                        </Link>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {job.location || "Remote"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" /> {job.type || "Full-time"}
                        </span>
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className={job.saved ? "text-primary" : "text-muted-foreground"}>
                      <Bookmark className="h-5 w-5" fill={job.saved ? "currentColor" : "none"} />
                    </Button>
                  </CardHeader>
                  <CardContent>
                     <div className="flex gap-2 flex-wrap mb-4">
                        {(job.requiredSkills || []).map((skill: any) => (
                          <Badge key={skill.skillId || skill} variant="outline" className="font-normal text-muted-foreground">
                            {skill.skill?.name || skill}
                          </Badge>
                        ))}
                     </div>
                     <p className="text-sm text-muted-foreground">
                       Salary: <span className="font-medium text-foreground">{job.salaryRange || "Not specified"}</span> • Posted {new Date(job.createdAt).toLocaleDateString()}
                     </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex gap-3 w-full sm:w-auto mt-2">
                      <Button>
                         <Link href={`/jobs/${job.id}`}>View Details</Link>
                      </Button>
                      <Button variant="outline">Quick Apply</Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t pt-6 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2 hidden sm:flex">
                  {getVisiblePages().map((p, idx) => (
                    p === "..." ? (
                      <span key={`dots-${idx}`} className="px-2 text-muted-foreground">...</span>
                    ) : (
                      <Button 
                        key={`p-${p}`}
                        variant={page === p ? "default" : "ghost"} 
                        size="sm" 
                        className={page === p ? "h-8 w-8 p-0 bg-primary/10 text-primary border-primary/20" : "h-8 w-8 p-0"}
                        onClick={() => handlePageChange(p as number)}
                        disabled={isLoading}
                      >
                        {p}
                      </Button>
                    )
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || isLoading}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </PageContainer>
  );
}

export default function FindJobsPage() {
  return (
    <Suspense fallback={<PageContainer><div>Loading jobs...</div></PageContainer>}>
      <FindJobsContent />
    </Suspense>
  );
}
