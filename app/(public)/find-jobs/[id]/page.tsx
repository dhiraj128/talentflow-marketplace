import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Briefcase, DollarSign, Clock, Users, ArrowLeft, Bookmark, Share2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function JobDetailsPage() {
  return (
    <PageContainer>
      <div className="py-8 flex flex-col gap-8 max-w-5xl mx-auto">
        <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 w-fit transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <Avatar className="h-20 w-20 border rounded-xl shadow-sm">
              <AvatarImage src="/company-logo.png" alt="Company Logo" />
              <AvatarFallback className="text-xl rounded-xl">GO</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Senior Frontend Engineer</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-base">
                <Link href="/company/1" className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium text-foreground">
                  <Building2 className="h-4 w-4" />
                  Google
                </Link>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Mountain View, CA
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Posted 2 days ago
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button size="lg" className="flex-1 md:flex-none">Apply Now</Button>
            <Button variant="outline" size="icon" className="h-11 w-11 flex-shrink-0">
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-11 w-11 flex-shrink-0">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-muted/40 shadow-none border-none">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Job Type
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="font-semibold text-foreground">Full-time</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/40 shadow-none border-none">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> Salary
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="font-semibold text-foreground">$150k - $200k</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/40 shadow-none border-none">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Experience
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="font-semibold text-foreground">5+ Years</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/40 shadow-none border-none">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Work Model
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="font-semibold text-foreground">Hybrid</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Main Content */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">About the Role</h2>
              <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed">
                <p>
                  We are looking for a Senior Frontend Engineer to join our core product team. You will be responsible for building exceptional user experiences and contributing to the technical direction of our frontend architecture.
                </p>
                <p>
                  In this role, you will collaborate closely with product managers, designers, and backend engineers to deliver high-quality, scalable web applications. We value engineers who are passionate about user experience, code quality, and continuous learning.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Key Responsibilities</h2>
              <ul className="space-y-3">
                {[
                  "Architect and develop responsive, high-performance web applications using React and Next.js.",
                  "Collaborate with cross-functional teams to define, design, and ship new features.",
                  "Mentor junior engineers and contribute to engineering best practices.",
                  "Optimize applications for maximum speed and scalability.",
                  "Write clean, maintainable, and well-tested code."
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Requirements</h2>
              <ul className="space-y-3">
                {[
                  "5+ years of professional experience in frontend development.",
                  "Deep understanding of React, TypeScript, and modern web technologies.",
                  "Experience with state management libraries and RESTful/GraphQL APIs.",
                  "Strong communication skills and ability to work in a collaborative environment.",
                  "A portfolio of complex web applications you've contributed to."
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground flex-shrink-0 mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "Jest", "Git"].map(skill => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm font-medium">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Health Insurance", desc: "100% covered premiums" },
                  { title: "401(k) Match", desc: "Up to 5% of salary" },
                  { title: "Flexible PTO", desc: "Take the time you need" },
                  { title: "Home Office Stipend", desc: "$1,000 upon joining" }
                ].map((benefit, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <span className="font-medium">{benefit.title}</span>
                    <span className="text-sm text-muted-foreground">{benefit.desc}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
              <h3 className="font-semibold text-lg mb-2">Ready to join us?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We're actively reviewing applications. Apply now to get started.
              </p>
              <Button className="w-full">Apply Now</Button>
            </div>
          </div>
        </div>

        {/* Related Jobs */}
        <section className="mt-12 space-y-6 border-t pt-12">
          <h2 className="text-2xl font-bold tracking-tight">Similar Jobs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4 mb-2">
                     <CardTitle className="text-lg">Frontend Developer</CardTitle>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground -mr-2 -mt-2">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>TechCorp • Remote</CardDescription>
                </CardHeader>
                <CardContent className="pb-4 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Looking for an experienced frontend developer to help build scalable web applications.
                  </p>
                </CardContent>
                <CardFooter className="pt-0 flex items-center justify-between mt-auto">
                   <span className="text-sm font-medium">$120k - $140k</span>
                   <Button variant="link" className="px-0">
                     <Link href={`/jobs/${item}`}>View Job</Link>
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
