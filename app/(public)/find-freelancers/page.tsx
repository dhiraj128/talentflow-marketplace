"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
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
import Link from "next/link";
import { freelancerService } from "@/lib/services/freelancer.service";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

function FreelancerSearchContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = 42;

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

  const { data: candidatesData, isLoading } = useQuery({
    queryKey: ['find-freelancers', query, page],
    queryFn: async () => {
      const results = await freelancerService.getMarketplace({ 
        location: searchParams.get('location') || undefined,
        rateMin: searchParams.get('rateMin') || undefined,
        rateMax: searchParams.get('rateMax') || undefined,
        skills: searchParams.get('skills') || undefined
      });
      // The API returns an array of freelancer profiles, we could do client-side pagination or server-side.
      // For now, doing simple client-side pagination for demo.
      const limit = 6;
      const offset = (page - 1) * limit;
      return results.slice(offset, offset + limit);
    }
  });

  const candidates = candidatesData || [];

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

          {/* Experience Range */}
          <div className="space-y-3">
            <Label className="text-base font-bold">Experience (Years)</Label>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="Min" className="bg-muted" />
              <Input type="number" placeholder="Max" className="bg-muted" />
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

          {/* Salary Range */}
          <div className="space-y-3">
            <Label className="text-base font-bold">Expected Salary (USD)</Label>
            <Slider defaultValue={[50]} max={250} step={1} className="py-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$50k</span>
              <span>$250k+</span>
            </div>
          </div>

          {/* Training Certificates */}
          <div className="space-y-3">
            <Label className="text-base font-bold">Certificates</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="cert1" />
                <Label htmlFor="cert1" className="font-normal text-muted-foreground">Google UX Professional</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="cert2" defaultChecked />
                <Label htmlFor="cert2" className="font-normal text-muted-foreground">AWS Certified Architect</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="cert3" />
                <Label htmlFor="cert3" className="font-normal text-muted-foreground">Scrum Master (CSM)</Label>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <Label className="text-base font-bold">Availability</Label>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start bg-primary/10 border-primary text-primary font-semibold">Immediate</Button>
              <Button variant="outline" className="w-full justify-start bg-muted text-muted-foreground">Within 2 weeks</Button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 space-y-6">
          {/* Content Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Elite Freelancers</h1>
              <p className="text-muted-foreground mt-1">Showing 1,248 verified professionals</p>
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

          {/* Candidate Grid / List */}
          <div className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "flex flex-col gap-4"
          )}>
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Skeleton key={`sk-${i}`} className={cn("rounded-xl", viewMode === "grid" ? "h-[300px]" : "h-32")} />
              ))
            ) : candidates.map((candidate: any) => (
              <Card key={candidate.id} className={cn("overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg border-border", viewMode === "list" ? "flex flex-row items-center gap-6 p-6" : "flex flex-col p-6 h-full")}>
                <div className={cn("flex items-start justify-between", viewMode === "grid" ? "mb-4" : "")}>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted border flex items-center justify-center">
                       <span className="text-xl font-bold text-muted-foreground">{candidate.fullName?.charAt(0) || '?'}</span>
                    </div>
                    {candidate.availability === 'immediate' && (
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
                    <h3 className="text-xl font-bold text-foreground truncate">{candidate.fullName}</h3>
                    {viewMode === "list" && (
                      <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg shrink-0">
                        <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
                        <span className="text-sm font-semibold text-foreground">{candidate.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-primary font-semibold">{candidate.title || 'Freelancer'}</p>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{candidate.location || 'Remote'}</span>
                  </div>
                </div>
                
                <div className={cn("flex flex-wrap gap-2", viewMode === "grid" ? "mb-4 flex-grow" : "flex-1")}>
                  <Badge variant="outline" className="text-muted-foreground bg-muted/50 rounded">${candidate.hourlyRate}/hr</Badge>
                  {candidate.skills?.map((s: any, idx: number) => (
                    <Badge key={idx} variant="secondary" className={idx % 2 === 0 ? "bg-secondary/20 text-secondary hover:bg-secondary/20" : "bg-primary/10 text-primary hover:bg-primary/10"}>
                      {s.skill?.name}
                    </Badge>
                  ))}
                </div>
                
                <div className={cn("border-t pt-4 mt-auto flex gap-3", viewMode === "grid" ? "flex-col" : "items-center pl-6 border-t-0 border-l")}>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
                    <Verified className="h-4 w-4 text-secondary shrink-0" />
                    <span className="truncate">{candidate.reviewCount} Reviews</span>
                  </div>
                  <div className={cn("gap-2", viewMode === "grid" ? "grid grid-cols-2 w-full mt-2" : "flex")}>
                    <Link href={`/find-freelancers/${candidate.id}`} className="w-full">
                      <Button variant="outline" className="w-full">View Profile</Button>
                    </Link>
                    <Link href={`/find-freelancers/${candidate.id}?action=hire`} className="w-full">
                      <Button className="w-full bg-secondary hover:bg-secondary/90">Hire / Request</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button 
                variant="outline" 
                size="icon" 
                className="w-10 h-10" 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {getVisiblePages().map((p, idx) => (
                p === "..." ? (
                  <span key={`dots-${idx}`} className="px-2 text-muted-foreground">...</span>
                ) : (
                  <Button 
                    key={`p-${p}`} 
                    variant={page === p ? "default" : "outline"} 
                    className="w-10 h-10"
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
                className="w-10 h-10" 
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

export default function FreelancerSearchPage() {
  return (
    <Suspense fallback={<PageContainer><div>Loading search...</div></PageContainer>}>
      <FreelancerSearchContent />
    </Suspense>
  );
}
