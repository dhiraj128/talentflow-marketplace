"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { CouponManagement } from "@/features/admin/coupons/CouponManagement";

export default function CouponsPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Coupon Management" 
        description="Create and manage discount codes for platform services."
      />
      <div className="mt-8">
        <CouponManagement />
      </div>
    </PageContainer>
  );
}
