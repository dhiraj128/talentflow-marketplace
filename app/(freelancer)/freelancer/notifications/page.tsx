"use client";

import React from "react";
import { NotificationCenter } from "@/components/shared/NotificationCenter";

export default function FreelancerNotificationsPage() {
  return (
    <div className="space-y-6">
      <NotificationCenter role="FREELANCER" />
    </div>
  );
}
