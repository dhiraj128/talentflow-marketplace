import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";

export default function PricingPage() {
  return (
    <PageContainer>
      <h1 className="text-4xl font-bold tracking-tight mb-4">Transparent Pricing for Elite Talent</h1>
      <p className="text-muted-foreground text-lg mb-12">
        Choose the right plan for your business. Whether you're hiring for one role or building an entire team, we have you covered.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8 text-left">
        {/* Pricing Cards Placeholder */}
        <div className="border rounded-xl p-8 bg-card shadow-sm">
          <h3 className="text-xl font-bold mb-2">Pay As You Go</h3>
          <p className="text-muted-foreground mb-6">For single, urgent hires.</p>
          <div className="text-3xl font-bold mb-6">$299 <span className="text-base font-normal text-muted-foreground">/post</span></div>
          <button className="w-full bg-secondary text-secondary-foreground font-medium py-2 rounded-lg border">Get Started</button>
        </div>
        <div className="border-2 border-primary rounded-xl p-8 bg-card shadow-md relative">
          <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</div>
          <h3 className="text-xl font-bold mb-2">Growth Plan</h3>
          <p className="text-muted-foreground mb-6">For growing teams.</p>
          <div className="text-3xl font-bold mb-6">$899 <span className="text-base font-normal text-muted-foreground">/mo</span></div>
          <button className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-lg">Subscribe Now</button>
        </div>
        <div className="border rounded-xl p-8 bg-card shadow-sm">
          <h3 className="text-xl font-bold mb-2">Enterprise</h3>
          <p className="text-muted-foreground mb-6">Custom solutions for large orgs.</p>
          <div className="text-3xl font-bold mb-6">Custom</div>
          <button className="w-full bg-secondary text-secondary-foreground font-medium py-2 rounded-lg border">Contact Sales</button>
        </div>
      </div>
    </PageContainer>
  );
}
