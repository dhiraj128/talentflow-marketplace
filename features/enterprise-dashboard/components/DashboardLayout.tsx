import React, { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { MetricCard } from "./MetricCard";
import { LearningProgressChart } from "./LearningProgressChart";
import { CategoryChart } from "./CategoryChart";
import { ActivityFeed, TeamOverview } from "./ActivityFeed";
import { DashboardSkeleton } from "./LoadingSkeletons";
import { enterpriseDashboardService } from "@/lib/services/enterprise-dashboard.service";
import { DashboardResponse } from "@/lib/types/enterprise";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: 'BarChart3', label: 'Overview' },
  { icon: 'Users', label: 'Teams' },
  { icon: 'BookOpen', label: 'Courses' },
  { icon: 'Award', label: 'Certificates' },
  { icon: 'FileText', label: 'Reports' },
  { icon: 'Settings', label: 'Settings' },
];

export const DashboardLayout = React.memo(function DashboardLayout() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await enterpriseDashboardService.getDashboard();
      setData(res);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="w-full h-full bg-[#0F1E33]/80 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col hover:-translate-y-2 transition-transform duration-500">
      
      {/* Mac Window Controls */}
      <div className="h-10 border-b border-slate-700/50 flex items-center px-6 gap-2 bg-[#0A1424] shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
        <div className="ml-4 text-xs text-slate-500 font-medium hidden sm:block">dashboard.talentflow.com</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] flex-1 overflow-hidden min-h-0">
        <div className="hidden md:block h-full overflow-y-auto hide-scrollbar">
          <Sidebar items={sidebarItems} activeItem="Overview" />
        </div>
        
        {loading && (
          <div className="h-full overflow-y-auto no-scrollbar hide-scrollbar w-full min-w-0">
            <DashboardSkeleton />
          </div>
        )}
        
        {error && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center w-full min-w-0">
            <AlertCircle className="w-12 h-12 text-rose-400" />
            <div className="text-slate-300 font-medium text-lg">{error}</div>
            <Button onClick={loadData} variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300">
              <RefreshCcw className="w-4 h-4 mr-2" /> Retry
            </Button>
          </div>
        )}

        {!loading && !error && data && (
          <div className="flex flex-col gap-6 p-6 overflow-y-auto no-scrollbar hide-scrollbar w-full min-w-0 h-full bg-[#081526]/30">
            
            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {data.metrics.map(metric => (
                <MetricCard key={metric.id} metric={metric} />
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              <LearningProgressChart data={data.learningProgress} />
              <CategoryChart data={data.categoryAnalytics} />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              <ActivityFeed activities={data.recentActivities} />
              <TeamOverview members={data.teamMembers} totalCount={data.totalTeamMembers} />
            </div>

          </div>
        )}
      </div>
    </div>
  );
});
