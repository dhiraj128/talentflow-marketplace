"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { CertificateGallery } from "@/features/training/certificates/CertificateGallery";
import { Certificate } from "@/features/training/certificates/CertificateCard";

export default function CertificatesPage() {
  const myCertificates: Certificate[] = [
    {
      id: "cert-1",
      courseTitle: "Advanced React Patterns & Architecture",
      issueDate: "Oct 24, 2026",
      credentialId: "TF-894-REACT",
      skills: ["React", "Architecture", "Hooks", "Next.js"],
      thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "cert-2",
      courseTitle: "Figma UI/UX Design Fundamentals",
      issueDate: "Sep 12, 2026",
      credentialId: "TF-421-FIGMA",
      skills: ["UI Design", "Figma", "Prototyping", "User Research"],
      thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <PageContainer className="py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Certificates</h1>
          <p className="text-muted-foreground">Manage and share your verified credentials.</p>
        </div>

        <CertificateGallery certificates={myCertificates} />
      </div>
    </PageContainer>
  );
}
