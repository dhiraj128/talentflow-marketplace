"use client";
import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar as CalendarIcon, Clock, Building2, Link as LinkIcon, XCircle } from "lucide-react";
import { useCandidateInterviews, useCancelInterview } from "@/hooks/useInterviews";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function CandidateInterviewsPage() {
  const { data: interviews, isLoading } = useCandidateInterviews();
  const cancelMutation = useCancelInterview();

  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this interview?')) cancelMutation.mutate(id);
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'SCHEDULED': return <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">Upcoming</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Completed</Badge>;
      case 'CANCELLED': return <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">Cancelled</Badge>;
      case 'NO_SHOW': return <Badge variant="outline" className="text-gray-600 bg-gray-50 border-gray-200">Missed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  }

  if (isLoading) return <div className="p-8">Loading interviews...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader title="My Interviews" description="View and manage your interview schedule." />
      
      {(!interviews || interviews.length === 0) ? (
        <Card className="p-12 text-center text-muted-foreground">
          <p>You have no interviews scheduled.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((iv: any) => (
            <Card key={iv.id} className="flex flex-col h-full">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-lg line-clamp-1">{iv.application?.job?.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{iv.employer?.companyProfile?.companyName || iv.employer?.user?.email}</span>
                    </div>
                  </div>
                  {getStatusBadge(iv.status)}
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-3 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium">{format(new Date(iv.scheduledAt), "MMM dd, yyyy - hh:mm a")}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Video className="w-4 h-4 mr-3 text-muted-foreground flex-shrink-0" />
                  <span>{iv.meetingProvider} ({iv.duration} mins)</span>
                </div>
                {iv.status === 'SCHEDULED' && iv.meetingUrl && (
                  <div className="flex items-center text-sm">
                    <LinkIcon className="w-4 h-4 mr-3 text-muted-foreground flex-shrink-0" />
                    <a href={iv.meetingUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline line-clamp-1">
                      {iv.meetingUrl}
                    </a>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4 border-t flex justify-end gap-2">
                {iv.status === 'SCHEDULED' && (
                  <Button variant="outline" size="sm" onClick={() => handleCancel(iv.id)} className="text-red-600 hover:text-red-700">
                    <XCircle className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                )}
                {iv.status === 'SCHEDULED' && iv.meetingUrl && (
                  <Button size="sm" onClick={() => window.open(iv.meetingUrl, '_blank')}>
                    Join Meeting
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
