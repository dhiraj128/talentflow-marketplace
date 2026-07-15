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

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        {/* Engagement Funnel Chart */}
        <Card className="lg:col-span-8 overflow-hidden shadow-sm border">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-bold text-foreground">Student Engagement Funnel</h4>
              <select className="bg-muted border-none text-sm rounded-lg focus:ring-0 px-3 py-1.5">
                <option>Last 30 Days</option>
                <option>All Time</option>
              </select>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-6 relative">
              <FunnelBar label="Enrolled" height="100%" delay={0} />
              <FunnelBar label="Started" height="85%" delay={0.1} />
              <FunnelBar label="Midway" height="60%" delay={0.2} />
              <FunnelBar label="Completed" height="42%" delay={0.3} />
              <FunnelBar label="Certified" height="38%" delay={0.4} />
            </div>

            <div className="mt-8 pt-8 border-t flex gap-12">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Completion Rate</p>
                <p className="text-2xl font-bold text-secondary-foreground mt-1">{stats?.courseCompletionRate ?? 0}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Certificates Issued</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats?.certificatesIssued?.toLocaleString() ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="lg:col-span-4 shadow-sm border">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xl font-bold text-foreground">Live Classes & Assignments</h4>
              <button className="text-primary text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              <ActivityItem icon={Video} title={<span><span className="font-bold">Advanced React Patterns</span> Live Q&A</span>} time="Starts in 30 mins" color="primary" />
              <ActivityItem icon={FileText} title={<span><span className="font-bold">Assignment Due</span> UI/UX Capstone</span>} time="Tomorrow" color="destructive" />
              <ActivityItem icon={Download} title={<span><span className="font-bold">New Resource</span> Figma templates uploaded</span>} time="2 hrs ago" color="secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Courses */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-xl font-bold text-foreground">Top Performing Courses</h4>
          <Button variant="ghost" className="text-primary hover:text-primary/80" nativeButton={false} render={<Link href="/trainer/courses" />}>
            Manage Courses &rarr;
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard 
            title="Advanced React Patterns & Architecture"
            instructor="You"
            level="Advanced"
            rating={4.9}
            students={845}
            duration="12.5 hrs"
            tags={["React", "TypeScript", "Performance"]}
          />
          <CourseCard 
            title="Next.js Full Stack Masterclass"
            instructor="You"
            level="Intermediate"
            rating={4.8}
            students={530}
            duration="8.2 hrs"
            tags={["Next.js", "Tailwind", "Prisma"]}
          />
          <CourseCard 
            title="UI/UX Design Systems in Figma"
            instructor="You"
            level="Beginner"
            rating={4.7}
            students={120}
            duration="6.0 hrs"
            tags={["Figma", "UI Design", "Systems"]}
          />
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

function FunnelBar({ label, height, delay }: any) {
  return (
    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
      <motion.div 
        className="w-full bg-muted rounded-t-lg hover:bg-primary/20 transition-colors"
        initial={{ height: 0 }}
        animate={{ height }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function ActivityItem({ icon: Icon, title, time, color }: any) {
  return (
    <div className="flex gap-4">
      <div className={`w-8 h-8 rounded-full bg-${color}/10 flex items-center justify-center shrink-0`}>
        <Icon className={`h-4 w-4 text-${color}`} />
      </div>
      <div>
        <p className="text-sm text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
}
