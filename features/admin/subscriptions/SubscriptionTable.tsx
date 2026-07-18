"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/services/admin.service";
import { DataTable, ColumnDef } from "@/features/admin/shared/DataTable";
import { StatusBadge } from "@/features/admin/shared/StatusBadge";
import { SearchBar } from "@/features/admin/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { RefreshCcw, XCircle, Clock } from "lucide-react";
import { ConfirmationDialog } from "@/features/admin/shared/ConfirmationDialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Subscription {
  id: string;
  plan?: any;
  user?: any;
  status?: string;
  billingCycle?: string;
  startDate?: string;
  expiryDate?: string;
}

export function SubscriptionTable() {
  const { data: subscriptionsData = [], isLoading } = useQuery({
    queryKey: ['admin', 'subscriptions'],
    queryFn: adminService.getSubscriptions,
  });

  const data = Array.isArray(subscriptionsData) ? subscriptionsData : subscriptionsData.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("ALL");
  
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const filteredData = data.filter((item: Subscription) => {
    const subscriberName = item.user?.firstName || item.user?.companyName || "Unknown";
    const planName = item.plan?.name || "Unknown Plan";
    return (activeTab === "ALL" || item.status === activeTab) &&
           (subscriberName.toLowerCase().includes(searchTerm.toLowerCase()) || planName.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleCancelClick = (id: string) => {
    setActionId(id);
    setIsCancelDialogOpen(true);
  };

  const handleRenewClick = (id: string) => {
    setActionId(id);
    setIsRenewDialogOpen(true);
  };

  const confirmCancel = () => {
    // API Call to cancel
    setIsCancelDialogOpen(false);
    setActionId(null);
  };

  const confirmRenew = () => {
    // API call to renew
    setIsRenewDialogOpen(false);
    setActionId(null);
  };

  const columns: ColumnDef<Subscription>[] = [
    { header: "Subscriber", cell: (row) => row.user?.firstName || row.user?.companyName || "Unknown", className: "font-medium" },
    { header: "Plan", cell: (row) => row.plan?.name || "Unknown Plan" },
    { header: "Billing", accessorKey: "billingCycle" },
    { header: "Start Date", cell: (row) => row.startDate ? new Date(row.startDate).toLocaleDateString() : "", className: "hidden md:table-cell" },
    { 
      header: "Expiry", 
      cell: (row) => (
        <div>
          <div>{row.expiryDate ? new Date(row.expiryDate).toLocaleDateString() : ""}</div>
        </div>
      ) 
    },
    { header: "Status", cell: (row) => <StatusBadge status={row.status || "UNKNOWN"} /> },
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

      <DataTable data={filteredData} columns={columns} keyExtractor={(row) => row.id} isLoading={isLoading} />

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
