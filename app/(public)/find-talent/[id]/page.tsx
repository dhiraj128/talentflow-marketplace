"use client";

import React from "react";
import { 
  Verified, 
  MapPin, 
  CalendarDays, 
  Globe, 
  Award, 
  TrendingUp,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PageContainer } from "@/components/shared/PageContainer";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import api from "@/lib/api";

export default function CandidateProfilePage() {
  const { id } = useParams() as { id: string };
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: async () => {
      const res = await api.get(`/candidates/${id}`);
      return res.data;
    }
  });

  if (isLoading) return <div className="p-12 text-center">Loading profile...</div>;
  if (!profile) return <div className="p-12 text-center text-red-500">Candidate not found.</div>;

  return (
    <PageContainer>
      <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative mb-12 bg-muted/30 rounded-2xl p-8 md:p-12 overflow-hidden border">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
          <Verified className="w-96 h-96 text-primary rotate-12 -translate-y-12 translate-x-12" />
        </div>
        <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
          <div className="relative shrink-0">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.fullName} className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover border-4 border-background shadow-xl" />
            ) : (
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-background shadow-xl bg-muted flex items-center justify-center">
                 <span className="text-5xl font-bold text-muted-foreground">{profile.fullName?.substring(0, 2).toUpperCase() || 'NA'}</span>
              </div>
            )}
            <div className="absolute -bottom-3 -right-3 bg-secondary text-secondary-foreground p-2 rounded-full border-4 border-background shadow-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1 text-left">
            <div className="flex flex-wrap items-center justify-start gap-4 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">{profile.fullName}</h1>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20" variant="secondary">CANDIDATE</Badge>
            </div>
            <p className="text-xl text-muted-foreground mb-6">{profile.title || 'Professional'}</p>
            <div className="flex flex-wrap justify-start gap-6 text-muted-foreground mb-8 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                <span>Joined 2021</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>English, Spanish</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-start gap-4">
              <Button size="lg" className="h-14 px-8 text-lg rounded-xl shadow-md">Shortlist Candidate</Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl">Message via Portal</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Layout Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Summary, Experience, Projects */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* About / Summary */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                {profile.bio || "No summary provided."}
              </p>
            </CardContent>
          </Card>

          {/* Certificates */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2"><Award className="w-6 h-6 text-primary" /> Certificates & Training</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.certificates?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {profile.certificates.map((cert: any) => (
                    <div key={cert.id} className="border rounded-xl p-4 flex gap-4 items-start">
                      <div className="bg-primary/10 p-3 rounded-lg border">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground">{cert.course?.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">Issued by: {cert.course?.trainer?.fullName || 'TalentFlow'}</p>
                        {cert.certificateUrl && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => window.open(cert.certificateUrl, '_blank')}>
                              View Credential
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No certificates earned yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Experience Timeline */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                {/* Job Item 1 */}
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary border-4 border-background shadow-sm"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-foreground">Lead Product Designer</h3>
                    <span className="text-primary font-bold text-sm tracking-wider">2021 — PRESENT</span>
                  </div>
                  <p className="text-muted-foreground font-medium mb-3">Quantum Systems • Remote</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Spearheaded the complete redesign of the core enterprise dashboard, resulting in a 25% reduction in task completion time. Managed a team of 4 designers and established a company-wide design language system.
                  </p>
                </div>
                {/* Job Item 2 */}
                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-muted-foreground/30 border-4 border-background shadow-sm"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-foreground">Senior UI/UX Designer</h3>
                    <span className="text-muted-foreground font-semibold text-sm tracking-wider">2018 — 2021</span>
                  </div>
                  <p className="text-muted-foreground font-medium mb-3">Fintech Flow • New York, NY</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Optimized user onboarding flows for a B2B financial tool, increasing conversion rates from 12% to 28%. Conducted over 50 usability testing sessions and translated insights into wireframes and high-fidelity prototypes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects (Card Grid) */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Key Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group cursor-pointer">
                  <div className="h-48 bg-muted rounded-xl overflow-hidden mb-4 border relative">
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-background text-primary px-4 py-2 rounded-lg font-semibold shadow-lg">View Case Study</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">Nova Analytics Hub</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">Complete end-to-end design for a predictive analytics engine used by Fortune 500 companies.</p>
                </div>
                <div className="group cursor-pointer">
                  <div className="h-48 bg-muted rounded-xl overflow-hidden mb-4 border relative">
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-background text-primary px-4 py-2 rounded-lg font-semibold shadow-lg">View Case Study</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">HealthSync Mobile</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">Reimagined the patient-provider interaction for a healthcare startup, focusing on accessibility and speed.</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Skills, Certifications, Education, Stats */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Skills */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  "UI Design", "UX Strategy", "Design Systems", "React.js", 
                  "Tailwind CSS", "Figma", "Prototyping", "Typescript"
                ].map(skill => (
                  <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 font-medium">{skill}</Badge>
                ))}
                {[
                  "User Research", "A/B Testing"
                ].map(skill => (
                  <Badge key={skill} variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 px-3 py-1 font-medium">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <Award className="text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground">Google UX Design Professional</p>
                    <p className="text-sm text-muted-foreground mt-1">Issued 2022 • Credential ID: G-4492</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Award className="text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground">Interaction Design Specialization</p>
                    <p className="text-sm text-muted-foreground mt-1">Coursera • Issued 2021</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="font-bold text-foreground text-lg">BFA in Graphic Design</p>
                  <p className="font-medium text-muted-foreground">Rhode Island School of Design</p>
                  <p className="text-sm text-muted-foreground mt-1">2014 — 2018</p>
                </div>
                <div className="pt-6 border-t">
                  <p className="font-bold text-foreground text-lg">Web Development Bootcamp</p>
                  <p className="font-medium text-muted-foreground">Fullstack Academy</p>
                  <p className="text-sm text-muted-foreground mt-1">2018 (6 months intensive)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats/Brief */}
          <Card className="bg-primary text-primary-foreground border-primary shadow-sm relative overflow-hidden">
            <CardContent className="p-8">
              <div className="absolute top-0 right-0 p-6 opacity-20">
                <TrendingUp className="w-24 h-24" />
              </div>
              <p className="text-sm uppercase tracking-widest opacity-80 mb-4 font-bold">Career Stats</p>
              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div>
                  <p className="text-4xl font-bold">120+</p>
                  <p className="text-sm opacity-80 mt-1 font-medium">Projects Completed</p>
                </div>
                <div>
                  <p className="text-4xl font-bold">98%</p>
                  <p className="text-sm opacity-80 mt-1 font-medium">Client Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </aside>
      </div>

      {/* Portfolio Gallery Section */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">Portfolio Gallery</h2>
          <Button variant="link" className="text-primary font-semibold text-lg gap-2">
            View full archive <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { title: "Interface Study", desc: "Glassmorphism Concepts" },
            { title: "Design System", desc: "Enterprise Components" },
            { title: "System Flow", desc: "Backend Architecture" },
            { title: "Brand Identity", desc: "Visual Strategy" },
          ].map((item, idx) => (
            <div key={idx} className="aspect-square bg-muted rounded-xl overflow-hidden border group relative cursor-pointer">
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-white duration-300">
                <p className="font-bold text-lg">{item.title}</p>
                <p className="text-sm opacity-80 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Task-Focused CTA */}
      <section className="mt-20 bg-muted/50 border p-12 rounded-2xl shadow-sm text-left">
        <h2 className="text-4xl font-bold mb-6 text-foreground">Ready to work with Alex?</h2>
        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
          Alex is currently available for contract roles and high-impact full-time positions. Shortlist this candidate to start a conversation through the secure EliteTalent portal.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
          <Button size="lg" className="h-14 px-10 text-lg rounded-xl shadow-md w-full sm:w-auto">Shortlist Candidate</Button>
          <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-xl w-full sm:w-auto bg-background">Send a Message</Button>
        </div>
      </section>

      </div>
    </PageContainer>
  );
}
