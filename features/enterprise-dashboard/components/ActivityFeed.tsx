import React from "react";
import { ActivityItem, TeamMember } from "@/lib/types/enterprise";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Avatar = React.memo(function Avatar({ initials, colorClass, size = "w-10 h-10", textClass = "text-sm" }: { initials: string, colorClass: string, size?: string, textClass?: string }) {
  return (
    <div className={`${size} rounded-full flex items-center justify-center ${textClass} font-bold text-white border-2 border-[#162947] ${colorClass} hover:-translate-y-1 transition-transform cursor-pointer shrink-0`}>
      {initials}
    </div>
  );
});

export const ActivityFeed = React.memo(function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-[#162947]/50 border border-slate-700/50 rounded-2xl p-6 flex items-center justify-center h-full w-full">
        <span className="text-slate-500 text-sm">No recent activity</span>
      </div>
    );
  }

  // Display only the first one
  const item = activities[0];

  return (
    <div className="bg-[#162947]/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-center gap-4 group hover:border-slate-500/50 transition-colors h-full w-full">
      <div className="text-sm font-semibold text-slate-200 mb-2">Recent Activity</div>
      <div className="flex items-start gap-4 w-full">
        <Avatar initials={item.user.avatarInitials} colorClass={item.user.avatarColor} size="w-12 h-12" textClass="text-base" />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm text-slate-300 break-words line-clamp-2">
            <strong className="text-white font-medium">{item.user.name}</strong> {item.action}
          </span>
          <span className="text-sm font-bold text-blue-400 truncate mt-1">{item.course}</span>
          <span className="text-xs text-slate-500 mt-1">{item.timestamp}</span>
        </div>
      </div>
    </div>
  );
});

export const TeamOverview = React.memo(function TeamOverview({ members, totalCount }: { members: TeamMember[], totalCount: number }) {
  if (!members || members.length === 0) {
    return (
      <div className="bg-[#162947]/50 border border-slate-700/50 rounded-2xl p-6 flex items-center justify-center h-full w-full">
        <span className="text-slate-500 text-sm">No team members</span>
      </div>
    );
  }

  // Strictly enforce max 5 avatars visible
  const visibleMembers = members.slice(0, 5);
  // Calculate remaining
  const extraCount = totalCount > visibleMembers.length ? totalCount - visibleMembers.length : 0;

  return (
    <div className="bg-[#162947]/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-center group hover:border-slate-500/50 transition-colors h-full w-full overflow-hidden">
      <span className="text-sm font-semibold text-slate-200 mb-4">Engineering Team</span>
      <div className="flex items-center justify-between w-full">
        <div className="flex -space-x-4">
          {visibleMembers.map((member, index) => (
            <div key={member.id} className="relative group/avatar" style={{ zIndex: 40 - index }}>
              <Avatar initials={member.initials} colorClass={member.color} size="w-12 h-12" textClass="text-base" />
              {member.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#162947] rounded-full"></div>
              )}
            </div>
          ))}
          {extraCount > 0 && (
            <div className="w-12 h-12 rounded-full border-2 border-[#162947] bg-slate-700 flex items-center justify-center text-sm font-bold text-white z-0 hover:-translate-y-1 transition-transform shrink-0">
              +{extraCount}
            </div>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-700 shrink-0 ml-2">
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Button>
      </div>
    </div>
  );
});
