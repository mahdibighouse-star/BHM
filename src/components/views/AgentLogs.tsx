import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { cn } from '../layout/Sidebar';

const AGENTS = [
  { id: 'all', label: 'Select All / Global', activeColor: 'bg-t-100/20 border-t-100/40 text-t-100', tagColor: 'text-t-100' },
  { id: 'commander', label: 'Commander', activeColor: 'bg-cmd/20 border-cmd/40 text-cmd', tagColor: 'text-cmd' },
  { id: 'onboarder', label: 'Onboarder', activeColor: 'bg-status-info/20 border-status-info/40 text-status-info', tagColor: 'text-status-info' },
  { id: 'briefer', label: 'Briefer', activeColor: 'bg-purple-500/20 border-purple-500/40 text-purple-400', tagColor: 'text-purple-400' },
  { id: 'coordinator', label: 'Coordinator', activeColor: 'bg-blue-500/20 border-blue-500/40 text-blue-400', tagColor: 'text-blue-400' },
  { id: 'tracker', label: 'Tracker', activeColor: 'bg-teal-500/20 border-teal-500/40 text-teal-400', tagColor: 'text-teal-400' },
  { id: 'communicator', label: 'Communicator', activeColor: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400', tagColor: 'text-yellow-400' },
  { id: 'sales-guard', label: 'Sales Guard', activeColor: 'bg-status-warning/20 border-status-warning/40 text-status-warning', tagColor: 'text-status-warning' },
  { id: 'automator', label: 'Automator', activeColor: 'bg-status-ok/20 border-status-ok/40 text-status-ok', tagColor: 'text-status-ok' },
  { id: 'optimizer', label: 'The Optimizer', activeColor: 'bg-orange-500/20 border-orange-500/40 text-orange-400', tagColor: 'text-orange-400' },
  { id: 'seo_writer', label: 'SEO Writer', activeColor: 'bg-pink-500/20 border-pink-500/40 text-pink-400', tagColor: 'text-pink-400' },
];

interface LogEntry {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  message: string;
  isError?: boolean;
}

const INITIAL_LOGS: LogEntry[] = [
  { 
    id: '1', 
    timestamp: '09:41:02', 
    agentId: 'automator', 
    agentName: 'AUTOMATOR', 
    message: 'n8n Webhook fired: J+15 Maintenance sequence initiated for Fantinolux.' 
  },
  { 
    id: '2', 
    timestamp: '09:45:18', 
    agentId: 'onboarder', 
    agentName: 'ONBOARDER', 
    message: 'WhatsApp /intro template successfully delivered to Auto Conduite.' 
  },
  { 
    id: '3', 
    timestamp: '10:12:05', 
    agentId: 'sales-guard', 
    agentName: 'SALES GUARD', 
    message: '⚠ BLOCKED: Emmanuel Lunardi quote exceeds €2,000 without tech validation.', 
    isError: true 
  },
];

export function AgentLogs() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, activeFilter]);

  const filteredLogs = logs.filter(
    log => activeFilter === 'all' || log.agentId === activeFilter
  );

  const handleClear = () => {
    setLogs([]);
  };

  const getAgentTagColor = (agentId: string) => {
    const agent = AGENTS.find(a => a.id === agentId);
    return agent ? agent.tagColor : 'text-t-300';
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-3 border-b border-border-100 pb-4 flex-shrink-0">
        <div className="w-10 h-10 bg-panel3 border border-border-100 rounded flex items-center justify-center z-10">
          <Terminal className="w-5 h-5 text-cmd" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-t-100 uppercase tracking-wider">AGENT EXECUTION LOGS</h1>
          <p className="text-xs text-t-300 uppercase tracking-widest mt-1">Live telemetry from n8n and MindStudio orchestrators.</p>
        </div>
      </div>

      <div className="flex-shrink-0 w-full overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        <div className="flex items-center gap-2 min-w-max">
          {AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => setActiveFilter(agent.id)}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-widest border transition-all duration-200 whitespace-nowrap",
                activeFilter === agent.id
                  ? agent.activeColor
                  : "bg-panel border-border-200 text-t-300 hover:border-border-300 hover:text-t-100"
              )}
            >
              {agent.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[400px] relative mt-2 bg-void border border-border-200 rounded-md shadow-inner flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-panel2 border-b border-border-200 flex-shrink-0">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-status-err opacity-80" />
            <span className="w-3 h-3 rounded-full bg-status-warning opacity-80" />
            <span className="w-3 h-3 rounded-full bg-status-ok opacity-80" />
          </div>
          <button 
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-panel border border-border-100 text-t-300 hover:text-t-100 hover:border-border-300 rounded text-[10px] font-mono uppercase tracking-widest transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear Console
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs leading-relaxed">
          {filteredLogs.length === 0 ? (
            <div className="text-t-300 opacity-50 italic">Waiting for incoming telemetry...</div>
          ) : (
            filteredLogs.map(log => (
              <div 
                key={log.id} 
                className={cn(
                  "py-1.5 px-2 rounded -mx-2 flex gap-3 transition-colors",
                  log.isError 
                    ? "bg-status-err/10 text-status-warning" // faint red bg, amber text
                    : "hover:bg-panel3/30 text-t-200"
                )}
              >
                <div className="flex-shrink-0 text-t-300 opacity-60">
                  [{log.timestamp}]
                </div>
                <div>
                  <span className={cn("font-bold", getAgentTagColor(log.agentId))}>
                    [{log.agentName}]
                  </span>
                  <span className="mx-2 text-t-300">&gt;</span>
                  <span className={cn(log.isError ? "text-status-warning" : "text-t-100")}>
                    {log.message}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={endOfLogsRef} className="h-4" />
        </div>
      </div>
    </div>
  );
}
