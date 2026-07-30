"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface AdminChartsProps {
  userGrowthData: any[];
  revenueData: any[];
}

export function AdminCharts({ userGrowthData, revenueData }: AdminChartsProps) {
  const hasUserGrowth = userGrowthData && userGrowthData.length > 0 && userGrowthData.some(d => d.users > 0);
  const hasRevenue = revenueData && revenueData.length > 0 && revenueData.some(d => d.revenue > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-background/50 backdrop-blur">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>New registrations over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasUserGrowth ? (
            <div className="h-[300px] w-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <p className="font-medium text-sm">No data available yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Registration trends will appear here as users sign up.</p>
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-background/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly recurring revenue & one-off sales</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasRevenue ? (
            <div className="h-[300px] w-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <p className="font-medium text-sm">No data available yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Platform revenue metrics will appear here.</p>
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
