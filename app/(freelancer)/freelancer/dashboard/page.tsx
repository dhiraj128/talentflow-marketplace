"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { MetricCard } from "@/components/shared/MetricCard";
import { Briefcase, DollarSign, Star, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Dashboard" 
        description="Welcome back. Here's an overview of your freelance business."
        actionLabel="Find Work"
      />

      <StatsGrid columns={4}>
        <MetricCard title="Total Earnings" value="$12,450" icon={<DollarSign className="w-4 h-4" />} trend="up" trendValue="+15%" />
        <MetricCard title="Active Projects" value="4" icon={<Briefcase className="w-4 h-4" />} />
        <MetricCard title="Proposals Sent" value="12" icon={<Clock className="w-4 h-4" />} trend="up" trendValue="+2 this week" />
        <MetricCard title="Success Rate" value="98%" icon={<Star className="w-4 h-4" />} trend="neutral" trendValue="Top Rated" />
      </StatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium">Senior React Developer</p>
                    <p className="text-sm text-muted-foreground">Submitted 2 days ago</p>
                  </div>
                  <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">In Review</div>
                </div>
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium">UI/UX Designer for FinTech App</p>
                    <p className="text-sm text-muted-foreground">Submitted 1 week ago</p>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Interviewing</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
                <p className="text-sm text-muted-foreground">85% Complete. Add portfolio items to reach 100%.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
