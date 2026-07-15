import React from "react";
import * as Icons from "lucide-react";

interface SidebarItemProps {
  iconName: string;
  label: string;
  active?: boolean;
}

export const Sidebar = React.memo(function Sidebar({ items, activeItem }: { items: { icon: string, label: string }[], activeItem: string }) {
  return (
    <div className="hidden md:flex flex-col gap-2 p-6 border-r border-slate-700/50 bg-[#0A1424]/50 h-full w-full">
      {items.map(item => (
        <SidebarItem key={item.label} iconName={item.icon} label={item.label} active={activeItem === item.label} />
      ))}
    </div>
  );
});

function SidebarItem({ iconName, label, active }: SidebarItemProps) {
  // @ts-expect-error Dynamic icon import
  const Icon = Icons[iconName] || Icons.Circle;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 shrink-0 ${active ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-800 hover:border-slate-700'}`}>
      <Icon className="w-5 h-5 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}
