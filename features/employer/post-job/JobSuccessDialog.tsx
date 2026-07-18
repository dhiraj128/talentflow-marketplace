import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface JobSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobSuccessDialog({ open, onOpenChange }: JobSuccessDialogProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center flex flex-col items-center">
        <DialogHeader className="flex flex-col items-center pt-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl">Job Submitted!</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Your job posting has been successfully submitted and is currently <strong>Under Review</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground w-full text-left my-4">
          <p>• Our team will review the listing within 2-4 hours.</p>
          <p>• You will receive an email once it is live.</p>
          <p>• In the meantime, you can explore AI-matched candidates.</p>
        </div>

        <div className="flex flex-col gap-3 w-full pb-4">
          <Button className="w-full" onClick={() => router.push("/employer/dashboard")}>
            Return to Dashboard
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.push("/employer/applications")}>
            <Search className="w-4 h-4 mr-2" /> Search AI Candidates
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
