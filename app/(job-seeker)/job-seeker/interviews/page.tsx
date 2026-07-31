"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/EmptyState";
import { Video, Calendar, Clock, Building2, ExternalLink, XCircle, MapPin, Info, Phone, Users, ShieldAlert } from "lucide-react";
import { interviewsService, Interview } from "@/lib/services/interviews.service";
import { format } from "date-fns";
import { toast } from "sonner";

export default function CandidateInterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setIsLoading(true);
    try {
      const data = await interviewsService.getCandidateInterviews();
      setInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load interviews", err);
      setInterviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm("Are you sure you want to cancel this interview?")) {
      try {
        await interviewsService.cancel(id);
        toast.success("Interview cancelled successfully");
        fetchInterviews();
      } catch (err) {
        toast.error("Failed to cancel interview");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SCHEDULED":
      case "RESCHEDULED":
        return <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">Upcoming</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">Cancelled</Badge>;
      case "NO_SHOW":
        return <Badge variant="outline" className="text-gray-600 bg-gray-50 border-gray-200">Missed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const upcomingInterviews = interviews.filter((i) => i.status === "SCHEDULED" || i.status === "RESCHEDULED");
  const completedInterviews = interviews.filter((i) => i.status === "COMPLETED");
  const cancelledInterviews = interviews.filter((i) => i.status === "CANCELLED" || i.status === "NO_SHOW");

  const renderInterviewCard = (iv: Interview) => {
    const isUpcoming = iv.status === "SCHEDULED" || iv.status === "RESCHEDULED";
    const scheduledDate = new Date(iv.scheduledAt);

    return (
      <Card key={iv.id} className="flex flex-col border shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle className="text-lg line-clamp-1">{iv.application?.job?.title || "Job Interview"}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground mt-1.5">
                <Building2 className="w-4 h-4 mr-2 shrink-0" />
                <span className="line-clamp-1">{iv.employer?.companyName || "Employer"}</span>
              </div>
            </div>
            {getStatusBadge(iv.status)}
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-3.5 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="w-4 h-4 mr-3 shrink-0 text-primary" />
            <span className="font-medium text-foreground">{format(scheduledDate, "EEEE, MMMM dd, yyyy")}</span>
          </div>

          <div className="flex items-center text-muted-foreground">
            <Clock className="w-4 h-4 mr-3 shrink-0 text-primary" />
            <span>{format(scheduledDate, "hh:mm a")} ({iv.timezone || "UTC"}) — {iv.duration} mins</span>
          </div>

          <div className="flex items-center text-muted-foreground">
            {iv.type === "PHONE" ? <Phone className="w-4 h-4 mr-3 shrink-0" /> : <Users className="w-4 h-4 mr-3 shrink-0" />}
            <span className="capitalize font-medium">{iv.type || "VIDEO"} Interview</span>
          </div>

          {iv.meetingUrl && (
            <div className="flex items-center text-muted-foreground">
              <Video className="w-4 h-4 mr-3 shrink-0 text-indigo-500" />
              <a href={iv.meetingUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline line-clamp-1 font-medium">
                {iv.meetingProvider || "Video Link"}
              </a>
            </div>
          )}

          {iv.location && (
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-3 shrink-0 text-rose-500" />
              <span className="line-clamp-1">{iv.location}</span>
            </div>
          )}

          {iv.instructions && (
            <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1">
              <span className="font-semibold flex items-center gap-1 text-foreground">
                <Info className="w-3.5 h-3.5 text-blue-500" /> Instructions:
              </span>
              <p className="text-muted-foreground whitespace-pre-wrap">{iv.instructions}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 border-t flex justify-end gap-2">
          {isUpcoming && (
            <Button variant="outline" size="sm" onClick={() => handleCancel(iv.id)} className="text-red-600 hover:bg-red-50">
              <XCircle className="w-4 h-4 mr-1.5" /> Cancel
            </Button>
          )}
          {isUpcoming && iv.meetingUrl && (
            <Button size="sm" onClick={() => window.open(iv.meetingUrl, "_blank")} className="gap-1.5 bg-indigo-600 hover:bg-indigo-700">
              <ExternalLink className="w-4 h-4" /> Join Interview
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader
        title="My Interviews"
        description="View your scheduled interview sessions and join link details"
      />

      <Tabs defaultValue="upcoming" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="upcoming">Upcoming ({upcomingInterviews.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedInterviews.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledInterviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading interview schedule...</div>
          ) : upcomingInterviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingInterviews.map(renderInterviewCard)}
            </div>
          ) : (
            <EmptyState
              icon={<Calendar className="h-10 w-10 text-muted-foreground" />}
              title="No upcoming interviews"
              description="Your scheduled interviews will appear here when employers invite you for an interview."
              action={{ label: "View Applications", href: "/job-seeker/applications" }}
            />
          )}
        </TabsContent>

        <TabsContent value="completed">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading interviews...</div>
          ) : completedInterviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedInterviews.map(renderInterviewCard)}
            </div>
          ) : (
            <EmptyState
              icon={<Calendar className="h-10 w-10 text-muted-foreground" />}
              title="No completed interviews"
              description="Completed interview sessions will be archived here."
            />
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading interviews...</div>
          ) : cancelledInterviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cancelledInterviews.map(renderInterviewCard)}
            </div>
          ) : (
            <EmptyState
              icon={<Calendar className="h-10 w-10 text-muted-foreground" />}
              title="No cancelled interviews"
              description="Cancelled or missed sessions will appear here."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
