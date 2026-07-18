"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkillsManagement } from "@/features/admin/master-data/SkillsManagement";

export default function SkillsPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Skills Management" 
        description="Manage skills for job seekers, freelancers, and course topics."
      />
      <div className="mt-8">
        <SkillsManagement />
      </div>
    </PageContainer>
  );
}
