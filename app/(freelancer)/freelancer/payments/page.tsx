"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Receipt } from "lucide-react";

export default function PaymentsPage() {
  const [paymentMethods] = useState<any[]>([]);
  const [billingHistory] = useState<any[]>([]);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader 
        title="Payment Methods" 
        description="Manage your withdrawal methods and billing details."
        actionLabel="Add Method"
        actionIcon={<Plus className="w-4 h-4 mr-2" />}
      />

      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <h3 className="font-semibold text-lg">No payment methods added</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Add a bank account or payment processor to receive payouts for your completed projects.
            </p>
            <Button className="mt-6">
              <Plus className="w-4 h-4 mr-2" /> Add Payment Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  {method.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Details</p>
                    <p className="font-medium">{method.details}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="pt-8 border-t">
        <h3 className="text-xl font-semibold mb-6">Billing History</h3>
        {billingHistory.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Receipt className="w-12 h-12 text-muted-foreground/40 mb-3" />
              <h4 className="font-semibold text-base">No billing history</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Statements and platform fee invoices will be displayed here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {billingHistory.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-6">
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium">-${item.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

