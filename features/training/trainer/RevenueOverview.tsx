"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function RevenueOverview() {
  const data = [
    { name: 'Jan', revenue: 4500 },
    { name: 'Feb', revenue: 5200 },
    { name: 'Mar', revenue: 4800 },
    { name: 'Apr', revenue: 6100 },
    { name: 'May', revenue: 5800 },
    { name: 'Jun', revenue: 7200 },
  ];

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`$${value}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
