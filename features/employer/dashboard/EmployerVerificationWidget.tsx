import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerificationBadge, VerificationStatus } from "@/features/employer/shared/VerificationBadge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, FileCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployerVerificationWidgetProps {
  status: VerificationStatus;
}

export function EmployerVerificationWidget({ status }: EmployerVerificationWidgetProps) {
  const isVerified = status === "VERIFIED";

  const getProgress = () => {
    switch (status) {
      case "PENDING": return 25;
      case "DOCUMENTS_SUBMITTED": return 50;
      case "UNDER_REVIEW": return 75;
      case "VERIFIED": return 100;
      case "REJECTED": return 0;
      default: return 25;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-background to-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Verification Status
          <VerificationBadge status={status} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isVerified ? (
          <div className="flex flex-col items-center justify-center p-4 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-green-500" />
            <div>
              <p className="font-medium">Your company is verified</p>
              <p className="text-sm text-muted-foreground">You have full access to hiring tools and candidate outreach.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{getProgress()}%</span>
              </div>
              <Progress value={getProgress()} className="h-2" />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Account Created</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FileCheck className={getProgress() >= 50 ? "w-4 h-4 text-green-500" : "w-4 h-4 text-muted-foreground"} />
                <span className={getProgress() >= 50 ? "" : "text-muted-foreground"}>Documents Submitted</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck className={getProgress() >= 75 ? "w-4 h-4 text-green-500" : "w-4 h-4 text-muted-foreground"} />
                <span className={getProgress() >= 75 ? "" : "text-muted-foreground"}>Under Review (Takes 2–4 hours)</span>
              </div>
            </div>

            {status === "PENDING" && (
              <Button className="w-full mt-2" size="sm">
                Complete Verification
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
