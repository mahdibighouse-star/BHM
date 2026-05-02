import React, { useState, useRef, useEffect } from 'react';
import { TeamMember } from '../../data';
import { useData } from '../../contexts/DataContext';
import { MessageSquare, FolderKanban, Plus, Edit2, X, User, Filter, Shield, Briefcase, Wrench } from 'lucide-react';
import { cn } from '../layout/Sidebar';

interface Props {
  initialSelectedMemberId?: string | null;
}

export function TeamList({ initialSelectedMemberId }: Props) {
  const { team: TEAM, projects: PROJECTS, addTeamMember, updateTeamMember } = useData();
  const members = Object.values(TEAM);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');
  
  const formRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    avatar: '',
    waLink: '',
    category: 'Developer'
  });

  const categories = ['All', 'Manager', 'Operations', 'Coordinator', 'Sales', 'Designer', 'Developer'];

  const getProjectsForMember = (memberId: string) => {
    return PROJECTS.filter(p => p.devIds.includes(memberId) || p.omId === memberId || p.salesId === memberId);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ name: '', role: '', avatar: '', waLink: '', category: 'Developer' });
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleEditClick = (member: TeamMember) => {
    setEditingId(member.id);
    setFormData(member);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => {
    if (initialSelectedMemberId) {
      const member = members.find(m => m.id === initialSelectedMemberId);
      if (member) {
        setFilter(member.category && categories.includes(member.category) ? member.category : 'All');
        handleEditClick(member);
        setTimeout(() => {
          const el = document.getElementById(`member-${member.id}`);
          if (el) {
             el.scrollIntoView({ behavior: 'smooth', block: 'center' });
             // Add a temporary highlight class
             el.classList.add('ring-2', 'ring-cmd', 'ring-offset-2', 'ring-offset-void');
             setTimeout(() => {
               el.classList.remove('ring-2', 'ring-cmd', 'ring-offset-2', 'ring-offset-void');
             }, 2000);
          }
        }, 300);
      }
    }
  }, [initialSelectedMemberId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;

    if (editingId) {
      updateTeamMember(editingId, formData as Partial<TeamMember>);
    } else {
      const newId = formData.name.toLowerCase().replace(/\s+/g, '_') + '_' + Math.random().toString(36).substring(2, 6);
      const newMember: TeamMember = {
        id: newId,
        name: formData.name,
        role: formData.role,
        avatar: formData.avatar || formData.name.substring(0, 2).toUpperCase(),
        waLink: formData.waLink || 'https://wa.me/something',
        category: formData.category || 'Developer'
      };
      addTeamMember(newMember);
    }
    setShowForm(false);
  };

  // Extract owner/Mahdi to show at top, and others filtered
  const myProfile = members.find(m => m.id === 'mahdi_om');
  const otherMembers = members.filter(m => m.id !== 'mahdi_om');
  
  const filteredMembers = filter === 'All' 
    ? otherMembers 
    : otherMembers.filter(m => m.category === filter);

  // Grouping for hierarchy when 'All' is selected
  const groupedMembers = categories.slice(1).reduce((acc, cat) => {
    acc[cat] = filteredMembers.filter(m => (m.category || 'Developer') === cat);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Manager': return <Shield className="w-3.5 h-3.5" />;
      case 'Operations': return <Briefcase className="w-3.5 h-3.5" />;
      case 'Coordinator': return <FolderKanban className="w-3.5 h-3.5" />;
      default: return <Wrench className="w-3.5 h-3.5" />;
    }
  };

  const renderMemberCard = (member: TeamMember, isOwner = false) => {
    const activeProjects = getProjectsForMember(member.id);
    return (
      <div id={`member-${member.id}`} key={member.id} className={cn(
        "bg-panel2 border rounded-md p-6 hover:border-t-300 transition-colors group relative",
        isOwner ? "border-cmd/50 shadow-[0_0_15px_rgba(26,220,186,0.1)]" : "border-border-100"
      )}>
        <button 
          onClick={() => handleEditClick(member)}
          className="absolute top-4 right-4 text-t-300 hover:text-cmd opacity-0 group-hover:opacity-100 transition-all"
          title="Edit Member"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded flex items-center justify-center text-sm font-bold shadow-inner",
              isOwner ? "bg-cmd text-void" : "bg-panel3 border border-border-200 text-cmd"
            )}>
              {member.avatar}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight pr-6 flex items-center gap-2">
                {member.name}
                {isOwner && <span className="text-[9px] bg-cmd/20 text-cmd px-1.5 py-0.5 rounded uppercase tracking-widest">You</span>}
              </h3>
              <p className="text-[10px] font-mono tracking-widest flex items-center gap-1 mt-1">
                <span className="text-t-200 uppercase">{member.role}</span>
                <span className="text-t-300 mx-1">•</span>
                <span className="text-cmd border border-cmd/30 px-1.5 rounded-sm">{member.category || 'Developer'}</span>
              </p>
            </div>
          </div>
          <a 
            href={member.waLink} 
            target="_blank" 
            rel="noreferrer"
            className="w-8 h-8 rounded bg-[#25D366]/10 text-[#25D366] flex flex-shrink-0 items-center justify-center hover:bg-[#25D366]/20 transition-colors border border-[#25D366]/20 mt-1 mr-8"
            title="WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        </div>

        <div className="space-y-3">
          <div className="text-[9px] font-mono uppercase tracking-widest text-t-300 font-bold border-b border-border-100 pb-2 flex items-center gap-2">
            <FolderKanban className="w-3 h-3" /> Assigned Projects ({activeProjects.length})
          </div>
          {activeProjects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeProjects.map(p => (
                <span key={p.id} className="px-2 py-1 bg-panel border border-border-100 rounded text-[9px] font-mono text-t-100 uppercase tracking-tighter">
                  #{p.num} {p.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-t-300 font-mono italic">No active projects.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xs font-mono uppercase italic tracking-widest text-t-200">// Team Matrix</h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-panel overflow-x-auto rounded border border-border-200 p-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded whitespace-nowrap transition-colors",
                  filter === cat ? "bg-panel3 text-t-100 border border-border-200 shadow-sm" : "text-t-300 hover:text-t-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <button 
            onClick={handleAddClick}
            className="flex flex-shrink-0 items-center gap-2 bg-cmd/10 hover:bg-cmd hover:text-void border border-cmd/50 text-cmd px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Member
          </button>
        </div>
      </div>

      {showForm && (
        <div ref={formRef} className="bg-panel2 border border-cmd/30 rounded-md p-6 animate-in fade-in slide-in-from-top-4 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-t-100 font-bold uppercase tracking-widest text-sm text-cmd">
              {editingId ? 'Edit Team Member' : 'Add New Team Member'}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-t-300 hover:text-t-100 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-t-300 uppercase tracking-widest mb-1">Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-panel border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" 
                  placeholder="e.g. John Doe" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-t-300 uppercase tracking-widest mb-1">Role/Title Description</label>
                <input 
                  type="text" 
                  required 
                  value={formData.role || ''} 
                  onChange={e => setFormData({...formData, role: e.target.value})} 
                  className="w-full bg-panel border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" 
                  placeholder="e.g. Senior Backend Dev" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-t-300 uppercase tracking-widest mb-1">Category (Hierarchy)</label>
                <select
                  value={formData.category || 'Developer'}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-panel border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none appearance-none"
                >
                  {categories.slice(1).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-t-300 uppercase tracking-widest mb-1">Avatar (Initials)</label>
                <input 
                  type="text" 
                  value={formData.avatar || ''} 
                  onChange={e => setFormData({...formData, avatar: e.target.value.substring(0, 2).toUpperCase()})} 
                  className="w-full bg-panel border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" 
                  placeholder="e.g. JD" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono text-t-300 uppercase tracking-widest mb-1">WhatsApp Link</label>
                <input 
                  type="url" 
                  value={formData.waLink || ''} 
                  onChange={e => setFormData({...formData, waLink: e.target.value})} 
                  className="w-full bg-panel border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" 
                  placeholder="e.g. https://wa.me/..." 
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                className="bg-cmd text-void px-6 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
              >
                {editingId ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      {(filter === 'All' || filter === 'Manager') && myProfile && (
        <div className="mb-8">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-t-300 mb-3 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-cmd" /> Executive / Owner
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderMemberCard(myProfile, true)}
          </div>
        </div>
      )}

      {filter === 'All' ? (
        <div className="space-y-8">
          {categories.slice(1).map(category => {
            const catMembers = groupedMembers[category];
            if (!catMembers || catMembers.length === 0) return null;
            return (
              <div key={category}>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-t-300 mb-3 flex items-center gap-2 border-b border-border-100 pb-2">
                  {getCategoryIcon(category)} {category}s
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {catMembers.map(m => renderMemberCard(m))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMembers.map(m => renderMemberCard(m))}
            {filteredMembers.length === 0 && (
              <div className="col-span-full py-12 text-center border border-dashed border-border-200 rounded-md">
                <p className="text-sm font-mono text-t-300">No members found in this category.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
