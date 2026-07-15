import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { RefreshCcw } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <PageContainer>
      <div className="py-12 max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-xl w-fit mb-2">
            <RefreshCcw className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Refund Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: October 15, 2023
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Overview</h2>
            <p>
              Thank you for choosing our platform for your recruitment and career needs. We strive to ensure our customers are completely satisfied with their purchases. If you are not entirely satisfied with your purchase, we're here to help.
            </p>
            <p>
              This Refund Policy outlines the terms and conditions under which you may request a refund for our services, including premium job postings, subscription plans, and other paid features.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Eligibility for Refunds</h2>
            <p>
              We evaluate refund requests on a case-by-case basis. Generally, you may be eligible for a refund under the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Accidental Purchases:</strong> If you accidentally purchased a service and notify us within 24 hours of the transaction, provided the service has not been utilized.</li>
              <li><strong>Technical Issues:</strong> If you experience significant technical problems that prevent you from using the purchased service, and our support team is unable to resolve the issue within a reasonable timeframe.</li>
              <li><strong>Duplicate Charges:</strong> If you are incorrectly billed multiple times for the same service.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. Non-Refundable Scenarios</h2>
            <p>
              Please note that not all situations warrant a refund. We typically do not issue refunds for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Change of Mind:</strong> If you change your mind after purchasing a service or subscription.</li>
              <li><strong>Partial Use:</strong> If you have already used a portion of the purchased service (e.g., your job posting has been live for several days and received applications).</li>
              <li><strong>Unused Subscriptions:</strong> If you forget to cancel an auto-renewing subscription before the renewal date. It is your responsibility to manage your subscription settings.</li>
              <li><strong>Account Violation:</strong> If your account is suspended or terminated due to a violation of our Terms of Service.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. How to Request a Refund</h2>
            <p>
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Contact our support team at support@example.com within the applicable time frame.</li>
              <li>Include your full name, account email address, and the transaction ID or receipt number.</li>
              <li>Provide a detailed explanation of why you are requesting a refund, including any relevant screenshots if you experienced technical issues.</li>
            </ol>
            <p>
              Our team will review your request and aim to respond within 3-5 business days with a decision or to request additional information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Processing of Refunds</h2>
            <p>
              If your refund is approved, it will be processed, and a credit will automatically be applied to your original method of payment. Please allow up to 10 business days for the refund to appear on your bank or credit card statement, depending on your financial institution's processing times.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Modifications to This Policy</h2>
            <p>
              We reserve the right to modify this Refund Policy at any time. Any changes will be effective immediately upon posting on this page. We encourage you to review this policy periodically to stay informed about our refund practices.
            </p>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
