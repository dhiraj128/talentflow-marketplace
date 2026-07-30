"use client";

import React from "react";
import { NotificationCenter } from "@/components/shared/NotificationCenter";

export default function EmployerNotificationsPage() {
  return (
    <div className="space-y-6">
      <NotificationCenter role="EMPLOYER" />
    </div>
  );
}
