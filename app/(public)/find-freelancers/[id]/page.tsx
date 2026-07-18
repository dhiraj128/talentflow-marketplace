"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { ServiceProfile } from "@/features/freelancer/profile/ServiceProfile";
import { MOCK_FREELANCERS } from "../mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FreelancerProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const freelancer = useMemo(() => {
    return MOCK_FREELANCERS.find(f => f.id === id);
  }, [id]);

  if (!freelancer) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-bold mb-2">Freelancer Not Found</h2>
          <p className="text-muted-foreground mb-6">The profile you are looking for does not exist or has been removed.</p>
          <Link href="/find-freelancers">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="bg-muted/10 min-h-screen pb-24 md:pb-20">
      <div className="bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 h-[250px] md:h-[300px] w-full rounded-b-[2rem] md:rounded-b-[4rem] absolute top-0 left-0 right-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>
      
      <PageContainer className="relative z-10 pt-6 md:pt-10">
        <div className="mb-6">
          <Link href="/find-freelancers">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
            </Button>
          </Link>
        </div>
        
        <ServiceProfile freelancer={freelancer} />
      </PageContainer>
    </div>
  );
}
