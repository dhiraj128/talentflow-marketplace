"use client";
import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { MetricCard } from "@/components/shared/MetricCard";
import { DataTable } from "@/components/shared/DataTable";
import { Users, Briefcase, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmployerDashboard() {
  const columns = [
    { accessorKey: "applicant", header: "Applicant" },
    { accessorKey: "job", header: "Job Role" },
    { accessorKey: "date", header: "Applied Date" },
    { accessorKey: "status", header: "Status" },
  ];

  const data = [
    { id: 1, applicant: "Alice Smith", job: "Frontend Developer", date: "2023-10-01", status: "New" },
    { id: 2, applicant: "Bob Johnson", job: "Backend Engineer", date: "2023-10-02", status: "Shortlisted" },
    { id: 3, applicant: "Charlie Brown", job: "UX Designer", date: "2023-10-03", status: "Interviewed" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Dashboard" description="Overview of your recruitment activity" actionLabel="Post Job" />
      <StatsGrid>
        <MetricCard title="Active Jobs" value="12" icon={<Briefcase />} trend="up" trendValue="+2" />
        <MetricCard title="Total Applications" value="248" icon={<Users />} trend="up" trendValue="+14" />
        <MetricCard title="Shortlisted" value="45" icon={<CheckCircle />} trend="up" trendValue="+5" />
        <MetricCard title="Pending Interviews" value="8" icon={<Clock />} trend="down" trendValue="-2" />
      </StatsGrid>
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} searchKey="applicant" />
        </CardContent>
      </Card>
    </div>
  );
}
