"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, CreditCard, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PaymentsPage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Payment Methods" 
        description="Manage your withdrawal methods and billing details."
        actionLabel="Add Method"
        actionIcon={<Plus className="w-4 h-4 mr-2" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="w-5 h-5 text-muted-foreground" />
              Bank Transfer (ACH)
            </CardTitle>
            <Badge variant="default">Primary</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="font-medium">**** **** 9821</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Routing Number</p>
                <p className="font-medium">**** 4432</p>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              PayPal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">john.doe@example.com</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium text-green-600">Verified</p>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" size="sm">Make Primary</Button>
                <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-8 border-t">
        <h3 className="text-xl font-semibold mb-6">Billing History</h3>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {[1,2,3].map((i) => (
                <div key={i} className="flex justify-between items-center p-6">
                  <div>
                    <p className="font-medium">Pro Subscription</p>
                    <p className="text-sm text-muted-foreground">Billed on Oct {i*5}, 2026</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">-$14.99</p>
                    <Button variant="outline" size="sm">Receipt</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
