import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Rocket, Users, History, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="flex flex-col gap-6 py-12 md:py-24 lg:py-32">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Redefining the Future of Talent
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          At Stitch, we believe that matching the right talent with the right opportunity shouldn't be a game of chance. We are building the most advanced marketplace to connect visionary employers with world-class professionals.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Target className="h-10 w-10 text-primary mb-4" />
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To empower organizations and professionals to achieve their highest potential by creating seamless, transparent, and highly effective connections in the talent ecosystem.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Rocket className="h-10 w-10 text-primary mb-4" />
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              A world where every individual finds their ideal role instantly, and every company builds their dream team without friction, powered by data-driven insights and human-centric design.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Our Story */}
      <section className="py-12 border-t border-border">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground text-lg">
            <p>
              Founded in 2024, Stitch emerged from a simple observation: the traditional recruitment model is broken. Resumes are static, job descriptions are vague, and the matching process is slow and biased.
            </p>
            <p>
              Our founders, a team of HR veterans and AI engineers, set out to create a platform that looks beyond the surface. We built Stitch to evaluate true capability, cultural fit, and long-term potential.
            </p>
            <p>
              Today, we serve thousands of companies and millions of professionals, continuously refining our algorithms and expanding our network to ensure that every connection made on Stitch is a step toward success.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4 py-8 border-t border-border">
        <div className="flex flex-col gap-2">
          <h3 className="text-4xl font-bold">2M+</h3>
          <p className="text-sm font-medium text-muted-foreground">Active Professionals</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-4xl font-bold">50k+</h3>
          <p className="text-sm font-medium text-muted-foreground">Hiring Companies</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-4xl font-bold">98%</h3>
          <p className="text-sm font-medium text-muted-foreground">Successful Matches</p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-4xl font-bold">24/7</h3>
          <p className="text-sm font-medium text-muted-foreground">Global Support</p>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-12 border-t border-border">
        <h2 className="text-3xl font-bold mb-8">Leadership Team</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "Sarah Jenkins", role: "Chief Executive Officer", desc: "Former VP of HR Tech at GlobalCorp with 15+ years of industry experience." },
            { name: "David Chen", role: "Chief Technology Officer", desc: "AI researcher and engineering leader passionate about scalable matchmaking." },
            { name: "Elena Rodriguez", role: "Chief Operating Officer", desc: "Operations expert focused on customer success and platform growth." },
          ].map((leader, i) => (
            <Card key={i} className="border-none bg-muted/50">
              <CardHeader>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{leader.name}</CardTitle>
                <CardDescription className="font-medium text-primary">{leader.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{leader.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 border-t border-border">
        <h2 className="text-3xl font-bold mb-8">Our Journey</h2>
        <div className="space-y-8 pl-4 border-l-2 border-muted">
          <div className="relative">
            <div className="absolute -left-[21px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
            <h3 className="text-xl font-semibold">2024 - The Genesis</h3>
            <p className="text-muted-foreground mt-2 max-w-2xl">Stitch is founded with a seed round of $5M to revolutionize talent acquisition by integrating advanced analytics with human-centered design.</p>
          </div>
          <div className="relative">
            <div className="absolute -left-[21px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
            <h3 className="text-xl font-semibold">2025 - Platform Launch</h3>
            <p className="text-muted-foreground mt-2 max-w-2xl">Public release of the Stitch Marketplace, successfully onboarding the first 10,000 users within the first month of operation.</p>
          </div>
          <div className="relative">
            <div className="absolute -left-[21px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
            <h3 className="text-xl font-semibold">2026 - Global Expansion</h3>
            <p className="text-muted-foreground mt-2 max-w-2xl">Opening offices in London and Singapore, crossing the 2 million user milestone and expanding into 15 new technical verticals.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground rounded-2xl px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career or Company?</h2>
          <p className="text-primary-foreground/80 text-lg">
            Join the thousands of professionals and employers who are already experiencing the future of work.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Button size="lg" variant="secondary" className="font-semibold w-full sm:w-auto">
            Find Talent
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto">
            Find a Job <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </PageContainer>
  );
}
