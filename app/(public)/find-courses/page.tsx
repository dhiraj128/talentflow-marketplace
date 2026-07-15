"use client";

import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { 
  ArrowRight, 
  Code, 
  BrainCircuit, 
  Cloud, 
  TrendingUp, 
  Landmark, 
  Palette, 
  Star, 
  Verified,
  RefreshCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { searchService } from "@/lib/services/search.service";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EnterpriseHero } from "@/components/shared/EnterpriseHero";

function AcademyDashboardContent() {
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

  const categories = [
    { name: "Programming", icon: Code, color: "text-primary", bg: "bg-primary/10", border: "hover:border-primary/30" },
    { name: "AI & ML", icon: BrainCircuit, color: "text-secondary", bg: "bg-secondary/10", border: "hover:border-secondary/30" },
    { name: "Cloud", icon: Cloud, color: "text-primary", bg: "bg-primary/10", border: "hover:border-primary/30" },
    { name: "Marketing", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10", border: "hover:border-orange-500/30" },
    { name: "Finance", icon: Landmark, color: "text-secondary", bg: "bg-secondary/10", border: "hover:border-secondary/30" },
    { name: "Design", icon: Palette, color: "text-orange-500", bg: "bg-orange-500/10", border: "hover:border-orange-500/30" },
  ];

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['find-courses', query, page],
    queryFn: async () => {
      const results = await searchService.searchCourses(query, "");
      const limit = 6;
      const offset = (page - 1) * limit;
      return results.slice(offset, offset + limit);
    }
  });

  const courses = coursesData || [];

  return (
    <PageContainer>
      
      {/* Hero Section */}
      <section className="relative rounded-[2rem] overflow-hidden mb-16 aspect-[21/9] min-h-[400px] flex items-center group bg-slate-900 border">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-r from-background/90 via-background/40 to-transparent absolute inset-0 z-10 dark:from-background/90 dark:via-background/60"></div>
          {/* Using a placeholder gradient pattern since we don't have the original image */}
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-slate-900 to-slate-900 transition-transform duration-700 group-hover:scale-105"></div>
        </div>
        <div className="relative z-20 px-8 md:px-16 max-w-2xl">
          <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30 mb-6 py-1 px-3">PREMIUM LEARNING</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">Master High-Demand Tech Skills</h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 font-medium">Access exclusive training modules curated by industry giants. From AI ethics to advanced cloud architecture.</p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="h-12 px-6 rounded-xl gap-2">
              Browse Modules <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 rounded-xl bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white">
              Learning Paths
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">Popular Categories</h2>
          <Button variant="link" className="text-primary font-semibold p-0 h-auto gap-1">
            View all categories <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Card key={idx} className={`flex flex-col items-center p-6 rounded-2xl cursor-pointer hover:shadow-lg transition-all group ${cat.border}`}>
                <div className={`w-14 h-14 rounded-xl ${cat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${cat.color}`} />
                </div>
                <span className="font-semibold text-foreground">{cat.name}</span>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Course Grid */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Featured Courses</h2>
            <p className="text-muted-foreground mt-1">Hand-picked excellence for your professional growth.</p>
          </div>
          <div className="flex items-center gap-2 bg-muted p-1 rounded-xl border">
            <Button variant="ghost" className="bg-background shadow-sm text-primary font-semibold h-9 rounded-lg">All Courses</Button>
            <Button variant="ghost" className="text-muted-foreground hover:bg-background/50 h-9 rounded-lg">Newest</Button>
            <Button variant="ghost" className="text-muted-foreground hover:bg-background/50 h-9 rounded-lg">Top Rated</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Skeleton key={`sk-${i}`} className="h-64 w-full rounded-xl" />
              ))
            ) : courses?.map((course: any) => (
              <Card key={course.id} className="group overflow-hidden rounded-3xl border-border hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full bg-card">
                <div className="relative h-48 w-full bg-muted overflow-hidden flex items-center justify-center p-6">
                  <div className="absolute inset-0 bg-gradient-to-tr from-background/80 to-transparent z-10"></div>
                  <course.icon className={`w-16 h-16 ${course.categoryColor} opacity-50 transform group-hover:scale-110 transition-transform duration-500 z-0`} />
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    {course.tags.map((tag: string, i: number) => (
                      <Badge key={i} className={`${course.tagColor} border-none`}>{tag}</Badge>
                    ))}
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${course.categoryColor}`}>{course.category || 'Category'}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                      <span className="font-semibold text-foreground text-sm">{course.rating || '4.9'}</span>
                      <span className="text-sm text-muted-foreground">({course.reviews || '2k'})</span>
                    </div>
                  </div>
                  <h3 className={`text-xl font-bold text-foreground mb-4 leading-tight group-hover:${course.categoryColor || 'text-primary'} transition-colors`}>
                    {course.title || `Course Title ${course.id}`}
                  </h3>
                  <div className="flex items-center gap-3 mb-6 mt-auto">
                    <div className="w-8 h-8 rounded-full bg-muted border flex items-center justify-center overflow-hidden">
                      <span className="font-bold text-xs text-muted-foreground">{(course.instructor || 'I').charAt(0)}</span>
                    </div>
                    <span className="font-medium text-muted-foreground text-sm">{course.instructor || 'Instructor Name'}</span>
                  </div>
                  <div className="pt-4 border-t flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground font-medium">{course.duration || '20 Hours'}</span>
                      <span className={`text-xl font-bold ${course.categoryColor}`}>{course.price || '$99.00'}</span>
                    </div>
                    <Button className={`${course.buttonColor} rounded-lg font-semibold`}>Enroll Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-12 pb-4">
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

      {/* CTA Section */}
      <EnterpriseHero />

    </PageContainer>
  );
}

export default function AcademyDashboardPage() {
  return (
    <Suspense fallback={<PageContainer><div>Loading courses...</div></PageContainer>}>
      <AcademyDashboardContent />
    </Suspense>
  );
}
