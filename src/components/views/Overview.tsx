import React from 'react';
import { useData } from '../../contexts/DataContext';
import { AlertCircle, CheckCircle2, Clock, Ghost, Zap } from 'lucide-react';
import { cn } from '../layout/Sidebar';

export function Overview() {
  const { projects: PROJECTS } = useData();
  const activeCount = PROJECTS.filter(p => p.status === 'Active').length;
  const blockedCount = PROJECTS.filter(p => p.status === 'Blocked').length;
  const waitingCount = PROJECTS.filter(p => p.status === 'Waiting Client').length;
  const toCloseCount = PROJECTS.filter(p => p.status === 'To Close').length;

  const urgentProjects = PROJECTS.filter(p => p.status === 'Blocked' || p.nextAction.includes('NOW') || p.statusDetail.includes('URGENT'));

  return (
    <div className="flex-1 overflow-y-auto w-full">
      {/* Header */}
      <header className="h-14 border-b border-border-100 flex items-center justify-between px-6 bg-void">
        <div className="flex gap-8 items-center">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-t-300 leading-none mb-1 font-mono">Active Load</span>
            <span className="text-lg font-bold leading-none">29 <span className="text-xs font-normal opacity-50 uppercase">Projects</span></span>
          </div>
          <div className="w-px h-8 bg-border-100" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-t-300 leading-none mb-1 font-mono">Blocked</span>
            <span className="text-lg font-bold leading-none text-status-err">04</span>
          </div>
          <div className="w-px h-8 bg-border-100" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-t-300 leading-none mb-1 font-mono">Waiting Client</span>
            <span className="text-lg font-bold leading-none text-status-warn">08</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-border-100 rounded text-[10px] uppercase font-bold hover:bg-white hover:text-black transition-colors">New Brief</button>
          <button className="px-3 py-1.5 bg-cmd text-t-100 rounded text-[10px] uppercase font-bold hover:bg-cmd/80 transition-colors">+ Add Project</button>
        </div>
      </header>

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        
        {/* Title Grid */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase italic tracking-widest text-t-200">// Current Operations Grid</h2>
          <div className="flex gap-2">
            <span className="w-2 h-2 bg-status-ok rounded-full"></span>
            <span className="w-2 h-2 bg-status-err rounded-full"></span>
            <span className="w-2 h-2 bg-status-warn rounded-full"></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {urgentProjects.map((p, i) => (
            <div 
              key={p.id} 
              className={cn(
                "p-4 border rounded relative group cursor-pointer transition-all",
                p.status === 'Blocked' || p.statusDetail.includes('URGENT') 
                  ? "border-cmd bg-panel3" 
                  : "border-border-100 bg-panel2 hover:border-t-300"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={cn("text-[9px] font-mono", p.status === 'Blocked' || p.statusDetail.includes('URGENT') ? "text-cmd" : "text-t-300")}>
                  #{p.num} {p.status === 'Blocked' ? 'BLOCKED' : p.status === 'To Close' ? 'TO CLOSE' : ''}
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-tighter",
                   p.status === 'Blocked' ? "bg-status-err/20 text-status-err" 
                 : p.status === 'Active' ? "bg-status-ok/20 text-status-ok"
                 : p.status === 'To Close' ? "bg-status-info/20 text-status-info"
                 : "bg-t-300/20 text-t-300"
                )}>
                  {p.status}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1 leading-tight">{p.name}</h3>
              <p className="text-xs text-t-200 mb-4 line-clamp-1">{p.statusDetail}</p>
              <div className="flex justify-between items-end border-t border-border-100 pt-3">
                <div className="flex -space-x-2">
                  {p.devIds.map((dId, idx) => (
                    <div key={dId} className={cn("w-6 h-6 rounded-full border border-panel3 flex items-center justify-center text-[8px] font-bold text-t-100 relative z-10", 
                      idx === 0 ? "bg-status-info" : idx === 1 ? "bg-cmd" : "bg-status-warn")} title={dId}>
                      {dId.substring(0,1).toUpperCase()}
                    </div>
                  ))}
                  {p.devIds.length === 0 && <span className="text-xs text-t-300">—</span>}
                </div>
                <span className={cn("text-[9px] font-mono italic uppercase tracking-tighter", p.status === 'Blocked' ? 'text-status-err' : 'text-t-300')}>
                  {p.nextAction}
                </span>
              </div>
            </div>
          ))}

          {/* View More Card */}
          <div className="p-4 border border-dashed border-border-100 bg-transparent rounded flex items-center justify-center group cursor-pointer hover:bg-panel3 transition-all">
             <span className="text-[10px] uppercase font-bold text-t-300 group-hover:text-t-100">+ View 24 More Projects</span>
          </div>

        </div>

        {/* Agency Pulse */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xs font-mono uppercase italic tracking-widest text-t-200">// Agency Pulse</h2>
            <div className="h-[1px] flex-1 bg-border-100" />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <PulseBar label="Active" count={5} max={29} color="bg-status-ok" />
            <PulseBar label="Waiting" count={10} max={29} color="bg-status-warn" />
            <PulseBar label="Ghosts" count={10} max={29} color="bg-t-300" />
            <PulseBar label="Blocked" count={4} max={29} color="bg-status-err" />
          </div>
        </div>

      </div>
    </div>
  );
}



function PulseBar({ label, count, max, color }: any) {
  const pct = Math.round((count / max) * 100);
  return (
    <div className="bg-panel2 border border-border-100 rounded p-4 h-full">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-[10px] uppercase font-bold text-t-200">{label}</span>
        <span className="font-mono text-t-100 font-medium">{count}/{max}</span>
      </div>
      <div className="h-1.5 bg-panel3 rounded-full overflow-hidden mt-3">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
