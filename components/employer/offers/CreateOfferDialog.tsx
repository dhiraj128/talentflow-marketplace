"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { offerService } from "@/lib/services/offer.service";
import { Award, DollarSign, Send, Save } from "lucide-react";
import { toast } from "sonner";

interface CreateOfferDialogProps {
  applicationId: string;
  candidateName?: string;
  jobTitle?: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreateOfferDialog({
  applicationId,
  candidateName = "Candidate",
  jobTitle = "Position",
  onSuccess,
  trigger,
}: CreateOfferDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(`Job Offer: ${jobTitle}`);
  const [salaryAmount, setSalaryAmount] = useState<number>(100000);
  const [salaryCurrency, setSalaryCurrency] = useState("USD");
  const [salaryPeriod, setSalaryPeriod] = useState("YEARLY");
  const [joiningDate, setJoiningDate] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [workLocation, setWorkLocation] = useState("Remote");
  const [message, setMessage] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (status: "DRAFT" | "SENT") => {
    if (!joiningDate) {
      toast.error("Please select a valid joining date");
      return;
    }
    setIsSubmitting(true);
    try {
      await offerService.createOffer({
        applicationId,
        title,
        salaryAmount,
        salaryCurrency,
        salaryPeriod,
        joiningDate,
        employmentType,
        workLocation,
        message,
        expiresAt: expiresAt || undefined,
        status,
      });
      toast.success(status === "SENT" ? "Job offer sent to candidate!" : "Draft offer saved");
      setIsOpen(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        {trigger || (
          <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700">
            <Award className="w-4 h-4" /> Create Offer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Extend Formal Job Offer</DialogTitle>
          <DialogDescription>
            Create job offer for <span className="font-semibold text-foreground">{candidateName}</span> for position <span className="font-semibold text-foreground">{jobTitle}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm max-h-[70vh] overflow-y-auto pr-1">
          <div className="space-y-2">
            <Label>Offer Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Job Offer Title"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 space-y-2">
              <Label>Currency</Label>
              <Select value={salaryCurrency} onValueChange={(val) => setSalaryCurrency(val || "USD")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                  <SelectItem value="AUD">AUD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 space-y-2">
              <Label>Amount *</Label>
              <Input
                type="number"
                value={salaryAmount}
                onChange={(e) => setSalaryAmount(Number(e.target.value))}
                required
              />
            </div>
            <div className="col-span-1 space-y-2">
              <Label>Period</Label>
              <Select value={salaryPeriod} onValueChange={(val) => setSalaryPeriod(val || "YEARLY")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="HOURLY">Hourly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Joining Date *</Label>
              <Input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Offer Expiration Date</Label>
              <Input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Employment Type</Label>
              <Select value={employmentType} onValueChange={(val) => setEmploymentType(val || "Full-time")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Work Location</Label>
              <Input
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
                placeholder="e.g. Remote / New York, NY"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Welcome Message / Terms</Label>
            <Textarea
              placeholder="We are thrilled to offer you the position..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
          <Button variant="outline" type="button" onClick={() => handleSubmit("DRAFT")} disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-1.5" /> Save Draft
          </Button>
          <Button type="button" onClick={() => handleSubmit("SENT")} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
            <Send className="w-4 h-4 mr-1.5" /> Send Offer Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
