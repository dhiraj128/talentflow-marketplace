"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { MetricCard } from "@/components/shared/MetricCard";
import { DataTable } from "@/components/shared/DataTable";
import { Users, Briefcase, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsService } from "@/lib/services/analytics.service";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function EmployerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    } else if (user) {
      analyticsService.getEmployerDashboard().then(res => {
        setData(res);
        setIsLoading(false);
      }).catch(err => {
        console.error("Failed to load dashboard data", err);
        setIsLoading(false);
      });
    }
  }, [user, loading, router]);

  if (loading || !user || isLoading) return null;

  const columns = [
    { accessorKey: "applicant", header: "Applicant" },
    { accessorKey: "job", header: "Job Role" },
    { accessorKey: "date", header: "Applied Date" },
    { accessorKey: "status", header: "Status" },
  ];

  const tableData = data?.recentApplications?.map((app: any) => ({
    id: app.id,
    applicant: app.candidate?.fullName || "Unknown",
    job: app.job?.title || "Unknown",
    date: new Date(app.appliedAt).toLocaleDateString(),
    status: app.status
  })) || [];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Dashboard" description="Overview of your recruitment activity" actionLabel="Post Job" />
      <StatsGrid>
        <MetricCard title="Active Jobs" value={data?.stats?.activeJobs?.toString() || "0"} icon={<Briefcase />} trend="up" trendValue="+0" />
        <MetricCard title="Total Applications" value={data?.stats?.totalApplications?.toString() || "0"} icon={<Users />} trend="up" trendValue="+0" />
        <MetricCard title="Shortlisted" value={data?.stats?.interviewsScheduled?.toString() || "0"} icon={<CheckCircle />} trend="up" trendValue="+0" />
        <MetricCard title="Hired" value={data?.stats?.hiredCandidates?.toString() || "0"} icon={<Clock />} trend="down" trendValue="-0" />
      </StatsGrid>
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={tableData} searchKey="applicant" />
        </CardContent>
      </Card>
    </div>
  );
}
