import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface EmployerWelcomeHeaderProps {
  user: any;
}

export function EmployerWelcomeHeader({ user }: EmployerWelcomeHeaderProps) {
  const companyName = user?.profile?.companyName || "Employer";
  const today = format(new Date(), "EEEE, MMMM do, yyyy");

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-primary/10 via-transparent to-transparent p-6 rounded-2xl border border-primary/10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {companyName} 👋</h1>
        <p className="text-muted-foreground">
          {today} • Here is what's happening with your hiring today.
        </p>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <Button variant="outline" className="flex-1 md:flex-none p-0">
          <Link href="/employer/applications" className="flex items-center justify-center w-full h-full px-4 py-2">
            <Search className="w-4 h-4 mr-2" /> Search Talent
          </Link>
        </Button>
        <Button className="flex-1 md:flex-none p-0">
          <Link href="/employer/post-job" className="flex items-center justify-center w-full h-full px-4 py-2">
            <PlusCircle className="w-4 h-4 mr-2" /> Post New Job
          </Link>
        </Button>
      </div>
    </div>
  );
}
