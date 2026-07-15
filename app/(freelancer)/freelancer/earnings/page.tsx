"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { MetricCard } from "@/components/shared/MetricCard";
import { DollarSign, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EarningsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Earnings Overview" 
        description="Track your financial performance and pending balances."
      />

      <StatsGrid columns={4}>
        <MetricCard title="Net Income" value="$34,250" icon={<DollarSign className="w-4 h-4" />} trend="up" trendValue="+12% from last month" />
        <MetricCard title="Withdrawn" value="$28,000" icon={<ArrowUpRight className="w-4 h-4" />} />
        <MetricCard title="Pending Clearance" value="$1,250" icon={<ArrowDownRight className="w-4 h-4" />} />
        <MetricCard title="Available for Withdrawal" value="$5,000" icon={<Wallet className="w-4 h-4" />} />
      </StatsGrid>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="font-medium">Milestone Payment - App Design</p>
                  <p className="text-sm text-muted-foreground">Cleared on Oct 14</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+$800</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="font-medium">Withdrawal to Bank Account</p>
                  <p className="text-sm text-muted-foreground">Processed on Oct 10</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">-$1,500</p>
                </div>
              </div>
              <div className="flex justify-between items-center pb-4">
                <div>
                  <p className="font-medium">Hourly Contract - Next.js Dev</p>
                  <p className="text-sm text-muted-foreground">Pending clearance (Expected Oct 18)</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-yellow-600">+$450</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earnings by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[250px]">
             {/* Placeholder for chart */}
             <div className="w-48 h-48 rounded-full border-8 border-primary border-r-muted flex items-center justify-center">
                <span className="font-medium text-muted-foreground">Chart Area</span>
             </div>
             <div className="flex gap-4 mt-6 text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary rounded-full"></div> Web Dev (65%)</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-muted rounded-full"></div> UI/UX (35%)</div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
