import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { CourseCard } from "../courses/CourseCard";
import Link from "next/link";

export function RecommendedCourses() {
  const recommendedCourses = [
    {
      id: "aws-cert",
      title: "AWS Certified Solutions Architect",
      instructor: "Michael Chang",
      rating: 4.8,
      students: 15420,
      duration: "42h 15m",
      level: "Certificate",
      price: 149.99,
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
      isAiRecommended: true,
      skills: ["AWS", "Cloud Architecture"]
    },
    {
      id: "ts-master",
      title: "TypeScript 5 Masterclass",
      instructor: "Anna Dev",
      rating: 4.9,
      students: 8230,
      duration: "12h 30m",
      level: "Intermediate",
      price: 89.99,
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
      isAiRecommended: true,
      skills: ["TypeScript", "JavaScript"]
    },
    {
      id: "ui-ux",
      title: "Advanced UI/UX Principles",
      instructor: "Sarah Jenkins",
      rating: 4.7,
      students: 5120,
      duration: "8h 45m",
      level: "Beginner",
      price: 0,
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop",
      isAiRecommended: false,
      skills: ["UI Design", "Figma"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          Recommended For You
        </h3>
        <Link href="/find-courses" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Explore All
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
