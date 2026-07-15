import fs from 'fs';
import path from 'path';

const COMPONENT_DIR = path.join(process.cwd(), 'components', 'shared');

if (!fs.existsSync(COMPONENT_DIR)) {
  fs.mkdirSync(COMPONENT_DIR, { recursive: true });
}

const templates = {
  'PageHeader.tsx': `"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
}

export function PageHeader({ title, description, actionLabel, onAction, actionIcon }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {actionLabel && (
        <div className="flex gap-2">
          <Button onClick={onAction}>
            {actionIcon || <Plus className="w-4 h-4 mr-2" />}
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
`,

  'SectionHeader.tsx': `"use client";
import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
`,

  'MetricCard.tsx': `"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function MetricCard({ title, value, description, icon, trend, trendValue, className }: MetricCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trendValue) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trendValue && (
              <span className={cn(
                trend === "up" ? "text-green-500" : "",
                trend === "down" ? "text-red-500" : ""
              )}>
                {trendValue}
              </span>
            )}
            {description && <span>{description}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
`,

  'StatsGrid.tsx': `"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({ children, columns = 4, className }: StatsGridProps) {
  const gridClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={cn(\`grid gap-4 grid-cols-1 \${gridClass}\`, className)}>
      {children}
    </div>
  );
}
`,

  'Timeline.tsx': `"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export interface TimelineItem {
  id: string | number;
  title: string;
  description?: string;
  date?: string;
  status: "completed" | "current" | "upcoming";
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <div key={item.id} className="relative pl-8 pb-4 last:pb-0">
          {index !== items.length - 1 && (
            <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
          )}
          <div className="absolute left-0 top-1">
            {item.status === "completed" && <CheckCircle2 className="w-6 h-6 text-primary" />}
            {item.status === "current" && <Clock className="w-6 h-6 text-amber-500" />}
            {item.status === "upcoming" && <Circle className="w-6 h-6 text-muted-foreground" />}
          </div>
          <div>
            <h4 className={cn("font-medium", item.status === "upcoming" ? "text-muted-foreground" : "")}>
              {item.title}
            </h4>
            {item.description && <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>}
            {item.date && <p className="text-xs text-muted-foreground mt-1">{item.date}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
`,

  'ActivityFeed.tsx': `"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  user: { name: string; avatar?: string };
  action: string;
  target?: string;
  time: string;
  icon?: React.ReactNode;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ items, className }: ActivityFeedProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {items.map((item) => (
        <div key={item.id} className="flex gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.user.avatar} alt={item.user.name} />
            <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm leading-none">
              <span className="font-medium">{item.user.name}</span> {item.action} <span className="font-medium">{item.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{item.time}</p>
          </div>
          {item.icon && <div className="text-muted-foreground">{item.icon}</div>}
        </div>
      ))}
    </div>
  );
}
`,

  'EmptyState.tsx': `"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ title, description, icon, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border rounded-xl bg-card border-dashed min-h-[300px]", className)}>
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">{description}</p>
      {actionLabel && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
`,

  'VerificationModule.tsx': `"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock, UploadCloud, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface VerificationDocument {
  id: string;
  type: string;
  name: string;
  status: "verified" | "pending" | "rejected" | "missing";
  uploadedAt?: string;
}

interface VerificationModuleProps {
  title?: string;
  description?: string;
  documents: VerificationDocument[];
  overallProgress: number;
}

export function VerificationModule({ 
  title = "Identity Verification", 
  description = "Please upload the required documents to verify your account.",
  documents,
  overallProgress
}: VerificationModuleProps) {
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "pending": return <Clock className="w-5 h-5 text-amber-500" />;
      case "rejected": return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified": return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Verified</Badge>;
      case "pending": return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending Review</Badge>;
      case "rejected": return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Action Required</Badge>;
      default: return <Badge variant="outline" className="bg-muted text-muted-foreground">Missing</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Required Documents</h3>
            <div className="grid gap-3">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(doc.status)}
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {doc.type}
                        {doc.uploadedAt && <span className="ml-2">Uploaded: {doc.uploadedAt}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(doc.status)}
                    {(doc.status === "missing" || doc.status === "rejected") && (
                      <Button size="sm" variant="outline"><UploadCloud className="w-4 h-4 mr-2"/> Upload</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
`
};

for (const [filename, content] of Object.entries(templates)) {
  const filePath = path.join(COMPONENT_DIR, filename);
  fs.writeFileSync(filePath, content);
  console.log(`Generated ${filename}`);
}
