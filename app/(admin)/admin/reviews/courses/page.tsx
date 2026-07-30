"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { GraduationCap } from "lucide-react";
import api from "@/lib/api";

type ReviewCourse = { id: string; title: string; trainer?: any; category?: string };

const columns: ColumnDef<ReviewCourse>[] = [
  { accessorKey: "title", header: "Course Title" },
  {
    accessorKey: "trainer",
    header: "Trainer",
    cell: ({ row }) => row.original.trainer?.user?.fullName || row.original.trainer?.companyName || "Trainer",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category || "General",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => window.open(`/find-courses/${row.original.id}`, '_blank')}>
          <GraduationCap className="w-4 h-4 mr-1" /> View
        </Button>
      </div>
    ),
  },
];

export default function CourseReviewsPage() {
  const [courses, setCourses] = useState<ReviewCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/courses');
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setCourses(list);
    } catch (e) {
      console.warn("Failed to load courses for review", e);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader title="Course Reviews" description="Review training courses submitted by trainers" />
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading course reviews...</div>
      ) : (
        <DataTable columns={columns} data={courses} searchKey="title" />
      )}
    </div>
  );
}
