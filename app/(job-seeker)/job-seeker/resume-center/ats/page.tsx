"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, CheckCircle, CreditCard, Lock, Download, FileJson } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { toast } from "sonner";
import { PageContainer } from "@/components/shared/PageContainer";

export default function ATSBuilderPage() {
  const { user } = useAuth();
  const [atsPlan, setAtsPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false); // Should be fetched from backend if user has ResumePayment
  const [resumeData, setResumeData] = useState({
    fullName: "",
    email: "",
    phone: "",
    summary: "",
    experience: "",
    education: "",
    skills: ""
  });

  useEffect(() => {
    fetchAtsPlan();
  }, []);

  const fetchAtsPlan = async () => {
    try {
      const response = await api.get('/plans');
      const plans = response.data?.data || response.data || [];
      const ats = plans.find((p: any) => p.name === 'ATS Resume' || p.id === 'ATS_RESUME_ONE_TIME');
      
      if (ats) {
        setAtsPlan(ats);
      } else {
        // Fallback for development if not seeded
        setAtsPlan({
          id: 'ATS_RESUME_ONE_TIME',
          name: 'ATS-Friendly Resume',
          price: 19.99,
          features: ["ATS-Optimized Formatting", "Keyword Matching Analysis", "PDF Export"]
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    // Payment Processing: BLOCKED BY EXTERNAL CONFIGURATION
    toast.error("Payment Gateway Integration is currently blocked by external configuration. Stripe credentials missing.");
    
    // Developer bypass for verification
    if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ATS_DEV_BYPASS_ENABLED === 'true') {
      toast.info("Dev Mode: Bypassing payment for verification.");
      setHasAccess(true);
    }
  };

  const handleExportPDF = async () => {
    try {
      // Save to backend
      await api.post('/resumes', {
        title: `${resumeData.fullName || 'My'} ATS Resume`,
        type: 'ATS',
        content: resumeData,
        isDefault: true
      });
      toast.success("ATS Resume saved to profile successfully.");
      
      // Trigger native print dialog for PDF export
      window.print();
    } catch (err) {
      toast.error("Failed to save resume");
    }
  };

  if (isLoading) {
    return <PageContainer><div className="py-8 text-center text-muted-foreground">Loading offering...</div></PageContainer>;
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ATS-Friendly Resume Builder</h2>
          <p className="text-muted-foreground mt-2">Create a resume structurally optimized for Applicant Tracking Systems.</p>
        </div>

        {!hasAccess ? (
          <Card className="border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5 border-b border-primary/10 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <FileJson className="h-6 w-6 text-primary" />
                    {atsPlan?.name || "Premium ATS Resume"}
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">
                    Unlock our structured builder to ensure your resume passes algorithmic screening.
                  </CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold">${atsPlan?.price || "19.99"}</span>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {(atsPlan?.features || ["ATS-Optimized Formatting", "PDF Export", "Standard Fonts", "No Complex Tables"]).map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-muted p-4 rounded-lg flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Secure payment processing powered by Stripe. You will receive immediate access after purchase.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full text-lg h-14" onClick={handleCheckout}>
                <CreditCard className="mr-2 h-5 w-5" /> Buy Now for ${atsPlan?.price || "19.99"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Builder Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Resume Details</CardTitle>
                  <CardDescription>Enter your information in a standard format.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      value={resumeData.fullName} 
                      onChange={(e) => setResumeData({...resumeData, fullName: e.target.value})} 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input 
                        value={resumeData.email} 
                        onChange={(e) => setResumeData({...resumeData, email: e.target.value})} 
                        placeholder="john@example.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input 
                        value={resumeData.phone} 
                        onChange={(e) => setResumeData({...resumeData, phone: e.target.value})} 
                        placeholder="+1 234 567 8900" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Professional Summary</Label>
                    <Textarea 
                      value={resumeData.summary} 
                      onChange={(e) => setResumeData({...resumeData, summary: e.target.value})} 
                      placeholder="Brief overview of your career..." 
                      className="h-24"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Experience</Label>
                    <Textarea 
                      value={resumeData.experience} 
                      onChange={(e) => setResumeData({...resumeData, experience: e.target.value})} 
                      placeholder="Company - Role (Dates)&#10;- Achievement 1&#10;- Achievement 2" 
                      className="h-32"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Education</Label>
                    <Textarea 
                      value={resumeData.education} 
                      onChange={(e) => setResumeData({...resumeData, education: e.target.value})} 
                      placeholder="University - Degree (Year)" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Core Skills</Label>
                    <Input 
                      value={resumeData.skills} 
                      onChange={(e) => setResumeData({...resumeData, skills: e.target.value})} 
                      placeholder="React, Node.js, TypeScript..." 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Live Preview */}
              <div className="space-y-4 flex flex-col">
                <Card className="bg-white">
                  <CardHeader className="border-b">
                    <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex justify-between items-center">
                      Live ATS Preview
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">ATS Optimized</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 prose prose-sm max-w-none text-slate-900">
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold m-0">{resumeData.fullName || "Your Name"}</h1>
                      <p className="text-sm m-0 mt-1">{resumeData.email || "email@example.com"} | {resumeData.phone || "Phone Number"}</p>
                    </div>
                    
                    {resumeData.summary && (
                      <div className="mb-4">
                        <h2 className="text-lg font-bold uppercase border-b pb-1 mb-2">Summary</h2>
                        <p className="whitespace-pre-wrap">{resumeData.summary}</p>
                      </div>
                    )}
                    
                    {resumeData.experience && (
                      <div className="mb-4">
                        <h2 className="text-lg font-bold uppercase border-b pb-1 mb-2">Experience</h2>
                        <div className="whitespace-pre-wrap">{resumeData.experience}</div>
                      </div>
                    )}
                    
                    {resumeData.education && (
                      <div className="mb-4">
                        <h2 className="text-lg font-bold uppercase border-b pb-1 mb-2">Education</h2>
                        <div className="whitespace-pre-wrap">{resumeData.education}</div>
                      </div>
                    )}

                    {resumeData.skills && (
                      <div className="mb-4">
                        <h2 className="text-lg font-bold uppercase border-b pb-1 mb-2">Skills</h2>
                        <p>{resumeData.skills}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Button size="lg" className="w-full h-14" onClick={handleExportPDF}>
                  <Download className="mr-2 h-5 w-5" /> Export PDF & Save to Profile
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
