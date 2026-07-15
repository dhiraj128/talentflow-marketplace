"use client";
import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";

export default function SavedCandidatesPage() {
  const columns = [
    { accessorKey: "name", header: "Candidate Name" },
    { accessorKey: "title", header: "Current Title" },
    { accessorKey: "skills", header: "Top Skills" },
    { accessorKey: "location", header: "Location" },
  ];

  const data = [
    { name: "Anna Lee", title: "Senior Data Scientist", skills: "Python, ML, SQL", location: "San Francisco, CA" },
    { name: "Tom Hardy", title: "Backend Engineer", skills: "Java, Spring, AWS", location: "Remote" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <PageHeader title="Saved Candidates" description="Profiles you have saved for future reference." />
      <Card>
        <CardContent className="pt-6">
          <DataTable columns={columns} data={data} searchKey="name" />
        </CardContent>
      </Card>
    </div>
  );
}
