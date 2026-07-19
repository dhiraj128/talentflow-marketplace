 
import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, Globe, ExternalLink, Calendar, Heart, Shield, Coffee, Zap, Code2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CompanyProfilePage() {
  return (
    <PageContainer>
      <div className="py-8 flex flex-col gap-8 max-w-6xl mx-auto">
        {/* Company Header Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-muted h-48 md:h-64 mb-16">
           <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200&h=400" 
              alt="Office" 
              className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
           
           <div className="absolute -bottom-16 left-8 flex items-end gap-6">
              <div className="p-2 bg-background rounded-2xl shadow-lg inline-block">
                <Avatar className="h-24 w-24 rounded-xl border">
                  <AvatarImage src="/company-logo.png" alt="Company Logo" />
                  <AvatarFallback className="text-2xl rounded-xl">ACME</AvatarFallback>
                </Avatar>
              </div>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start mt-4 px-2">
          {/* Main Content Area */}
          <div className="flex-1 space-y-8 w-full">
            <div>
               <h1 className="text-4xl font-bold tracking-tight mb-4">Acme Corp</h1>
               <div className="flex flex-wrap gap-x-6 gap-y-3 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> San Francisco, CA
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> 1,000 - 5,000 Employees
                  </span>
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Technology
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Founded 2010
                  </span>
               </div>
            </div>

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="mb-6 w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger value="about" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 text-base">About</TabsTrigger>
                <TabsTrigger value="jobs" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 text-base">Open Jobs (12)</TabsTrigger>
                <TabsTrigger value="benefits" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 text-base">Benefits</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-8 focus-visible:outline-none focus-visible:ring-0">
                 <section className="space-y-4">
                    <h2 className="text-2xl font-bold">About Us</h2>
                    <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed">
                      <p>
                        Acme Corp is a leading technology company focused on building innovative solutions for the modern workforce. Our mission is to empower teams everywhere to do their best work. 
                      </p>
                      <p>
                        Since our founding in 2010, we've grown from a small startup in a garage to a global enterprise with offices in San Francisco, London, and Tokyo. We believe in fostering a culture of creativity, inclusivity, and continuous learning.
                      </p>
                    </div>
                 </section>

                 <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Tech Stack</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: "React", icon: <Code2 className="h-5 w-5" /> },
                        { name: "TypeScript", icon: <Code2 className="h-5 w-5" /> },
                        { name: "Node.js", icon: <Code2 className="h-5 w-5" /> },
                        { name: "PostgreSQL", icon: <Code2 className="h-5 w-5" /> },
                        { name: "AWS", icon: <Code2 className="h-5 w-5" /> },
                        { name: "Docker", icon: <Code2 className="h-5 w-5" /> },
                        { name: "Kubernetes", icon: <Code2 className="h-5 w-5" /> },
                        { name: "GraphQL", icon: <Code2 className="h-5 w-5" /> }
                      ].map((tech) => (
                         <div key={tech.name} className="flex items-center gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="p-2 bg-primary/10 rounded text-primary">
                              {tech.icon}
                            </div>
                            <span className="font-medium">{tech.name}</span>
                         </div>
                      ))}
                    </div>
                 </section>
              </TabsContent>
              
              <TabsContent value="jobs" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                 <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
                 {[1, 2, 3, 4].map((job) => (
                    <Card key={job} className="hover:shadow-md transition-shadow">
                      <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div>
                           <Link href={`/jobs/${job}`} className="hover:underline">
                              <CardTitle className="text-xl mb-2">Senior Software Engineer</CardTitle>
                           </Link>
                           <CardDescription className="flex gap-4">
                             <span className="flex items-center gap-1"><MapPin className="h-4 w-4"/> San Francisco (Hybrid)</span>
                             <span>Engineering</span>
                           </CardDescription>
                        </div>
                        <Button>
                          <Link href={`/jobs/${job}`}>View Job</Link>
                        </Button>
                      </CardHeader>
                    </Card>
                 ))}
                 <Button variant="outline" className="w-full">View All 12 Jobs</Button>
              </TabsContent>

              <TabsContent value="benefits" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                  <h2 className="text-2xl font-bold mb-6">Perks & Benefits</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                     {[
                       { title: "Health & Wellness", desc: "Premium health, dental, and vision insurance for you and your dependents.", icon: <Heart className="h-6 w-6" /> },
                       { title: "Financial Security", desc: "Competitive salary, equity packages, and 401(k) matching.", icon: <Shield className="h-6 w-6" /> },
                       { title: "Flexible Time Off", desc: "Generous PTO policy, paid holidays, and paid parental leave.", icon: <Calendar className="h-6 w-6" /> },
                       { title: "Workspace & Equipment", desc: "Top-of-the-line laptop, accessories, and a home office stipend.", icon: <Zap className="h-6 w-6" /> },
                       { title: "Learning & Development", desc: "Annual stipend for courses, conferences, and books.", icon: <Code2 className="h-6 w-6" /> },
                       { title: "Food & Snacks", desc: "Catered lunches and a fully stocked kitchen in our offices.", icon: <Coffee className="h-6 w-6" /> }
                     ].map((benefit) => (
                        <div key={benefit.title} className="flex gap-4 p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                           <div className="flex-shrink-0 text-primary">
                             {benefit.icon}
                           </div>
                           <div>
                              <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                              <p className="text-muted-foreground leading-relaxed">{benefit.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="w-full md:w-80 flex-shrink-0 space-y-6">
             <Card>
                <CardHeader>
                  <CardTitle>Company Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Website</p>
                    <a href="#" className="flex items-center gap-2 text-primary hover:underline font-medium">
                       acmecorp.com <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Industry</p>
                    <p className="font-medium">Enterprise Software</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Company Size</p>
                    <p className="font-medium">1,000 - 5,000 employees</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Headquarters</p>
                    <p className="font-medium">San Francisco, CA</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Specialties</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                       <Badge variant="secondary">SaaS</Badge>
                       <Badge variant="secondary">Cloud Computing</Badge>
                       <Badge variant="secondary">B2B</Badge>
                    </div>
                  </div>
                </CardContent>
             </Card>

             <Card className="bg-primary text-primary-foreground border-none">
               <CardContent className="p-6 text-center space-y-4">
                 <h3 className="font-semibold text-xl">Want to work here?</h3>
                 <p className="text-primary-foreground/80 text-sm">
                   Set up a job alert and we'll notify you when new roles match your skills.
                 </p>
                 <Button variant="secondary" className="w-full">Create Job Alert</Button>
               </CardContent>
             </Card>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}
