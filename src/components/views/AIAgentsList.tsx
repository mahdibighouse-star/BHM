import React from 'react';
import { AI_AGENTS } from '../../data';
import { Bot, TerminalSquare, Activity, ShieldCheck } from 'lucide-react';
import { cn } from '../layout/Sidebar';

export function AIAgentsList() {
  const agents = Object.values(AI_AGENTS);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center gap-3 border-b border-border-100 pb-4">
        <div className="w-10 h-10 bg-panel3 border border-border-100 rounded flex items-center justify-center z-10">
          <Bot className="w-5 h-5 text-status-info" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-t-100 uppercase tracking-wider">Enterprise AI Agents</h1>
          <p className="text-xs text-t-300 uppercase tracking-widest mt-1">Autonomous Workforce</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map(agent => (
          <div key={agent.id} className="bg-panel2 border border-border-100 rounded-md p-6 hover:border-cmd/50 transition-colors group relative overflow-hidden">
            {/* Background Decorative */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TerminalSquare className="w-24 h-24" />
            </div>

            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-void border border-border-200 flex items-center justify-center text-xl font-bold shadow-inner">
                  {agent.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight text-t-100">{agent.name}</h3>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-cmd">{agent.role}</p>
                </div>
              </div>
              <div className={cn(
                "px-2 py-1 rounded text-[9px] font-mono uppercase tracking-widest border flex items-center gap-1",
                agent.status === 'Online' 
                  ? "bg-status-ok/10 text-status-ok border-status-ok/20" 
                  : agent.status === 'Idle'
                    ? "bg-status-warning/10 text-status-warning border-status-warning/20"
                    : "bg-status-info/10 text-status-info border-status-info/20"
              )}>
                {agent.status === 'Online' && <Activity className="w-3 h-3" />}
                {agent.status === 'Idle' && <TerminalSquare className="w-3 h-3" />}
                {agent.status === 'Training' && <ShieldCheck className="w-3 h-3" />}
                {agent.status}
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <p className="text-xs text-t-200 leading-relaxed min-h-[40px]">
                {agent.description}
              </p>
              
              <div>
                <div className="text-[9px] font-mono uppercase tracking-widest text-t-300 font-bold border-b border-border-100 pb-2 mb-2 flex items-center gap-2">
                  <TerminalSquare className="w-3 h-3" /> Core Capabilities
                </div>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((cap, idx) => (
                    <span key={idx} className="px-2 py-1 bg-panel border gap-1 border-border-200/50 rounded text-[9px] font-mono text-t-100 whitespace-nowrap">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <button className="w-full py-2 bg-void border border-cmd/30 text-cmd rounded text-[10px] font-mono uppercase tracking-widest hover:bg-cmd/10 hover:text-t-100 transition-colors">
                  Trigger Actions / Configure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
