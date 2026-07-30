"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/shared/PageContainer";
import { CourseGrid } from "@/features/training/courses/CourseGrid";
import { CourseSearch } from "@/features/training/courses/CourseSearch";
import { CourseFilters } from "@/features/training/courses/CourseFilters";
import { CategoryTabs } from "@/features/training/courses/CategoryTabs";
import { CourseSort } from "@/features/training/courses/CourseSort";
import { EmptyCoursesState } from "@/features/training/courses/EmptyCoursesState";
import { FeaturedCourses } from "@/features/training/courses/FeaturedCourses";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { courseService } from "@/lib/services/course.service";

export default function FindCoursesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortValue, setSortValue] = useState("recommended");
  const [filters, setFilters] = useState({
    difficulty: [],
    price: "all",
    rating: "4.0"
  });

  const categories = ["All", "Programming", "AI & Data Science", "Cloud Computing", "UI/UX Design", "Cybersecurity", "Business"];

  const { data: rawCourses, isLoading } = useQuery({
    queryKey: ["publicCoursesMarketplace", activeCategory, sortValue, filters],
    queryFn: async () => {
      const res = await courseService.getCourses({
        category: activeCategory !== "All" ? activeCategory : undefined,
      });
      return Array.isArray(res) ? res : res?.data || [];
    }
  });

  const courses = (rawCourses || []).map((c: any) => ({
    id: c.id,
    title: c.title,
    instructor: c.trainer?.user?.fullName || c.instructor || "Platform Trainer",
    rating: c.rating || 5.0,
    students: c.enrollments?.length || 0,
    duration: c.duration || "Self-paced",
    level: c.level || "All Levels",
    price: c.price || 0,
    thumbnail: c.thumbnailUrl || c.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
    isAiRecommended: !!c.isAiRecommended
  }));

  return (
    <PageContainer className="py-8">
      <div className="flex flex-col gap-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-3">Course Marketplace</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Upskill with premium courses. Earn verified certificates to stand out to employers.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <CourseSearch />
          </div>
        </div>

        {courses.length > 0 && <FeaturedCourses />}

        {/* Categories & Mobile Filters */}
        <div className="flex items-center justify-between gap-4 border-b pb-4 sticky top-[4rem] z-30 bg-background w-full min-w-0 overflow-hidden">
          <div className="flex-1 min-w-0 overflow-hidden">
            <CategoryTabs 
              categories={categories} 
              activeCategory={activeCategory} 
              onSelect={setActiveCategory} 
            />
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <Sheet>
              <SheetTrigger>
                <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 md:hidden gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
                <SheetHeader className="mb-6">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <CourseFilters filters={filters} setFilters={setFilters} />
              </SheetContent>
            </Sheet>
            
            <CourseSort value={sortValue} onChange={setSortValue} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-8 items-start pt-4">
          
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-64 shrink-0 sticky top-[10rem]">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filters
            </h3>
            <CourseFilters filters={filters} setFilters={setFilters} />
          </div>
          
          {/* Course Grid */}
          <div className="flex-1 w-full">
            {isLoading ? (
              <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : courses.length > 0 ? (
              <CourseGrid courses={courses} />
            ) : (
              <EmptyCoursesState onClearFilters={() => setFilters({ difficulty: [], price: "all", rating: "3.0" })} />
            )}
          </div>
        </div>

      </div>
    </PageContainer>
  );
}
