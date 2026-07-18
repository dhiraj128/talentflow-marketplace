"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon, Check, Send } from "lucide-react";
import { useState } from "react";
import { Certificate } from "./CertificateCard";

interface ShareCertificateDialogProps {
  certificate: Certificate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareCertificateDialog({ certificate, open, onOpenChange }: ShareCertificateDialogProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://talentflow.com/verify/${certificate.credentialId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your achievement</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="flex gap-4 mb-8">
            <Button className="flex-1 bg-[#0A66C2] hover:bg-[#004182] text-white gap-2">
              <Send className="w-4 h-4 fill-current" /> LinkedIn
            </Button>
            <Button className="flex-1 bg-black hover:bg-slate-800 text-white gap-2">
              <Send className="w-4 h-4 fill-current" /> Twitter
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Direct Link</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input readOnly value={shareUrl} className="pl-9 bg-muted/30" />
              </div>
              <Button variant="outline" onClick={handleCopy} className="w-24">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : "Copy"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
