"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { MetricCard } from "@/components/shared/MetricCard";
import { DollarSign, ArrowUpRight, ArrowDownRight, Wallet, Receipt } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { analyticsService } from "@/lib/services/analytics.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function EarningsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsService.getFreelancerDashboard()
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load earnings", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }

  const earnings = data?.stats?.earnings ?? 0;
  const transactions = data?.transactions || [];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Earnings Overview" 
        description="Track your financial performance and pending balances."
      />

      <StatsGrid columns={4}>
        <MetricCard title="Net Income" value={`$${earnings.toLocaleString()}`} icon={<DollarSign className="w-4 h-4" />} />
        <MetricCard title="Withdrawn" value="$0" icon={<ArrowUpRight className="w-4 h-4" />} />
        <MetricCard title="Pending Clearance" value="$0" icon={<ArrowDownRight className="w-4 h-4" />} />
        <MetricCard title="Available for Withdrawal" value={`$${earnings.toLocaleString()}`} icon={<Wallet className="w-4 h-4" />} />
      </StatsGrid>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Receipt className="w-10 h-10 text-muted-foreground/50 mb-3" />
                <p className="font-medium text-sm text-muted-foreground">No transactions yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Earnings from completed projects will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx: any) => (
                  <div key={tx.id} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+${tx.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full flex flex-col justify-center">
          <CardHeader>
            <CardTitle>Earnings Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <DollarSign className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-2xl font-bold">${earnings.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">Total cleared earnings across all contracts.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
