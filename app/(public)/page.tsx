import React from "react";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Building2, TrendingUp, CheckCircle2, Cpu, ShieldCheck, Briefcase, GraduationCap, FileCheck, Lock, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UniversalSearch } from "@/features/search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageContainer } from "@/components/shared/PageContainer";

export default function LandingPage() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center">
        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mb-8 bg-secondary text-secondary-foreground">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            The #1 Precision Talent System
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            Find the World's Best Talent. <br className="hidden md:inline" />
            <span className="text-primary">Precision Matched.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10">
            Stop scrolling through endless resumes. Our advanced matching engine connects you with pre-vetted professionals ready to make an impact from day one.
          </p>
          
          <UniversalSearch />
          
          <div className="mt-12 text-sm text-muted-foreground">
            Trusted by innovative companies worldwide
            <div className="flex justify-center gap-8 mt-6 opacity-60 flex-wrap">
              <div className="flex items-center gap-2 font-bold text-xl"><Building2 /> ACME Corp</div>
              <div className="flex items-center gap-2 font-bold text-xl"><TrendingUp /> GlobalTech</div>
              <div className="flex items-center gap-2 font-bold text-xl"><CheckCircle2 /> NextGen Systems</div>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* 6 Premium Feature Cards */}
      <section>
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose TalentFlow?</h2>
            <p className="text-muted-foreground text-lg">Experience the most advanced hiring and learning ecosystem built for scale, speed, and precision.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-card p-8 rounded-2xl border border-muted shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                <Cpu className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Matching</h3>
              <p className="text-muted-foreground leading-relaxed">Our proprietary AI engine analyzes 50+ data points to find candidates that perfectly match your role instantly.</p>
            </div>
            
            <div className="group bg-card p-8 rounded-2xl border border-muted shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Professionals</h3>
              <p className="text-muted-foreground leading-relaxed">Every professional goes through strict Aadhaar/PAN KYC verification ensuring 100% genuine profiles.</p>
            </div>
            
            <div className="group bg-card p-8 rounded-2xl border border-muted shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                <Briefcase className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Freelancer Marketplace</h3>
              <p className="text-muted-foreground leading-relaxed">Hire skilled independent contractors for short-term projects with automated milestone tracking.</p>
            </div>
            
            <div className="group bg-card p-8 rounded-2xl border border-muted shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Corporate Trainers</h3>
              <p className="text-muted-foreground leading-relaxed">Upskill your entire workforce with certified corporate trainers delivering private cohorts and workshops.</p>
            </div>
            
            <div className="group bg-card p-8 rounded-2xl border border-muted shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-rose-500/10 to-pink-500/10 text-rose-500 group-hover:scale-110 transition-transform">
                <FileCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Resume Verification</h3>
              <p className="text-muted-foreground leading-relaxed">We automatically cross-reference work history and certifications with our network of institutional partners.</p>
            </div>
            
            <div className="group bg-card p-8 rounded-2xl border border-muted shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-slate-500/10 to-zinc-500/10 text-slate-500 group-hover:scale-110 transition-transform">
                <Lock className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
              <p className="text-muted-foreground leading-relaxed">Enterprise-grade payment escrow holding funds securely until project milestones are officially approved.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-card rounded-2xl border">
        <div className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center divide-x divide-muted/50">
            <div className="px-4">
              <div className="text-4xl font-extrabold text-foreground mb-2">20k+</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Verified Pros</div>
            </div>
            <div className="px-4">
              <div className="text-4xl font-extrabold text-foreground mb-2">5k+</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Companies</div>
            </div>
            <div className="px-4">
              <div className="text-4xl font-extrabold text-foreground mb-2">3k+</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Freelancers</div>
            </div>
            <div className="px-4">
              <div className="text-4xl font-extrabold text-foreground mb-2">800+</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Courses</div>
            </div>
            <div className="px-4">
              <div className="text-4xl font-extrabold text-foreground mb-2">98%</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Success</div>
            </div>
            <div className="px-4">
              <div className="text-4xl font-extrabold text-foreground mb-2 flex items-center justify-center gap-1">4.9<Star className="h-6 w-6 text-yellow-500 fill-yellow-500" /></div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Loved by Industry Leaders</h2>
            <p className="text-muted-foreground text-lg">Hear how TalentFlow is transforming the way modern enterprises build their teams.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-lg text-foreground leading-relaxed italic mb-8">"TalentFlow completely eliminated our sourcing bottleneck. The AI matching is startlingly accurate, saving our recruiters hundreds of hours per quarter."</p>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-sm">Sarah Jenkins</h4>
                  <p className="text-xs text-muted-foreground">VP of Engineering, CloudScale</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-2xl border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-lg text-foreground leading-relaxed italic mb-8">"As a freelancer, the escrow payment system gives me immense peace of mind. I can focus on writing great code instead of chasing invoices."</p>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarFallback>MK</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-sm">Marcus Knowles</h4>
                  <p className="text-xs text-muted-foreground">Senior Fullstack Developer</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-2xl border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-lg text-foreground leading-relaxed italic mb-8">"We use TalentFlow's Corporate Trainers to continuously upskill our workforce. The quality of instruction and seamless video integration is unmatched."</p>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-sm">Anita Lopez</h4>
                  <p className="text-xs text-muted-foreground">Director of L&D, Nexus Group</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Industries */}
      <section>
        <div>
          <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-widest">Trusted by Growing Businesses Worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 opacity-70">
            {['Startups', 'Small & Medium Businesses', 'Enterprises', 'IT Companies', 'EdTech Organizations', 'Consulting Firms', 'Healthcare Organizations', 'Manufacturing Companies'].map((category) => (
              <div key={category} className="px-6 py-3 border rounded-full bg-secondary/30 text-sm md:text-base font-semibold tracking-tight hover:bg-secondary/70 transition-colors">
                {category}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section>
        <div>
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-slate-50 border border-slate-800 shadow-2xl">
            
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[100px] -z-10 mix-blend-screen"></div>
            <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[120px] -z-10 mix-blend-screen"></div>
            
            <div className="relative z-10 px-6 py-20 md:py-28 text-center flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                Ready to Build Your Dream Team?
              </h2>
              <p className="text-lg md:text-xl text-slate-300 mb-10">
                Hire verified professionals, freelancers and trainers using AI-powered matching. Join the future of work today.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Hiring
                </Button>
                <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold rounded-xl bg-slate-100 text-slate-900 hover:bg-white">
                  Find Talent
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold rounded-xl border-slate-700 hover:bg-slate-800 text-slate-100">
                  Book Demo
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-16 pt-8 border-t border-slate-800/80 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-400">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> AI Powered</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Verified Profiles</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Secure Payments</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Enterprise Ready</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> GDPR Ready</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Aadhaar/PAN Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}

