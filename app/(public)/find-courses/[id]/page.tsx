"use client";

import React from "react";
import { 
  Star, 
  Users, 
  Clock, 
  Globe, 
  PlayCircle,
  FileText,
  HelpCircle,
  Play,
  Heart,
  Video,
  Infinity as InfinityIcon,
  Award,
  Verified,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { PageContainer } from "@/components/shared/PageContainer";

export default function CourseDetailsPage() {
  return (
    <PageContainer>
      <div className="flex flex-col lg:flex-row gap-12 relative animate-in fade-in duration-700">
      {/* Left Content Area */}
      <div className="flex-grow max-w-full lg:max-w-[calc(100%-400px)]">
        
        {/* Course Overview Header */}
        <section className="mb-12">
          <div className="flex gap-2 mb-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 font-medium" variant="secondary">Architecture</Badge>
            <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30 px-3 py-1 font-medium" variant="secondary">Elite Certified</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground">Mastering Distributed Systems Architecture for Scale</h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            A deep dive into high-performance computing, microservices orchestration, and resilient cloud-native design. Built for senior engineers ready to lead global technical infrastructures.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
              <span className="font-semibold text-foreground text-lg">4.9 <span className="text-muted-foreground font-normal">(1,240 reviews)</span></span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5" />
              <span className="font-medium">12,450 learners enrolled</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span className="font-medium">32 Total Hours</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="w-5 h-5" />
              <span className="font-medium">English</span>
            </div>
          </div>
        </section>

        {/* Video/Banner Section */}
        <div className="rounded-2xl overflow-hidden mb-16 aspect-video relative shadow-sm bg-muted border group cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <div className="w-20 h-20 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
              <Play className="w-10 h-10 text-primary ml-1" fill="currentColor" />
            </div>
          </div>
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <span className="text-4xl font-bold text-slate-700">Course Preview</span>
          </div>
        </div>

        {/* Curriculum Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Course Curriculum</h2>
          <div className="space-y-4">
            
            {/* Module 1 */}
            <details className="group bg-muted/50 border rounded-2xl overflow-hidden" open>
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-muted transition-colors list-none [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-6">
                  <span className="bg-primary text-primary-foreground w-10 h-10 rounded-xl flex items-center justify-center font-bold">01</span>
                  <span className="text-xl font-bold text-foreground">Foundations of Scalability</span>
                </div>
                <ChevronDown className="w-6 h-6 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="p-6 pt-0 bg-background border-t space-y-6">
                <div className="flex items-center justify-between group/item mt-6">
                  <div className="flex items-center gap-4">
                    <PlayCircle className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">Understanding Latency and Throughput</span>
                  </div>
                  <span className="text-muted-foreground font-medium text-sm bg-muted px-2 py-1 rounded">15:40</span>
                </div>
                <div className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-4">
                    <FileText className="w-5 h-5 text-secondary" />
                    <span className="text-foreground font-medium">CAP Theorem Deep Dive</span>
                  </div>
                  <span className="text-muted-foreground font-medium text-sm bg-muted px-2 py-1 rounded">Reading</span>
                </div>
                <div className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-4">
                    <HelpCircle className="w-5 h-5 text-orange-500" />
                    <span className="text-foreground font-medium">Scalability Checkpoint Quiz</span>
                  </div>
                  <span className="text-muted-foreground font-medium text-sm bg-muted px-2 py-1 rounded">10 Questions</span>
                </div>
              </div>
            </details>

            {/* Module 2 */}
            <details className="group bg-muted/50 border rounded-2xl overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-muted transition-colors list-none [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-6">
                  <span className="bg-muted text-foreground border w-10 h-10 rounded-xl flex items-center justify-center font-bold">02</span>
                  <span className="text-xl font-bold text-foreground">Microservices Orchestration</span>
                </div>
                <ChevronDown className="w-6 h-6 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="p-6 pt-0 bg-background border-t">
                <p className="text-muted-foreground py-6 font-medium">Detailed breakdown of Kubernetes, Service Mesh, and Sidecar patterns in high-load environments.</p>
              </div>
            </details>

            {/* Module 3 */}
            <details className="group bg-muted/50 border rounded-2xl overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-muted transition-colors list-none [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-6">
                  <span className="bg-muted text-foreground border w-10 h-10 rounded-xl flex items-center justify-center font-bold">03</span>
                  <span className="text-xl font-bold text-foreground">Database Sharding and Replication</span>
                </div>
                <ChevronDown className="w-6 h-6 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="p-6 pt-0 bg-background border-t">
                <p className="text-muted-foreground py-6 font-medium">Strategies for stateful scalability across globally distributed data centers.</p>
              </div>
            </details>

          </div>
        </section>

        {/* Trainer Profile Section */}
        <section className="mb-16 p-8 md:p-10 bg-muted/30 border rounded-2xl shadow-sm">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Your Instructor</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 border-4 border-background shadow-md bg-muted flex items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground">ET</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-foreground">Dr. Elias Thorne</h3>
                <Badge variant="outline" className="bg-background border px-3 py-1 gap-1 hidden sm:flex">
                  <Verified className="w-4 h-4 text-secondary" />
                  <span className="font-semibold">Elite Verified Partner</span>
                </Badge>
              </div>
              <p className="text-primary font-semibold text-lg mb-4">Former Head of Infrastructure at CloudSync & Meta Senior Architect</p>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                Elias has spent over 15 years building systems that handle billions of requests per second. At EliteTalent, he focuses on platform-facilitated mentorship, bringing real-world outage scenarios and architectural breakthroughs to the curriculum.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="h-12 px-6 rounded-xl font-semibold">View Full Profile</Button>
                <Button className="h-12 px-6 rounded-xl font-semibold">Message via Portal</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-foreground">Course Reviews</h2>
            <Button variant="link" className="text-primary font-semibold p-0">See All Reviews</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />)}
                </div>
                <p className="italic text-lg text-foreground mb-6 leading-relaxed">"The best course on distributed systems I've ever taken. The case studies on actual high-load failures were worth the price alone."</p>
                <div className="flex items-center gap-4 pt-4 border-t">
                  <div className="w-10 h-10 rounded-full bg-muted border flex items-center justify-center">
                    <span className="font-bold text-muted-foreground text-sm">MC</span>
                  </div>
                  <span className="font-bold text-foreground">Marcus Cheng, Principal Dev</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />)}
                </div>
                <p className="italic text-lg text-foreground mb-6 leading-relaxed">"Highly tactical. Elias explains complex patterns with such clarity. My architecture reviews at work have improved significantly."</p>
                <div className="flex items-center gap-4 pt-4 border-t">
                  <div className="w-10 h-10 rounded-full bg-muted border flex items-center justify-center">
                    <span className="font-bold text-muted-foreground text-sm">SJ</span>
                  </div>
                  <span className="font-bold text-foreground">Sarah Jenkins, Senior Architect</span>
                </div>
              </CardContent>
            </Card>

          </div>
        </section>

        {/* FAQs Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-muted/30 border rounded-2xl p-6 cursor-pointer hover:bg-muted/50 transition-all group [&::-webkit-details-marker]:hidden list-none">
              <summary className="text-xl font-bold flex justify-between items-center text-foreground">
                Is this course suitable for beginners?
                <ChevronDown className="w-6 h-6 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-6 text-muted-foreground leading-relaxed text-lg pt-4 border-t">No, this course is designed for intermediate to senior engineers. You should have a solid grasp of basic back-end development and at least one cloud provider (AWS/GCP/Azure).</p>
            </details>
            <details className="bg-muted/30 border rounded-2xl p-6 cursor-pointer hover:bg-muted/50 transition-all group [&::-webkit-details-marker]:hidden list-none">
              <summary className="text-xl font-bold flex justify-between items-center text-foreground">
                Will I get a certificate upon completion?
                <ChevronDown className="w-6 h-6 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-6 text-muted-foreground leading-relaxed text-lg pt-4 border-t">Yes, you will receive an EliteTalent verified digital certificate that can be instantly added to your profile and LinkedIn.</p>
            </details>
          </div>
        </section>

      </div>

      {/* Sticky Sidebar */}
      <aside className="w-full lg:w-[400px] shrink-0">
        <div className="sticky top-28 space-y-6">
          
          {/* Enrollment Card */}
          <Card className="shadow-lg border-primary/20">
            <CardContent className="p-8 flex flex-col gap-6">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-bold text-foreground">$1,499.00</span>
                <span className="text-muted-foreground line-through text-lg mb-1">$2,250.00</span>
                <Badge variant="secondary" className="bg-secondary/20 text-secondary hover:bg-secondary/20 mb-1.5 ml-auto">33% OFF</Badge>
              </div>
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg border border-destructive/20 flex items-center gap-2">
                <Clock className="w-5 h-5 shrink-0" />
                <span className="font-semibold text-sm">Enrollment ends in 3 days at this price</span>
              </div>
              
              <Button size="lg" className="w-full h-14 text-lg rounded-xl shadow-md">Enroll Now</Button>
              <Button size="lg" variant="outline" className="w-full h-14 text-lg rounded-xl gap-2">
                <Heart className="w-5 h-5" /> Add to Wishlist
              </Button>
              
              <hr className="my-2" />
              
              <div className="space-y-4">
                <h4 className="font-bold text-foreground text-lg mb-4">This course includes:</h4>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <Video className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium text-foreground">32 hours on-demand video</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium text-foreground">24 Downloadable resources</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <InfinityIcon className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium text-foreground">Full lifetime access</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <Award className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium text-foreground">Certificate of completion</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Verification Preview */}
          <Card className="bg-muted/50 border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-secondary/10 p-3 rounded-xl border border-secondary/20">
                  <Verified className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">EliteTalent Verified</p>
                  <p className="text-sm text-muted-foreground font-medium">Blockchain Secured Certs</p>
                </div>
              </div>
              <div className="bg-background border rounded-xl p-4 relative group overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center border">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">ID: ET-2024-ARCH</span>
                </div>
                <p className="text-xs font-bold text-foreground truncate uppercase tracking-widest mb-3">Mastering Distributed Systems</p>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-secondary"></div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-6 text-center font-medium px-4">
                Share your credentials instantly with top-tier hiring managers on the platform.
              </p>
            </CardContent>
          </Card>

        </div>
      </aside>

      </div>
    </PageContainer>
  );
}
