import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Phone, Clock, MessageSquarePlus } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-4 py-8 md:py-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Get in Touch
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Whether you have a question about our platform, need support, or want to discuss enterprise solutions, our team is ready to help.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="Jane" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" placeholder="jane@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[150px]"
                  />
                </div>
                <Button type="button" size="lg" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Office Info & Map */}
        <div className="flex flex-col gap-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="border-none bg-muted/50">
              <CardContent className="p-6 flex flex-col gap-4">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Email Us</h3>
                  <p className="text-sm text-muted-foreground mt-1">support@stitch.com</p>
                  <p className="text-sm text-muted-foreground">enterprise@stitch.com</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none bg-muted/50">
              <CardContent className="p-6 flex flex-col gap-4">
                <Phone className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Call Us</h3>
                  <p className="text-sm text-muted-foreground mt-1">+1 (555) 123-4567</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri, 9am - 6pm EST</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="border-none bg-muted/50">
              <CardContent className="p-6 flex flex-col gap-4">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Headquarters</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    100 Innovation Way<br />
                    Suite 400<br />
                    San Francisco, CA 94105
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none bg-muted/50">
              <CardContent className="p-6 flex flex-col gap-4">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Support Hours</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    24/7 for Enterprise Clients<br />
                    Standard: 9AM - 8PM EST
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Shortcut */}
          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="p-6 flex items-start gap-4">
              <MessageSquarePlus className="h-8 w-8 shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Looking for quick answers?</h3>
                <p className="text-primary-foreground/80 mt-1 mb-4">
                  Check out our comprehensive Help Center and FAQ section before reaching out.
                </p>
                <Button variant="secondary">
                  <Link href="/faq">Visit FAQ</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <div className="h-64 w-full rounded-xl bg-muted border flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background" />
             <div className="flex flex-col items-center gap-2 text-muted-foreground z-10">
               <MapPin className="h-8 w-8" />
               <span className="font-medium">Interactive Map View</span>
             </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

