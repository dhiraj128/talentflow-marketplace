"use client";
import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Check, X, ShieldCheck, FileText, Zap } from "lucide-react";

export default function ApplicationsPage() {
  const candidates = [
    { 
      id: "1",
      name: "John Doe", 
      role: "Frontend Developer", 
      experience: "3 years", 
      date: "Oct 12, 2023",
      identityVerified: true,
      atsOptimized: true,
      resumeScore: 92,
      resumeType: "Visual / Creative"
    },
    { 
      id: "2",
      name: "Jane Smith", 
      role: "Backend Engineer", 
      experience: "5 years", 
      date: "Oct 13, 2023",
      identityVerified: false,
      atsOptimized: false,
      resumeScore: 65,
      resumeType: "Text / Traditional"
    },
    { 
      id: "3",
      name: "Alex Johnson", 
      role: "Full Stack Developer", 
      experience: "4 years", 
      date: "Oct 14, 2023",
      identityVerified: true,
      atsOptimized: true,
      resumeScore: 88,
      resumeType: "Hybrid ATS"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="All Applications" description="Review and manage candidates who have applied." />
      
      <div className="grid grid-cols-1 gap-6">
        {candidates.map(candidate => (
          <Card key={candidate.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {candidate.name}
                      {candidate.identityVerified && (
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                      )}
                    </h3>
                    <p className="text-muted-foreground">{candidate.role} • {candidate.experience}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {candidate.identityVerified && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Identity Verified
                      </Badge>
                    )}
                    {candidate.atsOptimized && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1">
                        <Zap className="w-3 h-3" /> ATS Optimized
                      </Badge>
                    )}
                    <Badge variant="outline" className={
                      candidate.resumeScore >= 80 ? "bg-green-50 text-green-700 border-green-200" : 
                      candidate.resumeScore >= 60 ? "bg-amber-50 text-amber-700 border-amber-200" : 
                      "bg-red-50 text-red-700 border-red-200"
                    }>
                      Resume Score: {candidate.resumeScore}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <FileText className="w-3 h-3" /> {candidate.resumeType}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col items-end justify-between gap-4">
                  <p className="text-sm text-muted-foreground">Applied {candidate.date}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" /> View Resume
                    </Button>
                    <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                      <Check className="w-4 h-4 mr-1" /> Accept
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
