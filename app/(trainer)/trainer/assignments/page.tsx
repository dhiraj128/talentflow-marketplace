"use client";

import { PageHeader } from "@/components/shared/PageHeader"
import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle, FileText } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useState } from "react"

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
  const [assignmentsList, setAssignmentsList] = useState<Assignment[]>([
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
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: "", course: "Advanced React", dueDate: "" });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title) return;

    const created: Assignment = {
      id: Date.now().toString(),
      title: newAssignment.title,
      course: newAssignment.course,
      dueDate: newAssignment.dueDate || "Nov 30, 2023",
      total: 45,
      submitted: 0,
      pending: 45,
      averageGrade: "N/A"
    };

    setAssignmentsList([created, ...assignmentsList]);
    setIsDialogOpen(false);
    setNewAssignment({ title: "", course: "Advanced React", dueDate: "" });
    toast.success("Assignment created successfully!");
  };

  const columns: ColumnDef<Assignment>[] = [
    {
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium">{row.original.title}</span>
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

  return (
    <>
      <PageHeader 
        title="Assignments" 
        description="Manage student assignments, track submissions, and provide grades." 
        action={<Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" /> Create Assignment</Button>}
      />

      <div className="mt-6">
        <DataTable columns={columns} data={assignmentsList} searchKey="title" />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Assignment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateAssignment} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Assignment Title *</Label>
              <Input 
                placeholder="e.g. Build a Custom Hook" 
                value={newAssignment.title} 
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Input 
                placeholder="e.g. Advanced React" 
                value={newAssignment.course} 
                onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input 
                type="date" 
                value={newAssignment.dueDate} 
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} 
              />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Create Assignment</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
