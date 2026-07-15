import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutTemplate, Eye } from "lucide-react";

export default function TemplatesPage() {
  const templates = [
    { id: 1, name: "Modern Professional", category: "Corporate", recommended: true },
    { id: 2, name: "Creative Portfolio", category: "Design", recommended: false },
    { id: 3, name: "Tech Minimalist", category: "Engineering", recommended: true },
    { id: 4, name: "Executive Brief", category: "Leadership", recommended: false },
    { id: 5, name: "Academic Scholar", category: "Education", recommended: false },
    { id: 6, name: "Startup Agile", category: "General", recommended: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resume Templates</h2>
          <p className="text-muted-foreground">Choose from our collection of ATS-friendly templates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden group">
            <div className="aspect-[1/1.4] bg-muted relative flex items-center justify-center border-b">
              <LayoutTemplate className="h-16 w-16 text-muted-foreground/30" />
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="secondary" size="sm">
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </Button>
                <Button size="sm">Use Template</Button>
              </div>
            </div>
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.category}</CardDescription>
                </div>
                {template.recommended && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">Popular</Badge>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
