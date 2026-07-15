import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Clock } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      title: "Resume Review",
      price: "$49",
      duration: "48 hours",
      description: "Professional review with actionable feedback.",
      features: ["Formatting check", "Keyword optimization", "Grammar & spell check"],
      popular: false,
    },
    {
      title: "Complete Rewrite",
      price: "$149",
      duration: "3-5 days",
      description: "End-to-end resume rewrite by an industry expert.",
      features: ["1-on-1 consultation", "ATS optimization", "Unlimited revisions for 7 days", "Cover letter template"],
      popular: true,
    },
    {
      title: "Career Package",
      price: "$299",
      duration: "1 week",
      description: "Comprehensive package for serious job seekers.",
      features: ["Complete resume rewrite", "Custom cover letter", "LinkedIn profile makeover", "Interview prep guide"],
      popular: false,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Professional Services</h2>
        <p className="text-muted-foreground mt-2">Get expert help to make your application stand out from the crowd.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {services.map((service, index) => (
          <Card key={index} className={`flex flex-col ${service.popular ? 'border-primary shadow-md relative' : ''}`}>
            {service.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-primary">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle>{service.title}</CardTitle>
              <CardDescription className="mt-2 h-10">{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-4">
              <div className="text-center mb-6">
                <span className="text-4xl font-bold">{service.price}</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-6">
                <Clock className="h-4 w-4" /> Turnaround: {service.duration}
              </div>
              <ul className="space-y-3 flex-1">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={service.popular ? "default" : "outline"}>
                Book Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
