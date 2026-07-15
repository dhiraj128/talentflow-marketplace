"use client";

import { PageHeader } from "@/components/shared/PageHeader"
import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle, FileText } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

type Assignment = {
  id: string
  title: string
  course: string
  dueDate: string
  total: number
  submitted: number
  pending: number
  averageGrade: string
}

export default function AssignmentsPage() {
  const columns: ColumnDef<Assignment>[] = [
    { 
      header: "Assignment", 
      accessorKey: "title",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-medium">
          <FileText className="h-4 w-4 text-muted-foreground" />
          {row.original.title}
        </div>
      )
    },
    { header: "Course", accessorKey: "course" },
    { header: "Due Date", accessorKey: "dueDate" },
    { header: "Total Students", accessorKey: "total" },
    { header: "Submitted", accessorKey: "submitted" },
    { header: "Pending", accessorKey: "pending" },
    { header: "Avg. Grade", accessorKey: "averageGrade" },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <Button variant="outline" size="sm">
          <CheckCircle className="h-4 w-4 mr-2" /> Review
        </Button>
      ),
    },
  ]

  const data: Assignment[] = [
    { 
      id: "1", 
      title: "Build a Custom Hook", 
      course: "Advanced React", 
      dueDate: "Oct 25, 2023", 
      total: 45, 
      submitted: 38, 
      pending: 7, 
      averageGrade: "92%" 
    },
    { 
      id: "2", 
      title: "Server Components Implementation", 
      course: "Next.js Mastery", 
      dueDate: "Oct 29, 2023", 
      total: 60, 
      submitted: 20, 
      pending: 40, 
      averageGrade: "88%" 
    },
    { 
      id: "3", 
      title: "Performance Optimization Task", 
      course: "Advanced React", 
      dueDate: "Nov 05, 2023", 
      total: 45, 
      submitted: 5, 
      pending: 40, 
      averageGrade: "N/A" 
    },
  ]

  return (
    <>
      <PageHeader 
        title="Assignments" 
        description="Manage student assignments, track submissions, and provide grades." 
        action={<Button><Plus className="h-4 w-4 mr-2" /> Create Assignment</Button>}
      />

      <div className="mt-6">
        <DataTable columns={columns} data={data} searchKey="title" />
      </div>
    </>
  )
}
