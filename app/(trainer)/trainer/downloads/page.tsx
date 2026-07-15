"use client";

import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Download, File, FileText, FileArchive, Upload, Video } from "lucide-react"

export default function DownloadsPage() {
  const categories = [
    {
      title: "PDF Documents",
      description: "Cheatsheets, guides, and text materials",
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      files: [
        { id: 1, name: "React Cheat Sheet.pdf", size: "2.4 MB", downloads: 145 },
        { id: 2, name: "Advanced Patterns.pdf", size: "1.8 MB", downloads: 89 },
      ]
    },
    {
      title: "Video Lessons",
      description: "Recorded sessions and tutorials",
      icon: <Video className="h-5 w-5 text-purple-500" />,
      files: [
        { id: 3, name: "State Management Deep Dive.mp4", size: "245 MB", downloads: 420 },
        { id: 4, name: "Next.js Routing.mp4", size: "180 MB", downloads: 312 },
      ]
    },
    {
      title: "Project Archives",
      description: "Source code and starter templates",
      icon: <FileArchive className="h-5 w-5 text-amber-500" />,
      files: [
        { id: 5, name: "E-Commerce Starter.zip", size: "15 MB", downloads: 856 },
        { id: 6, name: "UI Components Library.zip", size: "8.2 MB", downloads: 432 },
      ]
    }
  ]

  return (
    <>
      <PageHeader 
        title="Downloads & Resources" 
        description="Manage the Material Library (PDFs, Videos, ZIP Files) for your students." 
        action={<Button><Upload className="h-4 w-4 mr-2" /> Upload Resource</Button>}
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
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                {category.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
