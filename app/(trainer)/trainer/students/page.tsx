"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

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
            <AvatarFallback>{(student.name || 'S').charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{student.name}</span>
            <span className="text-xs text-muted-foreground">{student.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "course",
    header: "Course",
    cell: ({ row }) => <span className="text-sm">{row.original.course}</span>,
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => (
      <div className="w-[120px] flex items-center gap-2">
        <Progress value={row.original.progress || 0} className="h-2 flex-1" />
        <span className="text-xs font-medium">{row.original.progress || 0}%</span>
      </div>
    ),
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.lastActive}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "Active" ? "default" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
  },
];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/enrollments');
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      const formatted = list.map((e: any) => ({
        id: e.id,
        name: e.user?.fullName || e.candidate?.fullName || "Enrolled Student",
        email: e.user?.email || "student@talentflow.shop",
        avatar: e.user?.avatarUrl || e.candidate?.avatarUrl,
        course: e.course?.title || "Enrolled Course",
        progress: e.progress || 0,
        lastActive: e.updatedAt ? new Date(e.updatedAt).toLocaleDateString() : "Recently",
        status: e.status === "COMPLETED" || e.status === "ACTIVE" ? "Active" : "Inactive",
      }));
      setStudents(formatted);
    } catch (e) {
      console.warn("Failed to load trainer students", e);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Students"
        description="Monitor student progress, engagement, and activity."
      />
      <div className="mt-8">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading students...</div>
        ) : (
          <DataTable columns={columns} data={students} searchKey="name" />
        )}
      </div>
    </>
  );
}
