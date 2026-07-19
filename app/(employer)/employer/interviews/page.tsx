"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar as CalendarIcon, MoreVertical, XCircle, CheckCircle, UserX, Clock } from "lucide-react";
import { useEmployerInterviews, useCancelInterview, useCompleteInterview, useMarkNoShowInterview } from "@/hooks/useInterviews";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScheduleInterviewDialog } from "@/components/employer/interviews/ScheduleInterviewDialog";

export default function InterviewsPage() {
  const { data: interviews, isLoading } = useEmployerInterviews();
  const cancelMutation = useCancelInterview();
  const completeMutation = useCompleteInterview();
  const noShowMutation = useMarkNoShowInterview();

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this interview?')) cancelMutation.mutate(id);
  }
  
  const handleComplete = (id: string) => {
    completeMutation.mutate({ id });
  }

  const handleNoShow = (id: string) => {
    if (confirm('Mark candidate as no-show?')) noShowMutation.mutate(id);
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'SCHEDULED': return <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">Scheduled</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Completed</Badge>;
      case 'CANCELLED': return <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">Cancelled</Badge>;
      case 'NO_SHOW': return <Badge variant="outline" className="text-gray-600 bg-gray-50 border-gray-200">No Show</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  }

  const columns = [
    { 
      accessorKey: "candidate", 
      header: "Candidate Name",
      cell: ({ row }: any) => {
        const candidate = row.original.candidate;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {candidate?.user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{candidate?.user?.email}</p>
            </div>
          </div>
        )
      }
    },
    { 
      accessorKey: "application.job.title", 
      header: "Role",
      cell: ({ row }: any) => row.original.application?.job?.title || 'Unknown Role'
    },
    { 
      accessorKey: "scheduledAt", 
      header: "Date & Time",
      cell: ({ row }: any) => (
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
          {format(new Date(row.original.scheduledAt), "MMM dd, yyyy - hh:mm a")}
        </div>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => getStatusBadge(row.original.status)
    },
    { 
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const iv = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            {iv.meetingUrl && iv.status === 'SCHEDULED' && (
              <Button size="sm" onClick={() => window.open(iv.meetingUrl, '_blank')}>
                <Video className="w-4 h-4 mr-2" /> Join
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" type="button">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {iv.status === 'SCHEDULED' && (
                  <>
                    <DropdownMenuItem onClick={() => handleComplete(iv.id)}>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Mark Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNoShow(iv.id)}>
                      <UserX className="w-4 h-4 mr-2 text-orange-600" /> Mark No-Show
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCancel(iv.id)}>
                      <XCircle className="w-4 h-4 mr-2 text-red-600" /> Cancel Interview
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      }
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader 
        title="Interviews" 
        description="Manage your upcoming interview schedule." 
        action={
          <ScheduleInterviewDialog />
        }
      />
      <Card>
        <CardContent className="p-0 sm:p-6">
          <DataTable columns={columns} data={interviews || []} searchKey="candidate" />
        </CardContent>
      </Card>
    </div>
  );
}
