"use client";

import { useState } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { CourseGrid } from "@/features/training/courses/CourseGrid";
import { CourseSearch } from "@/features/training/courses/CourseSearch";
import { CourseFilters } from "@/features/training/courses/CourseFilters";
import { CategoryTabs } from "@/features/training/courses/CategoryTabs";
import { CourseSort } from "@/features/training/courses/CourseSort";
import { EmptyCoursesState } from "@/features/training/courses/EmptyCoursesState";
import { FeaturedCourses } from "@/features/training/courses/FeaturedCourses";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function FindCoursesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortValue, setSortValue] = useState("recommended");
  const [filters, setFilters] = useState({
    difficulty: [],
    price: "all",
    rating: "4.0"
  });

  const categories = ["All", "Programming", "AI & Data Science", "Cloud Computing", "UI/UX Design", "Cybersecurity", "Business"];
  
  const mockCourses = [
    {
      id: "react-adv",
      title: "Advanced React Patterns & Architecture",
      instructor: "Sarah Jenkins",
      rating: 4.8,
      students: 12400,
      duration: "18h 30m",
      level: "Certificate",
      price: 149.99,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
      isAiRecommended: true
    },
    {
      id: "node-api",
      title: "Node.js Microservices Masterclass",
      instructor: "David Chen",
      rating: 4.9,
      students: 8200,
      duration: "24h 15m",
      level: "Specialization",
      price: 199.99,
      thumbnail: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=600&auto=format&fit=crop",
      isAiRecommended: false
    },
    {
      id: "figma-ui",
      title: "Figma UI/UX Design Fundamentals",
      instructor: "Elena Rodriguez",
      rating: 4.7,
      students: 25100,
      duration: "10h 45m",
      level: "Short Course",
      price: 0,
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop",
      isAiRecommended: true
    }
  ];

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

        <FeaturedCourses />

        {/* Categories & Mobile Filters */}
        <div className="flex items-center justify-between gap-4 border-b pb-4 sticky top-[4rem] z-30 bg-background">
          <CategoryTabs 
            categories={categories} 
            activeCategory={activeCategory} 
            onSelect={setActiveCategory} 
          />
          
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
            {mockCourses.length > 0 ? (
              <CourseGrid courses={mockCourses} />
            ) : (
              <EmptyCoursesState onClearFilters={() => setFilters({ difficulty: [], price: "all", rating: "3.0" })} />
            )}
          </div>
        </div>

      </div>
    </PageContainer>
  );
}
