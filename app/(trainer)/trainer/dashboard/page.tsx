"use client";

import React, { useEffect, useState } from "react";
import { 
  DollarSign, 
  BookOpen, 
  Users, 
  Award, 
  Star,
  PlusCircle,
  Video,
  FileText,
  TrendingUp,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { trainerService } from "@/lib/services/trainer.service";
import { CourseCard } from "@/components/cards/CourseCard";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TrainerDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['trainer-dashboard'],
    queryFn: () => trainerService.getTrainerDashboard()
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Trainer Dashboard</h2>
          <p className="text-muted-foreground mt-2">Manage your courses, live classes, and students.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" className="gap-2 shadow-sm" nativeButton={false} render={<Link href="/trainer/live/new" />}>
            <Video className="h-4 w-4" /> Schedule Live Class
          </Button>
          <Button variant="default" className="gap-2 shadow-sm" nativeButton={false} render={<Link href="/trainer/courses/new" />}>
            <PlusCircle className="h-4 w-4" /> Create Course
          </Button>
        </div>
      </div>

      {/* Key Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard title="Total Revenue" value={isLoading ? "..." : `$${stats?.revenue?.toLocaleString() || 0}`} icon={DollarSign} trend="+24%" trendUp color="primary" />
        <MetricCard title="Total Students" value={isLoading ? "..." : stats?.totalStudents?.toLocaleString() || 0} icon={Users} trend="+125" trendUp color="secondary" />
        <MetricCard title="Published Courses" value={isLoading ? "..." : stats?.publishedCourses} icon={BookOpen} trend={`${stats?.draftCourses} drafts`} trendUp={true} color="primary" isNeutral />
        <MetricCard title="Course Rating" value={isLoading ? "..." : stats?.courseRating} icon={Star} trend="Top 5%" trendUp color="primary" />
      </div>

      {/* Main Content Area removed as it contained mock data */}

      {/* Featured Courses */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-xl font-bold text-foreground">Top Performing Courses</h4>
          <Button variant="ghost" className="text-primary hover:text-primary/80" nativeButton={false} render={<Link href="/trainer/courses" />}>
            Manage Courses &rarr;
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats?.recentCourses?.length > 0 ? stats.recentCourses.map((course: any) => (
            <CourseCard 
              key={course.id}
              title={course.title}
              instructor="You"
              level={course.category || "General"}
              rating={course.rating || 0}
              students={course.studentCount || 0}
              duration="Online"
              tags={[]}
            />
          )) : (
            <p className="text-sm text-muted-foreground">No courses published yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Subcomponents
function MetricCard({ title, value, icon: Icon, trend, trendUp, color, isNeutral }: any) {
  return (
    <Card className="shadow-sm border">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className={`p-2 rounded-lg bg-${color}/10 text-${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className={`text-xs font-bold ${isNeutral ? 'text-muted-foreground' : trendUp ? 'text-secondary-foreground' : 'text-destructive'}`}>
            {trend}
          </span>
        </div>
        <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold mt-2">{value}</h3>
      </CardContent>
    </Card>
  );
}

