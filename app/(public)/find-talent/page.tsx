"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { EmptySearchState } from "@/components/shared/EmptySearchState";
import { 
  MapPin, 
  Star, 
  Verified, 
  ChevronLeft, 
  ChevronRight,
  LayoutGrid,
  List,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { searchService } from "@/lib/services/search.service";
import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

function TalentSearchContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { data: rawCandidates, isLoading } = useQuery({
    queryKey: ['find-talent', query, page],
    queryFn: async () => {
      const results = await searchService.searchTalent(query, "");
      return Array.isArray(results) ? results : results?.data || [];
    }
  });

  const candidates = (rawCandidates || []).map((c: any) => ({
    id: c.id,
    name: c.fullName || c.title || "Candidate",
    role: c.title || "Professional",
    location: c.location || "Remote",
    rating: 5.0,
    experience: c.experience || "Entry Level",
    skills: (c.skills || []).map((s: any) => s.skill?.name || s),
    certification: c.education || "Verified Profile",
    availableNow: true
  }));

  const totalPages = Math.max(1, Math.ceil(candidates.length / 6));

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", newPage.toString());
    const search = current.toString();
    const newQuery = search ? `?${search}` : "";
    router.push(`${pathname}${newQuery}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Advanced Filter Sidebar */}
        <aside className="w-full md:w-72 shrink-0 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Filters</h2>
            <Button variant="link" className="text-primary p-0 h-auto font-medium">Clear all</Button>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <Label className="text-base font-bold">Skills</Label>
            <Input placeholder="Add skills..." className="bg-muted" />
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
                UI Design <X className="ml-1 h-3 w-3" />
              </Badge>
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
                React <X className="ml-1 h-3 w-3" />
              </Badge>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label className="text-base font-bold">Location</Label>
            <Select defaultValue="all">
              <SelectTrigger className="bg-muted">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="na">North America (Remote)</SelectItem>
                <SelectItem value="eu">Europe (Remote)</SelectItem>
                <SelectItem value="ap">Asia Pacific</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 space-y-6">
          {/* Content Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Elite Candidates</h1>
              <p className="text-muted-foreground mt-1">Showing {isLoading ? "..." : candidates.length} verified professionals</p>
            </div>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border self-start">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-8 w-8 rounded-lg", viewMode === "grid" ? "bg-background shadow-sm text-primary" : "text-muted-foreground")}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-8 w-8 rounded-lg", viewMode === "list" ? "bg-background shadow-sm text-primary" : "text-muted-foreground")}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={`sk-${i}`} className={cn("rounded-xl", viewMode === "grid" ? "h-[300px]" : "h-32")} />
              ))}
            </div>
          ) : candidates.length === 0 ? (
            <EmptySearchState />
          ) : (
            <div className={cn(
              viewMode === "grid" 
                ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
                : "flex flex-col gap-4"
            )}>
              {candidates.map((candidate: any) => (
                <Card key={candidate.id} className={cn("overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg border-border", viewMode === "list" ? "flex flex-row items-center gap-6 p-6" : "flex flex-col p-6 h-full")}>
                  <div className={cn("flex items-start justify-between", viewMode === "grid" ? "mb-4" : "")}>
                    <div className="relative">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted border flex items-center justify-center">
                         <span className="text-xl font-bold text-muted-foreground">{candidate.name.charAt(0)}</span>
                      </div>
                      {candidate.availableNow && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary border-2 border-background rounded-full" title="Available Now"></div>
                      )}
                    </div>
                    {viewMode === "grid" && (
                      <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg">
                        <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
                        <span className="text-sm font-semibold text-foreground">{candidate.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={cn("space-y-1", viewMode === "grid" ? "mb-4" : "flex-1")}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-foreground truncate">{candidate.name}</h3>
                    </div>
                    <p className="text-sm text-primary font-semibold">{candidate.role}</p>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{candidate.location}</span>
                    </div>
                  </div>
                  
                  <div className={cn("flex flex-wrap gap-2", viewMode === "grid" ? "mb-4 flex-grow" : "flex-1")}>
                    <Badge variant="outline" className="text-muted-foreground bg-muted/50 rounded">{candidate.experience}</Badge>
                    {candidate.skills.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="bg-secondary/20 text-secondary hover:bg-secondary/20">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className={cn("border-t pt-4 mt-auto flex gap-3", viewMode === "grid" ? "flex-col" : "items-center pl-6 border-t-0 border-l")}>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
                      <Verified className="h-4 w-4 text-secondary shrink-0" />
                      <span className="truncate">{candidate.certification}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-8 w-full max-w-full overflow-x-auto px-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button 
                  key={`p-${p}`} 
                  variant={page === p ? "default" : "outline"} 
                  className="w-9 h-9 sm:w-10 sm:h-10 text-xs sm:text-sm shrink-0 p-0"
                  onClick={() => handlePageChange(p)}
                  disabled={isLoading}
                >
                  {p}
                </Button>
              ))}

              <Button 
                variant="outline" 
                size="icon" 
                className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page === totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
}

export default function TalentSearchPage() {
  return (
    <Suspense fallback={<PageContainer><div>Loading search...</div></PageContainer>}>
      <TalentSearchContent />
    </Suspense>
  );
}
