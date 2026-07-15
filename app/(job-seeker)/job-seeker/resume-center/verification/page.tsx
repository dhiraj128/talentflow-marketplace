"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Upload, AlertCircle } from "lucide-react";
import { FileUpload } from "@/components/shared/FileUpload";

export default function VerificationPage() {
  const verifiedItems = [
    { title: "Identity", status: "verified", date: "Aug 15, 2023" },
    { title: "Education - B.S. Computer Science", status: "verified", date: "Sep 02, 2023" },
    { title: "Employment - Tech Corp Inc.", status: "pending", date: "Pending Verification" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Credential Verification</h2>
          <p className="text-muted-foreground">Verify your education and work experience to stand out to employers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verification Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">65%</div>
            <p className="text-xs text-muted-foreground mt-1">Intermediate level</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Manage and view the status of your verified credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {verifiedItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${item.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {item.status === 'verified' ? <ShieldCheck className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <div>
                    {item.status === 'verified' ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In Progress</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Credential</CardTitle>
              <CardDescription>Upload a document for verification (ID, Diploma, etc.)</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onFileSelect={() => {}} accept=".pdf,.png,.jpg,.jpeg" maxSizeMB={5} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
