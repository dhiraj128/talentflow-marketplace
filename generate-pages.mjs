import fs from 'fs';
import path from 'path';

const PORTALS = {
  trainer: [
    'courses', 'students', 'live', 'sessions', 'assignments',
    'certificates', 'downloads', 'announcements', 'analytics', 'revenue',
    'messages', 'settings'
  ],
  freelancer: [
    'proposals', 'projects', 'portfolio', 'services', 'reviews',
    'earnings', 'payments', 'messages', 'settings'
  ],
  employer: [
    'post-job', 'applications', 'shortlisted', 'interviews', 'saved',
    'profile', 'billing', 'reports', 'messages', 'settings'
  ],
  admin: [
    'users', 'employers', 'reviews/candidates', 'reviews/jobs', 
    'reviews/courses', 'matching', 'analytics', 'audit', 'settings'
  ],
  candidate: [
    'applications', 'saved-jobs', 'recommended', 'resume', 'certificates',
    'assessments', 'messages', 'notifications', 'profile', 'settings'
  ]
};

const PAGE_TEMPLATE = (title) => `"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Download } from "lucide-react";

export default function ${title.replace(/[^a-zA-Z]/g, '')}Page() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">${title}</h1>
          <p className="text-muted-foreground mt-1">Manage your ${title.toLowerCase()} and view insights.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Button><Plus className="w-4 h-4 mr-2" /> Create New</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Metric {i}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,34{i}</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8" />
            </div>
            <Button variant="secondary"><Download className="w-4 h-4 mr-2" /> Export</Button>
          </div>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="border-b">
                  <th className="h-10 px-4 text-left font-medium">ID</th>
                  <th className="h-10 px-4 text-left font-medium">Name</th>
                  <th className="h-10 px-4 text-left font-medium">Status</th>
                  <th className="h-10 px-4 text-left font-medium">Date</th>
                  <th className="h-10 px-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">#100{i}</td>
                    <td className="p-4">Item Record {i}</td>
                    <td className="p-4"><Badge variant="outline" className="text-green-600 bg-green-500/10">Active</Badge></td>
                    <td className="p-4">2026-07-14</td>
                    <td className="p-4 text-right"><Button variant="ghost" size="sm">View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
`;

const BASE_DIR = path.join(process.cwd(), 'app');

for (const [portal, routes] of Object.entries(PORTALS)) {
  for (const route of routes) {
    const routeParts = route.split('/');
    
    let dirPath = '';
    if (portal === 'candidate') {
      dirPath = path.join(BASE_DIR, '(candidate)', 'candidate', ...routeParts);
    } else {
      dirPath = path.join(BASE_DIR, `(${portal})`, portal, ...routeParts);
    }

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, 'page.tsx');
    if (!fs.existsSync(filePath)) {
      const titleName = routeParts[routeParts.length - 1].replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
      fs.writeFileSync(filePath, PAGE_TEMPLATE(titleName));
      console.log(`Created: ${filePath}`);
    } else {
      console.log(`Skipped (exists): ${filePath}`);
    }
  }
}

// Special case routes mentioned in layouts but mapped to root pages
const ROOT_ROUTES = [
  'billing', 'subscription', 'messages', 'settings'
];

for (const route of ROOT_ROUTES) {
  const dirPath = path.join(BASE_DIR, route);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, 'page.tsx');
  if (!fs.existsSync(filePath)) {
    const titleName = route.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
    fs.writeFileSync(filePath, PAGE_TEMPLATE(titleName));
    console.log(`Created Root: ${filePath}`);
  }
}
