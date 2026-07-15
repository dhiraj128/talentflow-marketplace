"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchType } from "@/lib/services/search.service";
import React from "react";

interface SearchTabsProps {
  activeTab: SearchType;
  onTabChange: (tab: SearchType) => void;
}

export const SearchTabs = React.memo(function SearchTabs({ activeTab, onTabChange }: SearchTabsProps) {
  return (
    <div className="flex justify-center mb-6">
      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as SearchType)} className="w-full max-w-[500px]">
        <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
          <TabsTrigger value="talent">Find Talent</TabsTrigger>
          <TabsTrigger value="jobs">Find Jobs</TabsTrigger>
          <TabsTrigger value="freelancers">Find Freelancers</TabsTrigger>
          <TabsTrigger value="courses">Find Courses</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
});
