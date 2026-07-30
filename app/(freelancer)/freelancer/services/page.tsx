"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { freelancerService } from "@/lib/services/freelancer.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    freelancerService.getMyServices()
      .then((res) => {
        setServices(res || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load services", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader 
        title="My Services" 
        description="Manage the predefined services and packages you offer."
        actionLabel="Create Service"
        onAction={() => router.push("/freelancer/services/new")}
      />

      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Layers className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <h3 className="font-semibold text-lg">No services created yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Create service packages with fixed prices and clear deliverables to attract clients.
            </p>
            <Button className="mt-6" onClick={() => router.push("/freelancer/services/new")}>
              Create Your First Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service: any) => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
                  </div>
                  <Badge variant={service.status === "ACTIVE" ? "default" : "secondary"}>
                    {service.status || "Active"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b pb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Starting from</p>
                      <p className="text-3xl font-bold">${service.price ? service.price.toLocaleString() : "0"}</p>
                    </div>
                    {service.deliveryTime && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Delivery time</p>
                        <p className="font-medium">{service.deliveryTime} Days</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1">Edit</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
