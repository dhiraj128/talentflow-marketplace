"use client";

import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, ChevronDown, UserPlus, Briefcase, CreditCard, Shield } from "lucide-react";
import { useState } from "react";

const FAQ_CATEGORIES = [
  { id: "general", name: "General", icon: UserPlus },
  { id: "employers", name: "For Employers", icon: Briefcase },
  { id: "freelancers", name: "For Freelancers", icon: UserPlus },
  { id: "billing", name: "Billing & Payments", icon: CreditCard },
  { id: "security", name: "Security", icon: Shield },
];

const FAQS = [
  {
    category: "general",
    question: "What is Stitch Talent Marketplace?",
    answer: "Stitch is a modern talent platform that connects top-tier professionals with leading companies. We use advanced matching algorithms to ensure perfect cultural and technical alignment.",
  },
  {
    category: "general",
    question: "How do I get started?",
    answer: "Simply sign up as either an employer or a professional. You'll be guided through a quick onboarding process to set up your profile and preferences.",
  },
  {
    category: "employers",
    question: "How much does it cost to post a job?",
    answer: "We offer flexible pricing tiers starting with a free basic tier for startups. Check our pricing page for detailed information on enterprise plans and features.",
  },
  {
    category: "employers",
    question: "Can I integrate Stitch with my ATS?",
    answer: "Yes, Stitch offers native integrations with popular ATS platforms like Greenhouse, Lever, and Workday on our Enterprise plans.",
  },
  {
    category: "freelancers",
    question: "How do I get paid for my work?",
    answer: "Payments are processed securely through our platform via Stripe. You can set up direct deposit to your bank account and receive payments bi-weekly.",
  },
  {
    category: "freelancers",
    question: "Is my profile visible to my current employer?",
    answer: "No. Our privacy controls allow you to block specific companies from viewing your profile, ensuring your job search remains confidential.",
  },
  {
    category: "billing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and wire transfers for annual Enterprise billing.",
  },
  {
    category: "security",
    question: "How is my data protected?",
    answer: "We use bank-level encryption (AES-256) for all data at rest and in transit. We are fully GDPR and CCPA compliant.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-lg bg-card text-card-foreground shadow-sm"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium hover:bg-muted/50 transition-colors rounded-lg [&[data-state=open]>svg]:rotate-180">
        <span className="text-left">{question}</span>
        <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 pt-0 text-muted-foreground overflow-hidden data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <div className="pt-2 border-t">
          {answer}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = FAQS.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = searchQuery ? true : faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageContainer>
      <div className="flex flex-col items-center text-center gap-6 py-12 md:py-20">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Find answers to common questions about our platform, pricing, and features.
        </p>
        
        {/* Search */}
        <div className="relative w-full max-w-xl mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            className="w-full pl-10 pr-4 py-6 text-lg rounded-xl bg-muted/50 border-muted focus-visible:ring-primary"
            placeholder="Search for answers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4 items-start">
        {/* Categories Sidebar */}
        <Card className="lg:col-span-1 border-none shadow-none bg-transparent">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl">Categories</CardTitle>
          </CardHeader>
          <CardContent className="px-0 flex flex-col gap-2">
            {FAQ_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id && !searchQuery ? "secondary" : "ghost"}
                  className="justify-start w-full font-medium"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearchQuery("");
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {cat.name}
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* FAQ List */}
        <div className="lg:col-span-3 space-y-4">
          {searchQuery && (
            <h2 className="text-xl font-semibold mb-6">
              Search results for "{searchQuery}" ({filteredFaqs.length})
            </h2>
          )}
          
          {!searchQuery && (
            <h2 className="text-2xl font-bold mb-6">
              {FAQ_CATEGORIES.find(c => c.id === activeCategory)?.name}
            </h2>
          )}

          {filteredFaqs.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredFaqs.map((faq, i) => (
                <FaqItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-xl border-dashed">
              <p className="text-muted-foreground">No questions found matching your search.</p>
              <Button 
                variant="link" 
                onClick={() => setSearchQuery("")}
                className="mt-2"
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
