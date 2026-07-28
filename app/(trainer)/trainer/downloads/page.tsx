"use client";

import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Download, FileText, Video, Archive, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useState } from "react"

export default function DownloadsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resourceTitle, setResourceTitle] = useState("");

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle) return;
    setIsDialogOpen(false);
    setResourceTitle("");
    toast.success("Resource uploaded successfully!");
  };

  const categories = [
    {
      title: "PDF Guides & E-books",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      items: [
        { name: "React Cheat Sheet 2023.pdf", size: "2.4 MB", downloads: 420 },
        { name: "Next.js Architecture Guide.pdf", size: "5.1 MB", downloads: 310 },
      ]
    },
    {
      title: "Video Lessons & Assets",
      icon: <Video className="h-5 w-5 text-purple-500" />,
      items: [
        { name: "Module 1 - Intro Video.mp4", size: "124 MB", downloads: 580 },
        { name: "Figma UI Kit Asset Pack.zip", size: "45 MB", downloads: 290 },
      ]
    },
    {
      title: "Source Code & Projects",
      icon: <Archive className="h-5 w-5 text-emerald-500" />,
      items: [
        { name: "Final-Project-Starter.zip", size: "12 MB", downloads: 640 },
        { name: "TypeScript-Exercises.zip", size: "4.2 MB", downloads: 510 },
      ]
    }
  ]

  return (
    <>
      <PageHeader 
        title="Downloads & Resources" 
        description="Manage the Material Library (PDFs, Videos, ZIP Files) for your students." 
        action={<Button onClick={() => setIsDialogOpen(true)}><Upload className="h-4 w-4 mr-2" /> Upload Resource</Button>}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        {categories.map((category, idx) => (
          <Card key={idx} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  {category.icon}
                </div>
                <div>
                  <CardTitle className="text-base">{category.title}</CardTitle>
                  <CardDescription>{category.items.length} files available</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                {category.items.map((file, fIdx) => (
                  <div key={fIdx} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {file.downloads}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="flex-shrink-0 ml-2">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
