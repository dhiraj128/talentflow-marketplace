"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { LocationManagement } from "@/features/admin/master-data/LocationManagement";

export default function LocationsPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Location Management" 
        description="Manage countries, states, and cities for the platform."
      />
      <div className="mt-8">
        <LocationManagement />
      </div>
    </PageContainer>
  );
}
