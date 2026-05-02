import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, LayoutTemplate, PenTool, Globe, ChevronDown, Plus, Briefcase, Wrench, GraduationCap, FolderSearch, CheckSquare, Square, X } from 'lucide-react';
import { cn } from '../layout/Sidebar';
import { useData } from '../../contexts/DataContext';

export function RecruitmentHR() {
  const { projects: PROJECTS } = useData();
  const [activeTab, setActiveTab] = useState('freelancer_pricing');
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [currency, setCurrency] = useState<'DH' | 'EUR'>('DH');

  const [jobs, setJobs] = useState([
    {
      id: "j1",
      title: "Senior React Developer",
      description: "Looking for an experienced React developer to structure complex dashboards and handle specialized UI states.",
      tasks: "1. Architect frontend structure\n2. Integrate with AI agents\n3. Implement Tailwind designs",
      mastery: "Senior/Expert",
      tools: "React, TypeScript, Framer Motion, Tailwind CSS",
      projectIds: ["p01"]
    },
    {
      id: "j2",
      title: "SEO Writer & Strategist",
      description: "We need someone capable of auditing content, finding gaps, and writing pillar content to rank highly.",
      tasks: "1. Perform content audits\n2. Draft pillar content pages\n3. Optimize internal linking",
      mastery: "Mid-level",
      tools: "SEMrush, Ahrefs, WordPress, SurferSEO",
      projectIds: []
    }
  ]);
  
  const [projectSelectJobId, setProjectSelectJobId] = useState<string | null>(null);
  const [showNewJobForm, setShowNewJobForm] = useState(false);
  const [newJobForm, setNewJobForm] = useState({
    title: "",
    description: "",
    tasks: "",
    mastery: "Mid-level",
    tools: ""
  });

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobForm.title) return;
    
    setJobs([
      {
        id: `j${Date.now()}`,
        title: newJobForm.title,
        description: newJobForm.description,
        tasks: newJobForm.tasks,
        mastery: newJobForm.mastery,
        tools: newJobForm.tools,
        projectIds: []
      },
      ...jobs
    ]);
    
    setNewJobForm({
      title: "",
      description: "",
      tasks: "",
      mastery: "Mid-level",
      tools: ""
    });
    setShowNewJobForm(false);
  };

  const toggleProjectForJob = (jobId: string, projectId: string) => {
    setJobs(jobs.map(j => {
      if (j.id === jobId) {
        const isSelected = j.projectIds.includes(projectId);
        return {
          ...j,
          projectIds: isSelected 
            ? j.projectIds.filter(id => id !== projectId)
            : [...j.projectIds, projectId]
        };
      }
      return j;
    }));
  };

  const tabs = [
    { id: 'candidates', label: 'Candidates' },
    { id: 'job_listings', label: 'Job Listings' },
    { id: 'freelancer_pricing', label: 'Freelancer Pricing' },
  ];

  const content = {
    en: {
      title: 'Website Creation Rates',
      subtitle: 'Volume and ongoing collaboration, on WordPress.',
      intro1: 'Thank you for reaching out! We are actively looking for freelance website creators to collaborate on a series of exciting projects.',
      intro2: 'We have a high volume of work to offer with regular projects, and we would love to have you on board as a collaborator.',
      whatWeProvide: "CE QU'ON FOURNIT",
      copywriting: 'Copywriting',
      copywritingDesc: 'All website copy written by our team',
      templates: 'Templates',
      templatesDesc: 'Reference templates provided from the start',
      yourRole: 'Your role',
      yourRoleDesc: 'You build the WordPress website',
      websiteCreation: 'WEBSITE CREATION',
      onePage: 'ONE PAGE',
      pages3to5: '3-4-5 PAGES',
      customTab: 'CUSTOM',
      customTitle: 'Custom',
      pricingOnRequest: 'pricing on request',
      onePageFeature1: 'One Page Website',
      pagesFeature1: '3 to 5 Page Website',
      customFeature1: 'Fully Custom Website',
      copyFeature: 'Copywriting provided by our team',
      templateFeature: 'Reference template provided',
      buildFeature: 'You build the WordPress website',
      priceDefinedFeature: 'Price defined after full brief',
      perWebsite: 'per website',
      outro1: 'We also provide the copywriting and templates so that you can focus entirely on building the website.',
      outro2: 'If this sounds like a good fit, feel free to reach out!',
      outro3: 'Looking forward to working together,\nBest regards,',
    },
    fr: {
      title: 'Tarifs Création de Sites',
      subtitle: 'Volume et collaboration régulière, sur WordPress.',
      intro1: 'Merci de nous avoir contactés ! Nous sommes ravis de vous informer que nous recherchons activement des créateurs de sites WordPress freelances pour collaborer sur une série de projets WordPress passionnants.',
      intro2: 'Nous avons un volume de travail important à offrir, avec des projets réguliers, et nous serions heureux de vous compter parmi nos collaborateurs.',
      whatWeProvide: "CE QU'ON FOURNIT",
      copywriting: 'Copywriting',
      copywritingDesc: 'Tous les textes rédigés par nos soins',
      templates: 'Templates',
      templatesDesc: 'Maquettes & templates fournis dès le départ',
      yourRole: 'Votre rôle',
      yourRoleDesc: 'Vous vous concentrez sur la création',
      websiteCreation: 'CRÉATION DE SITES',
      onePage: 'ONE PAGE',
      pages3to5: '3-4-5 PAGES',
      customTab: 'SUR MESURE',
      customTitle: 'Sur Mesure',
      pricingOnRequest: 'tarification sur discussion',
      onePageFeature1: 'Site Vitrine One Page',
      pagesFeature1: 'Site Vitrine 3 à 5 pages',
      customFeature1: 'Site Vitrine Sur Mesure',
      copyFeature: 'Copywriting fourni par nos soins',
      templateFeature: 'Template de référence fourni',
      buildFeature: 'Vous créez le site WordPress',
      priceDefinedFeature: 'Tarif défini après brief complet',
      perWebsite: 'par site',
      outro1: 'Nous fournissons également le copywriting ainsi que des templates, afin que vous puissiez vous concentrer pleinement sur la création du site WordPress.',
      outro2: "Si cela vous intéresse, n'hésitez pas à nous faire savoir !",
      outro3: "Dans l'attente de notre collaboration,\nCordialement,",
    }
  };

  const t = content[language];
  const currentSymbol = currency === 'DH' ? 'DH' : '€';

  const prices = {
    onePage: currency === 'DH' ? '400' : '30',
    pages3to5: currency === 'DH' ? '900' : '60',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 overflow-y-auto w-full p-8 max-w-7xl mx-auto space-y-6 bg-void"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-100 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-panel3 border border-border-100 rounded flex items-center justify-center z-10">
            <Users className="w-5 h-5 text-cmd" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-t-100 uppercase tracking-wider">Recruitment & HR</h1>
            <p className="text-xs text-t-300 uppercase tracking-widest mt-1">Manage Candidates, Listings, & Freelancers</p>
          </div>
        </div>
      </div>

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
        {activeTab === 'candidates' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center bg-panel2 border border-border-100 rounded-md p-6">
               <div>
                 <h2 className="text-t-100 font-bold uppercase tracking-widest flex items-center gap-2"><Globe className="w-5 h-5 text-cmd" /> Candidates & Recruitment Databases</h2>
                 <p className="text-xs text-t-300 mt-1">Access the source data sheets for recruitment pipelines.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a 
                href="https://docs.google.com/spreadsheets/d/1TZqJqkga1o-J1DKREjlNb5WqbmrWLP7NiJ-lHZ0_hbY/edit?gid=401409880#gid=401409880"
                target="_blank"
                rel="noreferrer"
                className="bg-panel2 border border-border-100 p-6 rounded-md hover:border-cmd transition-all group flex flex-col items-center justify-center text-center gap-4"
              >
                <div className="w-12 h-12 bg-cmd/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-cmd" />
                </div>
                <div>
                  <h3 className="text-t-100 font-bold uppercase tracking-widest text-sm group-hover:text-cmd transition-colors">Applied Candidates Sheet</h3>
                  <p className="text-xs text-t-300 mt-2 font-mono">Google Sheets ↗</p>
                </div>
              </a>

              {/* Add more sheet links here in the future if needed */}
              
            </div>
          </motion.div>
        )}

        {activeTab === 'job_listings' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center bg-panel2 border border-border-100 rounded-md p-6">
               <div>
                 <h2 className="text-t-100 font-bold uppercase tracking-widest flex items-center gap-2"><Briefcase className="w-5 h-5 text-cmd" /> Active Listings</h2>
                 <p className="text-xs text-t-300 mt-1">Manage job positions and attach them to required projects.</p>
               </div>
               <button 
                 onClick={() => setShowNewJobForm(true)}
                 className="flex items-center gap-2 bg-cmd/10 hover:bg-cmd hover:text-void border border-cmd/50 text-cmd px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-colors">
                 <Plus className="w-4 h-4" /> New Position
               </button>
            </div>

            {showNewJobForm && (
              <div className="bg-panel2 border border-cmd/30 rounded-md p-6 animate-in fade-in slide-in-from-top-4">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-t-100 font-bold uppercase tracking-widest text-sm text-cmd">Create New Position</h3>
                   <button onClick={() => setShowNewJobForm(false)} className="text-t-300 hover:text-t-100 transition-colors">
                      <X className="w-4 h-4" />
                   </button>
                 </div>
                 <form onSubmit={handleAddJob} className="space-y-4">
                   <div>
                     <label className="block text-[10px] font-mono text-t-300 uppercase tracking-widest mb-1">Job Title</label>
                     <input type="text" required value={newJobForm.title} onChange={e => setNewJobForm({...newJobForm, title: e.target.value})} className="w-full bg-panel border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none" placeholder="e.g. Frontend Developer" />
                   </div>
                   <div>
                     <label className="block text-[10px] font-mono text-t-300 uppercase tracking-widest mb-1">Description</label>
                     <textarea required value={newJobForm.description} onChange={e => setNewJobForm({...newJobForm, description: e.target.value})} rows={2} className="w-full bg-panel border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none resize-none" placeholder="A brief description of the role..." />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-[10px] font-mono text-t-300 uppercase tracking-widest mb-1">Key Tasks (numbered or bulleted)</label>
                       <textarea required value={newJobForm.tasks} onChange={e => setNewJobForm({...newJobForm, tasks: e.target.value})} rows={3} className="w-full bg-panel border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none resize-none" placeholder="1. Task one&#10;2. Task two" />
                     </div>
                     <div>
                       <label className="block text-[10px] font-mono text-t-300 uppercase tracking-widest mb-1">Tools Mastery</label>
                       <textarea required value={newJobForm.tools} onChange={e => setNewJobForm({...newJobForm, tools: e.target.value})} rows={3} className="w-full bg-panel border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none resize-none" placeholder="React, Figma, Node.js" />
                     </div>
                   </div>
                   <div>
                     <label className="block text-[10px] font-mono text-t-300 uppercase tracking-widest mb-1">Mastery Level</label>
                     <select value={newJobForm.mastery} onChange={e => setNewJobForm({...newJobForm, mastery: e.target.value})} className="w-full bg-panel border border-border-200 text-t-100 rounded px-3 py-2 text-sm focus:border-cmd outline-none appearance-none">
                       <option>Junior</option>
                       <option>Mid-level</option>
                       <option>Senior/Expert</option>
                       <option>Lead/Manager</option>
                     </select>
                   </div>
                   <div className="flex justify-end pt-2">
                     <button type="submit" className="bg-cmd text-void px-6 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
                        Add Position
                     </button>
                   </div>
                 </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map(job => (
                <div key={job.id} className="bg-panel2 border border-border-100 hover:border-border-300 transition-colors rounded-xl flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-border-100 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-t-100 tracking-wide">{job.title}</h3>
                      <span className="text-[10px] bg-panel3 border border-border-200 text-t-200 px-2 py-1 rounded font-mono uppercase font-bold flex items-center gap-1.5 whitespace-nowrap">
                        <GraduationCap className="w-3 h-3 text-cmd" /> {job.mastery}
                      </span>
                    </div>
                    
                    <p className="text-sm text-t-200 mb-6 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="space-y-4 text-sm">
                      <div>
                        <div className="text-xs text-t-300 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5 border-b border-border-200 pb-1">
                          <FileText className="w-3.5 h-3.5" /> Key Tasks
                        </div>
                        <p className="text-t-200 whitespace-pre-wrap leading-relaxed">{job.tasks}</p>
                      </div>
                      
                      <div>
                        <div className="text-xs text-t-300 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5 border-b border-border-200 pb-1">
                          <Wrench className="w-3.5 h-3.5" /> Tools Mastery
                        </div>
                        <p className="text-cmd font-medium">{job.tools}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-panel/50 p-4 border-t border-border-100 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-t-200 uppercase tracking-widest">
                        <FolderSearch className="w-4 h-4 text-t-300" /> 
                        {job.projectIds.length} Linked Project{job.projectIds.length !== 1 && 's'}
                      </div>
                      <button 
                        onClick={() => setProjectSelectJobId(job.id === projectSelectJobId ? null : job.id)}
                        className="text-xs border border-border-200 bg-panel3 hover:bg-panel hover:text-t-100 text-t-300 px-3 py-1.5 rounded transition-colors flex items-center gap-1.5"
                      >
                        Select Projects <ChevronDown className={cn("w-3 h-3 transition-transform", projectSelectJobId === job.id && "rotate-180")} />
                      </button>
                    </div>

                    {projectSelectJobId === job.id && (
                      <div className="absolute bottom-full right-4 mb-2 bg-panel3 border border-border-200 rounded-lg shadow-2xl overflow-hidden w-64 z-10 animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-3 border-b border-border-200 flex justify-between items-center bg-panel">
                          <span className="text-xs font-bold uppercase tracking-widest text-t-100">Link Projects</span>
                          <button onClick={() => setProjectSelectJobId(null)} className="text-t-300 hover:text-t-100">
                             <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="max-h-60 overflow-y-auto p-2">
                          {PROJECTS.map(proj => {
                            const isSelected = job.projectIds.includes(proj.id);
                            return (
                              <button
                                key={proj.id}
                                onClick={() => toggleProjectForJob(job.id, proj.id)}
                                className="w-full flex items-center justify-between p-2 rounded hover:bg-panel text-sm text-left transition-colors group"
                              >
                                <span className={cn("font-medium", isSelected ? "text-cmd" : "text-t-200 group-hover:text-t-100")}>
                                  {proj.name}
                                </span>
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-cmd" />
                                ) : (
                                  <Square className="w-4 h-4 text-t-300" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {job.projectIds.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {job.projectIds.map(pid => {
                          const proj = PROJECTS.find(p => p.id === pid);
                          if (!proj) return null;
                          return (
                            <span key={pid} className="text-[10px] bg-panel3 border border-border-200 text-t-100 px-2 py-0.5 rounded font-mono uppercase flex items-center gap-1">
                              {proj.name}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'freelancer_pricing' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Controls */}
            <div className="flex justify-end gap-4 mb-6">
              <div className="relative">
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
                  className="bg-panel border border-border-200 text-t-100 text-sm rounded px-4 py-2 outline-none focus:border-cmd appearance-none min-w-[120px]"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-300 pointer-events-none" />
              </div>
              <div className="relative">
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'DH' | 'EUR')}
                  className="bg-panel border border-border-200 text-t-100 text-sm rounded px-4 py-2 outline-none focus:border-cmd appearance-none min-w-[120px]"
                >
                  <option value="DH">MAD (DH)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-300 pointer-events-none" />
              </div>
            </div>

            {/* Document Preview (A4 style) */}
            <div className="max-w-3xl mx-auto bg-panel text-t-100 p-8 md:p-12 rounded-xl border border-border-100 shadow-2xl font-sans font-medium tracking-wide">
              {/* Header Title */}
              <div className="text-center mb-10">
                <div className="inline-block bg-[#1ebbb6] text-t-100 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
                  BIG HOUSE MARKETING
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title.split('Creation')[0]}<span className="text-[#1ebbb6]">Création</span>{t.title.split('Sites')[1]}</h1>
                {language === 'en' && <h1 className="text-4xl md:text-5xl font-bold mb-4">Website <span className="text-[#1ebbb6]">Creation</span> Rates</h1>}
                {language === 'fr' && <h1 className="text-4xl md:text-5xl font-bold mb-4">Tarifs <span className="text-[#1ebbb6]">Création</span> de Sites</h1>}
                <p className="text-t-300 text-sm">{t.subtitle}</p>
              </div>

              {/* Intro block */}
              <div className="bg-panel2 rounded-xl p-8 mb-8 border border-t-100/5">
                <p className="mb-4 text-t-100/80 leading-relaxed text-sm md:text-base">
                  {t.intro1}
                </p>
                <p className="text-t-100/80 leading-relaxed text-sm md:text-base">
                  {t.intro2}
                </p>
              </div>

              {/* What we provide */}
              <div className="border border-[#1ebbb6]/40 rounded-xl p-8 mb-12 relative">
                <div className="absolute -top-3 left-8 bg-[#0f111a] px-3 font-semibold text-[#1ebbb6] text-sm tracking-[0.2em]">
                  {t.whatWeProvide}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2 font-bold text-lg">
                      <div className="w-4 h-4 rounded-full bg-[#1ebbb6]" />
                      {t.copywriting}
                    </div>
                    <p className="text-t-300 text-sm">{t.copywritingDesc}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2 font-bold text-lg">
                      <div className="w-4 h-4 rounded-full bg-[#ff7315]" />
                      {t.templates}
                    </div>
                    <p className="text-t-300 text-sm">{t.templatesDesc}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2 font-bold text-lg">
                      <div className="w-4 h-4 rounded-full bg-[#8363f9]" />
                      {t.yourRole}
                    </div>
                    <p className="text-t-300 text-sm">{t.yourRoleDesc}</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] bg-t-100/10 flex-1" />
                <div className="text-t-100/40 text-xs font-bold tracking-[0.2em]">{t.websiteCreation}</div>
                <div className="h-[1px] bg-white/10 flex-1" />
              </div>

              {/* Pricing Cards */}
              <div className="space-y-6 mb-12">
                {/* One Page */}
                <div className="border hover:border-[#1ebbb6] transition-colors border-[#1ebbb6]/50 rounded-xl p-8 relative isolate overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#1ebbb6]/5 rounded-full blur-3xl -z-10" />
                  <div className="inline-block bg-[#1ebbb6] text-t-100 text-xs font-bold px-3 py-1 rounded mb-4">
                    {t.onePage}
                  </div>
                  <div className="flex items-start gap-2 mb-6">
                    <span className="text-2xl font-bold mt-1 text-[#1ebbb6]">{currency === 'DH' ? 'DH' : '€'}</span>
                    <span className="text-6xl font-bold text-t-100">{prices.onePage}</span>
                    <span className="self-end pb-2 text-t-300 text-sm">{t.perWebsite}</span>
                  </div>
                  <ul className="space-y-3 text-t-100/80">
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#1ebbb6]" /> {t.onePageFeature1}</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#1ebbb6]" /> {t.copyFeature}</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#1ebbb6]" /> {t.templateFeature}</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#1ebbb6]" /> {t.buildFeature}</li>
                  </ul>
                </div>

                {/* 3-4-5 Pages */}
                <div className="border hover:border-[#ff7315] transition-colors border-[#ff7315]/50 rounded-xl p-8 relative isolate overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff7315]/5 rounded-full blur-3xl -z-10" />
                  <div className="inline-block bg-[#ff7315] text-t-100 text-xs font-bold px-3 py-1 rounded mb-4">
                    {t.pages3to5}
                  </div>
                  <div className="flex items-start gap-2 mb-6">
                    <span className="text-2xl font-bold mt-1 text-[#ff7315]">{currency === 'DH' ? 'DH' : '€'}</span>
                    <span className="text-6xl font-bold text-t-100">{prices.pages3to5}</span>
                    <span className="self-end pb-2 text-t-300 text-sm">{t.perWebsite}</span>
                  </div>
                  <ul className="space-y-3 text-t-100/80">
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#ff7315]" /> {t.pagesFeature1}</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#ff7315]" /> {t.copyFeature}</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#ff7315]" /> {t.templateFeature}</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#ff7315]" /> {t.buildFeature}</li>
                  </ul>
                </div>

                {/* Custom */}
                <div className="border hover:border-[#8363f9] transition-colors border-[#8363f9]/50 rounded-xl p-8 relative isolate overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#8363f9]/5 rounded-full blur-3xl -z-10" />
                  <div className="inline-block bg-[#8363f9] text-t-100 text-xs font-bold px-3 py-1 rounded mb-4 tracking-widest uppercase">
                    {t.customTab}
                  </div>
                  <div className="mb-6">
                    <h2 className="text-4xl font-bold text-[#8363f9] mb-1">{t.customTitle}</h2>
                    <p className="text-t-300 text-sm">{t.pricingOnRequest}</p>
                  </div>
                   <ul className="space-y-3 text-t-100/80">
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#8363f9]" /> {t.customFeature1}</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#8363f9]" /> {t.copyFeature}</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#8363f9]" /> {t.templateFeature}</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#8363f9]" /> {t.priceDefinedFeature}</li>
                  </ul>
                </div>
              </div>

              {/* Footer Block */}
              <div className="bg-[#1a1c26] rounded-xl p-8 border border-white/5">
                <p className="mb-4 text-t-100/80 text-sm md:text-base">{t.outro1}</p>
                <p className="mb-8 text-t-100/80 text-sm md:text-base">{t.outro2}</p>
                <p className="text-t-100/80 whitespace-pre-line mb-6 text-sm md:text-base">{t.outro3}</p>
                
                <a href="mailto:contact@bighousemarketing.lu" className="text-[#1ebbb6] font-bold text-lg hover:underline block mb-8">
                  contact@bighousemarketing.lu
                </a>

                <div className="flex justify-between items-center text-t-300 text-xs md:text-sm pt-6 border-t border-white/10">
                  <span>bighousemarketing.lu</span>
                  <span className="text-[#1ebbb6]">@bighouse.marketing</span>
                </div>
              </div>
            </div>
            
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
