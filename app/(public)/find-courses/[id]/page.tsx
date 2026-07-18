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
import { useState } from "react";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  // Mock course data
  const course = {
    id: params.id,
    title: "Advanced React Patterns & Architecture",
    shortDescription: "Master React by learning advanced patterns, performance optimization, and architectural best practices used by top engineering teams.",
    description: "This comprehensive course is designed for intermediate to advanced React developers who want to take their skills to the next level. You'll dive deep into the internal mechanics of React, understand how to architect large-scale applications, and master patterns like Higher-Order Components, Render Props, and Custom Hooks in modern scenarios (React 18+).\n\nWe'll also cover performance optimization techniques, state management strategies, and how to properly integrate with Next.js App Router and Server Components.",
    instructor: "Sarah Jenkins",
    rating: 4.8,
    reviews: 1240,
    students: 12400,
    duration: "18h 30m",
    level: "Certificate",
    price: 149.99,
    language: "English",
    category: "Programming",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2000&auto=format&fit=crop"
  };

  const outcomes = [
    "Architect scalable React applications",
    "Master advanced React patterns (HOCs, Render Props, Custom Hooks)",
    "Implement effective state management solutions",
    "Optimize performance and avoid unnecessary renders",
    "Build accessible and reusable UI components",
    "Understand and utilize React Server Components"
  ];

  const curriculum = [
    {
      title: "Module 1: Introduction to Advanced Patterns",
      duration: "2h 15m",
      lessons: [
        { title: "Course Overview & Setup", duration: "10:25", type: "video" },
        { title: "Thinking in React: Re-evaluated", duration: "15:30", type: "video" },
        { title: "Component Design Principles", duration: "12:45", type: "video" },
        { title: "Module 1 Assessment", duration: "15:00", type: "assessment" }
      ]
    },
    {
      title: "Module 2: State Management Architecture",
      duration: "3h 45m",
      lessons: [
        { title: "Context API Deep Dive", duration: "25:10", type: "video" },
        { title: "When to use Redux vs Zustand", duration: "20:15", type: "video" },
        { title: "Server State with React Query", duration: "32:40", type: "video" }
      ]
    }
  ];

  const instructorData = {
    name: "Sarah Jenkins",
    headline: "Senior Staff Software Engineer at TechCorp",
    rating: 4.9,
    reviews: 5400,
    students: 45000,
    courses: 6,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    bio: "Sarah is a Staff Software Engineer with over 10 years of experience building large-scale web applications. She has worked at top tech companies and specializes in React, Node.js, and Cloud Architecture.\n\nShe is passionate about teaching and has helped thousands of developers advance their careers through her comprehensive courses."
  };

  const reviewsData = [
    {
      id: "r1",
      name: "Michael T.",
      avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
      rating: 5,
      date: "2 weeks ago",
      comment: "This course completely changed how I write React code. The section on performance optimization alone is worth the price."
    },
    {
      id: "r2",
      name: "Jessica W.",
      rating: 4.5,
      date: "1 month ago",
      comment: "Very thorough explanations of complex topics. Sarah's teaching style is clear and practical."
    }
  ];

  const requirements = [
    "Solid understanding of JavaScript (ES6+)",
    "Experience building basic React applications",
    "Familiarity with HTML and CSS",
    "A computer with Node.js installed"
  ];

  const relatedCourses = [
    {
      id: "node-api",
      title: "Node.js Microservices Masterclass",
      instructor: "David Chen",
      rating: 4.9,
      students: 8200,
      duration: "24h 15m",
      level: "Specialization",
      price: 199.99,
      thumbnail: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <CourseHero course={course} />
      
      <PageContainer className="py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start relative">
          
          {/* Main Content */}
          <div className="flex-1 w-full space-y-12">
            <LearningOutcomes outcomes={outcomes} />
            <CourseOverview description={course.description} />
            <CurriculumAccordion curriculum={curriculum} />
            <InstructorProfile instructor={instructorData} />
            <ReviewsSection reviews={reviewsData} />
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

        <div className="mt-16">
          <RelatedCourses courses={relatedCourses} />
        </div>
      </PageContainer>
    </div>
  );
}
