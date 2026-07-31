"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/EmptyState";
import { Video, Calendar, Clock, Search, Filter, MoreVertical, XCircle, CheckCircle, UserX, Star, MessageSquare, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { interviewsService, Interview } from "@/lib/services/interviews.service";
import { ScheduleInterviewDialog } from "@/components/employer/interviews/ScheduleInterviewDialog";
import { format } from "date-fns";
import { toast } from "sonner";

export default function EmployerInterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // Feedback Modal State
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(4);
  const [feedbackRecommendation, setFeedbackRecommendation] = useState("HIRE");
  const [feedbackStrengths, setFeedbackStrengths] = useState("");
  const [feedbackConcerns, setFeedbackConcerns] = useState("");
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setIsLoading(true);
    try {
      const data = await interviewsService.getEmployerInterviews();
      setInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch employer interviews", err);
      setInterviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm("Are you sure you want to cancel this interview?")) {
      try {
        await interviewsService.cancel(id);
        toast.success("Interview cancelled");
        fetchInterviews();
      } catch (err) {
        toast.error("Failed to cancel interview");
      }
    }
  };

  const handleMarkNoShow = async (id: string) => {
    if (confirm("Mark candidate as no-show?")) {
      try {
        await interviewsService.markNoShow(id);
        toast.success("Marked as no-show");
        fetchInterviews();
      } catch (err) {
        toast.error("Failed to mark no-show");
      }
    }
  };

  const openFeedbackModal = (iv: Interview) => {
    setSelectedInterview(iv);
    setFeedbackRating(4);
    setFeedbackRecommendation("HIRE");
    setFeedbackStrengths("");
    setFeedbackConcerns("");
    setFeedbackNotes("");
    setIsFeedbackOpen(true);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterview) return;
    setIsSubmittingFeedback(true);
    try {
      await interviewsService.submitFeedback(selectedInterview.id, {
        rating: feedbackRating,
        recommendation: feedbackRecommendation,
        strengths: feedbackStrengths,
        concerns: feedbackConcerns,
        notes: feedbackNotes,
      });
      toast.success("Private evaluation feedback saved");
      setIsFeedbackOpen(false);
      fetchInterviews();
    } catch (err) {
      toast.error("Failed to save interview feedback");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SCHEDULED":
      case "RESCHEDULED":
        return <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">Scheduled</Badge>;
      case "COMPLETED":
        return <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">Cancelled</Badge>;
      case "NO_SHOW":
        return <Badge variant="outline" className="text-gray-600 bg-gray-50 border-gray-200">No Show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filtered = interviews.filter((iv) => {
    const matchesSearch = searchTerm
      ? (iv.candidate?.fullName || iv.candidate?.user?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (iv.application?.job?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesStatus = statusFilter === "ALL" || iv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const upcomingInterviews = filtered.filter((i) => i.status === "SCHEDULED" || i.status === "RESCHEDULED");
  const completedInterviews = filtered.filter((i) => i.status === "COMPLETED");
  const cancelledInterviews = filtered.filter((i) => i.status === "CANCELLED" || i.status === "NO_SHOW");

  const renderInterviewRow = (iv: Interview) => {
    const candidateName = iv.candidate?.fullName || iv.candidate?.user?.email || "Candidate";
    const jobTitle = iv.application?.job?.title || "Position";
    const isScheduled = iv.status === "SCHEDULED" || iv.status === "RESCHEDULED";

    return (
      <Card key={iv.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border shadow-xs">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-3">
            <h4 className="font-bold text-base">{candidateName}</h4>
            {getStatusBadge(iv.status)}
            <Badge variant="secondary" className="capitalize text-xs">{iv.type || "VIDEO"}</Badge>
          </div>
          <p className="text-sm font-medium text-primary">{jobTitle}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> {format(new Date(iv.scheduledAt), "MMM dd, yyyy - hh:mm a")} ({iv.timezone})</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {iv.duration} mins</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          {isScheduled && iv.meetingUrl && (
            <Button size="sm" onClick={() => window.open(iv.meetingUrl, "_blank")} className="gap-1.5 bg-indigo-600 hover:bg-indigo-700">
              <Video className="w-4 h-4" /> Join
            </Button>
          )}

          {isScheduled && (
            <Button size="sm" variant="outline" onClick={() => openFeedbackModal(iv)} className="gap-1 text-green-700 border-green-200 bg-green-50 hover:bg-green-100">
              <CheckCircle className="w-4 h-4" /> Complete & Evaluate
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground flex items-center justify-center">
              <MoreVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isScheduled && (
                <>
                  <DropdownMenuItem onClick={() => handleMarkNoShow(iv.id)}>
                    <UserX className="w-4 h-4 mr-2 text-amber-600" /> Mark No-Show
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCancel(iv.id)}>
                    <XCircle className="w-4 h-4 mr-2 text-red-600" /> Cancel Interview
                  </DropdownMenuItem>
                </>
              )}
              {iv.status === "COMPLETED" && (
                <DropdownMenuItem onClick={() => openFeedbackModal(iv)}>
                  <MessageSquare className="w-4 h-4 mr-2 text-indigo-600" /> Edit Evaluation Notes
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 max-w-full overflow-x-hidden">
      <PageHeader
        title="Interviews Center"
        description="Schedule, manage, and record private evaluations for candidate interviews"
        action={<ScheduleInterviewDialog />}
      />

      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidate or job role..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="NO_SHOW">No Show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="upcoming" className="w-full space-y-6">
        <TabsList className="flex overflow-x-auto w-full max-w-md justify-start sm:justify-center">
          <TabsTrigger value="upcoming" className="text-xs sm:text-sm">Upcoming ({upcomingInterviews.length})</TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">Completed ({completedInterviews.length})</TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs sm:text-sm">Cancelled ({cancelledInterviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading interview schedule...</div>
          ) : upcomingInterviews.length > 0 ? (
            <div className="space-y-4">{upcomingInterviews.map(renderInterviewRow)}</div>
          ) : (
            <EmptyState
              icon={<Calendar className="h-10 w-10 text-muted-foreground" />}
              title="No upcoming interviews scheduled"
              description="Schedule interviews directly from your hiring pipeline or click Schedule Interview above."
            />
          )}
        </TabsContent>

        <TabsContent value="completed">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading interviews...</div>
          ) : completedInterviews.length > 0 ? (
            <div className="space-y-4">{completedInterviews.map(renderInterviewRow)}</div>
          ) : (
            <EmptyState
              icon={<Calendar className="h-10 w-10 text-muted-foreground" />}
              title="No completed interviews"
              description="Completed interviews and private evaluations will be archived here."
            />
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading interviews...</div>
          ) : cancelledInterviews.length > 0 ? (
            <div className="space-y-4">{cancelledInterviews.map(renderInterviewRow)}</div>
          ) : (
            <EmptyState
              icon={<Calendar className="h-10 w-10 text-muted-foreground" />}
              title="No cancelled interviews"
              description="Cancelled or no-show sessions will appear here."
            />
          )}
        </TabsContent>
      </Tabs>

      {/* PRIVATE EVALUATION FEEDBACK MODAL */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Employer Private Interview Evaluation</DialogTitle>
            <DialogDescription>
              Record rating, recommendation, and private notes. This information is strictly private to your team and is NEVER shared with candidates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFeedbackSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Overall Rating (1-5)</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${star <= feedbackRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                  </button>
                ))}
                <span className="text-sm font-semibold ml-2">{feedbackRating} / 5</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Recommendation *</Label>
              <Select value={feedbackRecommendation} onValueChange={(val) => setFeedbackRecommendation(val || "HIRE")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STRONG_HIRE">Strong Hire</SelectItem>
                  <SelectItem value="HIRE">Hire</SelectItem>
                  <SelectItem value="NEUTRAL">Neutral</SelectItem>
                  <SelectItem value="NO_HIRE">No Hire</SelectItem>
                  <SelectItem value="STRONG_NO_HIRE">Strong No Hire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Candidate Strengths</Label>
              <Textarea
                placeholder="Key technical skills, communication, problem solving..."
                value={feedbackStrengths}
                onChange={(e) => setFeedbackStrengths(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Areas of Concern</Label>
              <Textarea
                placeholder="Skill gaps, experience level, salary expectation..."
                value={feedbackConcerns}
                onChange={(e) => setFeedbackConcerns(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Private Employer Notes</Label>
              <Textarea
                placeholder="Internal interview feedback notes..."
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" type="button" onClick={() => setIsFeedbackOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingFeedback}>
                {isSubmittingFeedback ? "Saving..." : "Save Feedback"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
