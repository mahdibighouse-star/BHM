import React, { useState } from 'react';
import { cn } from '../layout/Sidebar';
import { Plus, Edit2, X, MessageSquare, Tag } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  category: string;
}

export function ClientOps() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 'c1', name: 'Jean Dupont', phone: '+33 6 12 34 56 78', category: 'Site Web' },
    { id: 'c2', name: 'Alice Martin', phone: '+33 6 98 76 54 32', category: 'Project Done - Logo' },
    { id: 'c3', name: 'Dev Team ALpha', phone: '+212 6 00 00 00 00', category: 'My Team' }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Contact>>({ name: '', phone: '', category: 'Site Web' });
  const [filter, setFilter] = useState('All');

  const categories = [
    'Site Web', 'Ads', 'Logo', 'SEO', 
    'Project Done - Site', 'Project Done - Logo', 'Subscription Done',
    'My Team', 'Devs Freelance', 'Client Stopped Answering'
  ];

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ name: '', phone: '', category: 'Site Web' });
    setShowForm(true);
  };

  const handleEditClick = (contact: Contact) => {
    setEditingId(contact.id);
    setFormData(contact);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingId) {
      setContacts(contacts.map(c => c.id === editingId ? { ...c, ...formData } as Contact : c));
    } else {
      const newContact: Contact = {
        id: `contact_${Date.now()}`,
        name: formData.name || '',
        phone: formData.phone || '',
        category: formData.category || 'Site Web'
      };
      setContacts([...contacts, newContact]);
    }
    setShowForm(false);
  };

  const filteredContacts = filter === 'All' ? contacts : contacts.filter(c => c.category === filter);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xs font-mono uppercase italic tracking-widest text-t-200 mb-2">// Client Operations</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* WA Labels */}
        <div className="bg-panel2 border border-border-100 rounded-md p-6 relative">
          <h2 className="text-[9px] font-mono uppercase tracking-widest text-t-300 font-bold border-b border-border-100 pb-3 mb-4 flex items-center justify-between">
            <span>WhatsApp Label System</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-[9px] font-mono uppercase text-t-300 mb-2 border-b border-border-100 pb-1 flex items-center justify-between">
                Active Projects 
              </h3>
              <div className="flex gap-2 flex-wrap text-[9px] font-mono uppercase tracking-widest font-bold">
                <span className="cursor-pointer px-2 py-1 bg-[#29b8f5]/10 text-[#29b8f5] hover:bg-[#29b8f5]/20 border border-[#29b8f5]/20 rounded transition-colors" onClick={() => setFilter(filter === 'Site Web' ? 'All' : 'Site Web')}>Site Web</span>
                <span className="cursor-pointer px-2 py-1 bg-[#29b8f5]/10 text-[#29b8f5] hover:bg-[#29b8f5]/20 border border-[#29b8f5]/20 rounded transition-colors" onClick={() => setFilter(filter === 'Ads' ? 'All' : 'Ads')}>Ads</span>
                <span className="cursor-pointer px-2 py-1 bg-[#29b8f5]/10 text-[#29b8f5] hover:bg-[#29b8f5]/20 border border-[#29b8f5]/20 rounded transition-colors" onClick={() => setFilter(filter === 'Logo' ? 'All' : 'Logo')}>Logo</span>
                <span className="cursor-pointer px-2 py-1 bg-[#29b8f5]/10 text-[#29b8f5] hover:bg-[#29b8f5]/20 border border-[#29b8f5]/20 rounded transition-colors" onClick={() => setFilter(filter === 'SEO' ? 'All' : 'SEO')}>SEO</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-[9px] font-mono uppercase text-t-300 mb-2 border-b border-border-100 pb-1">Closed</h3>
              <div className="flex gap-2 flex-wrap text-[9px] font-mono uppercase tracking-widest font-bold">
                <span className="cursor-pointer px-2 py-1 bg-border-100 text-t-200 border border-border-200 hover:text-t-100 rounded transition-colors" onClick={() => setFilter(filter === 'Project Done - Site' ? 'All' : 'Project Done - Site')}>Project Done - Site</span>
                <span className="cursor-pointer px-2 py-1 bg-border-100 text-t-200 border border-border-200 hover:text-t-100 rounded transition-colors" onClick={() => setFilter(filter === 'Project Done - Logo' ? 'All' : 'Project Done - Logo')}>Project Done - Logo</span>
                <span className="cursor-pointer px-2 py-1 bg-border-100 text-t-200 border border-border-200 hover:text-t-100 rounded transition-colors" onClick={() => setFilter(filter === 'Subscription Done' ? 'All' : 'Subscription Done')}>Subscription Done</span>
              </div>
            </div>

            <div>
              <h3 className="text-[9px] font-mono uppercase text-t-300 mb-2 border-b border-border-100 pb-1">Team & Special</h3>
              <div className="flex gap-2 flex-wrap text-[9px] font-mono uppercase tracking-widest font-bold">
                <span className="cursor-pointer px-2 py-1 bg-status-ok/10 text-status-ok border border-status-ok/20 hover:bg-status-ok/20 rounded transition-colors" onClick={() => setFilter(filter === 'My Team' ? 'All' : 'My Team')}>My Team</span>
                <span className="cursor-pointer px-2 py-1 bg-status-ok/10 text-status-ok border border-status-ok/20 hover:bg-status-ok/20 rounded transition-colors" onClick={() => setFilter(filter === 'Devs Freelance' ? 'All' : 'Devs Freelance')}>Devs Freelance</span>
                <span className="cursor-pointer px-2 py-1 bg-status-err/10 text-status-err border border-status-err/20 hover:bg-status-err/20 rounded transition-colors" onClick={() => setFilter(filter === 'Client Stopped Answering' ? 'All' : 'Client Stopped Answering')}>Client Stopped Answering</span>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Tiers */}
        <div className="bg-panel2 border border-border-100 rounded-md p-6">
          <h2 className="text-[9px] font-mono uppercase tracking-widest text-t-300 font-bold border-b border-border-100 pb-3 mb-4">Maintenance Tiers</h2>
          <div className="space-y-3">
            <div className="bg-panel rounded border border-border-100 p-4 hover:border-cmd/30 transition-colors cursor-default">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-sm">Essentiel</h3>
                <span className="font-mono font-bold text-cmd">€79 / mo</span>
              </div>
              <p className="text-xs text-t-200 font-mono">WP + plugin updates · security scan · weekly backup · 30min/month changes</p>
              <div className="mt-3"><span className="px-2 py-1 bg-status-ok/10 text-status-ok border border-status-ok/20 rounded text-[9px] font-mono font-bold uppercase tracking-wider">First month FREE</span></div>
            </div>
            
            <div className="bg-panel rounded border border-border-100 p-4 hover:border-cmd/30 transition-colors cursor-default">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-sm">Confort</h3>
                <span className="font-mono font-bold text-cmd">€129 / mo</span>
              </div>
              <p className="text-xs text-t-200 font-mono">Essentiel + performance + 1h/month changes + priority support</p>
            </div>
            
            <div className="bg-panel rounded border border-border-100 p-4 hover:border-cmd/30 transition-colors cursor-default">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-sm">Sérénité</h3>
                <span className="font-mono font-bold text-cmd">€199 / mo</span>
              </div>
              <p className="text-xs text-t-200 font-mono">Confort + staging + 3h/month changes + custom dev support</p>
            </div>
          </div>
        </div>

      </div>

      {/* Contact Manager */}
      <div className="bg-panel2 border border-border-100 rounded-md p-6">
        <div className="flex items-center justify-between border-b border-border-100 pb-3 mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-t-300 font-bold flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" /> Contacts Directory
            </h2>
            {filter !== 'All' && (
              <span className="text-[9px] bg-panel3 px-2 py-1 rounded text-cmd uppercase font-mono tracking-widest border border-cmd/20 flex items-center gap-2">
                Filter: {filter}
                <button onClick={() => setFilter('All')} className="hover:text-t-100 text-t-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-cmd/10 hover:bg-cmd hover:text-void border border-cmd/50 text-cmd px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Contact
          </button>
        </div>

        {showForm && (
          <div className="mb-6 bg-panel border border-cmd/30 rounded p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-4 border-b border-border-200 pb-2">
              <h3 className="text-t-100 font-bold uppercase tracking-widest text-[10px] text-cmd">
                {editingId ? 'Edit Contact' : 'Add New Contact'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-t-300 hover:text-t-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-mono text-t-300 uppercase tracking-widest mb-1">Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name || ''} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-1.5 text-xs focus:border-cmd outline-none" 
                    placeholder="e.g. Jean Dupont" 
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-t-300 uppercase tracking-widest mb-1">WhatsApp Phone</label>
                  <input 
                    type="text" 
                    value={formData.phone || ''} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-1.5 text-xs focus:border-cmd outline-none" 
                    placeholder="e.g. +33 6... " 
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-t-300 uppercase tracking-widest mb-1">Category (Label)</label>
                  <select
                    value={formData.category || 'Site Web'}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-panel3 border border-border-200 text-t-100 rounded px-3 py-1.5 text-xs focus:border-cmd outline-none appearance-none"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  className="bg-cmd text-void px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors"
                >
                  {editingId ? 'Save Options' : 'Add Contact'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredContacts.map(contact => (
            <div key={contact.id} className="bg-panel border border-border-100 rounded p-3 hover:border-cmd/30 transition-colors group relative flex flex-col">
              <button 
                onClick={() => handleEditClick(contact)}
                className="absolute top-3 right-3 text-t-300 hover:text-cmd opacity-0 group-hover:opacity-100 transition-all z-10 bg-panel border border-border-200 rounded-sm p-1"
                title="Edit Contact"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-sm text-t-100 pr-6 truncate">{contact.name}</h3>
              </div>
              
              <div className="flex items-center gap-1.5 text-xs text-t-200 mb-3 font-mono cursor-pointer hover:text-t-100 transition-colors">
                <MessageSquare className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{contact.phone || 'No phone added'}</span>
              </div>
              
              <div className="mt-auto pt-2 border-t border-border-100/50">
                <div className="inline-block px-2 py-0.5 bg-panel3 border border-border-200 rounded text-[9px] font-mono text-t-100 uppercase tracking-wider">
                  {contact.category}
                </div>
              </div>
            </div>
          ))}
          {filteredContacts.length === 0 && (
            <div className="col-span-full py-8 text-center text-t-300 font-mono text-[10px] uppercase tracking-widest bg-panel border-dashed border border-border-200 border-opacity-50 rounded">
              No contacts found
            </div>
          )}
        </div>
      </div>

      {/* Call Debrief */}
      <div className="bg-panel2 border border-border-100 rounded-md p-6">
        <h2 className="text-[9px] font-mono uppercase tracking-widest text-t-300 font-bold border-b border-border-100 pb-3 mb-4">Call Debrief Template</h2>
        <p className="text-xs text-t-200 mb-4 font-mono">Must be filled after every client call.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            '1. Client name + company',
            '2. Date + time of call',
            '3. Service requested',
            '4. Key requirements',
            '5. Budget discussed',
            '6. Timeline expectation',
            '7. Agreed next step',
            '8. Red flags / concerns',
          ].map(item => (
            <div key={item} className="bg-panel border border-border-100 rounded p-3 text-[10px] font-mono text-t-100 flex items-center shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
