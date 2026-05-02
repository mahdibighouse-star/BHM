import React, { useState, useEffect } from 'react';
import { Activity, BarChart, Globe, FileCode2, Zap, Network, TableProperties, ShieldAlert, Cpu, TerminalSquare, Search, GitBranch, ChevronDown, CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, TrendingDown, ArrowRight, ExternalLink, Link2, Shield, AlertOctagon } from 'lucide-react';
import { cn } from '../layout/Sidebar';
import { motion } from 'framer-motion';

export function SeoIntelligence() {
  const [projectToRun, setProjectToRun] = useState('CT Industry');
  const [activeTab, setActiveTab] = useState('overview');
  const [runningAction, setRunningAction] = useState<string | null>(null);

  interface Resource {
    id: string;
    name: string;
    url: string;
  }
  const [resources, setResources] = useState<Resource[]>([
    { id: '1', name: 'SEMrush Access', url: 'https://1.semrush.com.in/' }
  ]);
  const [isEditingResources, setIsEditingResources] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');

  useEffect(() => {
    const handleInvoke = (e: CustomEvent) => {
      const { actionId } = e.detail;
      setRunningAction(actionId);
      
      // Navigate to the relevant tab based on action
      if (actionId === 'run-full-link-audit' || actionId === 'draft-disavow' || actionId === 'monitor-link' || actionId === 'start-outreach') {
        setActiveTab('backlink_ops');
      } else if (actionId === 'run-crawler' || actionId.startsWith('execute-fix') || actionId.startsWith('schedule') || actionId.startsWith('retry')) {
        setActiveTab('overview');
      }
      
      // Clear the running state after 3 seconds
      setTimeout(() => setRunningAction(null), 3000);
    };
    
    window.addEventListener('agent-invoke-action', handleInvoke as EventListener);
    return () => window.removeEventListener('agent-invoke-action', handleInvoke as EventListener);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'site_audit', label: 'Site Audit' },
    { id: 'position_tracking', label: 'Position Tracking' },
    { id: 'backlink_ops', label: 'Backlink Ops' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 overflow-y-auto w-full p-8 max-w-7xl mx-auto space-y-6 bg-void"
    >
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-100 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-panel3 border border-border-100 rounded flex items-center justify-center z-10">
            <Globe className="w-5 h-5 text-cmd" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-t-100 uppercase tracking-wider">SEO & GEO INTELLIGENCE COMMAND</h1>
            <p className="text-xs text-t-300 uppercase tracking-widest mt-1">Agent 09: The Optimizer Control Interface</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <select 
              value={projectToRun}
              onChange={(e) => setProjectToRun(e.target.value)}
              className="w-full bg-panel border border-border-200 text-t-100 text-sm rounded px-4 py-2 outline-none focus:border-cmd appearance-none min-w-[200px]"
            >
              <option value="CT Industry">Target: CT Industry</option>
              <option value="Fantinolux">Target: Fantinolux</option>
              <option value="Auto Conduite">Target: Auto Conduite</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-300 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-border-200 pb-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-xs font-mono uppercase tracking-widest font-bold border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.id 
                ? "border-cmd text-cmd" 
                : "border-transparent text-t-300 hover:text-t-100 hover:border-border-300"
            )}
          >
            [{tab.label}]
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Overview Matrix (Top Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Authority Score */}
              <div className="bg-panel2 border border-border-100 rounded-md p-5 flex items-center justify-between group hover:border-border-300 transition-colors">
                <div className="flex flex-col gap-1">
                   <h3 className="text-[10px] font-mono text-t-300 uppercase tracking-widest flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Authority Score</h3>
                   <div className="flex items-baseline gap-2 mt-2">
                     <span className="text-3xl font-bold font-mono text-t-100">42</span>
                     <span className="text-xs font-mono text-t-300">/100</span>
                   </div>
                </div>
                {/* Mock Ring */}
                <div className="relative w-14 h-14 rounded-full border-4 border-panel3 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="24" cy="24" r="24" className="stroke-cmd fill-transparent" strokeWidth="4" strokeDasharray="150" strokeDashoffset="87" />
                  </svg>
                </div>
              </div>

              {/* Organic Traffic */}
              <div className="bg-panel2 border border-border-100 rounded-md p-5 flex flex-col justify-between group hover:border-border-300 transition-colors">
                <h3 className="text-[10px] font-mono text-t-300 uppercase tracking-widest flex items-center gap-1.5"><Network className="w-3.5 h-3.5" /> Organic Traffic</h3>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-3xl font-bold font-mono text-t-100">12.4K</span>
                  <span className="text-xs font-mono font-bold text-status-ok flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" /> +14%</span>
                </div>
              </div>

              {/* Keywords in Top 10 */}
              <div className="bg-panel2 border border-border-100 rounded-md p-5 flex flex-col justify-between group hover:border-border-300 transition-colors">
                <h3 className="text-[10px] font-mono text-t-300 uppercase tracking-widest flex items-center gap-1.5"><BarChart className="w-3.5 h-3.5" /> Keywords in Top 10</h3>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-bold font-mono text-t-100">184</span>
                  {/* Mock Sparkline */}
                  <div className="flex items-end gap-1 h-8 opacity-70">
                     {[4, 6, 5, 8, 7, 10, 12, 11, 15, 18].map((h, i) => (
                        <div key={i} className="w-1.5 bg-cmd rounded-t-sm" style={{ height: `${h * 2}px` }} />
                     ))}
                  </div>
                </div>
              </div>

              {/* Toxicity Score */}
              <div className="bg-panel2 border border-status-err/30 rounded-md p-5 flex flex-col justify-between group hover:border-status-err/60 transition-colors">
                <h3 className="text-[10px] font-mono text-status-err uppercase tracking-widest flex items-center gap-1.5 font-bold"><ShieldAlert className="w-3.5 h-3.5" /> Toxicity Score</h3>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-xl font-bold font-mono text-status-warning">High Risk</span>
                </div>
                <p className="text-[10px] font-mono text-status-err/80 mt-1 uppercase">14 toxic domains detected</p>
              </div>
            </div>

            {/* Middle Grid: Site Audit & Technical Action Board */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Column A: Core Web Vitals & Crawl Health */}
              <div className="bg-panel2 border border-border-100 rounded-md flex flex-col overflow-hidden">
                 <div className="bg-panel/50 px-6 py-4 border-b border-border-100 flex items-center justify-between">
                   <h2 className="text-xs font-mono uppercase tracking-widest text-t-100 font-bold flex items-center gap-2">
                     <Activity className="w-4 h-4 text-cmd" /> Core Web Vitals & Crawl Health
                   </h2>
                   <button 
                     onClick={() => setRunningAction('run-crawler')}
                     className={cn(
                       "border font-mono font-bold uppercase tracking-widest text-[10px] px-3 py-1.5 rounded transition-all",
                       runningAction === 'run-crawler' ? "bg-cmd text-void border-cmd" : "bg-cmd/10 hover:bg-cmd text-cmd hover:text-void border-cmd/50"
                     )}>
                     {runningAction === 'run-crawler' ? '[Running...]' : 'Run Crawler'}
                   </button>
                 </div>
                 <div className="p-6 space-y-4 font-mono text-xs">
                    {/* Errors */}
                    <div className="flex items-start gap-3 p-3 bg-status-err/5 border border-status-err/20 rounded">
                       <AlertCircle className="w-5 h-5 text-status-err shrink-0 mt-0.5" />
                       <div className="flex-1">
                         <div className="text-status-err font-bold mb-1">Errors: 24</div>
                         <div className="text-t-200">Broken internal links, Missing H1s</div>
                       </div>
                    </div>
                    {/* Warnings */}
                    <div className="flex items-start gap-3 p-3 bg-status-warning/5 border border-status-warning/20 rounded">
                       <AlertTriangle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" />
                       <div className="flex-1">
                         <div className="text-status-warning font-bold mb-1">Warnings: 102</div>
                         <div className="text-t-200">Missing Alt-text, Low text-to-HTML ratio</div>
                       </div>
                    </div>
                    {/* Notices */}
                    <div className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded">
                       <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                       <div className="flex-1">
                         <div className="text-blue-400 font-bold mb-1">Notices: 45</div>
                         <div className="text-t-200">Orphaned pages</div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Column B: Agent 09 Execution Queue */}
              <div className="bg-panel2 border border-border-100 rounded-md flex flex-col overflow-hidden">
                 <div className="bg-panel/50 px-6 py-4 border-b border-border-100 flex items-center justify-between">
                   <h2 className="text-xs font-mono uppercase tracking-widest text-t-100 font-bold flex items-center gap-2">
                     <TerminalSquare className="w-4 h-4 text-cmd" /> Agent 09 Execution Queue
                   </h2>
                 </div>
                 <div className="p-4 flex-1 space-y-3 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[300px]">
                    {/* Pending Task */}
                    <div className="border border-border-200 bg-void p-3 rounded flex flex-col gap-3 group hover:border-cmd/30 transition-colors">
                      <div className="flex items-start gap-2">
                         <span className="text-status-warning font-bold shrink-0">Issue:</span>
                         <span className="text-t-100">Cannibalization on /services.</span>
                      </div>
                      <div className="flex justify-between items-end mt-1">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-status-ok font-bold shrink-0">Fix:</span>
                            <span className="text-t-200">Auto-generate canonical tags.</span>
                          </div>
                          <span className="text-[10px] text-t-300">Status: <span className="text-cmd">Pending</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setRunningAction('schedule-fix-1')}
                            className={cn(
                              "px-3 py-1.5 border rounded transition-colors uppercase tracking-widest font-bold",
                              runningAction === 'schedule-fix-1' ? "bg-cmd text-void border-cmd" : "bg-cmd/10 hover:bg-cmd hover:text-void border-cmd/50 text-cmd"
                            )}>
                            {runningAction === 'schedule-fix-1' ? '[Scheduling...]' : '[Schedule]'}
                          </button>
                          <button 
                            onClick={() => setRunningAction('execute-fix-1')}
                            className={cn(
                              "px-3 py-1.5 border rounded transition-colors uppercase tracking-widest font-bold",
                              runningAction === 'execute-fix-1' ? "bg-cmd text-void border-cmd" : "bg-cmd/10 hover:bg-cmd hover:text-void border-cmd/50 text-cmd"
                            )}>
                            {runningAction === 'execute-fix-1' ? '[Executing...]' : '[Execute Fix]'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Failed Task */}
                    <div className="border border-status-err/30 bg-status-err/5 p-3 rounded flex flex-col gap-3 group hover:border-status-err/60 transition-colors">
                      <div className="flex items-start gap-2">
                         <span className="text-status-warning font-bold shrink-0">Issue:</span>
                         <span className="text-t-100">Missing Schema on 14 products.</span>
                      </div>
                      <div className="flex justify-between items-end mt-1">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-status-ok font-bold shrink-0">Fix:</span>
                            <span className="text-t-200">Inject Product JSON-LD.</span>
                          </div>
                          <span className="text-[10px] text-status-err font-bold">Status: Failed (API Timeout)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setRunningAction('retry-fix-2')}
                            className={cn(
                              "px-3 py-1.5 border rounded transition-colors uppercase tracking-widest font-bold",
                              runningAction === 'retry-fix-2' ? "bg-status-err text-void border-status-err" : "bg-status-err/10 hover:bg-status-err hover:text-void border-status-err/50 text-status-err"
                            )}>
                            {runningAction === 'retry-fix-2' ? '[Retrying...]' : '[Retry]'}
                          </button>
                          <button 
                            onClick={() => setRunningAction('execute-fix-2')}
                            className={cn(
                              "px-3 py-1.5 border rounded transition-colors uppercase tracking-widest font-bold",
                              runningAction === 'execute-fix-2' ? "bg-cmd text-void border-cmd" : "bg-cmd/10 hover:bg-cmd hover:text-void border-cmd/50 text-cmd"
                            )}>
                            {runningAction === 'execute-fix-2' ? '[Executing...]' : '[Execute Fix]'}
                          </button>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Position Tracking & GEO Hub (Bottom) */}
            <div className="bg-panel2 border border-border-100 rounded-md overflow-hidden">
               <div className="bg-panel/50 px-6 py-4 border-b border-border-100 flex items-center justify-between">
                 <h2 className="text-xs font-mono uppercase tracking-widest text-t-100 font-bold flex items-center gap-2">
                   <Globe className="w-4 h-4 text-cmd" /> Position Tracking & GEO Hub
                 </h2>
                 <button className="text-[10px] font-mono text-t-300 hover:text-t-100 uppercase tracking-widest font-bold flex items-center gap-1 transition-colors">
                   View Full Report <ArrowRight className="w-3 h-3" />
                 </button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-border-200 bg-panel text-[10px] font-mono uppercase tracking-widest text-t-300">
                       <th className="px-6 py-4 font-bold">Keyword</th>
                       <th className="px-4 py-4 font-bold">Intent</th>
                       <th className="px-4 py-4 font-bold">Pos.</th>
                       <th className="px-4 py-4 font-bold">Change</th>
                       <th className="px-4 py-4 font-bold">Volume</th>
                       <th className="px-4 py-4 font-bold">AI Overview</th>
                       <th className="px-6 py-4 font-bold text-right">Action</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm font-mono text-t-200 divide-y divide-border-100/50">
                     <tr className="hover:bg-panel/50 transition-colors">
                       <td className="px-6 py-4 font-medium text-t-100">Usinage sur mesure</td>
                       <td className="px-4 py-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20">COMMERCIAL</span></td>
                       <td className="px-4 py-4 text-t-100 font-bold">4</td>
                       <td className="px-4 py-4"><span className="text-status-ok font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +2</span></td>
                       <td className="px-4 py-4">850</td>
                       <td className="px-4 py-4"><span className="text-t-300 border border-border-200 px-2 py-0.5 rounded text-[10px]">Not Featured</span></td>
                       <td className="px-6 py-4 text-right">
                         <button className="px-3 py-1.5 bg-panel border border-border-200 hover:border-cmd/50 hover:text-cmd text-t-300 rounded transition-colors uppercase tracking-widest font-bold text-[10px]">
                           [Draft Pillar]
                         </button>
                       </td>
                     </tr>
                     <tr className="hover:bg-panel/50 transition-colors">
                       <td className="px-6 py-4 font-medium text-t-100">Tolerie industrielle</td>
                       <td className="px-4 py-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">INFORMATIONAL</span></td>
                       <td className="px-4 py-4 text-t-100 font-bold">11</td>
                       <td className="px-4 py-4"><span className="text-status-err font-bold flex items-center gap-1"><TrendingDown className="w-3 h-3" /> -3</span></td>
                       <td className="px-4 py-4">1.2K</td>
                       <td className="px-4 py-4"><span className="text-cmd border border-cmd/30 bg-cmd/10 px-2 py-0.5 rounded text-[10px]">Featured</span></td>
                       <td className="px-6 py-4 text-right">
                         <button className="px-3 py-1.5 bg-panel border border-border-200 hover:border-cmd/50 hover:text-cmd text-t-300 rounded transition-colors uppercase tracking-widest font-bold text-[10px]">
                           [Refresh Content]
                         </button>
                       </td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </div>
          </>
        )}

        {activeTab === 'backlink_ops' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Backlink Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div className="bg-panel2 border border-border-100 rounded-md p-5 flex flex-col justify-between group hover:border-border-300 transition-colors">
                  <h3 className="text-[10px] font-mono text-t-300 uppercase tracking-widest flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5" /> Total Active Backlinks</h3>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-3xl font-bold font-mono text-t-100">4,812</span>
                    <span className="text-xs font-mono font-bold text-status-ok flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" /> +210</span>
                  </div>
               </div>

               <div className="bg-panel2 border border-border-100 rounded-md p-5 flex flex-col justify-between group hover:border-border-300 transition-colors">
                  <h3 className="text-[10px] font-mono text-t-300 uppercase tracking-widest flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Referring Domains</h3>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-3xl font-bold font-mono text-t-100">345</span>
                    <span className="text-xs font-mono font-bold text-status-ok flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" /> +12</span>
                  </div>
               </div>

               <div className="bg-panel2 border border-status-err/30 rounded-md p-5 flex flex-col justify-between group hover:border-status-err/60 transition-colors">
                  <h3 className="text-[10px] font-mono text-status-err uppercase tracking-widest flex items-center gap-1.5 font-bold"><AlertOctagon className="w-3.5 h-3.5" /> Highly Toxic Links</h3>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-3xl font-bold font-mono text-status-err">14</span>
                  </div>
                  <p className="text-[10px] font-mono text-status-err/80 mt-1 uppercase">Requires Disavow</p>
               </div>
               
               <div className="bg-panel2 border border-border-100 rounded-md p-5 flex flex-col justify-between group hover:border-border-300 transition-colors">
                  <h3 className="text-[10px] font-mono text-t-300 uppercase tracking-widest flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Domain Trust Flow</h3>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-3xl font-bold font-mono text-t-100">38</span>
                    <span className="text-xs font-mono text-t-300">/100</span>
                  </div>
               </div>
            </div>

            {/* Link Analysis Table */}
            <div className="bg-panel2 border border-border-100 rounded-md overflow-hidden">
               <div className="bg-panel/50 px-6 py-4 border-b border-border-100 flex items-center justify-between">
                 <h2 className="text-xs font-mono uppercase tracking-widest text-t-100 font-bold flex items-center gap-2">
                   <TableProperties className="w-4 h-4 text-cmd" /> Live Link Graph & Outreach Action Board
                 </h2>
                 <button 
                   onClick={() => setRunningAction('run-full-link-audit')}
                   className={cn(
                     "border font-mono font-bold uppercase tracking-widest text-[10px] px-3 py-1.5 rounded transition-all",
                     runningAction === 'run-full-link-audit' ? "bg-cmd text-void border-cmd" : "bg-cmd/10 hover:bg-cmd text-cmd hover:text-void border-cmd/50"
                   )}>
                   {runningAction === 'run-full-link-audit' ? 'Running Audit...' : 'Run Full Link Audit'}
                 </button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-border-200 bg-panel text-[10px] font-mono uppercase tracking-widest text-t-300">
                       <th className="px-6 py-4 font-bold">Referring Domain / Target</th>
                       <th className="px-4 py-4 font-bold">Anchor Text</th>
                       <th className="px-4 py-4 font-bold">DR</th>
                       <th className="px-4 py-4 font-bold">Toxicity</th>
                       <th className="px-6 py-4 font-bold text-right">Action (Agent 09)</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm font-mono text-t-200 divide-y divide-border-100/50">
                     <tr className="hover:bg-panel/50 transition-colors">
                       <td className="px-6 py-4">
                         <div className="font-medium text-t-100 mb-1 flex items-center gap-1.5">
                           spam-directory-391.biz <ExternalLink className="w-3 h-3 text-t-300" />
                         </div>
                         <div className="text-[10px] font-mono text-t-300">Target: /about-us</div>
                       </td>
                       <td className="px-4 py-4 font-mono text-[11px] bg-void rounded px-2 min-w-[150px]">
                         "click here cheap machining"
                       </td>
                       <td className="px-4 py-4 text-t-200 font-bold">0</td>
                       <td className="px-4 py-4">
                         <div className="flex items-center gap-2">
                           <div className="w-16 h-2 bg-void rounded-full overflow-hidden border border-border-200">
                             <div className="h-full bg-status-err w-[90%]" />
                           </div>
                           <span className="text-status-err font-bold text-xs">90/100</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => setRunningAction('draft-disavow')}
                           className={cn(
                             "px-3 py-1.5 border rounded transition-colors uppercase tracking-widest font-bold text-[10px]",
                             runningAction === 'draft-disavow' ? "bg-status-err text-void border-status-err" : "bg-status-err/10 border-status-err/50 hover:bg-status-err hover:text-void text-status-err"
                           )}>
                           {runningAction === 'draft-disavow' ? '[Drafting...]' : '[Draft Disavow]'}
                         </button>
                       </td>
                     </tr>
                     <tr className="hover:bg-panel/50 transition-colors">
                       <td className="px-6 py-4">
                         <div className="font-medium text-t-100 mb-1 flex items-center gap-1.5">
                           industry-news-france.fr <ExternalLink className="w-3 h-3 text-t-300" />
                         </div>
                         <div className="text-[10px] font-mono text-t-300">Target: /services/usinage</div>
                       </td>
                       <td className="px-4 py-4 font-mono text-[11px] bg-void rounded px-2 min-w-[150px]">
                         "experts en usinage"
                       </td>
                       <td className="px-4 py-4 text-cmd font-bold">54</td>
                       <td className="px-4 py-4">
                         <div className="flex items-center gap-2">
                           <div className="w-16 h-2 bg-void rounded-full overflow-hidden border border-border-200">
                             <div className="h-full bg-status-ok w-[12%]" />
                           </div>
                           <span className="text-status-ok font-bold text-xs">12/100</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => setRunningAction('monitor-link')}
                           className={cn(
                             "px-3 py-1.5 border rounded transition-colors uppercase tracking-widest font-bold text-[10px]",
                             runningAction === 'monitor-link' ? "bg-cmd text-void border-cmd" : "bg-panel border-border-200 hover:border-cmd/50 hover:text-cmd text-t-300"
                           )}>
                           {runningAction === 'monitor-link' ? '[Monitoring...]' : '[Monitor]'}
                         </button>
                       </td>
                     </tr>
                     <tr className="hover:bg-panel/50 transition-colors">
                       <td className="px-6 py-4">
                         <div className="font-medium text-t-100 mb-1 flex items-center gap-1.5">
                           competitor-blog.com <ExternalLink className="w-3 h-3 text-t-300" />
                         </div>
                         <div className="text-[10px] font-mono text-t-300">Target: /blog/trends-2026</div>
                       </td>
                       <td className="px-4 py-4 font-mono text-[11px] bg-void rounded px-2 min-w-[150px]">
                         "industry report 2026"
                       </td>
                       <td className="px-4 py-4 text-t-100 font-bold">38</td>
                       <td className="px-4 py-4">
                         <div className="flex items-center gap-2">
                           <div className="w-16 h-2 bg-void rounded-full overflow-hidden border border-border-200">
                             <div className="h-full bg-status-warning w-[45%]" />
                           </div>
                           <span className="text-status-warning font-bold text-xs">45/100</span>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => setRunningAction('start-outreach')}
                           className={cn(
                             "px-3 py-1.5 border rounded transition-colors uppercase tracking-widest font-bold text-[10px]",
                             runningAction === 'start-outreach' ? "bg-cmd text-void border-cmd" : "bg-panel border-border-200 hover:border-cmd/50 hover:text-cmd text-t-300"
                           )}>
                           {runningAction === 'start-outreach' ? '[Starting...]' : '[Start Outreach]'}
                         </button>
                       </td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </div>
          </motion.div>
        )}

        {/* Other Tabs placeholders */}
        {(activeTab === 'site_audit' || activeTab === 'position_tracking') && (
           <div className="bg-panel2 border border-border-100 rounded-md p-12 text-center text-t-300 font-mono text-sm">
             [Module {activeTab.toUpperCase()} is initializing. Please review Overview or Backlink Ops.]
           </div>
        )}
      </div>

      {/* Resources Section at the Bottom */}
      <div className="mt-8 pt-8 border-t border-border-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-t-100 font-bold flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-cmd" /> SEO Resources
          </h2>
          <button 
            onClick={() => setIsEditingResources(!isEditingResources)}
            className="text-xs font-mono uppercase tracking-widest text-cmd hover:text-cmd/80 transition-colors border border-cmd/30 hover:border-cmd px-3 py-1.5 rounded"
          >
            {isEditingResources ? 'Done Editing' : 'Edit Resources'}
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          {resources.map((res, index) => (
            isEditingResources ? (
              <div key={res.id} className="flex gap-2 items-center bg-panel2 p-2 rounded border border-border-100 shadow-sm">
                <input 
                  type="text" 
                  value={res.name}
                  onChange={(e) => {
                    const updated = [...resources];
                    updated[index].name = e.target.value;
                    setResources(updated);
                  }}
                  className="bg-panel px-3 py-1.5 text-xs font-mono border border-border-200 rounded text-t-100 w-32 focus:border-cmd outline-none transition-colors" 
                />
                <input 
                  type="text" 
                  value={res.url}
                  onChange={(e) => {
                    const updated = [...resources];
                    updated[index].url = e.target.value;
                    setResources(updated);
                  }}
                  className="bg-panel px-3 py-1.5 text-xs font-mono border border-border-200 rounded text-t-100 w-64 focus:border-cmd outline-none transition-colors" 
                />
                <button 
                  onClick={() => setResources(resources.filter(r => r.id !== res.id))}
                  className="text-status-err hover:text-status-err/80 ml-2 text-xs font-bold uppercase tracking-widest"
                >
                  Remove
                </button>
              </div>
            ) : (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#ff642d]/10 hover:bg-[#ff642d]/20 text-[#ff642d] border border-[#ff642d]/50 px-4 py-2 rounded text-sm font-bold uppercase tracking-widest transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {res.name}
              </a>
            )
          ))}
          
          {isEditingResources && (
            <div className="flex gap-2 items-center bg-panel2 p-2 rounded border border-cmd/50 border-dashed">
              <input 
                type="text" 
                placeholder="Resource Name"
                value={newResourceName}
                onChange={(e) => setNewResourceName(e.target.value)}
                className="bg-panel px-3 py-1.5 text-xs font-mono border border-border-200 rounded text-t-100 w-32 focus:border-cmd outline-none transition-colors" 
              />
              <input 
                type="text" 
                placeholder="URL (https://...)"
                value={newResourceUrl}
                onChange={(e) => setNewResourceUrl(e.target.value)}
                className="bg-panel px-3 py-1.5 text-xs font-mono border border-border-200 rounded text-t-100 w-64 focus:border-cmd outline-none transition-colors" 
              />
              <button 
                onClick={() => {
                  if (newResourceName && newResourceUrl) {
                    setResources([...resources, { id: Date.now().toString(), name: newResourceName, url: newResourceUrl }]);
                    setNewResourceName('');
                    setNewResourceUrl('');
                  }
                }}
                className="bg-cmd text-void px-4 py-1.5 rounded text-xs font-bold font-mono tracking-widest uppercase hover:bg-cmd/90 ml-2 transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

