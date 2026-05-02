import React, { useState } from 'react';
import { Note } from '../../data';
import { useData } from '../../contexts/DataContext';
import { FileText, Folder, MessageSquare, Plus, ArrowLeft, RefreshCw, Copy, Check, Sparkles, Bot, Download, Globe, UploadCloud, Loader2, Trash2 } from 'lucide-react';
import { cn } from '../layout/Sidebar';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

interface Props {
  projectId: string;
  onBack: () => void;
  onNavigateTeam?: (memberId: string) => void;
}

export function ProjectDetail({ projectId, onBack, onNavigateTeam }: Props) {
  const { projects: PROJECTS, updateProject, deleteProject, team: TEAM } = useData();
  const project = PROJECTS.find(p => p.id === projectId);
  
  if (!project) return null;

  const handleDeleteProject = () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      deleteProject(project.id);
      onBack();
    }
  };

  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [overviewData, setOverviewData] = useState({
    status: project.status,
    statusDetail: project.statusDetail,
    nextAction: project.nextAction,
    reason: project.reason || '',
    recommendedSolution: project.recommendedSolution || ''
  });

  const handleSaveOverview = () => {
    updateProject(project.id, overviewData);
    setIsEditingOverview(false);
  };

  const [notes, setNotes] = useState<Note[]>(project.notes);
  const [newNote, setNewNote] = useState('');

  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [teamData, setTeamData] = useState<{devIds: string[], omId?: string, salesId?: string}>({
    devIds: project.devIds || [],
    omId: project.omId,
    salesId: project.salesId
  });

  const handleSaveTeam = () => {
    updateProject(project.id, teamData);
    setIsEditingTeam(false);
  };

  // Risk Assessment State
  const [riskData, setRiskData] = useState({
    probability: 'Low',
    impact: 'Minor',
    potentialRisks: '',
    technicalConsiderations: '',
    mitigationStrategy: ''
  });
  const [isRiskSaved, setIsRiskSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingRisk, setIsGeneratingRisk] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<{manager: string, aiAgent: string} | null>(null);
  const [developerTasks, setDeveloperTasks] = useState<{task: string, assigneeId: string, reasoning: string, assigned?: boolean}[] | null>(null);
  const [, forceRender] = useState(0);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState('Project Document');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(0);

    const fileRef = ref(storage, `projects/${project.id}/${Date.now()}_${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(fileRef, selectedFile);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const newDoc = {
          id: `doc_${Date.now()}`,
          title: selectedFile.name,
          url: downloadURL,
          type: fileType
        };
        updateProject(project.id, {
          docs: [...project.docs, newDoc]
        });
        setSelectedFile(null);
        setFileType('Project Document');
        setIsUploading(false);
        setUploadProgress(0);
      }
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([
      ...notes, 
      { id: Date.now().toString(), authorId: 'mahdi_om', content: newNote, timestamp: new Date().toISOString() }
    ]);
    setNewNote('');
  };

  const handleAssignTask = (taskIndex: number, assigneeId: string) => {
    if (!project) return;
    if (TEAM[assigneeId] && !project.devIds.includes(assigneeId)) {
      updateProject(project.id, { devIds: [...project.devIds, assigneeId] });
    }
    
    setDeveloperTasks(prev => {
      if (!prev) return prev;
      const newTasks = [...prev];
      newTasks[taskIndex] = { ...newTasks[taskIndex], assigned: true };
      return newTasks;
    });
    
    forceRender(prev => prev + 1);
  };

  const handleCopy = () => {
    const textToCopy = `Project: ${project.name}\nStatus: ${project.statusDetail}\nNext Action: ${project.nextAction}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const generateRiskAssessment = async () => {
    setIsGeneratingRisk(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Analyze this project and generate a risk assessment. 
Project Name: ${project.name}
Status: ${project.statusDetail}
Objective: ${project.clientInfo?.objective || ''}
Reason: ${project.reason || ''}

Return ONLY a valid JSON object with the following keys and string values:
{
  "probability": "Low", "Medium", or "High",
  "impact": "Minor", "Moderate", or "Severe",
  "potentialRisks": "...",
  "technicalConsiderations": "...",
  "mitigationStrategy": "..."
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || '{}';
      const data = JSON.parse(text);
      setRiskData({
        probability: data.probability || 'Medium',
        impact: data.impact || 'Moderate',
        potentialRisks: data.potentialRisks || '',
        technicalConsiderations: data.technicalConsiderations || '',
        mitigationStrategy: data.mitigationStrategy || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingRisk(false);
    }
  };

  const generateSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Based on this project, suggest next actions for the Manager, the Developers, and AI Agents in the command center.
Project Name: ${project.name}
Status: ${project.statusDetail}
Next Action: ${project.nextAction}
Objective: ${project.clientInfo?.objective || ''}

Available Team Members to assign tasks to:
${Object.values(TEAM).map(t => `- ID: ${t.id}, Name: ${t.name}, Role: ${t.role}`).join('\n')}

Return ONLY a valid JSON object with the following keys and values:
{
  "manager": "actions for the manager (markdown string)...",
  "developer": [
    {
      "task": "description of the task (markdown string)",
      "assigneeId": "id of the specific team member from the list above",
      "reasoning": "why did you choose this assignee?"
    }
  ],
  "aiAgent": "actions for the ai agents (markdown string)..."
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || '{}';
      const data = JSON.parse(text);
      setSuggestions({
        manager: data.manager || 'No suggestions available at this time.',
        aiAgent: data.aiAgent || 'No suggestions available at this time.'
      });
      setDeveloperTasks(data.developer || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-t-200 hover:text-t-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>
        
        <button
          onClick={handleDeleteProject}
          className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-widest text-status-warn hover:opacity-80 transition-opacity"
        >
          <Trash2 className="w-4 h-4" /> Delete Project
        </button>
      </div>

      <div className="bg-panel2 border border-border-100 rounded-md p-6 flex flex-col md:flex-row justify-between gap-6 items-start">
        <div className="space-y-4 max-w-xl w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-cmd font-bold">
                #{project.num}
              </span>
              <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
            </div>
            <button
              onClick={() => setIsEditingOverview(!isEditingOverview)}
              className="px-3 py-1.5 bg-panel3 hover:bg-cmd/10 hover:text-cmd border border-border-100 rounded text-xs font-mono uppercase tracking-wider text-t-200 transition-colors"
            >
              {isEditingOverview ? 'Cancel' : 'Edit Overview'}
            </button>
          </div>

          {isEditingOverview ? (
            <div className="space-y-3 bg-panel p-4 rounded border border-border-100">
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-[10px] font-mono uppercase text-t-300 mb-1">Status</label>
                  <select
                    value={overviewData.status}
                    onChange={(e) => setOverviewData({ ...overviewData, status: e.target.value as any })}
                    className="w-full bg-panel3 border border-border-100 rounded px-3 py-2 text-xs focus:outline-none focus:border-cmd text-t-100 appearance-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Waiting Client">Waiting Client</option>
                    <option value="To Close">To Close</option>
                    <option value="Ghost">Ghost</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <label className="block text-[10px] font-mono uppercase text-t-300 mb-1">Status Detail</label>
                  <input
                    type="text"
                    value={overviewData.statusDetail}
                    onChange={(e) => setOverviewData({ ...overviewData, statusDetail: e.target.value })}
                    className="w-full bg-panel3 border border-border-100 rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-cmd text-t-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-t-300 mb-1">Next Action</label>
                <input
                  type="text"
                  value={overviewData.nextAction}
                  onChange={(e) => setOverviewData({ ...overviewData, nextAction: e.target.value })}
                  className="w-full bg-panel3 border border-border-100 rounded px-3 py-2 text-xs focus:outline-none focus:border-cmd text-t-100"
                />
              </div>
              <div className="flex gap-4">
                 <div className="flex-1">
                  <label className="block text-[10px] font-mono uppercase text-t-300 mb-1">Blocker Reason (Optional)</label>
                  <input
                    type="text"
                    value={overviewData.reason}
                    onChange={(e) => setOverviewData({ ...overviewData, reason: e.target.value })}
                    className="w-full bg-panel3 border border-border-100 rounded px-3 py-2 text-xs focus:outline-none focus:border-cmd text-t-100"
                  />
                </div>
                 <div className="flex-1">
                  <label className="block text-[10px] font-mono uppercase text-t-300 mb-1">Recommended Solution (Optional)</label>
                  <input
                    type="text"
                    value={overviewData.recommendedSolution}
                    onChange={(e) => setOverviewData({ ...overviewData, recommendedSolution: e.target.value })}
                    className="w-full bg-panel3 border border-border-100 rounded px-3 py-2 text-xs focus:outline-none focus:border-cmd text-t-100"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveOverview}
                  className="px-4 py-2 bg-cmd text-void font-bold rounded text-xs font-mono hover:bg-cmd/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm space-y-1">
              <p className="text-t-200"><strong className="text-t-100">Status:</strong> <span className="font-mono text-cmd uppercase text-[10px] tracking-widest">{project.status}</span> - {project.statusDetail}</p>
              <p className="text-t-200"><strong className="text-t-100">Next Action:</strong> {project.nextAction}</p>
              {project.reason && <p className="text-status-warn"><strong className="text-t-100">Blocker Reason:</strong> {project.reason}</p>}
              {project.recommendedSolution && <p className="text-status-ok"><strong className="text-t-100">Recommended Solution:</strong> {project.recommendedSolution}</p>}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 min-w-[200px]">
          <button
             onClick={handleCopy}
             className="w-full flex items-center justify-center gap-2 bg-panel3 border border-border-100 py-2.5 px-4 rounded-lg text-xs font-mono uppercase tracking-wider font-bold hover:bg-border-100 transition-colors text-t-100 hover:text-t-100"
          >
            {isCopied ? <Check className="w-4 h-4 text-status-ok" /> : <Copy className="w-4 h-4" />}
            {isCopied ? 'Copied to Clipboard' : 'Copy Info'}
          </button>

          <a href={`https://wa.me/1234567890?text=Regarding ${project.name}`} target="_blank" rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 py-2.5 px-4 rounded-lg text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#25D366]/20 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            {project.waGroup}
          </a>
          
          {project.invoiceLink && (
            <a href={project.invoiceLink} download target="_blank" rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-cmd/10 text-cmd border border-cmd/30 py-2.5 px-4 rounded-lg text-xs font-mono uppercase tracking-wider font-bold hover:bg-cmd hover:text-void transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </a>
          )}
          
          {project.websiteLink && (
            <a href={project.websiteLink} target="_blank" rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-t-100/10 text-t-100 border border-t-100/30 py-2.5 px-4 rounded-lg text-xs font-mono uppercase tracking-wider font-bold hover:bg-t-100 hover:text-void transition-colors"
            >
              <Globe className="w-4 h-4" />
              Visit Website
            </a>
          )}
          
          <div className="bg-panel border border-border-100 rounded p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border-100 pb-2">
              <h3 className="text-[9px] font-mono uppercase tracking-widest text-t-300 font-bold">Assigned Team</h3>
              <button
                onClick={() => setIsEditingTeam(!isEditingTeam)}
                className="text-[9px] font-mono uppercase tracking-widest text-cmd hover:text-cmd/80 transition-colors"
              >
                {isEditingTeam ? 'Cancel' : 'Edit Team'}
              </button>
            </div>
            
            {isEditingTeam ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-t-300 mb-2">Sales Rep</label>
                  <select
                    value={teamData.salesId || ''}
                    onChange={(e) => setTeamData({ ...teamData, salesId: e.target.value || undefined })}
                    className="w-full bg-panel3 border border-border-100 rounded px-3 py-2 text-xs focus:outline-none focus:border-cmd text-t-100 appearance-none"
                  >
                    <option value="">Unassigned</option>
                    {Object.values(TEAM).filter(m => m.category === 'Sales').map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-t-300 mb-2">Operations Manager</label>
                  <select
                    value={teamData.omId || ''}
                    onChange={(e) => setTeamData({ ...teamData, omId: e.target.value || undefined })}
                    className="w-full bg-panel3 border border-border-100 rounded px-3 py-2 text-xs focus:outline-none focus:border-cmd text-t-100 appearance-none"
                  >
                    <option value="">Unassigned</option>
                    {Object.values(TEAM).filter(m => m.category === 'Manager').map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-t-300 mb-2">Developers</label>
                  <div className="flex flex-col gap-2">
                    {Object.values(TEAM).filter(m => m.category === 'Developer').map(m => (
                      <label key={m.id} className="flex items-center gap-2 text-xs text-t-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={teamData.devIds.includes(m.id)}
                          onChange={(e) => {
                            if (e.target.checked) setTeamData({ ...teamData, devIds: [...teamData.devIds, m.id] });
                            else setTeamData({ ...teamData, devIds: teamData.devIds.filter(id => id !== m.id) });
                          }}
                          className="rounded border-border-100 bg-panel3 text-cmd"
                        />
                        {m.name}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveTeam}
                    className="px-4 py-1.5 bg-cmd text-void font-bold rounded text-xs font-mono hover:bg-cmd/90 transition-colors"
                  >
                    Save Team
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {[...(project.omId ? [project.omId] : []), ...(project.salesId ? [project.salesId] : []), ...project.devIds].map((dId, index) => {
                  const member = TEAM[dId];
                  if (!member) return null;
                  return (
                    <button 
                      key={`${dId}-${index}`} 
                      onClick={() => onNavigateTeam?.(dId)}
                      className="flex items-center gap-2 bg-panel3 border border-border-100 px-2 py-1.5 rounded text-xs hover:border-cmd hover:bg-cmd/10 transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-status-info flex items-center justify-center text-[8px] font-bold text-t-100">
                        {member.avatar}
                      </div>
                      {member.name} 
                      <span className="text-[9px] text-t-300 ml-1 font-mono">({member.category === 'Manager' ? 'OM' : member.category === 'Sales' ? 'Sales' : 'Dev'})</span>
                    </button>
                  );
                })}
                {project.devIds.length === 0 && !project.omId && !project.salesId && <span className="text-xs text-t-300 font-mono">Unassigned</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-panel2 border border-border-100 rounded-md p-6">
        <div className="flex justify-between items-center mb-4 border-b border-border-100 pb-3">
          <h3 className="text-[9px] font-mono uppercase tracking-widest text-t-300 font-bold flex items-center gap-2">
            <Bot className="w-3 h-3 text-cmd" />
            AI Recommended Actions
          </h3>
          <button
            onClick={generateSuggestions}
            disabled={isGeneratingSuggestions}
            className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest bg-cmd/10 text-cmd hover:bg-cmd/20 px-2 py-1 rounded transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3 h-3" />
            {isGeneratingSuggestions ? 'Analyzing...' : 'Generate Actions'}
          </button>
        </div>
        
        {suggestions ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-panel border border-border-100 rounded p-4 space-y-2">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-status-warn">Manager Actions</h4>
              <div className="text-xs text-t-200 prose prose-invert prose-p:leading-snug prose-sm max-w-none">
                <Markdown>{suggestions.manager}</Markdown>
              </div>
            </div>
            <div className="bg-panel border border-border-100 rounded p-4 space-y-2">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-status-info">Developer Actions</h4>
              <div className="space-y-3">
                {developerTasks && developerTasks.length > 0 ? developerTasks.map((t, idx) => (
                  <div key={idx} className="bg-panel3 border border-border-100 rounded p-3 text-xs">
                    <div className="text-t-200 prose prose-invert prose-p:leading-snug prose-sm max-w-none">
                      <Markdown>{t.task}</Markdown>
                    </div>
                    <div className="mt-2 text-[10px] italic text-t-300">
                      Reasoning: {t.reasoning}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-100">
                      <span className="text-[10px] font-mono text-t-300">Assign to: <strong className="text-cmd">{TEAM[t.assigneeId]?.name || t.assigneeId}</strong></span>
                      <button 
                        onClick={() => handleAssignTask(idx, t.assigneeId)}
                        disabled={t.assigned}
                        className={cn(
                          "px-2 py-1 rounded text-[9px] font-mono uppercase tracking-widest transition-colors",
                          t.assigned 
                            ? "bg-status-ok/10 text-status-ok" 
                            : "bg-cmd text-t-100 hover:bg-cmd/80"
                        )}
                      >
                        {t.assigned ? 'Assigned' : 'Confirm Assignment'}
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-xs text-t-200">No developer tasks suggested.</div>
                )}
              </div>
            </div>
            <div className="bg-panel border border-border-100 rounded p-4 space-y-2">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-cmd">AI Agent Tasks</h4>
              <div className="text-xs text-t-200 prose prose-invert prose-p:leading-snug prose-sm max-w-none">
                <Markdown>{suggestions.aiAgent}</Markdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-t-300">
            <p className="text-xs italic">Click generate to receive context-aware action plans for the team.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-panel2 border border-border-100 rounded-md p-6">
            <h3 className="text-[9px] font-mono uppercase tracking-widest text-t-300 font-bold border-b border-border-100 pb-3 mb-4">Internal Notes</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {notes.length === 0 ? (
                <p className="text-xs text-t-300 font-mono italic">No notes yet.</p>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="bg-panel border border-border-100 p-3 rounded text-sm">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-[10px] text-cmd uppercase">{TEAM[note.authorId]?.name || 'Unknown'}</span>
                      <span className="text-[9px] font-mono text-t-300">{new Date(note.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-t-200 text-xs">{note.content}</p>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleAddNote} className="mt-4 flex gap-2">
              <input 
                type="text" 
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Add a new note..."
                className="flex-1 bg-panel border border-border-100 rounded px-3 py-2 text-xs text-t-100 placeholder:text-t-300 focus:border-cmd focus:outline-none italic"
              />
              <button type="submit" className="bg-cmd hover:bg-cmd/80 text-t-100 px-3 py-2 rounded flex items-center justify-center transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="bg-panel2 border border-border-100 rounded-md p-6">
            <div className="flex justify-between items-center border-b border-border-100 pb-3 mb-4">
              <h3 className="text-[9px] font-mono uppercase tracking-widest text-t-300 font-bold flex items-center gap-2">
                Risk Assessment & Planning
                <span className="text-[8px] bg-status-err/10 text-status-err px-2 py-0.5 rounded">CRITICAL</span>
              </h3>
              <button
                onClick={generateRiskAssessment}
                disabled={isGeneratingRisk}
                className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest bg-status-warn/10 text-status-warn hover:bg-status-warn/20 px-2 py-1 rounded transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" />
                {isGeneratingRisk ? 'Analyzing...' : 'Auto-fill AI'}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-t-300">Probability</label>
                  <select 
                    value={riskData.probability}
                    onChange={e => setRiskData({...riskData, probability: e.target.value})}
                    className="w-full bg-panel border border-border-100 rounded px-3 py-2 text-xs text-t-100 focus:outline-none focus:border-cmd"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-t-300">Impact</label>
                  <select 
                    value={riskData.impact}
                    onChange={e => setRiskData({...riskData, impact: e.target.value})}
                    className="w-full bg-panel border border-border-100 rounded px-3 py-2 text-xs text-t-100 focus:outline-none focus:border-cmd"
                  >
                    <option>Minor</option>
                    <option>Moderate</option>
                    <option>Severe</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-t-300">Potential Risks & Delay Factors</label>
                <textarea 
                  value={riskData.potentialRisks}
                  onChange={e => setRiskData({...riskData, potentialRisks: e.target.value})}
                  placeholder="Identify risks, blockers, and what might delay the timeline..."
                  className="w-full bg-panel border border-border-100 rounded px-3 py-2 text-xs text-t-100 placeholder:text-t-300 focus:outline-none focus:border-cmd h-20 resize-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-t-300">Technical Considerations & Errors to Avoid</label>
                <textarea 
                  value={riskData.technicalConsiderations}
                  onChange={e => setRiskData({...riskData, technicalConsiderations: e.target.value})}
                  placeholder="E.g., Cautious about third-party API limits, specific architectural debt..."
                  className="w-full bg-panel border border-border-100 rounded px-3 py-2 text-xs text-t-100 placeholder:text-t-300 focus:outline-none focus:border-cmd h-20 resize-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-t-300">Mitigation Strategy</label>
                <textarea 
                  value={riskData.mitigationStrategy}
                  onChange={e => setRiskData({...riskData, mitigationStrategy: e.target.value})}
                  placeholder="How will we prevent or handle these risks if they occur?"
                  className="w-full bg-panel border border-border-100 rounded px-3 py-2 text-xs text-t-100 placeholder:text-t-300 focus:outline-none focus:border-cmd h-20 resize-none font-mono"
                />
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setIsRiskSaved(true)}
                  className="w-full bg-border-100 hover:bg-border-200 text-t-100 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors font-mono flex justify-center items-center gap-2"
                >
                  {isRiskSaved ? <><RefreshCw className="w-3 h-3" /> Update Risk Log</> : "Save Risk Log"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-panel2 border border-border-100 rounded-md p-6">
            <h3 className="text-[9px] font-mono uppercase tracking-widest text-t-300 font-bold border-b border-border-100 pb-3 mb-4">Project Files</h3>
            <div className="space-y-2 mb-4">
              {project.docs.length === 0 ? (
                <p className="text-xs text-t-300 font-mono italic">No documents attached.</p>
              ) : (
                project.docs.map(doc => (
                  <a key={doc.id} href={doc.url} className="flex items-center gap-3 p-2 hover:bg-panel3 rounded group transition-colors border border-transparent hover:border-border-100">
                    {doc.type === 'folder' ? <Folder className="w-4 h-4 text-t-300 group-hover:text-cmd flex-shrink-0" /> : <FileText className="w-4 h-4 text-t-300 group-hover:text-cmd flex-shrink-0" />}
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-t-200 group-hover:text-t-100 transition-colors">{doc.title}</span>
                      {doc.type !== 'folder' && doc.type !== 'file' && <span className="text-[10px] font-mono text-t-300 uppercase tracking-widest">{doc.type}</span>}
                    </div>
                  </a>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-border-100">
              <div className="flex flex-col gap-2">
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="text-xs text-t-300 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-panel3 file:text-t-100 hover:file:bg-panel focus:outline-none"
                />
                {selectedFile && (
                  <div className="flex flex-col md:flex-row gap-2 mt-2">
                    <select
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                      className="flex-1 bg-panel3 border border-border-100 rounded px-3 py-1.5 text-xs text-t-100 focus:outline-none focus:border-cmd appearance-none"
                    >
                      <option value="Project Document">Project Document</option>
                      <option value="Invoice">Invoice</option>
                      <option value="Brief">Brief</option>
                      <option value="Media File">Media File</option>
                    </select>
                    <button
                      onClick={handleUploadFile}
                      disabled={isUploading}
                      className="bg-cmd hover:bg-cmd/80 text-void font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <><Loader2 className="w-3 h-3 animate-spin"/> {Math.round(uploadProgress)}%</>
                      ) : (
                        <><UploadCloud className="w-3 h-3" /> Upload</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-panel2 border border-border-100 rounded-md p-6">
            <h3 className="text-[9px] font-mono uppercase tracking-widest text-t-300 font-bold border-b border-border-100 pb-3 mb-4">Client Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-[9px] font-mono uppercase tracking-widest text-t-300 mb-0.5">Contact</div>
                <div className="font-bold text-xs">{project.clientInfo.name}</div>
              </div>
              <div>
                <div className="text-[9px] font-mono uppercase tracking-widest text-t-300 mb-0.5">Objective</div>
                <div className="text-t-200 text-xs leading-relaxed italic">{project.clientInfo.objective}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
