"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X, RefreshCcw, Eye, Download, MessageSquare } from "lucide-react";

import { freelancerService } from "@/lib/services/freelancer.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";

export default function AdminVerificationPage() {
  const queryClient = useQueryClient();

  const { data: freelancers = [], isLoading: isLoadingF } = useQuery({
    queryKey: ['adminFreelancers'],
    queryFn: async () => {
      const res = await api.get('/freelancers/admin/all');
      return res.data;
    }
  });

  const { data: employers = [], isLoading: isLoadingE } = useQuery({
    queryKey: ['adminEmployers'],
    queryFn: async () => {
      const res = await api.get('/employers?take=100');
      return res.data;
    }
  });

  const { data: jobs = [], isLoading: isLoadingJ } = useQuery({
    queryKey: ['adminJobs'],
    queryFn: async () => {
      const res = await api.get('/jobs?take=100');
      return res.data;
    }
  });

  const { data: courses = [], isLoading: isLoadingC } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: async () => {
      const res = await api.get('/courses?take=100');
      return res.data;
    }
  });

  const { data: trainers = [], isLoading: isLoadingT } = useQuery({
    queryKey: ['adminTrainers'],
    queryFn: async () => {
      const res = await api.get('/trainers');
      return res.data;
    }
  });

  const isLoading = isLoadingF || isLoadingE || isLoadingJ || isLoadingC || isLoadingT;

  const verifyMutation = useMutation({
    mutationFn: async ({ type, id, status }: { type: string, id: string, status: string | boolean }) => {
      if (type === 'Freelancer') return api.patch(`/freelancers/${id}/verify`, { isVerified: status });
      if (type === 'Employer') return api.patch(`/employers/${id}`, { isVerified: status });
      if (type === 'Trainer') return api.patch(`/trainers/${id}`, { isVerified: status });
      if (type === 'Job') return api.patch(`/jobs/${id}`, { status });
      if (type === 'Course') return api.patch(`/courses/${id}/approve`);
    },
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update status")
  });

  const allData = [
    ...freelancers.map((f: any) => ({
      id: f.id,
      type: "Freelancer",
      title: f.fullName || f.userId,
      submittedAt: new Date(f.createdAt).toLocaleDateString(),
      status: f.isVerified ? "Verified" : "Pending"
    })),
    ...employers.map((e: any) => ({
      id: e.id,
      type: "Employer",
      title: e.companyName || e.userId,
      submittedAt: new Date(e.createdAt || Date.now()).toLocaleDateString(),
      status: e.isVerified ? "Verified" : "Pending"
    })),
    ...trainers.map((t: any) => ({
      id: t.id,
      type: "Trainer",
      title: t.fullName || t.userId,
      submittedAt: new Date(t.createdAt || Date.now()).toLocaleDateString(),
      status: t.isVerified ? "Verified" : "Pending"
    })),
    ...jobs.map((j: any) => ({
      id: j.id,
      type: "Job",
      title: j.title,
      submittedAt: new Date(j.createdAt || Date.now()).toLocaleDateString(),
      status: j.status === 'APPROVED' ? "Verified" : j.status === 'REJECTED' ? 'Rejected' : "Pending"
    })),
    ...courses.map((c: any) => ({
      id: c.id,
      type: "Course",
      title: c.title,
      submittedAt: new Date(c.createdAt || Date.now()).toLocaleDateString(),
      status: c.status === 'APPROVED' ? "Verified" : c.status === 'REJECTED' ? 'Rejected' : "Pending"
    }))
  ];

  const columns: ColumnDef<any>[] = [
    { accessorKey: "title", header: "Item Name" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "submittedAt", header: "Submitted" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          "Verified": "default",
          "Pending": "secondary",
          "Rejected": "destructive",
          "Need Re-upload": "outline"
        };
        return <Badge variant={variants[status] || "default"}>{status}</Badge>;
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const req = row.original;
        return (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" title="Preview"><Eye className="w-4 h-4" /></Button>
            {req.status !== 'Verified' && (
              <Button onClick={() => verifyMutation.mutate({ type: req.type, id: req.id, status: (req.type === 'Job' || req.type === 'Course') ? 'APPROVED' : true })} variant="outline" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" title="Approve">
                <Check className="w-4 h-4" />
              </Button>
            )}
            {req.status === 'Verified' && (req.type === 'Freelancer' || req.type === 'Employer' || req.type === 'Trainer') && (
              <Button onClick={() => verifyMutation.mutate({ type: req.type, id: req.id, status: false })} variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" title="Revoke">
                <X className="w-4 h-4" />
              </Button>
            )}
            {req.status === 'Pending' && (req.type === 'Job' || req.type === 'Course') && (
               <Button onClick={() => verifyMutation.mutate({ type: req.type, id: req.id, status: 'REJECTED' })} variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" title="Reject">
                 <X className="w-4 h-4" />
               </Button>
            )}
          </div>
        );
      }
    }
  ];

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Verification Dashboard" description="Review and manage user verification requests" />
      
      <Tabs defaultValue="Pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Verified">Verified</TabsTrigger>
          <TabsTrigger value="Rejected">Rejected</TabsTrigger>
          <TabsTrigger value="Need Re-upload">Need Re-upload</TabsTrigger>
        </TabsList>
        
        {["Pending", "Verified", "Rejected", "Need Re-upload"].map(status => (
          <TabsContent key={status} value={status}>
            <DataTable 
              columns={columns} 
              data={allData.filter((d: any) => d.status === status)} 
              searchKey="title" 
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
