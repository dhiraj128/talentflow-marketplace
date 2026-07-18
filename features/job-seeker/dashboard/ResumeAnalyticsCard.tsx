"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Eye, Download, Send, TrendingUp } from "lucide-react";
import { PremiumBadge } from "@/components/shared/PremiumBadge";

// Mock data for analytics
const analyticsData = [
  { name: 'Week 1', views: 4, score: 65, apps: 2 },
  { name: 'Week 2', views: 7, score: 68, apps: 3 },
  { name: 'Week 3', views: 12, score: 72, apps: 5 },
  { name: 'Week 4', views: 24, score: 85, apps: 8 },
  { name: 'Week 5', views: 32, score: 88, apps: 12 },
];

export function ResumeAnalyticsCard() {
  return (
    <Card className="h-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              Resume Analytics <PremiumBadge />
            </CardTitle>
            <CardDescription>Performance of your ATS-optimized resume</CardDescription>
          </div>
          <TrendingUp className="h-5 w-5 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6 mt-2">
          <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg border border-border/50">
            <Eye className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-2xl font-bold">79</span>
            <span className="text-xs text-muted-foreground">Recruiter Views</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg border border-border/50">
            <Send className="h-5 w-5 text-green-500 mb-1" />
            <span className="text-2xl font-bold">30</span>
            <span className="text-xs text-muted-foreground">Applications</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg border border-border/50">
            <Download className="h-5 w-5 text-purple-500 mb-1" />
            <span className="text-2xl font-bold">14</span>
            <span className="text-xs text-muted-foreground">Downloads</span>
          </div>
        </div>

        <div className="h-[200px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888833" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#f59e0b" 
                strokeWidth={3} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
