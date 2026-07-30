"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { CourseHero } from "@/features/training/course-detail/CourseHero";
import { CourseOverview } from "@/features/training/course-detail/CourseOverview";
import { CurriculumAccordion } from "@/features/training/course-detail/CurriculumAccordion";
import { InstructorProfile } from "@/features/training/course-detail/InstructorProfile";
import { LearningOutcomes } from "@/features/training/course-detail/LearningOutcomes";
import { RequirementsCard } from "@/features/training/course-detail/RequirementsCard";
import { ReviewsSection } from "@/features/training/course-detail/ReviewsSection";
import { RelatedCourses } from "@/features/training/course-detail/RelatedCourses";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/lib/services/course.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CourseDetailPage() {
  const routeParams = useParams();
  const courseId = routeParams?.id as string;

  const { data: rawCourse, isLoading } = useQuery({
    queryKey: ["courseDetail", courseId],
    queryFn: async () => {
      if (!courseId) return null;
      return await courseService.getCourse(courseId);
    },
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <PageContainer className="py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </PageContainer>
    );
  }

  if (!rawCourse) {
    return (
      <PageContainer className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
        <p className="text-muted-foreground mb-6">The requested course does not exist or is currently unavailable.</p>
        <Link href="/find-courses">
          <Button>Back to Courses</Button>
        </Link>
      </PageContainer>
    );
  }

  const course = {
    id: rawCourse.id,
    title: rawCourse.title,
    shortDescription: rawCourse.description?.slice(0, 150) || "Comprehensive professional training course.",
    description: rawCourse.description || "Detailed course overview.",
    instructor: rawCourse.trainer?.user?.fullName || "Platform Trainer",
    rating: rawCourse.rating || 5.0,
    reviews: rawCourse.reviews?.length || 0,
    students: rawCourse.enrollments?.length || 0,
    duration: rawCourse.duration || "Self-paced",
    level: rawCourse.level || "All Levels",
    price: rawCourse.price || 0,
    language: "English",
    category: rawCourse.category || "General",
    thumbnail: rawCourse.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop"
  };

  const outcomes = (rawCourse.outcomes || []).map((o: any) => typeof o === "string" ? o : o.text);
  const curriculum = rawCourse.modules || [];
  const instructorData = {
    name: rawCourse.trainer?.user?.fullName || "Platform Trainer",
    headline: rawCourse.trainer?.headline || "Certified Instructor",
    rating: 5.0,
    reviews: 0,
    students: rawCourse.enrollments?.length || 0,
    courses: 1,
    avatarUrl: rawCourse.trainer?.avatarUrl,
    bio: rawCourse.trainer?.bio || "Professional instructor dedicated to delivering practical, high-impact learning."
  };
  const reviewsData = rawCourse.reviews || [];
  const requirements = (rawCourse.requirements || []).map((r: any) => typeof r === "string" ? r : r.text);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <CourseHero course={course} />
      
      <PageContainer className="py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start relative">
          
          {/* Main Content */}
          <div className="flex-1 w-full space-y-12">
            {outcomes.length > 0 && <LearningOutcomes outcomes={outcomes} />}
            <CourseOverview description={course.description} />
            {curriculum.length > 0 && <CurriculumAccordion curriculum={curriculum} />}
            <InstructorProfile instructor={instructorData} />
            {reviewsData.length > 0 && <ReviewsSection reviews={reviewsData} />}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-[6rem]">
            <RequirementsCard 
              courseId={course.id} 
              price={course.price} 
              requirements={requirements} 
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
