import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Compass } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface FreelancerWelcomeHeaderProps {
  user: any;
}

export function FreelancerWelcomeHeader({ user }: FreelancerWelcomeHeaderProps) {
  const name = user?.profile?.fullName || user?.firstName || "Freelancer";
  const today = format(new Date(), "EEEE, MMMM do, yyyy");

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent p-6 rounded-2xl border border-purple-500/10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name} 👋</h1>
        <p className="text-muted-foreground">
          {today} • Here is a summary of your freelance business.
        </p>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <Link href="/find-jobs" className="flex-1 md:flex-none">
          <Button variant="outline" className="w-full">
            <Compass className="w-4 h-4 mr-2" /> Find Projects
          </Button>
        </Link>
        <Link href="/freelancer/services/new" className="flex-1 md:flex-none">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            <PlusCircle className="w-4 h-4 mr-2" /> Create Service
          </Button>
        </Link>
      </div>
    </div>
  );
}
