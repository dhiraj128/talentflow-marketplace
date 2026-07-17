"use client";

import React, { useEffect, useState } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Briefcase, DollarSign, Clock, Users, ArrowLeft, Bookmark, Share2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/lib/services/job.service";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', params.id],
    queryFn: () => jobService.getJob(params.id)
  });

  const { data: applicationStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['job-application-status', params.id],
    queryFn: () => jobService.checkApplicationStatus(params.id),
    enabled: !!user && user.role === 'job-seeker'
  });

  const handleApply = async () => {
    if (!user) {
      toast.error("Please sign in to apply");
      router.push(`/sign-in?redirect=/find-jobs/${params.id}`);
      return;
    }

    if (user.role !== 'job-seeker') {
      toast.error("Only Job Seekers can apply for jobs");
      return;
    }

    setIsApplying(true);
    try {
      await jobService.applyToJob(params.id);
      toast.success("Successfully applied to the job!");
      refetchStatus();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to apply");
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="py-8 text-center text-muted-foreground">Loading job details...</div>
      </PageContainer>
    );
  }

  if (error || !job) {
    return (
      <PageContainer>
        <div className="py-8 text-center text-muted-foreground text-lg">Job not found or unavailable.</div>
      </PageContainer>
    );
  }

  const hasApplied = applicationStatus?.hasApplied;
  const isApplyDisabled = hasApplied || isApplying;

  const renderApplyButton = (className = "") => (
    <Button 
      size="lg" 
      className={className} 
      onClick={handleApply} 
      disabled={isApplyDisabled}
    >
      {hasApplied ? "Applied" : isApplying ? "Applying..." : "Apply Now"}
    </Button>
  );

  return (
    <PageContainer>
      <div className="py-8 flex flex-col gap-8 max-w-5xl mx-auto">
        <Link href="/find-jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 w-fit transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <Avatar className="h-20 w-20 border rounded-xl shadow-sm bg-white">
              <AvatarImage src={job.employer?.logoUrl} alt={job.employer?.companyName} className="object-contain" />
              <AvatarFallback className="text-xl rounded-xl bg-primary/10 text-primary font-bold">
                {job.employer?.companyName?.substring(0, 2).toUpperCase() || "C"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-base">
                <Link href={`/company/${job.employerId}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium text-foreground">
                  <Building2 className="h-4 w-4" />
                  {job.employer?.companyName || "Unknown Company"}
                </Link>
                {job.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            {renderApplyButton("flex-1 md:flex-none")}
            <Button variant="outline" size="icon" className="h-11 w-11 flex-shrink-0">
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-11 w-11 flex-shrink-0">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-muted/40 shadow-none border-none">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Job Type
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="font-semibold text-foreground">{job.type || "Full-time"}</p>
            </CardContent>
          </Card>
          {job.salaryRange && (
            <Card className="bg-muted/40 shadow-none border-none">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Salary
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="font-semibold text-foreground">{job.salaryRange}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Main Content */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Job Description</h2>
              <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((rs: any) => (
                      <Badge key={rs.skillId} variant="secondary" className="px-3 py-1 text-sm font-medium">
                        {rs.skill?.name || "Skill"} {rs.isMandatory ? "*" : ""}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
              <h3 className="font-semibold text-lg mb-2">Ready to join?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We're actively reviewing applications. Apply now to get started.
              </p>
              {renderApplyButton("w-full")}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
