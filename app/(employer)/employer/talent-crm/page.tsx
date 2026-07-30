"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Bookmark,
  Star,
  Users,
  Send,
  Plus,
  Trash2,
  Eye,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
} from "lucide-react";
import { talentCrmService } from "@/lib/services/talent-crm.service";
import { jobService } from "@/lib/services/job.service";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function EmployerTalentCrmPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"SAVED" | "POOLS" | "INVITATIONS">("SAVED");
  const [analytics, setAnalytics] = useState<any>(null);
  const [savedCandidates, setSavedCandidates] = useState<any[]>([]);
  const [pools, setPools] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pool Creation Modal
  const [isPoolModalOpen, setIsPoolModalOpen] = useState(false);
  const [newPoolName, setNewPoolName] = useState("");
  const [newPoolDesc, setNewPoolDesc] = useState("");

  // Invite Modal
  const [selectedCandForInvite, setSelectedCandForInvite] = useState<any>(null);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [inviteMsg, setInviteMsg] = useState("");

  useEffect(() => {
    fetchCrmData();
    fetchEmployerJobs();
  }, [user]);

  const fetchCrmData = async () => {
    setIsLoading(true);
    try {
      const [analyticsData, savedData, poolsData, invData] = await Promise.all([
        talentCrmService.getAnalytics().catch(() => null),
        talentCrmService.getSavedCandidates({ limit: 50 }).catch(() => ({ data: [] })),
        talentCrmService.getPools().catch(() => []),
        talentCrmService.getEmployerInvitations().catch(() => []),
      ]);

      setAnalytics(analyticsData);
      setSavedCandidates(savedData.data || []);
      setPools(poolsData || []);
      setInvitations(invData || []);
    } catch (err) {
      console.error("Failed to load CRM data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployerJobs = async () => {
    try {
      const myJobs = await jobService.getEmployerJobs().catch(() => []);
      setJobs(myJobs.data || myJobs || []);
    } catch (e) {
      console.warn("Failed to load jobs", e);
    }
  };

  const handleUnsave = async (candId: string) => {
    try {
      await talentCrmService.unsaveCandidate(candId);
      toast.success("Candidate Unsaved");
      fetchCrmData();
    } catch (e) {
      toast.error("Failed to unsave candidate");
    }
  };

  const handleToggleFavorite = async (candId: string, currentFav: boolean) => {
    try {
      await talentCrmService.saveCandidate(candId, !currentFav);
      toast.success(!currentFav ? "Added to Favorites" : "Removed from Favorites");
      fetchCrmData();
    } catch (e) {
      toast.error("Failed to update favorite");
    }
  };

  const handleCreatePool = async () => {
    if (!newPoolName.trim()) return;
    try {
      await talentCrmService.createPool(newPoolName.trim(), newPoolDesc.trim());
      toast.success("Talent Pool Created");
      setIsPoolModalOpen(false);
      setNewPoolName("");
      setNewPoolDesc("");
      fetchCrmData();
    } catch (e) {
      toast.error("Failed to create talent pool");
    }
  };

  const handleDeletePool = async (poolId: string) => {
    try {
      await talentCrmService.deletePool(poolId);
      toast.success("Talent Pool Deleted");
      fetchCrmData();
    } catch (e) {
      toast.error("Failed to delete talent pool");
    }
  };

  const handleSendInvite = async () => {
    if (!selectedCandForInvite || !selectedJobId) {
      toast.error("Please select a target job");
      return;
    }
    try {
      await talentCrmService.createInvitation(selectedCandForInvite.id, selectedJobId, inviteMsg);
      toast.success("Invitation Sent", { description: "Candidate received an in-app notification & transactional email." });
      setSelectedCandForInvite(null);
      setSelectedJobId("");
      setInviteMsg("");
      fetchCrmData();
    } catch (err: any) {
      toast.error("Invitation Failed", { description: err?.response?.data?.message || "Could not send invitation." });
    }
  };

  const handleCancelInvite = async (invId: string) => {
    try {
      await talentCrmService.cancelInvitation(invId);
      toast.success("Invitation Cancelled");
      fetchCrmData();
    } catch (e) {
      toast.error("Failed to cancel invitation");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <PageHeader
        title="Talent CRM V1.2"
        description="Discover, save, organize talent pools, and invite qualified candidates to apply."
      />

      {/* Analytics Summary */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          <Card className="p-4 bg-blue-500/10 border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-700">Saved Candidates</span>
              <Bookmark className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-2">{analytics.savedCandidates || 0}</p>
          </Card>
          <Card className="p-4 bg-amber-500/10 border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700">Favorites</span>
              <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
            </div>
            <p className="text-2xl font-bold text-amber-900 mt-2">{analytics.favorites || 0}</p>
          </Card>
          <Card className="p-4 bg-purple-500/10 border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-700">Talent Pools</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-2">{analytics.talentPools || 0}</p>
          </Card>
          <Card className="p-4 bg-indigo-500/10 border-indigo-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-700">Invitations Sent</span>
              <Send className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-indigo-900 mt-2">{analytics.invitationsSent || 0}</p>
          </Card>
          <Card className="p-4 bg-green-500/10 border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-green-700">Conversion Rate</span>
              <Zap className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-900 mt-2">{analytics.conversionRate || 0}%</p>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex justify-between items-center border-b pb-3">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "SAVED" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("SAVED")}
          >
            Saved Candidates ({savedCandidates.length})
          </Button>
          <Button
            variant={activeTab === "POOLS" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("POOLS")}
          >
            Talent Pools ({pools.length})
          </Button>
          <Button
            variant={activeTab === "INVITATIONS" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("INVITATIONS")}
          >
            Invitations ({invitations.length})
          </Button>
        </div>

        {activeTab === "POOLS" && (
          <Button size="sm" onClick={() => setIsPoolModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Create Pool
          </Button>
        )}
      </div>

      {/* SAVED CANDIDATES TAB */}
      {activeTab === "SAVED" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center text-muted-foreground py-8">Loading CRM candidates...</div>
          ) : savedCandidates.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-12 border rounded-xl bg-card">
              No candidates saved yet. Discover candidates on <a href="/find-talent" className="text-primary underline">Talent Discovery</a>!
            </div>
          ) : (
            savedCandidates.map((sc) => {
              const candidate = sc.candidate || {};
              return (
                <Card key={sc.id} className="p-4 shadow-sm hover:shadow transition">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-base">{candidate.fullName || "Candidate"}</h4>
                        <p className="text-xs text-muted-foreground">{candidate.title || "Talent"}</p>
                        <p className="text-[11px] text-muted-foreground">{candidate.location || "Remote"}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-500"
                        onClick={() => handleToggleFavorite(candidate.id, sc.isFavorite)}
                      >
                        <Star className={`w-4 h-4 ${sc.isFavorite ? "fill-amber-500" : ""}`} />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {(candidate.skills || []).slice(0, 3).map((s: any) => (
                        <Badge key={s.id || s.skillId} variant="secondary" className="text-[10px]">
                          {s.skill?.name || "Skill"}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t text-xs">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => window.open(`/find-talent/${candidate.id}`, "_blank")}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> Profile
                      </Button>

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="default"
                          className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700"
                          onClick={() => setSelectedCandForInvite(candidate)}
                        >
                          <Send className="w-3.5 h-3.5 mr-1" /> Invite
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleUnsave(candidate.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* TALENT POOLS TAB */}
      {activeTab === "POOLS" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pools.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-12 border rounded-xl bg-card">
              No talent pools created yet. Click "Create Pool" above to organize candidates!
            </div>
          ) : (
            pools.map((pool) => (
              <Card key={pool.id} className="p-4 shadow-sm hover:shadow transition">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base">{pool.name}</h4>
                      <p className="text-xs text-muted-foreground">{pool.description || "No description"}</p>
                    </div>
                    <Badge variant="secondary">{pool._count?.members || 0} Members</Badge>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t text-xs">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/employer/talent-crm/pools/${pool.id}`}
                    >
                      Manage Pool
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => handleDeletePool(pool.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* INVITATIONS TAB */}
      {activeTab === "INVITATIONS" && (
        <div className="space-y-3">
          {invitations.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 border rounded-xl bg-card">
              No invitations sent yet. Browse candidates to invite them to apply!
            </div>
          ) : (
            invitations.map((inv) => (
              <Card key={inv.id} className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="font-bold text-sm">{inv.candidate?.fullName || "Candidate"}</h4>
                    <p className="text-xs text-muted-foreground">
                      Invited to: <strong>{inv.job?.title}</strong> • Sent on{" "}
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        inv.status === "ACCEPTED" ? "default" :
                        inv.status === "DECLINED" ? "destructive" :
                        inv.status === "CANCELLED" ? "outline" : "secondary"
                      }
                    >
                      {inv.status}
                    </Badge>

                    {inv.status === "PENDING" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 text-xs h-8"
                        onClick={() => handleCancelInvite(inv.id)}
                      >
                        Cancel Invitation
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* CREATE TALENT POOL MODAL */}
      <Dialog open={isPoolModalOpen} onOpenChange={setIsPoolModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Talent Pool</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="Pool Name (e.g. Frontend Engineers)..."
              value={newPoolName}
              onChange={(e) => setNewPoolName(e.target.value)}
            />
            <Textarea
              placeholder="Optional description..."
              value={newPoolDesc}
              onChange={(e) => setNewPoolDesc(e.target.value)}
            />
            <Button size="sm" onClick={handleCreatePool} className="w-full">
              Create Pool
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* INVITE CANDIDATE MODAL */}
      <Dialog open={!!selectedCandForInvite} onOpenChange={() => setSelectedCandForInvite(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite {selectedCandForInvite?.fullName} to Apply</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Select Target Active Job</label>
              <select
                className="w-full border rounded-md p-2 text-sm bg-background"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
              >
                <option value="">-- Choose Job Posting --</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Custom Invitation Message</label>
              <Textarea
                placeholder="Optional message to candidate..."
                value={inviteMsg}
                onChange={(e) => setInviteMsg(e.target.value)}
              />
            </div>

            <Button size="sm" onClick={handleSendInvite} className="w-full">
              Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
