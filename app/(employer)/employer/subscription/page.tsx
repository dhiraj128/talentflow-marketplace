import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SubscriptionCard } from "@/components/shared/SubscriptionCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function SubscriptionPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Subscription Plans" description="Manage your current plan and explore other options." />
      
      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-primary">Current Plan: Professional</h3>
            <p className="text-sm text-muted-foreground mt-1">Your next billing cycle is on Nov 1, 2023.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SubscriptionCard 
          planName="Basic" 
          price="$99" 
          billingCycle="/month" 
          features={["Up to 3 active jobs", "Basic candidate search", "Standard support"]} 
          actionLabel="Downgrade" 
        />
        <SubscriptionCard 
          planName="Professional" 
          price="$299" 
          billingCycle="/month" 
          features={["Up to 10 active jobs", "Advanced candidate search", "Priority support", "AI Matchmaking"]} 
          isActive={true}
          actionLabel="Current Plan" 
        />
        <SubscriptionCard 
          planName="Enterprise" 
          price="Custom" 
          billingCycle="" 
          features={["Unlimited jobs", "Full database access", "Dedicated account manager", "Custom integrations"]} 
          actionLabel="Contact Sales" 
        />
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Compare Plans</CardTitle>
          <CardDescription>Find the perfect plan for your hiring needs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-4 font-medium">Feature</th>
                  <th className="py-4 font-medium">Basic</th>
                  <th className="py-4 font-medium text-primary">Professional</th>
                  <th className="py-4 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4">Active Jobs</td>
                  <td className="py-4">3</td>
                  <td className="py-4 font-medium">10</td>
                  <td className="py-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4">Candidate Search</td>
                  <td className="py-4">Basic</td>
                  <td className="py-4 font-medium">Advanced</td>
                  <td className="py-4">Full Access</td>
                </tr>
                <tr>
                  <td className="py-4">AI Matchmaking</td>
                  <td className="py-4 text-muted-foreground">-</td>
                  <td className="py-4"><Check className="w-5 h-5 text-primary" /></td>
                  <td className="py-4"><Check className="w-5 h-5 text-green-500" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
