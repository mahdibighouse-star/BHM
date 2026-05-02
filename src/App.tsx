/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar, View } from './components/layout/Sidebar';
import { AgentChat } from './components/chat/AgentChat';
import { Overview } from './components/views/Overview';
import { Projects } from './components/views/Projects';
import { ProjectDetail } from './components/views/ProjectDetail';
import { TeamList } from './components/views/TeamList';
import { AIAgentsList } from './components/views/AIAgentsList';
import { ServicesList } from './components/views/ServicesList';
import { ClientOps } from './components/views/ClientOps';
import { AgentMemory } from './components/views/AgentMemory';
import { AgentLogs } from './components/views/AgentLogs';
import { PromptTemplates } from './components/views/PromptTemplates';
import { SeoIntelligence } from './components/views/SeoIntelligence';
import { RecruitmentHR } from './components/views/RecruitmentHR';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Bot, LogIn } from 'lucide-react';

import { AnimatePresence, motion } from 'motion/react';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const { user, signIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen bg-void justify-center items-center text-t-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cmd"></div>
          <p className="text-sm font-mono animate-pulse">Loading system...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen bg-void justify-center items-center flex-col gap-6 text-center px-4">
        <Bot className="w-16 h-16 text-cmd" />
        <div>
          <h1 className="text-2xl font-bold text-t-100 tracking-widest uppercase mb-2">Agency OS</h1>
          <p className="text-t-200 font-mono text-sm max-w-sm">
            AI-powered agency operating system. Login required to access internal tools and Commander.
          </p>
        </div>
        <button
          onClick={signIn}
          className="flex items-center gap-2 bg-cmd hover:bg-cmd/80 text-t-100 px-6 py-3 rounded uppercase tracking-widest text-xs font-bold transition-all"
        >
          <LogIn className="w-4 h-4" /> Sign In with Google
        </button>
      </div>
    );
  }

  const handleNavigate = (view: View, param?: string) => {
    setCurrentView(view);
    if (!view.startsWith('project-detail')) {
      setSelectedProjectId(null);
    }
    if (view === 'team' && param) {
      setSelectedMemberId(param);
    } else if (view !== 'team') {
      setSelectedMemberId(null);
    }
  };

  const handleSelectProject = (id: string, view: View) => {
    setSelectedProjectId(id);
    setCurrentView(view);
  };

  return (
    <div className="flex h-screen bg-void text-t-100 overflow-hidden font-sans">
      <Sidebar currentView={currentView} onChangeView={handleNavigate} />
      
      <main className="flex-1 overflow-y-auto relative bg-void">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView === 'project-detail' ? `project-detail-${selectedProjectId}` : currentView}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-h-full"
          >
            {currentView === 'overview' && <Overview />}
            {currentView === 'projects' && <Projects onSelectProject={handleSelectProject} />}
            {currentView === 'project-detail' && selectedProjectId && (
              <ProjectDetail 
                projectId={selectedProjectId} 
                onBack={() => handleNavigate('projects')} 
                onNavigateTeam={(memberId) => handleNavigate('team', memberId)}
              />
            )}
            {currentView === 'team' && <TeamList initialSelectedMemberId={selectedMemberId} />}
            {currentView === 'ai-agents' && <AIAgentsList />}
            {currentView === 'services' && <ServicesList />}
            {currentView === 'client-ops' && <ClientOps />}
            {currentView === 'templates' && <PromptTemplates />}
            {currentView === 'seo-intel' && <SeoIntelligence />}
            {currentView === 'recruitment-hr' && <RecruitmentHR />}
            {currentView === 'memory' && <AgentMemory />}
            {currentView === 'logs' && <AgentLogs />}
          </motion.div>
        </AnimatePresence>
      </main>

      <AgentChat onNavigate={(viewId, entityId) => {
        if (entityId && (viewId === 'project-detail' || viewId === 'team-detail' || viewId === 'service-detail')) {
           if (viewId === 'project-detail') {
               handleSelectProject(entityId, viewId as View);
           } else {
               handleNavigate(viewId as View);
           }
        } else {
          handleNavigate(viewId as View);
        }
      }} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
