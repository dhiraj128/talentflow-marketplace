import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Globe, Zap, Coffee, ArrowRight, CheckCircle2, Briefcase, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-16 md:py-24 space-y-6">
        <Badge variant="secondary" className="px-3 py-1 text-sm rounded-full">
          We're Hiring
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
          Build the future of work
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          At TalentFlow, we're on a mission to connect the world's best talent with visionary companies. Join us in shaping the global freelance economy.
        </p>
        <div className="pt-4 flex gap-4">
          <Button size="lg">
            <Link href="#open-roles">View Open Roles</Link>
          </Button>
          <Button size="lg" variant="outline">
            <Link href="#culture">Our Culture</Link>
          </Button>
        </div>
      </section>

      {/* Culture Section */}
      <section id="culture" className="space-y-10 py-10 border-t">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Life at TalentFlow</h2>
          <p className="text-muted-foreground">
            We believe in fostering an environment where innovation thrives, and every team member can do their best work.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Impact Driven",
              description: "Every line of code, every design, every decision impacts millions of freelancers globally.",
              icon: Zap,
            },
            {
              title: "Empathy First",
              description: "We build for humans. We listen to our users and to each other.",
              icon: Heart,
            },
            {
              title: "Global Mindset",
              description: "We are a remote-first team spread across 15+ countries, embracing diverse perspectives.",
              icon: Globe,
            },
          ].map((value, i) => (
            <Card key={i} className="border-none bg-accent/50">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{value.title}</CardTitle>
                <CardDescription className="text-base">{value.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Perks & Benefits */}
      <section className="space-y-10 py-10 border-t">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/3 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Perks & Benefits</h2>
            <p className="text-muted-foreground">
              We take care of our team so they can focus on taking care of our community.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Competitive salary & equity",
              "100% remote work flexibility",
              "Unlimited paid time off",
              "Comprehensive health coverage",
              "Home office stipend",
              "Annual team retreats",
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section id="open-roles" className="space-y-8 py-10 border-t">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Open Roles</h2>
          <p className="text-muted-foreground">
            Don't see a perfect fit? Send your resume to careers@talentflow.com
          </p>
        </div>

        <div className="space-y-6">
          {/* Department: Engineering */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">Engineering</h3>
            <div className="grid gap-4">
              {[
                { role: "Senior Frontend Engineer", location: "Remote (US/Canada)", type: "Full-time" },
                { role: "Backend Developer (Node.js)", location: "Remote (Europe)", type: "Full-time" },
                { role: "DevOps Engineer", location: "Remote (Global)", type: "Full-time" },
              ].map((job, i) => (
                <Card key={i} className="hover:border-primary transition-colors">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">{job.role}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {job.type}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="shrink-0 gap-2">
                      Apply Now <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Department: Design */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">Design</h3>
            <div className="grid gap-4">
              {[
                { role: "Product Designer", location: "Remote (Global)", type: "Full-time" },
              ].map((job, i) => (
                <Card key={i} className="hover:border-primary transition-colors">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">{job.role}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {job.type}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="shrink-0 gap-2">
                      Apply Now <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}

