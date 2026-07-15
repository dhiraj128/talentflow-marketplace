"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X, GraduationCap } from "lucide-react";

type ReviewCourse = { id: string; title: string; trainer: string; category: string };

const data: ReviewCourse[] = [
  { id: "1", title: "Advanced React Patterns", trainer: "John Doe", category: "Development" },
  { id: "2", title: "UX/UI Masterclass", trainer: "Jane Smith", category: "Design" },
];

const columns: ColumnDef<ReviewCourse>[] = [
  { accessorKey: "title", header: "Course Title" },
  { accessorKey: "trainer", header: "Trainer" },
  { accessorKey: "category", header: "Category" },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm"><GraduationCap className="w-4 h-4 mr-1" /> View</Button>
        <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-1" /> Approve</Button>
        <Button variant="destructive" size="sm"><X className="w-4 h-4 mr-1" /> Reject</Button>
      </div>
    )
  }
];

export default function CourseReviewsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Course Reviews" description="Review and approve newly submitted training courses" />
      <DataTable columns={columns} data={data} searchKey="title" />
    </div>
  );
}
