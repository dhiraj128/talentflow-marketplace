"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { OfferManagement } from "@/features/admin/offers/OfferManagement";

export default function OffersPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Offer Management" 
        description="Manage promotional banners and targeted offers."
      />
      <div className="mt-8">
        <OfferManagement />
      </div>
    </PageContainer>
  );
}
