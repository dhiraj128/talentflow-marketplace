"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { Certificate } from "./CertificateCard";

interface CertificatePreviewProps {
  certificate: Certificate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CertificatePreview({ certificate, open, onOpenChange }: CertificatePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-muted/20">
        <DialogHeader className="p-4 bg-background border-b border-border/60 flex flex-row items-center justify-between">
          <DialogTitle>{certificate.courseTitle}</DialogTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
              <Share2 className="w-4 h-4" /> Share
            </Button>
            <Button size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-8 flex items-center justify-center min-h-[500px]">
          <div className="w-full max-w-3xl aspect-[1.414/1] bg-white text-slate-900 border shadow-2xl relative p-12 flex flex-col items-center justify-center text-center">
            {/* Certificate Template Mock */}
            <div className="absolute inset-4 border-2 border-slate-200 p-2">
              <div className="absolute inset-0 border border-slate-300"></div>
            </div>
            
            <div className="relative z-10 w-full">
              <h2 className="text-4xl font-serif text-slate-400 mb-8 uppercase tracking-[0.2em]">Certificate of Completion</h2>
              <p className="text-lg text-slate-600 mb-4">This is to certify that</p>
              <h1 className="text-5xl font-serif text-slate-800 border-b-2 border-slate-300 pb-2 mb-8 inline-block px-12">
                John Doe
              </h1>
              <p className="text-lg text-slate-600 mb-2">has successfully completed the course</p>
              <h3 className="text-3xl font-serif text-indigo-900 mb-12">{certificate.courseTitle}</h3>
              
              <div className="flex justify-between items-end px-12 mt-16 w-full">
                <div className="text-center">
                  <div className="border-b border-slate-400 w-48 pb-1 mb-2 font-serif italic text-xl">TalentFlow</div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Issuing Organization</p>
                </div>
                
                <div className="w-32 h-32 border-4 border-amber-500 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-1 border border-amber-400 rounded-full"></div>
                  <div className="text-center text-amber-600 font-serif leading-tight transform -rotate-12">
                    <span className="block text-xs uppercase tracking-wider">Verified</span>
                    <span className="block text-xl font-bold">Credential</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="border-b border-slate-400 w-48 pb-1 mb-2 font-serif text-lg">{certificate.issueDate}</div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Date Issued</p>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-slate-400 font-mono">
                Credential ID: {certificate.credentialId}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
