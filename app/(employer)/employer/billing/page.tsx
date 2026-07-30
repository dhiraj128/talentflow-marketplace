"use client";
import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Receipt } from "lucide-react";

export default function BillingPage() {
  const data: any[] = [];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Billing & Invoices" description="Manage your billing information and view past invoices." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Your current primary payment method</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <CreditCard className="w-10 h-10 text-muted-foreground/40 mb-2" />
            <p className="font-medium text-sm">No payment method on file</p>
            <p className="text-xs text-muted-foreground/60 mt-1 mb-4">Add a payment method to post promoted job listings.</p>
            <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Add Payment Method</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Recent invoices and charges</CardDescription>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Receipt className="w-10 h-10 text-muted-foreground/40 mb-2" />
              <p className="font-medium text-sm">No billing history</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Invoices and transaction records will be displayed here.</p>
            </div>
          ) : (
            <div>History</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
