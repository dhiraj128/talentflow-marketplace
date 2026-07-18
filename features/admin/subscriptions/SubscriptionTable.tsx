"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/features/admin/shared/DataTable";
import { StatusBadge } from "@/features/admin/shared/StatusBadge";
import { SearchBar } from "@/features/admin/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { RefreshCcw, XCircle, Clock } from "lucide-react";
import { ConfirmationDialog } from "@/features/admin/shared/ConfirmationDialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Subscription {
  id: string;
  subscriber: string;
  plan: string;
  billingCycle: string;
  startDate: string;
  expiryDate: string;
  daysRemaining: number;
  autoRenewal: boolean;
  status: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "CANCELLED";
}

const mockSubscriptions: Subscription[] = [
  { id: "s1", subscriber: "Acme Corp", plan: "Employer Enterprise", billingCycle: "YEARLY", startDate: "2025-01-01", expiryDate: "2025-12-31", daysRemaining: 150, autoRenewal: true, status: "ACTIVE" },
  { id: "s2", subscriber: "John Doe", plan: "Job Seeker Premium", billingCycle: "MONTHLY", startDate: "2026-06-15", expiryDate: "2026-07-15", daysRemaining: 3, autoRenewal: true, status: "EXPIRING_SOON" },
  { id: "s3", subscriber: "Sarah Smith", plan: "Job Seeker Premium", billingCycle: "MONTHLY", startDate: "2026-05-01", expiryDate: "2026-06-01", daysRemaining: 0, autoRenewal: false, status: "EXPIRED" },
  { id: "s4", subscriber: "TechFlow Ltd", plan: "Employer Starter", billingCycle: "MONTHLY", startDate: "2026-01-01", expiryDate: "2026-02-01", daysRemaining: 0, autoRenewal: false, status: "CANCELLED" },
];

export function SubscriptionTable() {
  const [data, setData] = useState<Subscription[]>(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("ALL");
  
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const filteredData = data.filter((item) =>
    (activeTab === "ALL" || item.status === activeTab) &&
    (item.subscriber.toLowerCase().includes(searchTerm.toLowerCase()) || item.plan.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCancelClick = (id: string) => {
    setActionId(id);
    setIsCancelDialogOpen(true);
  };

  const handleRenewClick = (id: string) => {
    setActionId(id);
    setIsRenewDialogOpen(true);
  };

  const confirmCancel = () => {
    if (actionId) {
      setData((prev) => prev.map(sub => sub.id === actionId ? { ...sub, status: "CANCELLED", autoRenewal: false } : sub));
    }
    setIsCancelDialogOpen(false);
    setActionId(null);
  };

  const confirmRenew = () => {
    if (actionId) {
      setData((prev) => prev.map(sub => sub.id === actionId ? { ...sub, status: "ACTIVE", daysRemaining: 30 } : sub));
    }
    setIsRenewDialogOpen(false);
    setActionId(null);
  };

  const columns: ColumnDef<Subscription>[] = [
    { header: "Subscriber", accessorKey: "subscriber", className: "font-medium" },
    { header: "Plan", accessorKey: "plan" },
    { header: "Billing", accessorKey: "billingCycle" },
    { header: "Start Date", accessorKey: "startDate", className: "hidden md:table-cell" },
    { 
      header: "Expiry", 
      cell: (row) => (
        <div>
          <div>{row.expiryDate}</div>
          {row.status === "ACTIVE" || row.status === "EXPIRING_SOON" ? (
            <div className={`text-xs ${row.daysRemaining <= 7 ? 'text-amber-500 font-bold' : 'text-muted-foreground'}`}>
              {row.daysRemaining} days left
            </div>
          ) : null}
        </div>
      ) 
    },
    { header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status !== "CANCELLED" && (
            <>
              <Button variant="ghost" size="icon" onClick={() => handleRenewClick(row.id)} title="Renew / Extend">
                <RefreshCcw className="w-4 h-4 text-blue-500" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleCancelClick(row.id)} title="Cancel Subscription">
                <XCircle className="w-4 h-4 text-red-500" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto overflow-x-auto">
          <TabsList>
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="ACTIVE">Active</TabsTrigger>
            <TabsTrigger value="EXPIRING_SOON">Expiring Soon</TabsTrigger>
            <TabsTrigger value="EXPIRED">Expired</TabsTrigger>
            <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search subscriber..." />
      </div>

      <DataTable data={filteredData} columns={columns} keyExtractor={(row) => row.id} />

      <ConfirmationDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        title="Cancel Subscription"
        description="Are you sure you want to cancel this subscription? The user will lose access at the end of their current billing cycle."
        confirmText="Cancel Subscription"
        isDestructive={true}
        onConfirm={confirmCancel}
      />

      <ConfirmationDialog
        open={isRenewDialogOpen}
        onOpenChange={setIsRenewDialogOpen}
        title="Renew Subscription"
        description="This will manually extend the subscription by 1 billing cycle."
        confirmText="Renew Now"
        onConfirm={confirmRenew}
      />
    </div>
  );
}
