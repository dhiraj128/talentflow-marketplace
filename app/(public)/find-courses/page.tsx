"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { 
  Code, BrainCircuit, Cloud, TrendingUp, Landmark, Palette, Star, 
  ChevronLeft, ChevronRight, Play, BookOpen
} from "lucide-react";

import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdvancedSearchBox } from "@/features/search/AdvancedSearchBox";
import { DesktopFilterSidebar, FilterGroup } from "@/features/search/DesktopFilterSidebar";
import { MobileFilterDrawer } from "@/features/search/MobileFilterDrawer";
import { ActiveFilterChips } from "@/features/search/ActiveFilterChips";
import { EmptySearchState } from "@/components/shared/EmptySearchState";

import { searchService } from "@/lib/services/search.service";
import { useAuth } from "@/lib/auth-context";
import { courseService } from "@/lib/services/course.service";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const COURSE_FILTERS: FilterGroup[] = [
  {
    id: "category",
    label: "Category",
    type: "checkbox",
    options: [
      { label: "Programming", value: "Programming" },
      { label: "AI & ML", value: "AI & ML" },
      { label: "Cloud", value: "Cloud" },
      { label: "Marketing", value: "Marketing" },
      { label: "Finance", value: "Finance" },
      { label: "Design", value: "Design" }
    ]
  },
  {
    id: "level",
    label: "Level",
    type: "checkbox",
    options: [
      { label: "Beginner", value: "Beginner" },
      { label: "Intermediate", value: "Intermediate" },
      { label: "Advanced", value: "Advanced" }
    ]
  },
  {
    id: "price",
    label: "Price Type",
    type: "checkbox",
    options: [
      { label: "Free", value: "free" },
      { label: "Paid", value: "paid" }
    ]
  },
  {
    id: "duration",
    label: "Max Duration (Hours)",
    type: "slider",
    min: 1,
    max: 100,
    step: 1,
    formatValue: (val) => `${val}h`
  }
];

function FindCoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    const currentFilters: Record<string, any> = {};
    COURSE_FILTERS.forEach(f => {
      const val = searchParams.get(f.id);
      if (val) {
        currentFilters[f.id] = f.type === "checkbox" ? val.split(",") : (f.type === "slider" ? parseInt(val, 10) : val);
      }
    });
    setSelectedFilters(currentFilters);
  }, [searchParams]);

  const updateFiltersInUrl = (filters: Record<string, any>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    COURSE_FILTERS.forEach(f => {
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
    const totalPages = 42;
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

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['find-courses', query, page, selectedFilters],
    queryFn: async () => {
      // Mock filter application since API doesn't fully support all filters yet
      // Passing categories as filters where possible
      const categoryFilter = Array.isArray(selectedFilters.category) ? selectedFilters.category[0] : "";
      
      const results = await searchService.searchCourses(query, categoryFilter || "");
      
      const limit = 9;
      const offset = (page - 1) * limit;
      return results.slice(offset, offset + limit);
    }
  });

  const courses = coursesData || [];
  const totalPages = 42; 

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
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Master High-Demand Tech Skills</h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Access exclusive training modules curated by industry giants. From AI ethics to advanced cloud architecture.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start relative">
          
          <DesktopFilterSidebar 
            filters={COURSE_FILTERS}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAllFilters}
          />

          <main className="flex-1 w-full flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <MobileFilterDrawer 
                  filters={COURSE_FILTERS}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAllFilters}
                  activeFilterCount={activeFilterCount}
                />
                <p className="text-muted-foreground text-sm font-medium hidden sm:block">
                  Showing premium courses
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto self-end sm:self-auto">
                <span className="text-sm text-muted-foreground hidden sm:block">Sort by:</span>
                <Select defaultValue="popular">
                  <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-xl bg-card">
                    <SelectValue placeholder="Sort courses" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ActiveFilterChips 
              filters={COURSE_FILTERS}
              selectedFilters={selectedFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <Skeleton key={`sk-${i}`} className="h-[420px] w-full rounded-2xl" />
                ))
              ) : courses.length === 0 ? (
                <div className="col-span-full">
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <EmptySearchState 
                      title="No courses found"
                      description="We couldn't find any courses matching your criteria. Try adjusting your filters or searching for a different topic."
                      onClearFilters={activeFilterCount > 0 ? handleClearAllFilters : undefined}
                      onBrowseAll={() => {
                        handleClearAllFilters();
                        router.push(pathname);
                      }}
                    />
                   </motion.div>
                </div>
              ) : (
                courses.map((course: any, index: number) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="h-full"
                  >
                    <Card className="group overflow-hidden rounded-2xl border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full bg-card">
                      <div className="relative h-48 w-full bg-muted overflow-hidden flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-gradient-to-tr from-background/80 to-transparent z-10"></div>
                        {course.thumbnailUrl ? (
                          <img src={course.thumbnailUrl} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <BookOpen className="w-16 h-16 text-primary opacity-30 transform group-hover:scale-110 transition-transform duration-500 z-0" />
                        )}
                        <div className="absolute top-4 left-4 z-20">
                          {course.level && (
                            <Badge className="bg-background/90 text-foreground backdrop-blur-sm shadow-sm border-none font-semibold px-2.5">{course.level}</Badge>
                          )}
                        </div>
                        <div className="absolute top-4 right-4 z-20">
                          {course.price === 0 && (
                            <Badge className="bg-emerald-500/90 text-emerald-50 backdrop-blur-sm shadow-sm border-none font-bold tracking-wide">FREE</Badge>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary">{course.category || 'General'}</span>
                          {course.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                              <span className="font-bold text-foreground text-sm">{course.rating.toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground font-medium">({course.studentCount})</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-3 mb-5 mt-auto bg-muted/30 p-2 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-muted border flex items-center justify-center overflow-hidden shrink-0">
                            {course.trainer?.avatarUrl ? (
                              <img src={course.trainer.avatarUrl} alt={course.trainer.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-bold text-xs text-muted-foreground">{(course.trainer?.fullName || 'T').charAt(0)}</span>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-foreground text-sm truncate">{course.trainer?.fullName || 'Expert Instructor'}</span>
                            <span className="text-xs text-muted-foreground truncate">{course.trainer?.expertise || 'Certified Trainer'}</span>
                          </div>
                        </div>
                        <div className="pt-4 border-t flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Duration</span>
                            <span className="text-sm font-bold text-foreground">{course.duration || 'Self-paced'}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Modules</span>
                            <span className="text-sm font-bold text-foreground">{course.modules?.length || 10} Units</span>
                          </div>
                        </div>
                        <Button className="w-full mt-5 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" asChild>
                           <Link href={`/find-courses/${course.id}`}>View Course Details</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
            
            {totalPages > 1 && courses.length > 0 && (
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

export default function FindCoursesPage() {
  return (
    <Suspense fallback={<PageContainer><div className="flex items-center justify-center h-[50vh]"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div></PageContainer>}>
      <FindCoursesContent />
    </Suspense>
  );
}
