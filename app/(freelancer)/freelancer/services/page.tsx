"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="My Services" 
        description="Manage the predefined services and packages you offer."
        actionLabel="Create Service"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service 1 */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Full Website Development</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">A complete custom website using Next.js and TailwindCSS.</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b pb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="text-3xl font-bold">$1,200</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Delivery time</p>
                  <p className="font-medium">14 Days</p>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-sm font-medium">Includes:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Up to 5 pages</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Responsive Design</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> SEO Optimization</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Source Code Delivery</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" className="flex-1">Edit</Button>
            <Button variant="secondary" className="flex-1">Pause</Button>
          </CardFooter>
        </Card>

        {/* Service 2 */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">UI/UX Audit & Redesign</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Comprehensive review and redesign of your existing app.</p>
              </div>
              <Badge variant="secondary">Draft</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b pb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="text-3xl font-bold">$800</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Delivery time</p>
                  <p className="font-medium">7 Days</p>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-sm font-medium">Includes:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Heuristic Evaluation</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Figma Prototypes</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 2 Revisions</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Design System Assets</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="default" className="flex-1">Publish</Button>
            <Button variant="outline" className="flex-1">Edit</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
