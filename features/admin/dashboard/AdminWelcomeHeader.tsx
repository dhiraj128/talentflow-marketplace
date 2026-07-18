import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface AdminWelcomeHeaderProps {
  user: any;
}

export function AdminWelcomeHeader({ user }: AdminWelcomeHeaderProps) {
  const firstName = user?.firstName || "Admin";

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
          Welcome back, {firstName}
        </h1>
        <p className="text-muted-foreground text-lg">
          Here's an overview of the platform's performance today.
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Button variant="outline" className="gap-2 bg-background/50 backdrop-blur">
          <Download className="w-4 h-4" /> Export Report
        </Button>
      </div>
    </div>
  );
}
