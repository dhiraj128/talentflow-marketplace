"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, CheckCircle2, Clock, XCircle, AlertCircle, Ban } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { applicationService } from "@/lib/services/application.service";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status History Modal
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [historyList, setHistoryList] = useState<any[]>([]);

  // Withdraw Modal
  const [withdrawAppId, setWithdrawAppId] = useState<string | null>(null);
  const [withdrawReason, setWithdrawReason] = useState("");

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    const candidateId = (user as any)?.profile?.id;
    if (!candidateId) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await applicationService.getApplications({ candidateId });
      setApplications(data);
    } catch (error) {
      console.error("Failed to load applications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenStatusModal = async (app: any) => {
    setSelectedApp(app);
    try {
      const history = await applicationService.getStatusHistory(app.id);
      setHistoryList(history);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAppId) return;
    try {
      await applicationService.withdrawApplication(withdrawAppId, withdrawReason);
      toast.success("Application Withdrawn", { description: "Your application status has been updated to Withdrawn." });
      setWithdrawAppId(null);
      setWithdrawReason("");
      fetchApplications();
    } catch (err: any) {
      toast.error("Withdrawal Failed", {
        description: err?.response?.data?.message || "Failed to withdraw application.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "HIRED":
        return <Badge className="bg-green-600 text-white">Hired</Badge>;
      case "OFFERED":
        return <Badge className="bg-indigo-600 text-white">Offer Received</Badge>;
      case "INTERVIEWING":
        return <Badge className="bg-amber-500 text-white">Interviewing</Badge>;
      case "SHORTLISTED":
        return <Badge className="bg-purple-600 text-white">Shortlisted</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "WITHDRAWN":
        return <Badge variant="outline" className="border-gray-400 text-gray-600">Withdrawn</Badge>;
      default:
        return <Badge variant="secondary">Applied</Badge>;
    }
  };

  const steps = [
    { key: "APPLIED", label: "Applied" },
    { key: "SHORTLISTED", label: "Shortlisted" },
    { key: "INTERVIEWING", label: "Interviewing" },
    { key: "OFFERED", label: "Offer" },
    { key: "HIRED", label: "Hired" },
  ];

  const getStepStatus = (appStatus: string, stepKey: string) => {
    const order = ["APPLIED", "PENDING", "SHORTLISTED", "INTERVIEWING", "OFFERED", "HIRED"];
    const currentIndex = order.indexOf(appStatus);
    const stepIndex = order.indexOf(stepKey);

    if (appStatus === "REJECTED" || appStatus === "WITHDRAWN") {
      return "terminal";
    }

    if (currentIndex >= stepIndex) return "completed";
    return "upcoming";
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader
        title="Application Tracker V1.1"
        description="Track your hiring pipeline stage, view timeline history, or withdraw applications."
      />

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border rounded-xl bg-card">
            No applications submitted yet. Browse jobs to apply!
          </div>
        ) : (
          applications.map((app) => (
            <Card key={app.id} className="overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">{app.job?.title || "Position"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {app.job?.employer?.companyName || "Company"} • Applied on{" "}
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(app.status)}
                    <Button variant="outline" size="sm" onClick={() => handleOpenStatusModal(app)}>
                      <Eye className="w-4 h-4 mr-1" /> View Timeline
                    </Button>
                    {!["HIRED", "REJECTED", "WITHDRAWN"].includes(app.status) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => setWithdrawAppId(app.id)}
                      >
                        <Ban className="w-4 h-4 mr-1" /> Withdraw
                      </Button>
                    )}
                  </div>
                </div>

                {/* VISUAL TIMELINE STEPPER */}
                {app.status !== "REJECTED" && app.status !== "WITHDRAWN" ? (
                  <div className="pt-2">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -z-0" />
                      {steps.map((step) => {
                        const status = getStepStatus(app.status, step.key);
                        return (
                          <div key={step.key} className="flex flex-col items-center bg-card px-2 z-10">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                status === "completed"
                                  ? "bg-green-600 text-white"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {status === "completed" ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                <Clock className="w-4 h-4" />
                              )}
                            </div>
                            <span className="text-xs font-medium mt-1">{step.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-muted/40 rounded-lg flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Application terminal status: <strong>{app.status}</strong></span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* STATUS HISTORY TIMELINE MODAL */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Status Timeline — {selectedApp?.job?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2 max-h-80 overflow-y-auto">
            {historyList.length === 0 ? (
              <p className="text-xs text-center text-muted-foreground">No detailed timeline logged yet.</p>
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

      {/* WITHDRAW MODAL */}
      <Dialog open={!!withdrawAppId} onOpenChange={() => setWithdrawAppId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to withdraw your application? This action will notify the employer.
            </p>
            <Textarea
              placeholder="Optional withdrawal reason..."
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setWithdrawAppId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleWithdraw}>
                Confirm Withdrawal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
