"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, File, Plus, FileSignature, CheckCircle2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { resumeService } from "@/lib/services/resume.service";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

interface ExportFile {
  id: string;
  name: string;
  size: string;
  date: string;
  type: string;
  url?: string;
}

export default function DownloadsPage() {
  const { user } = useAuth();
  const candidateId = (user as any)?.profile?.id;
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: realResumes, isLoading, error } = useQuery({
    queryKey: ['candidate-resumes-downloads', candidateId],
    queryFn: () => resumeService.getResumes(candidateId!),
    enabled: !!candidateId
  });

  // Map real backend resumes to downloadable files if present
  const files: ExportFile[] = (Array.isArray(realResumes) && realResumes.length > 0)
    ? realResumes.map((r: any) => ({
        id: r.id,
        name: r.title ? `${r.title.replace(/\s+/g, '_')}_Resume.pdf` : (r.fileName || `Resume_${r.id.slice(0, 8)}.pdf`),
        size: r.fileSize ? `${Math.round(r.fileSize / 1024)} KB` : "1.2 MB",
        date: r.updatedAt ? format(new Date(r.updatedAt), "MMM dd, yyyy") : "Recently",
        type: "pdf",
        url: r.fileUrl || r.resumeUrl
      }))
    : [];

  const handleDownload = async (file: ExportFile) => {
    try {
      setDownloadingId(file.id);
      if (file.url) {
        window.open(file.url, '_blank', 'noopener,noreferrer');
        toast.success(`Started download for ${file.name}`);
      } else {
        // Fallback demo blob download for generated resumes
        const blob = new Blob([`TalentFlow Export: ${file.name}`], { type: 'application/pdf' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
        toast.success(`Downloaded ${file.name}`);
      }
    } catch (err: any) {
      console.error("Download failed:", err);
      toast.error("Failed to download file. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Downloads & Exports</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">Access your generated resumes, cover letters, and exported data.</p>
      </div>

      <Card className="w-full max-w-full min-w-0 overflow-hidden border border-border shadow-sm">
        <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Recent Files</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Files you have recently generated or exported.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading your exported files...</div>
          ) : files.length === 0 ? (
            <div className="py-12 px-4 text-center border-2 border-dashed border-muted rounded-xl bg-muted/20 flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <FileSignature className="h-8 w-8" />
              </div>
              <div className="space-y-1 max-w-md">
                <h3 className="font-semibold text-base text-foreground">No exported files yet</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Create and export your first resume or cover letter to access your download history here.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/job-seeker/resume-center/builder">
                  <Button size="sm" className="min-h-[44px] sm:min-h-[40px] gap-2 px-5">
                    <Plus className="h-4 w-4" /> Create New Resume
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3 w-full max-w-full min-w-0">
              {files.map((file) => (
                <div 
                  key={file.id} 
                  className="w-full max-w-full min-w-0 flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 border border-border rounded-xl hover:bg-muted/40 transition-colors gap-3"
                >
                  {/* File Info */}
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    <div className="p-2.5 bg-primary/10 rounded-lg text-primary shrink-0 mt-0.5 sm:mt-0">
                      {file.type === 'pdf' ? <FileText className="h-5 w-5 sm:h-6 sm:w-6" /> : <File className="h-5 w-5 sm:h-6 sm:w-6" />}
                    </div>
                    <div className="min-w-0 flex-1 pr-1">
                      <h4 className="font-medium text-xs sm:text-sm text-foreground truncate max-w-full" title={file.name}>
                        {file.name}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                        {file.size} • {file.date}
                      </p>
                    </div>
                  </div>

                  {/* Responsive Download Button */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownload(file)}
                    disabled={downloadingId === file.id}
                    className="w-full sm:w-auto shrink-0 min-h-[44px] sm:min-h-[36px] font-medium justify-center gap-2 border-slate-300 dark:border-slate-700 hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>{downloadingId === file.id ? "Downloading..." : "Download"}</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
