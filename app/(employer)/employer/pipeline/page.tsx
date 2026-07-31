"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  Check,
  X,
  Search,
  Filter,
  Plus,
  Tag as TagIcon,
  MessageSquare,
  History,
  TrendingUp,
  UserCheck,
  Zap,
} from "lucide-react";
import { applicationService } from "@/lib/services/application.service";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { CreateOfferDialog } from "@/components/employer/offers/CreateOfferDialog";
import { ScheduleInterviewDialog } from "@/components/employer/interviews/ScheduleInterviewDialog";

export default function EmployerPipelinePage() {
  const { user } = useAuth();
  const [pipelineData, setPipelineData] = useState<any>({ pipeline: {}, counts: {} });
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [activeTab, setActiveTab] = useState<"KANBAN" | "REJECTED" | "WITHDRAWN">("KANBAN");

  // Notes Modal state
  const [activeAppForNotes, setActiveAppForNotes] = useState<any>(null);
  const [notesList, setNotesList] = useState<any[]>([]);
  const [newNoteContent, setNewNoteContent] = useState("");

  // Tags Modal state
  const [activeAppForTags, setActiveAppForTags] = useState<any>(null);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [newTagName, setNewTagName] = useState("");

  // History Modal state
  const [activeAppForHistory, setActiveAppForHistory] = useState<any>(null);
  const [historyList, setHistoryList] = useState<any[]>([]);

  useEffect(() => {
    fetchPipeline();
    fetchAnalytics();
    fetchTags();
  }, [user]);

  const fetchPipeline = async () => {
    setIsLoading(true);
    try {
      const data = await applicationService.getPipeline({
        search: searchQuery || undefined,
        jobId: selectedJobId || undefined,
      });
      setPipelineData(data);
    } catch (err) {
      console.error("Failed to load pipeline data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await applicationService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  };

  const fetchTags = async () => {
    try {
      const tags = await applicationService.getTags();
      setAllTags(tags);
    } catch (err) {
      console.error("Failed to load tags", err);
    }
  };

  const handleStatusChange = async (appId: string, targetStatus: string) => {
    try {
      await applicationService.updateApplicationStatus(appId, targetStatus);
      toast.success("Stage Updated", { description: `Application moved to ${targetStatus}` });
      fetchPipeline();
      fetchAnalytics();
    } catch (err: any) {
      toast.error("Transition Failed", {
        description: err?.response?.data?.message || "Invalid status transition.",
      });
    }
  };

  // Notes actions
  const openNotesModal = async (app: any) => {
    setActiveAppForNotes(app);
    try {
      const notes = await applicationService.getNotes(app.id);
      setNotesList(notes);
    } catch (err) {
      console.error("Failed to load notes", err);
    }
  };

  const handleAddNote = async () => {
    if (!newNoteContent.trim() || !activeAppForNotes) return;
    try {
      await applicationService.createNote(activeAppForNotes.id, newNoteContent);
      toast.success("Note Added");
      setNewNoteContent("");
      openNotesModal(activeAppForNotes);
    } catch (err) {
      toast.error("Failed to add note");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await applicationService.deleteNote(noteId);
      toast.success("Note Deleted");
      openNotesModal(activeAppForNotes);
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  // Tags actions
  const openTagsModal = async (app: any) => {
    setActiveAppForTags(app);
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    try {
      await applicationService.createTag(newTagName.trim());
      setNewTagName("");
      fetchTags();
      toast.success("Tag Created");
    } catch (err) {
      toast.error("Failed to create tag");
    }
  };

  const handleAssignTag = async (tagId: string) => {
    if (!activeAppForTags) return;
    try {
      await applicationService.assignTag(activeAppForTags.id, tagId);
      toast.success("Tag Assigned");
      fetchPipeline();
    } catch (err) {
      toast.error("Failed to assign tag");
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    if (!activeAppForTags) return;
    try {
      await applicationService.removeTag(activeAppForTags.id, tagId);
      toast.success("Tag Removed");
      fetchPipeline();
    } catch (err) {
      toast.error("Failed to remove tag");
    }
  };

  // History modal
  const openHistoryModal = async (app: any) => {
    setActiveAppForHistory(app);
    try {
      const history = await applicationService.getStatusHistory(app.id);
      setHistoryList(history);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const stages = [
    { key: "APPLIED", label: "Applied / Pending", color: "border-blue-500 bg-blue-50/30" },
    { key: "SHORTLISTED", label: "Shortlisted", color: "border-purple-500 bg-purple-50/30" },
    { key: "INTERVIEWING", label: "Interviewing", color: "border-amber-500 bg-amber-50/30" },
    { key: "OFFERED", label: "Offered", color: "border-indigo-500 bg-indigo-50/30" },
    { key: "HIRED", label: "Hired", color: "border-green-500 bg-green-50/30" },
  ];

  const pipeline = pipelineData.pipeline || {};
  const counts = pipelineData.counts || {};

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 max-w-full overflow-x-hidden">
      <PageHeader
        title="Hiring Pipeline V1.1"
        description="Kanban application management, stage transitions, private notes, and candidate tracking."
      />

      {/* Analytics Summary Cards */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          <Card className="p-4 bg-blue-500/10 border-blue-200">
            <p className="text-xs font-semibold text-blue-700">Total Applied</p>
            <p className="text-2xl font-bold text-blue-900">{counts.applied || 0}</p>
          </Card>
          <Card className="p-4 bg-purple-500/10 border-purple-200">
            <p className="text-xs font-semibold text-purple-700">Shortlisted</p>
            <p className="text-2xl font-bold text-purple-900">{counts.shortlisted || 0}</p>
            <p className="text-[10px] text-purple-600 mt-1">
              Conv: {analytics.conversionRates?.appliedToShortlist || 0}%
            </p>
          </Card>
          <Card className="p-4 bg-amber-500/10 border-amber-200">
            <p className="text-xs font-semibold text-amber-700">Interviewing</p>
            <p className="text-2xl font-bold text-amber-900">{counts.interviewing || 0}</p>
            <p className="text-[10px] text-amber-600 mt-1">
              Conv: {analytics.conversionRates?.shortlistToInterview || 0}%
            </p>
          </Card>
          <Card className="p-4 bg-indigo-500/10 border-indigo-200">
            <p className="text-xs font-semibold text-indigo-700">Offered</p>
            <p className="text-2xl font-bold text-indigo-900">{counts.offered || 0}</p>
            <p className="text-[10px] text-indigo-600 mt-1">
              Conv: {analytics.conversionRates?.interviewToOffer || 0}%
            </p>
          </Card>
          <Card className="p-4 bg-green-500/10 border-green-200">
            <p className="text-xs font-semibold text-green-700">Hired</p>
            <p className="text-2xl font-bold text-green-900">{counts.hired || 0}</p>
            <p className="text-[10px] text-green-600 mt-1">
              Conv: {analytics.conversionRates?.offerToHire || 0}%
            </p>
          </Card>
        </div>
      )}

      {/* Filter & View Tabs */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search candidate..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchPipeline()}
            />
          </div>
          <Button variant="outline" onClick={fetchPipeline}>
            Filter
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === "KANBAN" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("KANBAN")}
          >
            Pipeline Board
          </Button>
          <Button
            variant={activeTab === "REJECTED" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("REJECTED")}
          >
            Rejected ({counts.rejected || 0})
          </Button>
          <Button
            variant={activeTab === "WITHDRAWN" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("WITHDRAWN")}
          >
            Withdrawn ({counts.withdrawn || 0})
          </Button>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {activeTab === "KANBAN" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const list = [
              ...(stage.key === "APPLIED" ? pipeline.PENDING || [] : []),
              ...(pipeline[stage.key] || []),
            ];

            return (
              <div
                key={stage.key}
                className={`rounded-lg border-t-4 p-3 ${stage.color} min-w-[260px] space-y-3`}
              >
                <div className="flex justify-between items-center pb-2 border-b">
                  <h4 className="font-bold text-sm text-foreground">{stage.label}</h4>
                  <Badge variant="secondary">{list.length}</Badge>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {list.length === 0 ? (
                    <p className="text-xs text-center text-muted-foreground py-8">No candidates</p>
                  ) : (
                    list.map((app) => (
                      <Card key={app.id} className="p-3 shadow-sm hover:shadow transition">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-sm">
                                {app.candidate?.fullName || app.candidate?.user?.email || "Candidate"}
                              </p>
                              <p className="text-xs text-muted-foreground">{app.job?.title}</p>
                            </div>
                            <Badge variant="outline" className="text-[10px]">
                              {app.matchScore}% Match
                            </Badge>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-1 pt-2 border-t text-xs">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="Private Notes"
                              onClick={() => openNotesModal(app)}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="Tags"
                              onClick={() => openTagsModal(app)}
                            >
                              <TagIcon className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="History Timeline"
                              onClick={() => openHistoryModal(app)}
                            >
                              <History className="w-3.5 h-3.5" />
                            </Button>

                            {/* Stage Movement Controls */}
                            {stage.key === "APPLIED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-[11px] bg-purple-50 text-purple-700 ml-auto"
                                onClick={() => handleStatusChange(app.id, "SHORTLISTED")}
                              >
                                Shortlist
                              </Button>
                            )}
                            {stage.key === "SHORTLISTED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-[11px] bg-amber-50 text-amber-700 ml-auto"
                                onClick={() => handleStatusChange(app.id, "INTERVIEWING")}
                              >
                                Interview
                              </Button>
                            )}
                            {stage.key === "INTERVIEWING" && (
                              <div className="flex items-center gap-1 ml-auto">
                                <ScheduleInterviewDialog defaultApplicationId={app.id}>
                                  <Button size="sm" variant="outline" className="h-7 text-[11px] bg-amber-50 text-amber-700">
                                    Interview
                                  </Button>
                                </ScheduleInterviewDialog>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-[11px] bg-indigo-50 text-indigo-700"
                                  onClick={() => handleStatusChange(app.id, "OFFERED")}
                                >
                                  Move Offer
                                </Button>
                              </div>
                            )}
                            {stage.key === "OFFERED" && (
                              <div className="flex items-center gap-1 ml-auto">
                                <CreateOfferDialog
                                  applicationId={app.id}
                                  candidateName={app.candidate?.fullName}
                                  jobTitle={app.job?.title}
                                  onSuccess={fetchPipeline}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REJECTED / WITHDRAWN TAB VIEW */}
      {(activeTab === "REJECTED" || activeTab === "WITHDRAWN") && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(pipeline[activeTab] || []).map((app: any) => (
            <Card key={app.id} className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h4 className="font-bold">{app.candidate?.fullName || "Candidate"}</h4>
                  <Badge variant="destructive">{app.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Job: {app.job?.title}</p>
                <p className="text-xs text-muted-foreground">
                  Date: {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* PRIVATE NOTES MODAL */}
      <Dialog open={!!activeAppForNotes} onOpenChange={() => setActiveAppForNotes(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Employer Private Candidate Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Textarea
                placeholder="Add private note (Candidate cannot view)..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
              />
              <Button size="sm" onClick={handleAddNote} className="w-full">
                Add Note
              </Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pt-2 border-t">
              {notesList.length === 0 ? (
                <p className="text-xs text-center text-muted-foreground">No notes yet.</p>
              ) : (
                notesList.map((note) => (
                  <div key={note.id} className="p-2 border rounded bg-muted/30 text-xs space-y-1">
                    <p>{note.content}</p>
                    <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
                      <span>{new Date(note.createdAt).toLocaleString()}</span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* HISTORY MODAL */}
      <Dialog open={!!activeAppForHistory} onOpenChange={() => setActiveAppForHistory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Application Status History</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2 max-h-80 overflow-y-auto">
            {historyList.length === 0 ? (
              <p className="text-xs text-center text-muted-foreground">No history logged yet.</p>
            ) : (
              historyList.map((h) => (
                <div key={h.id} className="p-2 border-l-2 border-primary pl-3 text-xs space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>
                      {h.fromStatus} &rarr; {h.toStatus}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(h.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{h.reason}</p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
