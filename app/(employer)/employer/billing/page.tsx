"use client";
import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Download } from "lucide-react";

export default function BillingPage() {
  const columns = [
    { accessorKey: "invoice", header: "Invoice" },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "status", header: "Status" },
    { 
      id: "actions",
      header: "Actions",
      cell: () => (
        <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
      )
    },
  ];

  const data = [
    { invoice: "INV-2023-001", date: "Oct 01, 2023", amount: "$299.00", status: "Paid" },
    { invoice: "INV-2023-002", date: "Nov 01, 2023", amount: "$299.00", status: "Paid" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Billing & Invoices" description="Manage your billing information and view past invoices." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Your current primary payment method</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-full">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="outline">Update</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Recent invoices and charges</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
