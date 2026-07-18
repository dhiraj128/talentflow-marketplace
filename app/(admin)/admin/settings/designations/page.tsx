"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { DesignationManagement } from "@/features/admin/master-data/DesignationManagement";

export default function DesignationsPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Designation Management" 
        description="Manage job titles and roles across the platform."
      />
      <div className="mt-8">
        <DesignationManagement />
      </div>
    </PageContainer>
  );
}
