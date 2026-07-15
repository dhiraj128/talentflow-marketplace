import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { MetricCard } from "@/components/shared/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, TrendingUp, Users, Clock } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Reports & Analytics" description="Insights into your hiring performance." actionLabel="Download Report" />
      
      <StatsGrid>
        <MetricCard title="Time to Hire" value="18 days" icon={<Clock />} trend="down" trendValue="-2 days" />
        <MetricCard title="Offer Acceptance" value="85%" icon={<TrendingUp />} trend="up" trendValue="+5%" />
        <MetricCard title="Total Hires (YTD)" value="42" icon={<Users />} />
        <MetricCard title="Cost per Hire" value="$1,200" icon={<BarChart />} trend="down" trendValue="-10%" />
      </StatsGrid>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="min-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle>Application Sources</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
            [Chart Placeholder: Sources Breakdown]
          </CardContent>
        </Card>
        <Card className="min-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle>Hiring Pipeline Conversion</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
            [Chart Placeholder: Pipeline Funnel]
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
