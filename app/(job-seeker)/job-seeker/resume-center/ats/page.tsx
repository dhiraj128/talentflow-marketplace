"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/shared/FileUpload";
import { CheckCircle, AlertCircle, Scan } from "lucide-react";
import { useState } from "react";

export default function ATSCheckPage() {
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">ATS Resume Checker</h2>
        <p className="text-muted-foreground">Scan your resume against job descriptions to improve your match rate.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Upload Resume</CardTitle>
              <CardDescription>Select the resume you want to analyze.</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onFileSelect={() => {}} accept=".pdf,.doc,.docx" maxSize={5} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Job Description</CardTitle>
              <CardDescription>Paste the job description you are targeting.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="job-description">Job Details</Label>
                <Textarea 
                  id="job-description" 
                  placeholder="Paste the requirements, qualifications, and role description here..." 
                  className="h-48"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => setIsScanning(true)}
                disabled={isScanning}
              >
                <Scan className="mr-2 h-4 w-4" /> 
                {isScanning ? "Scanning..." : "Scan Resume"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>Review your compatibility and suggested improvements.</CardDescription>
            </CardHeader>
            <CardContent>
              {isScanning ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Analyzing keywords and formatting...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center border-2 border-dashed rounded-lg p-6 bg-muted/20">
                  <Scan className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-lg">No Analysis Yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload a resume and paste a job description to see your ATS score and keyword match rate.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
