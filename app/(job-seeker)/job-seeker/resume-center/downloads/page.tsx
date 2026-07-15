import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, File } from "lucide-react";

export default function DownloadsPage() {
  const files = [
    { name: "JohnDoe_Resume_2023.pdf", size: "1.2 MB", date: "Oct 12, 2023", type: "pdf" },
    { name: "JohnDoe_CoverLetter_Tech.pdf", size: "450 KB", date: "Oct 14, 2023", type: "pdf" },
    { name: "Portfolio_Export.zip", size: "15 MB", date: "Sep 28, 2023", type: "zip" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Downloads & Exports</h2>
        <p className="text-muted-foreground">Access your previously exported resumes, cover letters, and data.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Files</CardTitle>
          <CardDescription>Files you have recently generated or exported.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {file.type === 'pdf' ? <FileText className="h-6 w-6" /> : <File className="h-6 w-6" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{file.name}</h4>
                    <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
