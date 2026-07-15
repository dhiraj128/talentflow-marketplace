"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock, UploadCloud, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface VerificationDocument {
  id: string;
  type: string;
  name: string;
  status: "verified" | "pending" | "rejected" | "missing";
  uploadedAt?: string;
  required?: boolean;
}

interface VerificationModuleProps {
  title?: string;
  description?: string;
  documents?: VerificationDocument[];
  overallProgress?: number;
  [key: string]: any;
}

export function VerificationModule({ 
  title = "Identity Verification", 
  description = "Please upload the required documents to verify your account.",
  documents = [],
  overallProgress = 0,
  ...rest
}: VerificationModuleProps) {
  
  const displayDocuments = documents.length > 0 ? documents : rest.type === "identity" ? [
    { id: "id-doc", type: "Identity", name: "Identity Verification", status: "missing" as const, required: true }
  ] : [];
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "pending": return <Clock className="w-5 h-5 text-amber-500" />;
      case "rejected": return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified": return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Verified</Badge>;
      case "pending": return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>;
      case "rejected": return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>;
      default: return <Badge variant="outline" className="bg-muted text-muted-foreground">Missing</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          
          <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground mt-4 pt-2">
            <div className="flex items-center gap-1"><span className="text-red-500 text-base font-bold leading-none mt-1">*</span> Required</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full border-2 border-slate-300 bg-white"></span> Optional</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pending</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Verified</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Rejected</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="space-y-4 pt-4">
            <div className="grid gap-3">
              {displayDocuments.map(doc => {
                const isIdentityBlock = doc.name === "Identity Verification" || doc.type === "Identity" && doc.name !== "Aadhaar Card"; // Fallback to avoid breaking old usage
                
                return (
                <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="mt-1 sm:mt-0">{getStatusIcon(doc.status)}</div>
                    <div>
                      {isIdentityBlock ? (
                        <div className="flex items-center gap-2 mb-1">
                          <Select defaultValue="Aadhaar">
                            <SelectTrigger className="w-[180px] h-8 text-sm font-medium">
                              <SelectValue placeholder="Select ID Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Aadhaar">Aadhaar</SelectItem>
                              <SelectItem value="PAN">PAN</SelectItem>
                              <SelectItem value="Passport">Passport</SelectItem>
                              <SelectItem value="DL">DL</SelectItem>
                              <SelectItem value="Voter ID">Voter ID</SelectItem>
                            </SelectContent>
                          </Select>
                          {doc.required ? (
                            <span className="text-red-500 text-lg font-bold leading-none">*</span>
                          ) : (
                            <span className="text-muted-foreground text-xs font-normal ml-1">(Optional)</span>
                          )}
                        </div>
                      ) : (
                        <p className="font-medium flex items-center gap-1">
                          {doc.name}
                          {doc.required ? (
                            <span className="text-red-500 text-lg font-bold leading-none">*</span>
                          ) : (
                            <span className="text-muted-foreground text-xs font-normal ml-1">(Optional)</span>
                          )}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <FileText className="w-3 h-3" /> {doc.type}
                        {doc.uploadedAt && <span className="ml-2 border-l pl-2">Uploaded: {doc.uploadedAt}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {getStatusBadge(doc.status)}
                    {(doc.status === "missing" || doc.status === "rejected") && (
                      <Button size="sm" variant="outline"><UploadCloud className="w-4 h-4 mr-2"/> Upload</Button>
                    )}
                  </div>
                </div>
              )})}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
