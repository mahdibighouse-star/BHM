import React from 'react';
import { LayoutDashboard, FolderKanban, Users, Grid, Briefcase, Mail, Blocks, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type View = 'overview' | 'projects' | 'team' | 'ai-agents' | 'services' | 'client-ops' | 'memory' | 'logs' | 'templates' | 'seo-intel' | 'recruitment-hr' | 'project-detail' | 'team-detail' | 'service-detail';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Database, ScrollText, BookTemplate, Bot } from 'lucide-react';

export function Sidebar({ currentView, onChangeView }: SidebarProps) {
  const { user, signOut } = useAuth();
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'ai-agents', label: 'AI Agents', icon: Bot },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'templates', label: 'Prompt Templates', icon: BookTemplate },
    { id: 'seo-intel', label: 'SEO Intelligence', icon: Activity },
    { id: 'recruitment-hr', label: 'Recruitment & HR', icon: Users },
    { id: 'client-ops', label: 'Client Ops', icon: Mail },
    { id: 'memory', label: 'AI Memory', icon: Database },
    { id: 'logs', label: 'Agent Logs', icon: ScrollText },
  ] as const;

  return (
    <aside className="w-64 flex-shrink-0 bg-panel border-r border-border-200 h-screen flex flex-col">
      <div className="p-5 border-b border-border-100 bg-panel2 flex flex-col items-start gap-1">
        <h1 className="text-xs font-black tracking-widest uppercase text-cmd">BHM Command Center</h1>
        <p className="text-[10px] text-t-300 uppercase tracking-tighter italic">V2.4 — Operating System</p>
      </div>
      
      <div className="flex-1 py-6 px-3 flex flex-col gap-1">
        <div className="text-[10px] uppercase tracking-widest text-t-300 font-bold font-mono mb-3 px-3">Navigation</div>
        {navItems.map((item) => {
          const isActive = currentView === item.id || currentView.startsWith(item.id.replace('s', ''));
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as View)}
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-md text-sm transition-colors font-medium border",
                isActive
                  ? "bg-panel3 border-border-100 text-t-100"
                  : "border-transparent text-t-200 hover:bg-panel2 hover:border-transparent"
              )}
            >
              <div className={cn("w-1 h-3 rounded-sm", isActive ? "bg-cmd" : "bg-transparent")} />
              <item.icon className="w-4 h-4 opacity-70" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-border-100 bg-panel text-[10px] text-t-300 font-mono flex items-center justify-between">
        <div className="truncate pr-2">USER: {user?.email}<br/>SESSION: ACTIVE</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-ok animate-pulse" />
          <button onClick={signOut} className="text-t-300 hover:text-t-100 group" title="Sign Out">
            <LogOut className="w-4 h-4 group-hover:text-status-err transition-colors" />
          </button>
        </div>
      </div>
    </aside>
  );
}
