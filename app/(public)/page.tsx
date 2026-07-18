import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  FileCheck, 
  Lock, 
  Star,
  Users,
  Search,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Zap,
  Award
} from "lucide-react";
import { HeroSearchBox } from "@/features/search/HeroSearchBox";
import { PageContainer } from "@/components/shared/PageContainer";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LandingPage() {
  return (
    <PageContainer>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden text-center py-10 md:py-20">
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold mb-8 bg-background shadow-sm text-foreground">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Curated • Verified • Moderated Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            TalentFlow Marketplace
          </h1>
          <p className="text-2xl md:text-3xl text-primary font-bold mb-10 max-w-3xl mx-auto tracking-tight">
            Your Career Ecosystem — All in One Place
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href="/find-jobs">
              <Button size="lg" className="rounded-full px-8 h-12">Find Jobs</Button>
            </Link>
            <Link href="/find-talent">
              <Button size="lg" variant="secondary" className="rounded-full px-8 h-12">Hire Talent</Button>
            </Link>
            <Link href="/find-freelancers">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12">Explore Freelancers</Button>
            </Link>
            <Link href="/find-courses">
              <Button size="lg" variant="ghost" className="rounded-full px-8 h-12 bg-muted hover:bg-muted/80">Browse Courses</Button>
            </Link>
          </div>
          
          {/* SEARCH SECTION */}
          <HeroSearchBox />
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* LIVE PLATFORM METRICS */}
      <section className="py-12 border-y bg-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-foreground mb-2 flex justify-center items-baseline">
              <AnimatedCounter end={12480} />
            </div>
            <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Active Jobs</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-foreground mb-2 flex justify-center items-baseline">
              <AnimatedCounter end={3200} suffix="+" />
            </div>
            <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Verified Employers</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-foreground mb-2 flex justify-center items-baseline">
              <AnimatedCounter end={8900} suffix="+" />
            </div>
            <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Freelancers</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-foreground mb-2 flex justify-center items-baseline">
              <AnimatedCounter end={540} suffix="+" />
            </div>
            <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Training Courses</div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="text-4xl font-extrabold text-foreground mb-2 flex justify-center items-baseline">
              <AnimatedCounter end={96} suffix="%" />
            </div>
            <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Placement Rate</div>
          </div>
        </div>
      </section>

      {/* PORTAL SELECTOR */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Choose Your Path</h2>
          <p className="text-muted-foreground text-lg">Four premium portals built into one unified ecosystem.</p>
        </div>
        
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { title: 'Job Seeker', icon: Users, desc: 'Find your dream job with AI matching.', features: ['AI Resume Scoring', 'Match % Algorithms', 'Application Tracking'], cta: 'Find Jobs', href: '/find-jobs', color: 'bg-blue-500/10 text-blue-600' },
            { title: 'Employer', icon: Building2, desc: 'Hire top verified talent effortlessly.', features: ['AI Candidate Sourcing', 'Verified Profiles', 'Integrated ATS'], cta: 'Hire Talent', href: '/find-talent', color: 'bg-emerald-500/10 text-emerald-600' },
            { title: 'Freelancer', icon: Zap, desc: 'Work on your terms with secure escrow.', features: ['Secure Payments', 'Project Bidding', 'Verified Clients'], cta: 'Find Projects', href: '/find-freelancers', color: 'bg-purple-500/10 text-purple-600' },
            { title: 'Training', icon: GraduationCap, desc: 'Upskill with industry-recognized courses.', features: ['Verified Certificates', 'Expert Instructors', 'Career Growth'], cta: 'Browse Courses', href: '/find-courses', color: 'bg-orange-500/10 text-orange-600' },
          ].map((portal, idx) => (
            <div key={idx} className="group flex flex-col bg-card rounded-3xl p-8 border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${portal.color}`}>
                <portal.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{portal.title}</h3>
              <p className="text-muted-foreground mb-6 h-12">{portal.desc}</p>
              
              <ul className="space-y-3 mb-8 flex-1">
                {portal.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              
              <Link href={portal.href} className="w-full">
                <Button className="w-full justify-between group-hover:bg-primary" variant="outline">
                  {portal.cta} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORM WORKFLOW */}
      <section className="py-20 bg-muted/30 rounded-3xl border px-4 md:px-10 overflow-hidden relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">A seamless pipeline from registration to hired.</p>
        </div>
        
        {/* Desktop/Tablet Horizontal Scrollable Timeline */}
        <div className="hidden md:flex overflow-x-auto pb-8 gap-4 snap-x hide-scrollbar">
          {['Register', 'Verify', 'Create Profile', 'Admin Review', 'Publish', 'AI Match', 'Apply / Enroll', 'Shortlist', 'Interview', 'Hired'].map((step, idx) => (
            <div key={idx} className="snap-start shrink-0 flex flex-col items-center min-w-[140px] relative">
              <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary font-bold z-10 mb-4 shadow-sm">
                {idx + 1}
              </div>
              <span className="font-semibold text-center">{step}</span>
              {/* Connector line */}
              {idx < 9 && <div className="absolute top-6 left-1/2 w-full h-0.5 bg-primary/20 -z-0"></div>}
            </div>
          ))}
        </div>

        {/* Mobile Vertical Stepper */}
        <div className="flex flex-col md:hidden gap-6 relative ml-4">
          <div className="absolute top-0 left-6 w-0.5 h-full bg-primary/20 -z-10"></div>
          {['Register', 'Verify', 'Create Profile', 'Admin Review', 'Publish', 'AI Match', 'Apply / Enroll', 'Shortlist', 'Interview', 'Hired'].map((step, idx) => (
            <div key={idx} className="flex items-center gap-6">
              <div className="w-12 h-12 shrink-0 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary font-bold z-10 shadow-sm">
                {idx + 1}
              </div>
              <span className="font-semibold text-lg">{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY TALENTFLOW */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Why TalentFlow?</h2>
          <p className="text-muted-foreground text-lg">Experience the most advanced hiring and learning ecosystem built for scale, speed, and precision.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            { title: 'AI Matching', icon: Cpu, desc: 'Advanced algorithms matching profiles accurately.' },
            { title: 'Verified Employers', icon: Building2, desc: 'All companies are strictly verified.' },
            { title: 'Verified Candidates', icon: CheckCircle2, desc: 'Rigorous KYC and skill validation.' },
            { title: 'Privacy Protection', icon: ShieldCheck, desc: 'Your data is secured and encrypted.' },
            { title: 'Secure Payments', icon: Lock, desc: 'Escrow based payments for freelancers.' },
            { title: 'Training & Certs', icon: Award, desc: 'Integrated LMS with real certifications.' },
            { title: 'Career Growth', icon: TrendingUp, desc: 'End-to-end career ecosystem.' },
          ].map((item, idx) => (
            <div key={idx} className="group bg-card p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS CAROUSEL */}
      <section className="py-20 bg-card rounded-3xl border px-4 md:px-10 overflow-hidden mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Loved by Industry Leaders</h2>
          <p className="text-muted-foreground text-lg">Hear how TalentFlow is transforming careers and companies.</p>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
          {[
            { name: "Sarah Jenkins", role: "VP of Engineering", company: "CloudScale", review: "TalentFlow completely eliminated our sourcing bottleneck. The AI matching is startlingly accurate, saving our recruiters hundreds of hours per quarter." },
            { name: "Marcus Knowles", role: "Senior Fullstack Developer", company: "Freelance", review: "As a freelancer, the escrow payment system gives me immense peace of mind. I can focus on writing great code instead of chasing invoices." },
            { name: "Anita Lopez", role: "Director of L&D", company: "Nexus Group", review: "We use TalentFlow's Corporate Trainers to continuously upskill our workforce. The quality of instruction and seamless video integration is unmatched." },
            { name: "David Chen", role: "Data Scientist", company: "AI Dynamics", review: "I took a certified course on TalentFlow and within a week, their AI engine matched me with my current employer. The ecosystem works seamlessly." }
          ].map((t, i) => (
            <div key={i} className="snap-center shrink-0 w-[320px] md:w-[400px] bg-background p-8 rounded-3xl border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, idx) => <Star key={idx} className="h-5 w-5 text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-lg text-foreground leading-relaxed italic mb-8">"{t.review}"</p>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarFallback>{t.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-sm">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 mb-20 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">Everything you need to know about the TalentFlow Ecosystem.</p>
        </div>
        
        <div className="space-y-4">
          {[
            { q: "How does AI Matching work?", a: "Our proprietary AI engine analyzes 50+ data points including skills, experience, location, and salary expectations to find candidates that perfectly match an employer's job description instantly." },
            { q: "How do I apply for jobs?", a: "Once you create your Job Seeker profile and upload your resume, our ATS parses your data. You can then apply to any job with a single click, and employers receive your standardized profile instantly." },
            { q: "How are employers verified?", a: "Every employer must pass our strict KYB (Know Your Business) verification process, which includes verifying their company registration, domain ownership, and identity of the account creator." },
            { q: "How does freelancing work?", a: "Freelancers can browse project requests or receive direct invitations. Once hired, payments are held securely in escrow and released upon milestone completion." },
            { q: "How do certifications work?", a: "You can enroll in courses from our verified Corporate Trainers. Upon completion, the certificate is automatically added to your TalentFlow profile, boosting your AI Match score." }
          ].map((faq, i) => (
            <details key={i} className="group bg-card border rounded-2xl [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 font-semibold cursor-pointer text-lg list-none">
                {faq.q}
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="mb-20">
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-slate-50 border border-slate-800 shadow-2xl">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[100px] -z-10 mix-blend-screen"></div>
          <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[120px] -z-10 mix-blend-screen"></div>
          
          <div className="relative z-10 px-6 py-20 md:py-28 text-center flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
              Join the complete career ecosystem. Hire verified professionals, find your dream job, or upskill with premium courses.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full sm:w-auto">
              <Link href="/sign-up"><Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-xl">Create Account</Button></Link>
              <Link href="/find-jobs"><Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-xl text-slate-900 bg-slate-100 hover:bg-white">Find Jobs</Button></Link>
              <Link href="/find-talent"><Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-xl border-slate-700 hover:bg-slate-800 text-slate-100">Hire Talent</Button></Link>
              <Link href="/find-courses"><Button size="lg" variant="ghost" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-xl text-slate-300 hover:bg-slate-800">Browse Courses</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
