import { FileDown, Link as LinkIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LessonResources() {
  const resources = [
    { id: 1, title: "Lesson Slides (PDF)", type: "pdf", size: "2.4 MB" },
    { id: 2, title: "Source Code Repository", type: "link", size: "External" },
    { id: 3, title: "Cheatsheet (React Hooks)", type: "doc", size: "1.1 MB" }
  ];

  return (
    <div className="space-y-4">
      {resources.map((res) => (
        <div key={res.id} className="flex items-center justify-between p-4 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              {res.type === 'pdf' ? <FileText className="w-5 h-5 text-blue-600" /> : 
               res.type === 'link' ? <LinkIcon className="w-5 h-5 text-blue-600" /> :
               <FileDown className="w-5 h-5 text-blue-600" />}
            </div>
            <div>
              <h4 className="font-semibold text-sm">{res.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{res.size}</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            {res.type === 'link' ? 'Open' : 'Download'}
          </Button>
        </div>
      ))}
    </div>
  );
}
