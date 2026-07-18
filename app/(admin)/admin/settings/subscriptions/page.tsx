"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { SubscriptionTable } from "@/features/admin/subscriptions/SubscriptionTable";
import { ExpiryTracker } from "@/features/admin/subscriptions/ExpiryTracker";

export default function SubscriptionsPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Subscription Management" 
        description="Monitor user subscriptions, renewals, and expiring plans."
      />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <SubscriptionTable />
        </div>
        <div className="lg:col-span-1">
          <ExpiryTracker />
        </div>
      </div>
    </PageContainer>
  );
}
