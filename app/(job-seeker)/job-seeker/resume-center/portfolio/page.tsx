import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Plus, ExternalLink, Edit, Trash2 } from "lucide-react";

export default function PortfolioPage() {
  const projects = [
    {
      id: 1,
      title: "E-commerce Redesign",
      description: "Led the frontend redesign of a major e-commerce platform, improving conversion rates by 15%.",
      link: "https://example.com/project-1",
      tags: ["React", "Next.js", "Tailwind CSS"],
    },
    {
      id: 2,
      title: "Task Management API",
      description: "Developed a RESTful API for a task management application with robust authentication.",
      link: "https://github.com/example/api",
      tags: ["Node.js", "Express", "MongoDB"],
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Portfolio</h2>
          <p className="text-muted-foreground">Showcase your best projects and work samples.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="mt-2">{project.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-muted rounded-md text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-primary hover:underline">
                  <ExternalLink className="mr-1 h-3 w-3" /> View Project
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add New Project</CardTitle>
              <CardDescription>Include relevant projects to strengthen your profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Title</Label>
                  <Input placeholder="e.g. Finance Dashboard" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Briefly describe the project and your role..." />
                </div>
                <div className="space-y-2">
                  <Label>Project URL</Label>
                  <Input placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label>Technologies Used (comma separated)</Label>
                  <Input placeholder="React, Python, AWS" />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Project
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
