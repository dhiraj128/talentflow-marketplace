"use client";

import { PageHeader } from "@/components/shared/PageHeader"
import { DataTable } from "@/components/shared/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  course: string;
  progress: number;
  lastActive: string;
  status: "Active" | "Inactive";
}

const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Student",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{student.name}</span>
            <span className="text-xs text-muted-foreground">{student.email}</span>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "course",
    header: "Course",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.course}</span>
    )
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => (
      <div className="w-[120px] flex items-center gap-2">
        <Progress value={row.original.progress} className="h-2 flex-1" />
        <span className="text-xs font-medium">{row.original.progress}%</span>
      </div>
    )
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.lastActive}</span>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "Active" ? "default" : "secondary"}>
        {row.original.status}
      </Badge>
    )
  }
]

export default function StudentsPage() {
  const data: Student[] = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", avatar: "https://i.pravatar.cc/150?u=1", course: "Advanced React Patterns", progress: 85, lastActive: "2 hours ago", status: "Active" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", avatar: "https://i.pravatar.cc/150?u=2", course: "Next.js Fullstack Development", progress: 45, lastActive: "1 day ago", status: "Active" },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", avatar: "https://i.pravatar.cc/150?u=3", course: "Advanced React Patterns", progress: 100, lastActive: "3 days ago", status: "Inactive" },
    { id: "4", name: "Diana Prince", email: "diana@example.com", avatar: "https://i.pravatar.cc/150?u=4", course: "Modern UI/UX Design", progress: 12, lastActive: "1 week ago", status: "Inactive" },
    { id: "5", name: "Ethan Hunt", email: "ethan@example.com", avatar: "https://i.pravatar.cc/150?u=5", course: "Next.js Fullstack Development", progress: 68, lastActive: "5 mins ago", status: "Active" },
  ]

  return (
    <>
      <PageHeader 
        title="Students" 
        description="Monitor student progress, engagement, and activity." 
      />
      <div className="mt-8">
        <DataTable columns={columns} data={data} searchKey="name" />
      </div>
    </>
  )
}
