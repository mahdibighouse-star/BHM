import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, TeamMember, PROJECTS as initialProjects, TEAM as initialTeam } from '../data';

interface DataContextType {
  projects: Project[];
  addProject: (p: Project) => void;
  updateProject: (id: string, partial: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  team: Record<string, TeamMember>;
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (id: string, partial: Partial<TeamMember>) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('bhm_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialProjects;
  });

  const [team, setTeam] = useState<Record<string, TeamMember>>(() => {
    const saved = localStorage.getItem('bhm_team');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialTeam;
  });

  useEffect(() => {
    localStorage.setItem('bhm_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('bhm_team', JSON.stringify(team));
  }, [team]);

  const addProject = (p: Project) => {
    setProjects(prev => [p, ...prev]);
  };

  const updateProject = (id: string, partial: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...partial } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addTeamMember = (member: TeamMember) => {
    setTeam(prev => ({ ...prev, [member.id]: member }));
  };

  const updateTeamMember = (id: string, partial: Partial<TeamMember>) => {
    setTeam(prev => ({
      ...prev,
      [id]: { ...prev[id], ...partial }
    }));
  };

  return (
    <DataContext.Provider value={{ projects, addProject, updateProject, deleteProject, team, addTeamMember, updateTeamMember }}>
      {children}
    </DataContext.Provider>
  );
};
