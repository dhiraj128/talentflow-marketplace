"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/EmptyState";
import { DollarSign, Calendar, MapPin, Briefcase, Award, CheckCircle, XCircle, Clock, Building2 } from "lucide-react";
import { offerService } from "@/lib/services/offer.service";
import { format } from "date-fns";
import { toast } from "sonner";

export default function CandidateOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Decline Dialog State
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [isDeclineOpen, setIsDeclineOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const data = await offerService.getCandidateOffers();
      setOffers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load offers", err);
      setOffers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    if (confirm("Are you sure you want to accept this job offer? Accepting will finalize your hire for this role.")) {
      try {
        await offerService.acceptOffer(id);
        toast.success("Congratulations! You have accepted the job offer!");
        fetchOffers();
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to accept offer");
      }
    }
  };

  const openDeclineDialog = (offer: any) => {
    setSelectedOffer(offer);
    setDeclineReason("");
    setIsDeclineOpen(true);
  };

  const handleDeclineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer) return;
    setIsSubmitting(true);
    try {
      await offerService.declineOffer(selectedOffer.id, declineReason);
      toast.info("Job offer declined");
      setIsDeclineOpen(false);
      fetchOffers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to decline offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
      case "VIEWED":
        return <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">Active Offer</Badge>;
      case "ACCEPTED":
        return <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Accepted</Badge>;
      case "DECLINED":
        return <Badge variant="outline" className="text-rose-600 bg-rose-50 border-rose-200">Declined</Badge>;
      case "WITHDRAWN":
        return <Badge variant="outline" className="text-gray-600 bg-gray-50 border-gray-200">Withdrawn</Badge>;
      case "EXPIRED":
        return <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const activeOffers = offers.filter((o) => o.status === "SENT" || o.status === "VIEWED");
  const acceptedOffers = offers.filter((o) => o.status === "ACCEPTED");
  const declinedOffers = offers.filter((o) => o.status === "DECLINED" || o.status === "WITHDRAWN");
  const expiredOffers = offers.filter((o) => o.status === "EXPIRED");

  const renderOfferCard = (offer: any) => {
    const isActive = offer.status === "SENT" || offer.status === "VIEWED";
    const joining = offer.joiningDate ? new Date(offer.joiningDate) : null;
    const expires = offer.expiresAt ? new Date(offer.expiresAt) : null;

    return (
      <Card key={offer.id} className="flex flex-col border shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle className="text-xl line-clamp-1">{offer.title || offer.job?.title || "Job Offer"}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground mt-1.5">
                <Building2 className="w-4 h-4 mr-2 shrink-0" />
                <span className="line-clamp-1">{offer.employer?.companyName || "Employer"}</span>
              </div>
            </div>
            {getStatusBadge(offer.status)}
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4 text-sm">
          <div className="p-4 bg-muted/40 rounded-xl grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                <DollarSign className="w-3.5 h-3.5 text-green-600" /> Compensation
              </span>
              <p className="font-bold text-base text-foreground">
                {offer.salaryCurrency} {offer.salaryAmount?.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ {offer.salaryPeriod?.toLowerCase()}</span>
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Joining Date
              </span>
              <p className="font-semibold text-sm text-foreground">
                {joining ? format(joining, "MMM dd, yyyy") : "Flexible"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {offer.employmentType && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Briefcase className="w-3.5 h-3.5" /> {offer.employmentType}
              </div>
            )}
            {offer.workLocation && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" /> {offer.workLocation}
              </div>
            )}
          </div>

          {offer.message && (
            <div className="p-3 border rounded-lg bg-card space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Employer Message:</span>
              <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap">{offer.message}</p>
            </div>
          )}

          {expires && isActive && (
            <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
              <Clock className="w-3.5 h-3.5" /> Offer expires on {format(expires, "MMM dd, yyyy")}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 border-t flex justify-end gap-2">
          {isActive && (
            <>
              <Button variant="outline" size="sm" onClick={() => openDeclineDialog(offer)} className="text-rose-600 hover:bg-rose-50">
                <XCircle className="w-4 h-4 mr-1.5" /> Decline
              </Button>
              <Button size="sm" onClick={() => handleAccept(offer.id)} className="bg-green-600 hover:bg-green-700 gap-1.5">
                <CheckCircle className="w-4 h-4" /> Accept Offer
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader
        title="Job Offers"
        description="Review formal job offers extended by marketplace employers"
      />

      <Tabs defaultValue="active" className="w-full space-y-6">
        <TabsList className="flex overflow-x-auto w-full max-w-lg justify-start sm:justify-center">
          <TabsTrigger value="active" className="text-xs sm:text-sm">Active ({activeOffers.length})</TabsTrigger>
          <TabsTrigger value="accepted" className="text-xs sm:text-sm">Accepted ({acceptedOffers.length})</TabsTrigger>
          <TabsTrigger value="declined" className="text-xs sm:text-sm">Declined ({declinedOffers.length})</TabsTrigger>
          <TabsTrigger value="expired" className="text-xs sm:text-sm">Expired ({expiredOffers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading job offers...</div>
          ) : activeOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{activeOffers.map(renderOfferCard)}</div>
          ) : (
            <EmptyState
              icon={<Award className="h-10 w-10 text-muted-foreground" />}
              title="No active job offers"
              description="Formal job offers extended to you will appear here for your review and acceptance."
              action={{ label: "View Applications", href: "/job-seeker/applications" }}
            />
          )}
        </TabsContent>

        <TabsContent value="accepted">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading offers...</div>
          ) : acceptedOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{acceptedOffers.map(renderOfferCard)}</div>
          ) : (
            <EmptyState
              icon={<Award className="h-10 w-10 text-muted-foreground" />}
              title="No accepted offers yet"
              description="Accepted offers will be archived here."
            />
          )}
        </TabsContent>

        <TabsContent value="declined">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading offers...</div>
          ) : declinedOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{declinedOffers.map(renderOfferCard)}</div>
          ) : (
            <EmptyState
              icon={<Award className="h-10 w-10 text-muted-foreground" />}
              title="No declined offers"
              description="Declined or withdrawn offers will be listed here."
            />
          )}
        </TabsContent>

        <TabsContent value="expired">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading offers...</div>
          ) : expiredOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{expiredOffers.map(renderOfferCard)}</div>
          ) : (
            <EmptyState
              icon={<Award className="h-10 w-10 text-muted-foreground" />}
              title="No expired offers"
              description="Offers past their validity period will appear here."
            />
          )}
        </TabsContent>
      </Tabs>

      {/* DECLINE OFFER DIALOG */}
      <Dialog open={isDeclineOpen} onOpenChange={setIsDeclineOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Decline Job Offer</DialogTitle>
            <DialogDescription>
              Are you sure you want to decline this job offer? You may optionally provide feedback for the employer.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDeclineSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Reason for Declining (Optional)</Label>
              <Textarea
                placeholder="e.g. Accepted another position, salary mismatch, location..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" type="button" onClick={() => setIsDeclineOpen(false)}>
                Keep Offer
              </Button>
              <Button type="submit" variant="destructive" disabled={isSubmitting}>
                {isSubmitting ? "Declining..." : "Decline Offer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
