import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, CreditCard, Wrench, User, ArrowRight, MessageCircle, FileText, LifeBuoy } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <PageContainer>
      {/* Hero / Search Section */}
      <section className="flex flex-col items-center text-center py-12 md:py-20 space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          How can we help you today?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Search our knowledge base or browse categories below to find answers to your questions.
        </p>
        <div className="w-full max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search for articles, topics, or issues..." 
            className="pl-10 h-14 text-base"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Getting Started", description: "Learn the basics of TalentFlow.", icon: BookOpen },
            { title: "Account & Profile", description: "Manage your personal settings.", icon: User },
            { title: "Billing & Payments", description: "Invoices, subscriptions, and fees.", icon: CreditCard },
            { title: "Troubleshooting", description: "Fix common technical issues.", icon: Wrench },
          ].map((category, i) => (
            <Card key={i} className="hover:border-primary transition-colors cursor-pointer group">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Articles */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Popular Articles</h2>
          <div className="grid gap-4">
            {[
              "How to verify your employer account",
              "Understanding freelancer service fees",
              "Setting up two-factor authentication (2FA)",
              "How to post a featured job",
              "Withdrawing funds from your wallet",
            ].map((article, i) => (
              <Link key={i} href="#" className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{article}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>

        {/* Support Tickets & Contact */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Need More Help?</h2>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LifeBuoy className="h-5 w-5" />
                Contact Support
              </CardTitle>
              <CardDescription>
                Can't find what you're looking for? Our support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Average response time: &lt; 2 hours</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button className="w-full">Submit a Ticket</Button>
              <Button variant="outline" className="w-full">View My Tickets</Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </PageContainer>
  );
}
