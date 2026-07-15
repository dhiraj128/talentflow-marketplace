"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Download, Copy } from "lucide-react";
import { useState } from "react";

export default function CoverLetterPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setGeneratedContent("Dear Hiring Manager,\n\nI am writing to express my strong interest in the Software Engineer position at your company. With my background in full-stack development and passion for creating intuitive user experiences, I am confident in my ability to contribute effectively to your team.\n\nIn my previous role, I successfully delivered several key projects that improved system performance by 30%. I am particularly drawn to your company's innovative approach to solving complex problems.\n\nI would welcome the opportunity to discuss how my skills align with your needs. Thank you for considering my application.\n\nSincerely,\n[Your Name]");
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cover Letter Generator</h2>
        <p className="text-muted-foreground">Create tailored cover letters instantly using AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Provide information about the job you are applying for.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Base Resume</Label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Software Engineer Resume</SelectItem>
                    <SelectItem value="2">Frontend Developer Tailored</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select defaultValue="professional">
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="confident">Confident</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Job Description (Optional)</Label>
                <Textarea 
                  placeholder="Paste the job description to tailor the cover letter..." 
                  className="h-32"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                <Wand2 className="mr-2 h-4 w-4" /> 
                {isGenerating ? "Generating..." : "Generate Cover Letter"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Result</CardTitle>
                  <CardDescription>Your generated cover letter</CardDescription>
                </div>
                {generatedContent && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" title="Copy">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              {generatedContent ? (
                <Textarea 
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="h-full min-h-[300px] font-mono text-sm"
                />
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-6 bg-muted/20">
                  <Wand2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold">Ready to Generate</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    Fill out the details on the left and click generate to create your cover letter.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
