"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { UniversalSearch } from "@/features/search";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { CandidateCard } from "@/components/cards/CandidateCard";
import { JobCard } from "@/components/cards/JobCard";
import { FreelancerCard } from "@/components/cards/FreelancerCard";
import { CourseCard } from "@/components/cards/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { PageContainer } from "@/components/shared/PageContainer";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const type = (searchParams.get("type") || "talent") as "talent" | "jobs" | "freelancers" | "courses";
  const query = searchParams.get("query") || searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = 42; // Hardcoded max pages for the demo

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

  const { data, isLoading } = useQuery({
    queryKey: ['search-results', type, query, location, page],
    queryFn: async () => {
      // Mocking results based on type for the demo
      await new Promise(r => setTimeout(r, 800));
      if (type === 'talent') {
        return Array(6).fill(null).map((_, i) => ({
          id: i,
          name: `Candidate ${i + 1}`,
          role: "Software Engineer",
          match: `${90 - i}%`,
          skills: ["React", "TypeScript", "Node.js"]
        }));
      }
      if (type === 'jobs') {
        return Array(6).fill(null).map((_, i) => ({
          id: i,
          title: `Senior Developer Role ${i + 1}`,
          company: `TechCorp ${i + 1}`,
          location: "Remote",
          type: "Full-time",
          salary: "$120k - $150k",
          skills: ["React", "AWS"]
        }));
      }
      if (type === 'freelancers') {
        return Array(6).fill(null).map((_, i) => ({
          id: i,
          name: `Freelancer ${i + 1}`,
          title: "Expert UI/UX Designer",
          hourlyRate: "$45",
          rating: 4.8,
          reviews: 24 + i,
          skills: ["Figma", "Web Design"]
        }));
      }
      if (type === 'courses') {
        return Array(6).fill(null).map((_, i) => ({
          id: i,
          title: `Mastering Web Development ${i + 1}`,
          instructor: "Jane Doe",
          level: "All Levels",
          rating: 4.9,
          students: 1200,
          duration: "10 hrs",
          tags: ["Web", "Programming"]
        }));
      }
      return [];
    }
  });

  return (
    <>
      <div className="bg-background border-b shadow-sm p-6 rounded-2xl">
        <UniversalSearch />
      </div>

      <div>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground capitalize">{type} Results</h2>
            <p className="text-muted-foreground mt-1">
              Showing {isLoading ? "..." : data?.length} results for "{query || 'all'}"
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((item: any) => (
              <div key={item.id}>
                {type === 'talent' && <CandidateCard {...item} />}
                {type === 'jobs' && <JobCard {...item} />}
                {type === 'freelancers' && <FreelancerCard {...item} />}
                {type === 'courses' && <CourseCard {...item} />}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
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
                  key={p} 
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
      </div>
    </>
  );
}

export default function SearchResultsPage() {
  return (
    <PageContainer>
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchResultsContent />
      </Suspense>
    </PageContainer>
  );
}
