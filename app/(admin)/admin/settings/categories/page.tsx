"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { CategoryManagement } from "@/features/admin/master-data/CategoryManagement";

export default function CategoriesPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Category Management" 
        description="Manage platform categories used across jobs, freelancers, and courses."
      />
      <div className="mt-8">
        <CategoryManagement />
      </div>
    </PageContainer>
  );
}
