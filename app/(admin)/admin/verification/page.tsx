"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X, RefreshCcw, Eye, Download, MessageSquare } from "lucide-react";

type VerificationRequest = { 
  id: string; 
  user: string; 
  role: string; 
  documentType: string; 
  submittedAt: string; 
  status: string; 
  notes: string;
};

const allData: VerificationRequest[] = [
  { id: "1", user: "John Doe", role: "Job Seeker", documentType: "Identity (Aadhaar)", submittedAt: "2024-03-10", status: "Pending", notes: "" },
  { id: "2", user: "Jane Smith", role: "Employer", documentType: "Company Registration", submittedAt: "2024-03-09", status: "Verified", notes: "Looks good" },
  { id: "3", user: "Mike Johnson", role: "Freelancer", documentType: "Identity (PAN)", submittedAt: "2024-03-08", status: "Rejected", notes: "Image too blurry" },
  { id: "4", user: "Sarah Williams", role: "Trainer", documentType: "Certification", submittedAt: "2024-03-11", status: "Need Re-upload", notes: "Wrong document uploaded" },
];

export default function AdminVerificationPage() {
  const columns: ColumnDef<VerificationRequest>[] = [
    { accessorKey: "user", header: "User" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "documentType", header: "Document Type" },
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
      cell: () => (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" title="Preview"><Eye className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" title="Download"><Download className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" title="Approve"><Check className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" title="Reject"><X className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="Request Re-upload"><RefreshCcw className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" title="Reviewer Notes"><MessageSquare className="w-4 h-4" /></Button>
        </div>
      )
    }
  ];

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
              data={allData.filter(d => d.status === status)} 
              searchKey="user" 
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
