"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Edit, Trash2, Eye, History, CheckCircle, AlertCircle } from "lucide-react";
import { FileUpload } from "@/components/shared/FileUpload";

export default function MyResumePage() {
  const [resumes, setResumes] = useState([
    { id: 1, name: "Software Engineer Resume.pdf", date: "Oct 12, 2023", default: true, published: true, isPublic: true, atsScore: 85 },
    { id: 2, name: "Frontend Developer Tailored.pdf", date: "Nov 05, 2023", default: false, published: false, isPublic: false, atsScore: 72 },
  ]);

  const [versionHistory, setVersionHistory] = useState([
    { version: "v2.0", date: "Nov 05, 2023", changes: "Updated Next.js experience" },
    { version: "v1.0", date: "Oct 12, 2023", changes: "Initial upload" }
  ]);

  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setUploading(true);
      setTimeout(() => {
        const newResume = {
          id: Date.now(),
          name: file.name,
          date: new Date().toLocaleDateString(),
          default: resumes.length === 0,
          published: false,
          isPublic: false,
          atsScore: Math.floor(Math.random() * 30) + 60, // random score 60-90
        };
        setResumes([newResume, ...resumes]);
        setVersionHistory([{ version: `v${versionHistory.length + 1}.0`, date: new Date().toLocaleDateString(), changes: `Uploaded ${file.name}` }, ...versionHistory]);
        setUploading(false);
      }, 1000);
    }
  };

  const togglePublish = (id: number) => {
    setResumes(resumes.map(r => r.id === id ? { ...r, published: !r.published } : r));
  };

  const togglePublic = (id: number) => {
    setResumes(resumes.map(r => r.id === id ? { ...r, isPublic: !r.isPublic } : r));
  };

  const deleteResume = (id: number) => {
    setResumes(resumes.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Resumes</h2>
          <p className="text-muted-foreground mt-1">Manage your saved resumes, check ATS scores, and control visibility.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Resume</CardTitle>
              <CardDescription>Supported formats: PDF, DOC, DOCX. Max size 5MB.</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload 
                onFileSelect={handleFileSelect} 
                accept=".pdf,.doc,.docx"
                maxSizeMB={5}
              />
              {uploading && <p className="text-sm text-primary mt-2">Uploading and analyzing resume...</p>}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumes.map((resume) => (
              <Card key={resume.id} className={resume.default ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded text-muted-foreground">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <CardTitle className="text-lg truncate" title={resume.name}>{resume.name}</CardTitle>
                      <CardDescription>Updated: {resume.date}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    {resume.default && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Default Resume
                      </span>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">ATS Score:</span>
                      <span className={`font-bold ${resume.atsScore >= 80 ? 'text-green-600' : resume.atsScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {resume.atsScore}/100
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Marketplace Visibility</span>
                    <Button 
                      variant={resume.published ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => togglePublish(resume.id)}
                    >
                      {resume.published ? "Published" : "Unpublished"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Public Link</span>
                    <Button 
                      variant={resume.isPublic ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => togglePublic(resume.id)}
                    >
                      {resume.isPublic ? "Public" : "Private"}
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-1 border-t p-2 bg-muted/20">
                  <Button variant="ghost" size="sm" title="Preview">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" title="Delete" onClick={() => deleteResume(resume.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Version History
              </CardTitle>
              <CardDescription>Track changes to your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 border-l-2 border-muted ml-3 pl-4">
                {versionHistory.map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                    <p className="font-medium text-sm">{item.version}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                    <p className="text-sm mt-1">{item.changes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                ATS Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>Keyword Match</span>
                <span className="font-medium text-green-600">85%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Formatting</span>
                <span className="font-medium text-green-600">Good</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Missing Skills</span>
                <span className="font-medium text-amber-600">3 Identified</span>
              </div>
              <Button variant="outline" className="w-full mt-2" size="sm">View Detailed Report</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
