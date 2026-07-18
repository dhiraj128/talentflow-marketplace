"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, Share2, Download } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface CourseCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
}

export function CourseCompletionDialog({ open, onOpenChange, courseTitle }: CourseCompletionDialogProps) {
  const { width, height } = useWindowSize();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        {open && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}
        
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <Award className="w-8 h-8" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">Congratulations!</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-muted-foreground mb-2">You have successfully completed</p>
          <p className="font-bold text-lg">{courseTitle}</p>
          
          <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border/60">
            <p className="text-sm font-medium mb-3">Your certificate is ready</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-center flex-col sm:flex-row gap-2 mt-2">
          <Link href="/job-seeker/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">Back to Dashboard</Button>
          </Link>
          <Link href="/find-courses" className="w-full sm:w-auto">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Explore More Courses</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
