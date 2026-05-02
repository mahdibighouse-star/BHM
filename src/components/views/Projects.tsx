import React, { useState } from 'react';
import { Project, ProjectStatus } from '../../data';
import { useData } from '../../contexts/DataContext';
import { cn } from '../layout/Sidebar';
import { View } from '../layout/Sidebar';
import { Plus, X } from 'lucide-react';

interface Props {
  onSelectProject: (id: string, view: View) => void;
}

export function Projects({ onSelectProject }: Props) {
  const { projects: PROJECTS, addProject, team: TEAM } = useData();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');
  
  const [newProject, setNewProject] = useState<Partial<Project>>({
    id: `p_${Date.now()}`,
    num: String(PROJECTS.length + 1).padStart(2, '0'),
    name: '',
    status: 'Active',
    statusDetail: '',
    devIds: [],
    agent: 'Commander',
    nextAction: '',
    waGroup: '',
    clientInfo: { name: '', objective: '' },
    notes: [],
    docs: [],
    invoiceLink: '',
    websiteLink: ''
  });

  const getStatusColor = (s: string) => {
    if (s === 'Active') return 'bg-status-ok/10 text-status-ok border-status-ok/20';
    if (s === 'Blocked') return 'bg-status-err/10 text-status-err border-status-err/20';
    if (s === 'To Close') return 'bg-status-info/10 text-status-info border-status-info/20';
    if (s === 'Waiting Client') return 'bg-status-warn/10 text-status-warn border-status-warn/20';
    return 'bg-t-300/10 text-t-300 border-t-300/20';
  };

  const active = PROJECTS.filter(p => p.status === 'Active');
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProject(newProject as Project);
    setShowForm(false);
    setNewProject({
      id: `p_${Date.now()}`,
      num: String(PROJECTS.length + 2).padStart(2, '0'),
      name: '',
      status: 'Active',
      statusDetail: '',
      devIds: [],
      agent: 'Commander',
      nextAction: '',
      waGroup: '',
      clientInfo: { name: '', objective: '' },
      notes: [],
      docs: [],
      invoiceLink: '',
      websiteLink: ''
    });
  };

  const renderTable = (list: Project[], title: string) => (
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-xs font-mono uppercase italic tracking-widest text-t-200">// {title} ({list.length})</h2>
      </div>

      <div className="border border-border-100 rounded overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel2 text-[9px] font-mono uppercase tracking-widest text-t-300 border-b border-border-100">
            <tr>
              <th className="py-2.5 px-4 font-bold">#</th>
              <th className="py-2.5 px-4 font-bold">Project</th>
              <th className="py-2.5 px-4 font-bold">Dev</th>
              <th className="py-2.5 px-4 font-bold">Status Detail</th>
              <th className="py-2.5 px-4 font-bold">Flag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-100 bg-panel border-b border-border-100">
            {list.map(p => (
              <tr 
                key={p.id} 
                onClick={() => onSelectProject(p.id, 'project-detail')}
                className="hover:bg-panel3 transition-colors cursor-pointer group"
              >
                <td className="py-3 px-4 w-12 text-t-300 font-mono text-xs">{p.num}</td>
                <td className="py-3 px-4 font-bold max-w-[200px] truncate group-hover:text-cmd transition-colors">
                  {p.name}
                </td>
                <td className="py-3 px-4 w-24">
                  <div className="flex -space-x-2 relative">
                    {p.devIds.map((dId, idx) => (
                      <div key={dId} className={cn("w-6 h-6 rounded-full border border-panel flex items-center justify-center text-[8px] font-bold text-t-100 relative z-10",
                          idx === 0 ? "bg-status-info" : idx === 1 ? "bg-cmd" : "bg-status-warn"
                      )} title={TEAM[dId]?.name}>
                        {TEAM[dId]?.avatar}
                      </div>
                    ))}
                    {p.devIds.length === 0 && <span className="text-xs text-t-300">—</span>}
                  </div>
                </td>
                <td className="py-3 px-4 text-t-200 max-w-[300px] truncate text-xs">{p.statusDetail}</td>
                <td className="py-3 px-4 w-32">
                  <span className={cn("px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-tighter font-bold border", getStatusColor(p.status))}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase italic tracking-widest text-t-200">
            // Project Matrix
          </h2>
          <div className="flex gap-2 text-[10px] font-mono tracking-widest uppercase">
            {['All', 'Active', 'Blocked', 'Waiting Client', 'To Close', 'Ghost', 'Delivered'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s as any)}
                className={cn(
                  "px-3 py-1.5 rounded border transition-colors",
                  statusFilter === s 
                    ? "bg-cmd text-void font-bold border-cmd" 
                    : "bg-panel3 text-t-300 border-border-100 hover:text-t-100 hover:border-border-200"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-cmd text-t-100 px-3 py-1.5 rounded flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-cmd/80 transition-colors h-fit">
          {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddSubmit} className="bg-panel border border-border-100 p-6 rounded-lg mb-8 space-y-4">
          <h3 className="text-sm font-bold text-cmd uppercase tracking-widest mb-4">New Project Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-t-300 mb-1">Project Name</label>
              <input required value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" placeholder="e.g. Aylim Redesign" />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-t-300 mb-1">Status</label>
              <select value={newProject.status} onChange={e => setNewProject({...newProject, status: e.target.value as ProjectStatus})} className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none appearance-none">
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
                <option value="Waiting Client">Waiting Client</option>
                <option value="To Close">To Close</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-t-300 mb-1">Operations Manager</label>
              <select value={newProject.omId || ''} onChange={e => setNewProject({...newProject, omId: e.target.value})} className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none appearance-none">
                <option value="">None</option>
                {Object.entries(TEAM).filter(([_, tm]) => tm.category === 'Manager').map(([id, tm]) => (
                  <option key={id} value={id}>{tm.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-t-300 mb-1">Sales Rep</label>
              <select value={newProject.salesId || ''} onChange={e => setNewProject({...newProject, salesId: e.target.value})} className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none appearance-none">
                <option value="">None</option>
                {Object.entries(TEAM).filter(([_, tm]) => tm.category === 'Sales').map(([id, tm]) => (
                  <option key={id} value={id}>{tm.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-t-300 mb-1 flex justify-between">
              Assigned Developers
              <span className="text-t-200 font-normal">({newProject.devIds?.length || 0} selected)</span>
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-panel3 border border-border-200 rounded">
              {Object.entries(TEAM).filter(([_, tm]) => tm.category === 'Developer').map(([id, tm]) => (
                <label key={id} className={cn("flex items-center gap-2 px-3 py-1.5 rounded border cursor-pointer border-border-200 hover:border-cmd transition-colors text-xs", newProject.devIds?.includes(id) ? "bg-cmd/10 border-cmd text-cmd" : "bg-panel border-border-100 text-t-100")}>
                  <input type="checkbox" className="hidden" checked={newProject.devIds?.includes(id) || false} onChange={e => {
                    const devIds = newProject.devIds || [];
                    if (e.target.checked) setNewProject({...newProject, devIds: [...devIds, id]});
                    else setNewProject({...newProject, devIds: devIds.filter(d => d !== id)});
                  }} />
                  <span className="font-bold">{tm.avatar}</span> {tm.name}
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-t-300 mb-1">Status Detail</label>
            <input required value={newProject.statusDetail} onChange={e => setNewProject({...newProject, statusDetail: e.target.value})} className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" placeholder="e.g. Needs branding validation" />
          </div>

          {newProject.status === 'Blocked' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-t-300 mb-1">Blocker Reason</label>
                <input required value={newProject.reason || ''} onChange={e => setNewProject({...newProject, reason: e.target.value})} className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" placeholder="e.g. Client missing assets" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-t-300 mb-1">Recommended Solution</label>
                <input value={newProject.recommendedSolution || ''} onChange={e => setNewProject({...newProject, recommendedSolution: e.target.value})} className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" placeholder="e.g. Follow up in WA group" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-t-300 mb-1">Next Action</label>
              <input required value={newProject.nextAction} onChange={e => setNewProject({...newProject, nextAction: e.target.value})} className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" placeholder="e.g. Call client for feedback" />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-t-300 mb-1">WhatsApp Group</label>
              <input required value={newProject.waGroup} onChange={e => setNewProject({...newProject, waGroup: e.target.value})} className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" placeholder="e.g. Aylim / BHM" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-t-300 mb-1">Client Name</label>
              <input required value={newProject.clientInfo?.name} onChange={e => setNewProject({...newProject, clientInfo: { ...newProject.clientInfo!, name: e.target.value }})} className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" placeholder="e.g. Aylim Corp" />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-t-300 mb-1">Client Objective</label>
              <input required value={newProject.clientInfo?.objective} onChange={e => setNewProject({...newProject, clientInfo: { ...newProject.clientInfo!, objective: e.target.value }})} className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" placeholder="e.g. Increase sales by 20%" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-t-300 mb-1">Invoice PDF Link (Optional)</label>
              <input value={newProject.invoiceLink || ''} onChange={e => setNewProject({...newProject, invoiceLink: e.target.value})} className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" placeholder="e.g. /invoices/Facture_NEW.pdf" />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-t-300 mb-1">Website Link (Optional)</label>
              <input value={newProject.websiteLink || ''} onChange={e => setNewProject({...newProject, websiteLink: e.target.value})} className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" placeholder="e.g. https://example.com" />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
             <button type="submit" className="bg-cmd text-t-100 px-6 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-cmd/80 transition-colors">
               Create Project
             </button>
          </div>
        </form>
      )}

      {statusFilter === 'All' ? (
        renderTable(PROJECTS, 'All Projects')
      ) : (
        renderTable(PROJECTS.filter(p => p.status === statusFilter), `Status: ${statusFilter}`)
      )}
    </div>
  );
}
