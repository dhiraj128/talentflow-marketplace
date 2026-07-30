"use client";

import React from "react";
import { NotificationCenter } from "@/components/shared/NotificationCenter";

export default function TrainerNotificationsPage() {
  return (
    <div className="space-y-6">
      <NotificationCenter role="TRAINER" />
    </div>
  );
}
