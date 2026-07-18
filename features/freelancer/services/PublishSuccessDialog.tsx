import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PublishSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PublishSuccessDialog({ open, onOpenChange }: PublishSuccessDialogProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center flex flex-col items-center py-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Service Submitted</DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Your service has been successfully submitted and is currently <span className="font-semibold text-foreground">under review</span> by our moderation team. 
            <br/><br/>
            You will be notified once it is approved and live on the marketplace.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full mt-6 flex-col gap-2 sm:flex-col">
          <Button onClick={() => router.push("/freelancer/dashboard")} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Go to Dashboard
          </Button>
          <Button variant="outline" onClick={() => router.push("/find-freelancers")} className="w-full">
            Browse Marketplace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
