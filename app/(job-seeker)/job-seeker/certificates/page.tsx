"use client";

import React, { useEffect, useState } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { CertificateGallery } from "@/features/training/certificates/CertificateGallery";
import { certificatesService } from "@/lib/services/certificates.service";
import { EmptyState } from "@/components/shared/EmptyState";
import { Award } from "lucide-react";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await certificatesService.getUserCertificates();
      const list = Array.isArray(data) ? data : data?.data || [];
      
      // Map API format to gallery component format
      const formatted = list.map((c: any) => ({
        id: c.id,
        courseTitle: c.course?.title || c.courseTitle || "Completed Course",
        issueDate: c.issueDate ? new Date(c.issueDate).toLocaleDateString() : new Date().toLocaleDateString(),
        credentialId: c.credentialId || `TF-${c.id?.slice(0, 6)?.toUpperCase()}`,
        skills: c.skills || c.course?.tags || ["Verified Skill"],
        thumbnailUrl: c.thumbnailUrl || c.course?.thumbnailUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop"
      }));

      setCertificates(formatted);
    } catch (err: any) {
      console.error("Failed to load certificates", err);
      setError("Unable to load certificates.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer className="py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">My Certificates</h1>
          <p className="text-muted-foreground">Manage and share your verified credentials earned from completed courses.</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 rounded-xl border bg-muted/20 animate-pulse p-4" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 border rounded-xl bg-red-50/50">
            <p>{error}</p>
            <button
              onClick={fetchCertificates}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        ) : certificates.length > 0 ? (
          <CertificateGallery certificates={certificates} />
        ) : (
          <EmptyState
            icon={<Award className="h-10 w-10 text-muted-foreground" />}
            title="No certificates earned yet"
            description="Complete enrolled courses and assessments to earn shareable certificates."
            action={{ label: "Explore Courses", href: "/find-courses" }}
          />
        )}
      </div>
    </PageContainer>
  );
}
