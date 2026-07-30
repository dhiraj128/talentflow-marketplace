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
import { EmptySearchState } from "@/components/shared/EmptySearchState";
import { searchService } from "@/lib/services/search.service";
import { jobService } from "@/lib/services/job.service";
import { freelancerService } from "@/lib/services/freelancer.service";
import { courseService } from "@/lib/services/course.service";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const type = (searchParams.get("type") || "jobs") as "talent" | "jobs" | "freelancers" | "courses";
  const query = searchParams.get("query") || searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { data: searchResponse, isLoading } = useQuery({
    queryKey: ['search-results', type, query, location, page],
    queryFn: async () => {
      if (type === 'jobs') {
        const res = await jobService.getJobs({ q: query, location, page, limit: 9 });
        return {
          items: (res?.data || []).map((j: any) => ({
            id: j.id,
            title: j.title,
            company: j.employer?.companyName || "Company",
            location: j.location || "Remote",
            type: j.type || "Full-time",
            salary: j.salaryRange || "Competitive",
            skills: (j.requiredSkills || []).map((s: any) => s.skill?.name || s)
          })),
          total: res?.total || 0,
          totalPages: res?.totalPages || 1
        };
      }
      if (type === 'freelancers' || type === 'talent') {
        const res = await freelancerService.getMarketplace({ location });
        const list = Array.isArray(res) ? res : res?.data || [];
        const filtered = list.filter((f: any) => {
          if (!query) return true;
          const q = query.toLowerCase();
          return (f.fullName || "").toLowerCase().includes(q) || (f.title || "").toLowerCase().includes(q);
        });
        return {
          items: filtered.map((f: any) => ({
            id: f.id,
            name: f.fullName || f.title || "Freelancer",
            title: f.title || "Specialist",
            hourlyRate: `$${f.hourlyRate || 0}`,
            rating: f.rating || 5.0,
            reviews: f.reviews?.length || 0,
            skills: (f.skills || []).map((s: any) => s.skill?.name || s)
          })),
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / 9) || 1
        };
      }
      if (type === 'courses') {
        const res = await courseService.getCourses({ q: query });
        const list = Array.isArray(res) ? res : res?.data || [];
        return {
          items: list.map((c: any) => ({
            id: c.id,
            title: c.title,
            instructor: c.trainer?.user?.fullName || "Platform Trainer",
            level: c.level || "All Levels",
            rating: c.rating || 5.0,
            students: c.enrollments?.length || 0,
            duration: c.duration || "Self-paced",
            tags: [c.category || "General"]
          })),
          total: list.length,
          totalPages: Math.ceil(list.length / 9) || 1
        };
      }
      return { items: [], total: 0, totalPages: 1 };
    }
  });

  const items = searchResponse?.items || [];
  const total = searchResponse?.total || 0;
  const totalPages = searchResponse?.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", newPage.toString());
    const search = current.toString();
    router.push(`${pathname}${search ? `?${search}` : ""}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="bg-background border-b shadow-sm p-6 rounded-2xl">
        <UniversalSearch />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground capitalize">{type} Results</h2>
            <p className="text-muted-foreground mt-1">
              Showing {isLoading ? "..." : total} results {query ? `for "${query}"` : ''}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptySearchState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any) => (
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
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button 
                key={p} 
                variant={page === p ? "default" : "outline"} 
                className="w-10 h-10"
                onClick={() => handlePageChange(p)}
                disabled={isLoading}
              >
                {p}
              </Button>
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
