"use client";

import { useState } from "react";
import { CertificateCard, Certificate } from "./CertificateCard";
import { CertificatePreview } from "./CertificatePreview";
import { ShareCertificateDialog } from "./ShareCertificateDialog";

interface CertificateGalleryProps {
  certificates: Certificate[];
}

export function CertificateGallery({ certificates }: CertificateGalleryProps) {
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [shareCert, setShareCert] = useState<Certificate | null>(null);

  if (certificates.length === 0) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        <p>You haven't earned any certificates yet.</p>
        <p className="text-sm mt-2">Complete courses to earn verified credentials.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <CertificateCard 
            key={cert.id} 
            certificate={cert} 
            onPreview={setPreviewCert}
            onShare={setShareCert}
          />
        ))}
      </div>

      {previewCert && (
        <CertificatePreview 
          certificate={previewCert} 
          open={!!previewCert} 
          onOpenChange={(open) => !open && setPreviewCert(null)} 
        />
      )}

      {shareCert && (
        <ShareCertificateDialog 
          certificate={shareCert} 
          open={!!shareCert} 
          onOpenChange={(open) => !open && setShareCert(null)} 
        />
      )}
    </>
  );
}
