import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";

export default function CheckoutPage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Secure Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <p className="text-sm text-muted-foreground mb-6">Stripe integration will be added here.</p>
          <div className="h-64 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            Payment Form Placeholder
          </div>
        </div>
        <div className="bg-secondary/20 p-6 rounded-xl border">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-4">
              <span>Growth Plan (Monthly)</span>
              <span className="font-medium">$899.00</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span>Tax</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-bold">Total</span>
              <span className="font-bold text-xl">$899.00</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
