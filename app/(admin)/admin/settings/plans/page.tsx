"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { PricingPlans } from "@/features/admin/pricing/PricingPlans";

export default function PlansPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Pricing Plans" 
        description="Manage pricing models for memberships, employers, and ATS services."
      />
      <div className="mt-8">
        <PricingPlans />
      </div>
    </PageContainer>
  );
}
